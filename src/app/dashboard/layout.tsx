import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardProvider } from "@/components/dashboard/DashboardContext";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import {
  aggregateDashboardStats,
  emptyDashboardStats,
  type AnalyticsEventRow,
} from "@/lib/analytics";
import {
  linksFromRows,
  profileFromRow,
  type DotraLinkRow,
  type DotraProfileRow,
} from "@/lib/dotra-profile";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard | dotra",
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
  const uiLinks = linksFromRows((links ?? []) as DotraLinkRow[]);

  const since = new Date();
  since.setDate(since.getDate() - 90);

  const { data: events, error: eventsError } = await supabase
    .from("dotra_events")
    .select(
      "event_type, link_id, link_href, link_icon, link_label, visitor_key, created_at",
    )
    .eq("profile_id", user.id)
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: true });

  const initialStats = eventsError
    ? emptyDashboardStats()
    : aggregateDashboardStats((events ?? []) as AnalyticsEventRow[], uiLinks);

  return (
    <DashboardProvider
      profileId={user.id}
      userEmail={user.email ?? ""}
      slug={row.slug}
      initialProfile={profileFromRow(row)}
      initialLinks={uiLinks}
      initialStats={initialStats}
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
