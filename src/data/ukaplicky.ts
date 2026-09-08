import type { Profile, ProfileLink } from "@/data/types";

export const profile: Profile = {
  name: "Restaurace U Kapličky",
  tagline: "Restaurace v klidné části Chrudimi",
  bannerSrc: "/images/bannerkaplenovy.webp",
  avatarSrc: "/images/kaplelogoo.webp",
  wifi: {
    ssid: "U Kaplicky Guest",
    password: "kaplicka2026",
    encryption: "WPA",
  },
};

export const links: ProfileLink[] = [
  {
    id: "menu",
    label: "Menu",
    href: "#menu",
    description: "Podívejte se na náš jídelní lístek",
    icon: "menu",
  },
  {
    id: "website",
    label: "Webové stránky",
    href: "https://example.com",
    description: "Více o restauraci a rezervacích",
    icon: "globe",
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
    id: "address",
    label: "Adresa",
    href: "https://maps.google.com/?q=Restaurace+U+Kapličky+Chrudim",
    description: "Najděte nás na mapě",
    icon: "address",
  },
];
