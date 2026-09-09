import type { Metadata } from "next";
import { ProfilePage } from "@/components/ProfilePage";
import { links, profile } from "@/data/tomas";

export const metadata: Metadata = {
  title: "Tomáš Dočekal | Odkazy",
  description: "Co-Founder of Rezit, Vouchy and Dotra",
};

export default function TomasPage() {
  return <ProfilePage profile={profile} links={links} />;
}
