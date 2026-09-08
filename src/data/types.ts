export type LinkIcon =
  | "globe"
  | "email"
  | "instagram"
  | "tiktok"
  | "google"
  | "wifi"
  | "menu"
  | "address";

export type ProfileLink = {
  id: string;
  label: string;
  href: string;
  description: string;
  icon: LinkIcon;
};

export type WifiConfig = {
  ssid: string;
  password: string;
  encryption?: "WPA" | "WEP" | "nopass";
};

export type Profile = {
  name: string;
  tagline: string;
  bannerSrc: string;
  avatarSrc: string;
  wifi?: WifiConfig;
};
