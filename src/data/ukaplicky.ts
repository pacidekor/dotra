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
    href: "https://ukaplickychrudim.cz/#denni-menu",
    description: "Podívejte se na náš jídelní lístek",
    icon: "menu",
  },
  {
    id: "website",
    label: "Webové stránky",
    href: "https://ukaplickychrudim.cz/",
    description: "Více o restauraci a rezervacích",
    icon: "globe",
  },
  {
    id: "google",
    label: "Ohodnoťte nás na Google",
    href: "https://search.google.com/local/writereview?placeid=ChIJYSTMCifKDUcRLPb85sxMZlM",
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
    href: "https://www.instagram.com/u_kaplicky_chrudim/",
    description: "Sledujte nás na Instagramu",
    icon: "instagram",
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/restauraceukaplicky/",
    description: "Sledujte nás na Facebooku",
    icon: "facebook",
  },
  {
    id: "email",
    label: "E-mail",
    href: "mailto:lada@cateringsindelar.cz",
    description: "Napište nám",
    icon: "email",
  },
  {
    id: "phone",
    label: "Telefon",
    href: "tel:+420774355426",
    description: "Zavolejte nám",
    icon: "phone",
  },
  {
    id: "address",
    label: "Adresa",
    href: "https://www.google.com/maps/place/Restaurace+U+Kapli%C4%8Dky/@49.9537137,15.7990883,13.75z/data=!4m6!3m5!1s0x470dca270acc2461:0x53664ccce6fcf62c!8m2!3d49.956556!4d15.809618!16s%2Fg%2F11b6v8xmx3?entry=ttu",
    description: "Najděte nás na mapě",
    icon: "address",
  },
];
