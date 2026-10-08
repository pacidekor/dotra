"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  initialDashboardState,
  type DashboardState,
} from "@/data/dashboard-mock";
import type { Profile, ProfileLink, WifiConfig } from "@/data/types";
import {
  slugify,
  uploadProfileImageFile,
  validateSlugInput,
} from "@/lib/dotra-profile";
import { createClient } from "@/utils/supabase/client";

type DashboardContextValue = {
  state: DashboardState;
  profileId: string;
  userEmail: string;
  slug: string;
  setSlug: (slug: string) => void;
  setProfile: (profile: Profile) => void;
  setWifi: (wifi: WifiConfig | undefined) => void;
  setLinks: (links: ProfileLink[]) => void;
  uploadImage: (kind: "avatar" | "banner", file: File) => Promise<void>;
  save: () => Promise<void>;
  savedAt: Date | null;
  saving: boolean;
  uploadingImage: "avatar" | "banner" | null;
  saveError: string | null;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

type DashboardProviderProps = {
  children: ReactNode;
  profileId: string;
  userEmail: string;
  slug: string | null;
  initialProfile: Profile;
  initialLinks: ProfileLink[];
};

export function DashboardProvider({
  children,
  profileId,
  userEmail,
  slug: initialSlug,
  initialProfile,
  initialLinks,
}: DashboardProviderProps) {
  const [state, setState] = useState<DashboardState>({
    ...initialDashboardState,
    profile: initialProfile,
    links: initialLinks,
  });
  const [slug, setSlugState] = useState(initialSlug || "");
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<
    "avatar" | "banner" | null
  >(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const setProfile = useCallback((profile: Profile) => {
    setState((prev) => ({ ...prev, profile }));
  }, []);

  const setWifi = useCallback((wifi: WifiConfig | undefined) => {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, wifi },
    }));
  }, []);

  const setLinks = useCallback((links: ProfileLink[]) => {
    setState((prev) => ({ ...prev, links }));
  }, []);

  const setSlug = useCallback((value: string) => {
    setSlugState(slugify(value));
  }, []);

  const uploadImage = useCallback(
    async (kind: "avatar" | "banner", file: File) => {
      setUploadingImage(kind);
      setSaveError(null);
      const supabase = createClient();
      const bucket = kind === "avatar" ? "avatars" : "banners";
      const column = kind === "avatar" ? "avatar_path" : "banner_path";
      const previewField = kind === "avatar" ? "avatarSrc" : "bannerSrc";
      const previousUrl =
        kind === "avatar" ? state.profile.avatarSrc : state.profile.bannerSrc;
      const localUrl = URL.createObjectURL(file);

      setState((prev) => ({
        ...prev,
        profile: { ...prev.profile, [previewField]: localUrl },
      }));

      try {
        const { path, publicUrl } = await uploadProfileImageFile(
          supabase,
          profileId,
          file,
          bucket,
        );

        const { error: updateError } = await supabase
          .from("dotra_profiles")
          .update({ [column]: path })
          .eq("id", profileId);

        if (updateError) throw updateError;

        setState((prev) => ({
          ...prev,
          profile: { ...prev.profile, [previewField]: publicUrl },
        }));
        URL.revokeObjectURL(localUrl);
        setSavedAt(new Date());
      } catch (err) {
        setState((prev) => ({
          ...prev,
          profile: { ...prev.profile, [previewField]: previousUrl },
        }));
        URL.revokeObjectURL(localUrl);
        setSaveError(
          err instanceof Error ? err.message : "Upload obrázku selhal.",
        );
      } finally {
        setUploadingImage(null);
      }
    },
    [profileId, state.profile.avatarSrc, state.profile.bannerSrc],
  );

  const save = useCallback(async () => {
    setSaving(true);
    setSaveError(null);
    const supabase = createClient();

    try {
      const nextSlug = slugify(slug);
      const slugValidationError = validateSlugInput(nextSlug);
      if (slugValidationError) throw new Error(slugValidationError);

      const wifi = state.profile.wifi;
      const wifiSsid = wifi?.ssid.trim() || null;
      if (wifi !== undefined && !wifiSsid) {
        throw new Error("Zadejte název Wi‑Fi sítě (SSID).");
      }

      const { error: profileError } = await supabase
        .from("dotra_profiles")
        .update({
          display_name: state.profile.name,
          tagline: state.profile.tagline,
          slug: nextSlug,
          wifi_ssid: wifiSsid,
          wifi_password: wifiSsid ? wifi?.password ?? "" : null,
          wifi_encryption: wifiSsid ? wifi?.encryption || "WPA" : null,
        })
        .eq("id", profileId);

      if (profileError) {
        if (profileError.code === "23505") {
          throw new Error("Tento slug už někdo používá.");
        }
        if (
          profileError.message?.toLowerCase().includes("wifi_ssid") ||
          profileError.message?.toLowerCase().includes("column")
        ) {
          throw new Error(
            "Wi‑Fi sloupce v DB ještě nejsou. Spusť migraci 20261008_dotra_wifi.sql v Supabase.",
          );
        }
        throw profileError;
      }

      setSlugState(nextSlug);

      let linksToSave = state.links;
      if (wifiSsid && !linksToSave.some((link) => link.icon === "wifi")) {
        linksToSave = [
          ...linksToSave,
          {
            id: `wifi-${Date.now()}`,
            label: "Připojit se na Wi‑Fi",
            href: "#wifi",
            description: "Rychlé připojení k naší síti",
            icon: "wifi" as const,
          },
        ];
        setState((prev) => ({ ...prev, links: linksToSave }));
      }

      await supabase.from("dotra_links").delete().eq("profile_id", profileId);

      const rows = linksToSave.map((link, index) => ({
        profile_id: profileId,
        label: link.label,
        href: link.href,
        description: link.description,
        icon: link.icon,
        sort_order: index,
        enabled: true,
      }));

      if (rows.length > 0) {
        const { error: linksError } = await supabase
          .from("dotra_links")
          .insert(rows);
        if (linksError) throw linksError;
      }

      setSavedAt(new Date());
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Uložení selhalo.");
    } finally {
      setSaving(false);
    }
  }, [
    profileId,
    slug,
    state.links,
    state.profile.name,
    state.profile.tagline,
    state.profile.wifi,
  ]);

  const value = useMemo(
    () => ({
      state,
      profileId,
      userEmail,
      slug,
      setSlug,
      setProfile,
      setWifi,
      setLinks,
      uploadImage,
      save,
      savedAt,
      saving,
      uploadingImage,
      saveError,
    }),
    [
      state,
      profileId,
      userEmail,
      slug,
      setSlug,
      setProfile,
      setWifi,
      setLinks,
      uploadImage,
      save,
      savedAt,
      saving,
      uploadingImage,
      saveError,
    ],
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return ctx;
}
