"use client";

import Image from "next/image";
import type { Profile } from "@/data/types";

type ProfileEditorProps = {
  profile: Profile;
  slug: string;
  onChange: (profile: Profile) => void;
  onSlugChange: (slug: string) => void;
  onUploadImage: (kind: "avatar" | "banner", file: File) => void;
  uploadingImage?: "avatar" | "banner" | null;
};

export function ProfileEditor({
  profile,
  slug,
  onChange,
  onSlugChange,
  onUploadImage,
  uploadingImage = null,
}: ProfileEditorProps) {
  const publicPath = slug ? `/${slug}` : "/…";

  return (
    <section className="space-y-4">
      <div className="space-y-4 rounded-2xl border border-black/[0.06] bg-white/90 p-3.5 sm:p-4">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-foreground">Název</span>
          <input
            type="text"
            value={profile.name}
            onChange={(event) =>
              onChange({ ...profile, name: event.target.value })
            }
            className="w-full rounded-xl border border-border bg-card px-3.5 py-3 text-sm text-foreground outline-none transition-colors focus:border-foreground/30 sm:py-2.5"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-foreground">
            Veřejná URL
          </span>
          <div className="flex items-center gap-0 overflow-hidden rounded-xl border border-border bg-card focus-within:border-foreground/30">
            <span className="shrink-0 border-r border-border bg-surface px-3 py-3 text-sm text-muted sm:py-2.5">
              /
            </span>
            <input
              type="text"
              value={slug}
              onChange={(event) => onSlugChange(event.target.value)}
              className="w-full cursor-text bg-transparent px-3.5 py-3 text-sm text-foreground outline-none sm:py-2.5"
              placeholder="vas-slug"
              spellCheck={false}
              autoComplete="off"
            />
          </div>
          <p className="text-xs text-muted">
            Profil bude na{" "}
            <span className="font-medium text-foreground">{publicPath}</span>
          </p>
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-foreground">Popis</span>
          <textarea
            value={profile.tagline}
            onChange={(event) =>
              onChange({ ...profile, tagline: event.target.value })
            }
            rows={3}
            className="w-full resize-none rounded-xl border border-border bg-card px-3.5 py-3 text-sm text-foreground outline-none transition-colors focus:border-foreground/30 sm:py-2.5"
          />
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-stretch">
          <label className="flex min-w-0 flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">Banner</span>
            <span
              className={`relative block h-36 w-full overflow-hidden rounded-xl border border-dashed border-border bg-card transition-colors active:border-foreground/30 sm:h-40 lg:h-44 ${
                uploadingImage === "banner"
                  ? "pointer-events-none opacity-70"
                  : "cursor-pointer"
              }`}
            >
              <Image
                src={profile.bannerSrc}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
              <span className="absolute inset-0 flex items-end bg-gradient-to-t from-black/45 to-transparent p-2.5">
                <span className="rounded-md bg-black/35 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {uploadingImage === "banner" ? "Nahrávám…" : "Změnit"}
                </span>
              </span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={uploadingImage !== null}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (file) onUploadImage("banner", file);
                }}
              />
            </span>
          </label>

          <label className="flex flex-col gap-1.5 sm:w-40 lg:w-44">
            <span className="text-sm font-medium text-foreground">
              Profilovka
            </span>
            <span
              className={`relative block aspect-square w-full overflow-hidden rounded-xl border border-dashed border-border bg-card transition-colors active:border-foreground/30 sm:aspect-auto sm:h-40 lg:h-44 ${
                uploadingImage === "avatar"
                  ? "pointer-events-none opacity-70"
                  : "cursor-pointer"
              }`}
            >
              <Image
                src={profile.avatarSrc}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
              <span className="absolute inset-0 flex items-end bg-gradient-to-t from-black/45 to-transparent p-2.5">
                <span className="rounded-md bg-black/35 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {uploadingImage === "avatar" ? "Nahrávám…" : "Změnit"}
                </span>
              </span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={uploadingImage !== null}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (file) onUploadImage("avatar", file);
                }}
              />
            </span>
          </label>
        </div>
      </div>
    </section>
  );
}
