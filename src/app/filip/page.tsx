import type { Metadata } from "next";
import { ProfilePage } from "@/components/ProfilePage";
import { links, profile } from "@/data/filip";

export const metadata: Metadata = {
  title: "Filip Drbohlav | Odkazy",
  description: "Co-Founder of Rezit, Vouchy and Dotra",
};

export default function FilipPage() {
  return <ProfilePage profile={profile} links={links} />;
}
