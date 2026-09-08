import type { Profile, ProfileLink } from "@/data/types";

export type { LinkIcon, Profile, ProfileLink } from "@/data/types";

export const profile: Profile = {
  name: "Rezit",
  tagline: "Stavíme digitální produkty nové generace.",
  bannerSrc: "/images/image-mesh-gradient.png",
  avatarSrc: "/images/rezitlogo.png",
  wifi: {
    ssid: "Rezit Guest",
    password: "rezit2026",
    encryption: "WPA",
  },
};

export const links: ProfileLink[] = [
  {
    id: "website",
    label: "Webové stránky",
    href: "https://example.com",
    description: "Více o nás a našich produktech",
    icon: "globe",
  },
  {
    id: "email",
    label: "E-mail",
    href: "mailto:info@rezit.cz",
    description: "Napište nám",
    icon: "email",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://instagram.com/",
    description: "Sledujte nás na Instagramu",
    icon: "instagram",
  },
  {
    id: "tiktok",
    label: "TikTok",
    href: "https://tiktok.com/",
    description: "Krátká videa a novinky ze zákulisí",
    icon: "tiktok",
  },
  {
    id: "google",
    label: "Ohodnoťte nás na Google",
    href: "https://g.page/r/PLACEHOLDER",
    description: "Zpětná vazba nám pomáhá růst",
    icon: "google",
  },
  {
    id: "wifi",
    label: "Připojit se na Wi‑Fi",
    href: "#wifi",
    description: "Rychlé připojení k naší síti",
    icon: "wifi",
  },
];
