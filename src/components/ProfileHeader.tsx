import Image from "next/image";
import type { Profile } from "@/data/types";

const AVATAR_SIZE = 104;

type ProfileHeaderProps = {
  profile: Profile;
};

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <header className="relative">
      {/* Tmavé pozadí = žádný prázdný světlý „rámeček“ než naskočí obrázek */}
      <div className="relative h-36 w-full overflow-hidden bg-[#1a1a1a] sm:h-40">
        <div className="animate-reveal-banner absolute inset-0 origin-center will-change-transform">
          <Image
            src={profile.bannerSrc}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="(max-width: 420px) 100vw, 420px"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/5"
          aria-hidden
        />
      </div>

      <div
        className="absolute left-1/2 z-10 -translate-x-1/2"
        style={{
          top: "100%",
          marginTop: `-${AVATAR_SIZE / 2}px`,
        }}
      >
        <div
          className="animate-reveal-avatar overflow-hidden rounded-full border-[3px] border-card bg-surface will-change-transform"
          style={{
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            animationDelay: "280ms",
            boxShadow: "0 6px 20px rgba(26, 37, 51, 0.12)",
          }}
        >
          <Image
            src={profile.avatarSrc}
            alt={profile.name}
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
            className="h-full w-full object-cover"
            priority
          />
        </div>
      </div>
    </header>
  );
}
