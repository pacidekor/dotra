"use client";

import Image from "next/image";
import type { Profile } from "@/data/types";

type ProfileEditorProps = {
  profile: Profile;
  onChange: (profile: Profile) => void;
  onUploadImage: (kind: "avatar" | "banner", file: File) => void;
  uploadingImage?: "avatar" | "banner" | null;
};

export function ProfileEditor({
  profile,
  onChange,
  onUploadImage,
  uploadingImage = null,
}: ProfileEditorProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-4 rounded-2xl border border-border bg-surface p-3.5 sm:p-4">
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

        {/* Stejná výška: banner + čtvercová profilovka na jedné úrovni */}
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
