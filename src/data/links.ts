import type { Profile, ProfileLink } from "@/data/types";

export type { LinkIcon, Profile, ProfileLink } from "@/data/types";

export const profile: Profile = {
  name: "Rezit",
  tagline: "Stavíme digitální produkty nové generace.",
  bannerSrc: "/images/image-mesh-gradient.png",
  avatarSrc: "/images/rezitlogo.png",
};

export const links: ProfileLink[] = [
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
];
