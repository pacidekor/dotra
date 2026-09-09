"use client";

import Image from "next/image";
import { LinkIconGlyph } from "@/components/LinkIcons";
import type { Profile, ProfileLink } from "@/data/types";

type LivePreviewProps = {
  profile: Profile;
  links: ProfileLink[];
  compact?: boolean;
};

export function LivePreview({ profile, links, compact = false }: LivePreviewProps) {
  const avatarSize = compact ? 72 : 88;

  return (
    <aside className={compact ? "" : "lg:sticky lg:top-6"}>
      {!compact ? (
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Live preview
          </h2>
          <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted">
            Náhled
          </span>
        </div>
      ) : null}

      <div
        className={`mx-auto w-full overflow-hidden rounded-[1.25rem] border border-border bg-card shadow-[0_12px_32px_rgba(17,17,17,0.08)] ${
          compact ? "max-w-none" : "max-w-[340px] rounded-[1.5rem]"
        }`}
      >
        <div className="relative">
          <div
            className={`relative w-full overflow-hidden bg-[#1a1a1a] ${
              compact ? "h-28" : "h-32"
            }`}
          >
            <Image
              src={profile.bannerSrc}
              alt=""
              fill
              className="object-cover"
              unoptimized
              sizes="(max-width: 768px) 100vw, 340px"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/5"
              aria-hidden
            />
          </div>

          <div
            className="absolute left-1/2 z-10 -translate-x-1/2 overflow-hidden rounded-full border-[3px] border-card bg-surface"
            style={{
              top: "100%",
              marginTop: `-${avatarSize / 2}px`,
              width: avatarSize,
              height: avatarSize,
              boxShadow: "0 6px 20px rgba(17, 17, 17, 0.12)",
            }}
          >
            <Image
              src={profile.avatarSrc}
              alt={profile.name}
              width={avatarSize}
              height={avatarSize}
              className="h-full w-full object-cover"
              unoptimized
            />
          </div>
        </div>

        <div className={`px-4 text-center ${compact ? "pt-12" : "px-5 pt-14"}`}>
          <h3
            className={`font-semibold tracking-tight text-foreground ${
              compact ? "text-lg" : "text-xl"
            }`}
          >
            {profile.name || "Bez názvu"}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            {profile.tagline || "Bez popisu"}
          </p>
        </div>

        <div className={`flex flex-col gap-2 px-3 pb-5 ${compact ? "mt-4" : "mt-5 gap-2.5 px-4 pb-6"}`}>
          {links.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted">
              Zatím žádné karty
            </p>
          ) : (
            links.map((link) => (
              <div
                key={link.id}
                className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-3 py-2.5"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border text-foreground">
                  <LinkIconGlyph name={link.icon} />
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {link.label}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted">
                    {link.description}
                  </span>
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
