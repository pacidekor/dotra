import type { LinkIcon, Profile, ProfileLink } from "@/data/types";

export type DashboardStats = {
  visits: number;
  pageViews: number;
  totalClicks: number;
  clicksByLink: Record<string, number>;
  visitsOverTime: { date: string; label: string; visits: number; clicks: number }[];
};

export type DashboardState = {
  profile: Profile;
  links: ProfileLink[];
  stats: DashboardStats;
};

export const ICON_OPTIONS: { id: LinkIcon; label: string }[] = [
  { id: "globe", label: "Web" },
  { id: "email", label: "E-mail" },
  { id: "phone", label: "Telefon" },
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
  { id: "facebook", label: "Facebook" },
  { id: "google", label: "Google" },
  { id: "wifi", label: "Wi‑Fi" },
  { id: "menu", label: "Menu" },
  { id: "address", label: "Adresa" },
];

export const initialDashboardState: DashboardState = {
  profile: {
    name: "Rezit",
    tagline: "Stavíme digitální produkty nové generace.",
    bannerSrc: "/images/image-mesh-gradient.png",
    avatarSrc: "/images/rezitlogo.png",
  },
  links: [
    {
      id: "website",
      label: "Webové stránky",
      href: "https://www.rezit.cz",
      description: "Více o nás a našich produktech",
      icon: "globe",
    },
    {
      id: "instagram",
      label: "Instagram",
      href: "https://www.instagram.com/rezit.cz/",
      description: "Sledujte nás na Instagramu",
      icon: "instagram",
    },
    {
      id: "tiktok",
      label: "TikTok",
      href: "https://www.tiktok.com/@rezit.cz",
      description: "Krátká videa a novinky ze zákulisí",
      icon: "tiktok",
    },
    {
      id: "email",
      label: "E-mail",
      href: "mailto:info@rezit.cz",
      description: "Napište nám",
      icon: "email",
    },
    {
      id: "phone",
      label: "Telefon",
      href: "tel:+420722793181",
      description: "Zavolejte nám",
      icon: "phone",
    },
  ],
  stats: {
    visits: 1284,
    pageViews: 3512,
    totalClicks: 892,
    clicksByLink: {
      website: 312,
      instagram: 245,
      tiktok: 168,
      email: 97,
      phone: 70,
    },
    visitsOverTime: [
      { date: "2026-09-02", label: "Po", visits: 120, clicks: 48 },
      { date: "2026-09-03", label: "Út", visits: 156, clicks: 62 },
      { date: "2026-09-04", label: "St", visits: 142, clicks: 55 },
      { date: "2026-09-05", label: "Čt", visits: 198, clicks: 81 },
      { date: "2026-09-06", label: "Pá", visits: 224, clicks: 96 },
      { date: "2026-09-07", label: "So", visits: 260, clicks: 118 },
      { date: "2026-09-08", label: "Ne", visits: 184, clicks: 74 },
    ],
  },
};
