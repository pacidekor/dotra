import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardProvider } from "@/components/dashboard/DashboardContext";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import {
  linksFromRows,
  profileFromRow,
  type DotraLinkRow,
  type DotraProfileRow,
} from "@/lib/dotra-profile";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard | Dotra",
  description: "Nastavení link tree profilu",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("dotra_profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.onboarding_completed_at) {
    redirect("/onboarding");
  }

  const { data: links } = await supabase
    .from("dotra_links")
    .select("*")
    .eq("profile_id", user.id)
    .order("sort_order", { ascending: true });

  const row = profile as DotraProfileRow;

  return (
    <DashboardProvider
      profileId={user.id}
      slug={row.slug}
      initialProfile={profileFromRow(row)}
      initialLinks={linksFromRows((links ?? []) as DotraLinkRow[])}
    >
      <div className="min-h-dvh bg-background">
        <DashboardSidebar />
        <div className="lg:pl-64">
          <div className="w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
}
