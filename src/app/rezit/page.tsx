import type { Metadata } from "next";
import { ProfilePage } from "@/components/ProfilePage";
import { links, profile } from "@/data/links";

export const metadata: Metadata = {
  title: "Rezit | Odkazy",
  description: "Stavíme digitální produkty nové generace.",
};

export default function RezitPage() {
  return <ProfilePage profile={profile} links={links} />;
}
