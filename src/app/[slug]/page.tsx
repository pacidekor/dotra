import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfilePage } from "@/components/ProfilePage";
import {
  linksFromRows,
  profileFromRow,
  type DotraLinkRow,
  type DotraProfileRow,
} from "@/lib/dotra-profile";
import { createClient } from "@/utils/supabase/server";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const RESERVED = new Set([
  "dashboard",
  "login",
  "register",
  "onboarding",
  "tomas",
  "filip",
  "rezit",
  "ukaplicky",
  "api",
]);

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (RESERVED.has(slug)) return {};

  const supabase = await createClient();
  const { data } = await supabase
    .from("dotra_profiles")
    .select("display_name, tagline")
    .eq("slug", slug)
    .not("onboarding_completed_at", "is", null)
    .maybeSingle();

  if (!data) return { title: "Profil | Dotra" };

  return {
    title: `${data.display_name || "Profil"} | Dotra`,
    description: data.tagline || undefined,
  };
}

export default async function DynamicProfilePage({ params }: PageProps) {
  const { slug } = await params;

  if (RESERVED.has(slug)) {
    notFound();
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("dotra_profiles")
    .select("*")
    .eq("slug", slug)
    .not("onboarding_completed_at", "is", null)
    .maybeSingle();

  if (!profile) {
    notFound();
  }

  const row = profile as DotraProfileRow;
  const { data: links } = await supabase
    .from("dotra_links")
    .select("*")
    .eq("profile_id", row.id)
    .eq("enabled", true)
    .order("sort_order", { ascending: true });

  const uiProfile = profileFromRow(row);
  const uiLinks = linksFromRows((links ?? []) as DotraLinkRow[]);

  // Contact CTA when phone/email present in links
  const phone = uiLinks.find((link) => link.icon === "phone")?.href;
  const email = uiLinks.find((link) => link.icon === "email")?.href;
  const web = uiLinks.find((link) => link.icon === "globe")?.href;

  if (phone?.startsWith("tel:") || email?.startsWith("mailto:") || web) {
    uiProfile.contact = {
      phone: phone?.replace(/^tel:/, "") || "",
      email: email?.replace(/^mailto:/, "") || "",
      url: web || "https://dotra.app",
      title: row.tagline || undefined,
    };
  }

  return <ProfilePage profile={uiProfile} links={uiLinks} />;
}
