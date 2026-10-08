import type { LinkIcon, Profile, ProfileLink } from "@/data/types";

export type DotraProfileRow = {
  id: string;
  slug: string | null;
  display_name: string;
  tagline: string;
  avatar_path: string | null;
  banner_path: string | null;
  wifi_ssid: string | null;
  wifi_password: string | null;
  wifi_encryption: string | null;
  onboarding_completed_at: string | null;
};

export type DotraLinkRow = {
  id: string;
  profile_id: string;
  label: string;
  href: string;
  description: string;
  icon: string;
  sort_order: number;
  enabled: boolean;
};

const DEFAULT_AVATAR = "/images/rezitlogo.png";
const DEFAULT_BANNER = "/images/image-mesh-gradient.png";

export function publicStorageUrl(
  bucket: "avatars" | "banners",
  path: string | null | undefined,
) {
  if (!path) return null;
  if (
    path.startsWith("http") ||
    path.startsWith("/") ||
    path.startsWith("blob:")
  ) {
    return path;
  }
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}

type StorageUploader = {
  storage: {
    from: (bucket: string) => {
      upload: (
        path: string,
        file: File,
        options?: { upsert?: boolean; contentType?: string },
      ) => PromiseLike<{ error: { message: string } | null }>;
    };
  };
};

/** Upload path + public URL; throws with a Czech message on storage bucket errors. */
export async function uploadProfileImageFile(
  supabase: StorageUploader,
  userId: string,
  file: File,
  bucket: "avatars" | "banners",
): Promise<{ path: string; publicUrl: string }> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${userId}/${Date.now()}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    const message = uploadError.message || "";
    if (
      message.toLowerCase().includes("bucket") ||
      message.toLowerCase().includes("not found")
    ) {
      throw new Error(
        "Úložiště fotek ještě není vytvořené. V Supabase spusť migraci storage (avatars/banners).",
      );
    }
    throw new Error(message || "Upload obrázku selhal.");
  }

  const publicUrl = publicStorageUrl(bucket, path);
  if (!publicUrl) {
    throw new Error("Nepodařilo se sestavit URL obrázku.");
  }

  return { path, publicUrl };
}

export function profileFromRow(row: DotraProfileRow): Profile {
  const ssid = row.wifi_ssid?.trim() || "";
  const encryption =
    row.wifi_encryption === "WEP" ||
    row.wifi_encryption === "nopass" ||
    row.wifi_encryption === "WPA"
      ? row.wifi_encryption
      : "WPA";

  return {
    name: row.display_name || "Váš profil",
    tagline: row.tagline || "Doplňte popisek profilu",
    avatarSrc:
      publicStorageUrl("avatars", row.avatar_path) ?? DEFAULT_AVATAR,
    bannerSrc:
      publicStorageUrl("banners", row.banner_path) ?? DEFAULT_BANNER,
    wifi: ssid
      ? {
          ssid,
          password: row.wifi_password || "",
          encryption,
        }
      : undefined,
  };
}

export function linksFromRows(rows: DotraLinkRow[]): ProfileLink[] {
  return [...rows]
    .filter((row) => row.enabled)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((row) => ({
      id: row.id,
      label: row.label,
      href: row.href,
      description: row.description,
      icon: (row.icon as LinkIcon) || "globe",
    }));
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export const RESERVED_SLUGS = [
  "dashboard",
  "login",
  "register",
  "forgot-password",
  "reset-password",
  "onboarding",
  "auth",
  "tomas",
  "filip",
  "rezit",
  "ukaplicky",
  "api",
] as const;

/** Returns Czech error message, or null when slug is usable. */
export function validateSlugInput(raw: string): string | null {
  const next = slugify(raw);
  if (!next) return "Zadejte platný slug URL.";
  if ((RESERVED_SLUGS as readonly string[]).includes(next)) {
    return "Tento slug je rezervovaný, zvolte jiný.";
  }
  return null;
}

export const DEFAULT_ONBOARDING_LINKS: Omit<
  DotraLinkRow,
  "id" | "profile_id"
>[] = [
  {
    label: "Instagram",
    href: "",
    description: "Sledujte mě na Instagramu",
    icon: "instagram",
    sort_order: 0,
    enabled: true,
  },
  {
    label: "E-mail",
    href: "",
    description: "Napište mi",
    icon: "email",
    sort_order: 1,
    enabled: true,
  },
  {
    label: "Telefon",
    href: "",
    description: "Zavolejte mi",
    icon: "phone",
    sort_order: 2,
    enabled: true,
  },
  {
    label: "Web",
    href: "",
    description: "Moje webové stránky",
    icon: "globe",
    sort_order: 3,
    enabled: true,
  },
];
