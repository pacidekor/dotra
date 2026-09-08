export type LinkIcon =
  | "globe"
  | "email"
  | "instagram"
  | "tiktok"
  | "facebook"
  | "google"
  | "wifi"
  | "menu"
  | "address"
  | "phone";

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
