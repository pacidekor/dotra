import type { Profile, ProfileLink } from "@/data/types";

export const profile: Profile = {
  name: "Tomáš Dočekal",
  tagline: "Co-Founder of Rezit, Vouchy and Dotra",
  // Nahraď vlastními fotkami v /public/images/ a uprav cesty níž
  bannerSrc: "/images/image-mesh-gradient.png",
  avatarSrc: "/images/rezitlogo.png",
  contact: {
    phone: "+420773902633",
    email: "tomas@rezit.cz",
    url: "https://www.rezit.cz",
    organization: "Rezit",
    title: "Co-Founder of Rezit, Vouchy and Dotra",
  },
};

export const links: ProfileLink[] = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/tomasdocekal_/",
    description: "Sledujte mě na Instagramu",
    icon: "instagram",
  },
  {
    id: "email",
    label: "E-mail",
    href: "mailto:tomas@rezit.cz",
    description: "Napište mi",
    icon: "email",
  },
  {
    id: "phone",
    label: "Telefon",
    href: "tel:+420773902633",
    description: "Zavolejte mi",
    icon: "phone",
  },
  {
    id: "rezit",
    label: "Rezit",
    href: "https://www.rezit.cz",
    description: "www.rezit.cz",
    icon: "globe",
  },
  {
    id: "vouchy",
    label: "Vouchy",
    href: "https://www.vouchy.cz",
    description: "www.vouchy.cz",
    icon: "globe",
  },
];
