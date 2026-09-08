import type { Metadata } from "next";
import { ProfilePage } from "@/components/ProfilePage";
import { links, profile } from "@/data/ukaplicky";

export const metadata: Metadata = {
  title: "Restaurace U Kapličky | Odkazy",
  description: "Restaurace v klidné části Chrudimi",
};

export default function UKaplickyPage() {
  return <ProfilePage profile={profile} links={links} />;
}
