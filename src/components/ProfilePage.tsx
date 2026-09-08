"use client";

import { useCallback, useState } from "react";
import { LinkButton } from "@/components/LinkButton";
import { ProfileHeader } from "@/components/ProfileHeader";
import { WifiSheet } from "@/components/WifiSheet";
import type { Profile, ProfileLink } from "@/data/types";

type ProfilePageProps = {
  profile: Profile;
  links: ProfileLink[];
};

export function ProfilePage({ profile, links }: ProfilePageProps) {
  const [wifiOpen, setWifiOpen] = useState(false);

  const openWifi = useCallback(() => setWifiOpen(true), []);
  const closeWifi = useCallback(() => setWifiOpen(false), []);

  return (
    <div className="relative flex min-h-dvh flex-1 flex-col">
      <div
        className="pointer-events-none absolute inset-0 animate-reveal-fade bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,_#cfe6f5_0%,_transparent_60%),linear-gradient(180deg,_#e8f2fa_0%,_#d9eaf6_100%)]"
        aria-hidden
      />

      <main className="relative mx-auto flex w-full flex-1 flex-col md:max-w-[420px] md:justify-center md:px-4 md:py-10">
        <div className="flex min-h-dvh flex-1 flex-col overflow-hidden bg-card md:min-h-0 md:flex-none md:rounded-[1.5rem] md:shadow-[0_16px_48px_rgba(26,37,51,0.12)]">
          <ProfileHeader profile={profile} />

          <div className="px-5 pt-[3.75rem] text-center md:px-6 md:pt-16">
            <h1
              className="animate-reveal-title origin-center text-[1.75rem] font-semibold tracking-tight text-foreground will-change-transform md:text-3xl"
              style={{ animationDelay: "420ms" }}
            >
              {profile.name}
            </h1>
            <p
              className="animate-reveal-subtitle mt-2 px-1 text-sm leading-relaxed text-muted will-change-transform"
              style={{ animationDelay: "560ms" }}
            >
              {profile.tagline}
            </p>
          </div>

          <nav
            className="mt-6 flex flex-col gap-2.5 px-4 md:mt-7 md:gap-3 md:px-5"
            aria-label="Odkazy"
          >
            {links.map((link, index) => (
              <LinkButton
                key={link.id}
                link={link}
                index={index}
                onWifiClick={profile.wifi ? openWifi : undefined}
              />
            ))}
          </nav>

          <p
            className="animate-reveal-fade mt-auto px-4 pb-6 pt-8 text-center text-xs text-muted/70 md:mt-8 md:pb-8"
            style={{ animationDelay: `${720 + links.length * 70}ms` }}
          >
            © {new Date().getFullYear()} {profile.name}
          </p>
        </div>
      </main>

      {profile.wifi ? (
        <WifiSheet
          open={wifiOpen}
          onClose={closeWifi}
          wifi={profile.wifi}
          networkName={profile.wifi.ssid}
        />
      ) : null}
    </div>
  );
}
