import type { DashboardStats } from "@/data/dashboard-mock";
import type { ProfileLink } from "@/data/types";

export type AnalyticsEventRow = {
  event_type: "view" | "click" | string;
  link_id: string | null;
  link_href: string | null;
  link_icon: string | null;
  link_label: string | null;
  visitor_key: string | null;
  created_at: string;
};

const DAY_LABELS = ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"] as const;

function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function last7DayBuckets() {
  const days: { date: string; label: string; visits: number; clicks: number }[] =
    [];
  const now = new Date();
  for (let i = 6; i >= 0; i -= 1) {
    const day = new Date(now);
    day.setHours(12, 0, 0, 0);
    day.setDate(now.getDate() - i);
    days.push({
      date: toDateKey(day),
      label: DAY_LABELS[day.getDay()],
      visits: 0,
      clicks: 0,
    });
  }
  return days;
}

export function emptyDashboardStats(): DashboardStats {
  return {
    visits: 0,
    pageViews: 0,
    totalClicks: 0,
    clicksByLink: {},
    visitsOverTime: last7DayBuckets(),
  };
}

function linkMatchKey(href: string | null | undefined, icon: string | null | undefined) {
  return `${icon || ""}::${href || ""}`;
}

export function aggregateDashboardStats(
  events: AnalyticsEventRow[],
  links: ProfileLink[],
): DashboardStats {
  const visitsOverTime = last7DayBuckets();
  const dayIndex = new Map(visitsOverTime.map((day, index) => [day.date, index]));
  const uniqueVisitors = new Set<string>();
  const clicksByKey = new Map<string, number>();
  let pageViews = 0;
  let totalClicks = 0;

  for (const event of events) {
    const created = new Date(event.created_at);
    const key = toDateKey(created);
    const bucketIndex = dayIndex.get(key);

    if (event.event_type === "view") {
      pageViews += 1;
      if (event.visitor_key) uniqueVisitors.add(event.visitor_key);
      if (bucketIndex !== undefined) visitsOverTime[bucketIndex].visits += 1;
      continue;
    }

    if (event.event_type === "click") {
      totalClicks += 1;
      if (bucketIndex !== undefined) visitsOverTime[bucketIndex].clicks += 1;
      const match = linkMatchKey(event.link_href, event.link_icon);
      clicksByKey.set(match, (clicksByKey.get(match) || 0) + 1);
    }
  }

  const clicksByLink: Record<string, number> = {};
  for (const link of links) {
    clicksByLink[link.id] =
      clicksByKey.get(linkMatchKey(link.href, link.icon)) || 0;
  }

  return {
    visits: uniqueVisitors.size || pageViews,
    pageViews,
    totalClicks,
    clicksByLink,
    visitsOverTime,
  };
}

const VISITOR_KEY = "dotra_vid";

export function getOrCreateVisitorKey() {
  if (typeof window === "undefined") return null;
  try {
    const existing = window.localStorage.getItem(VISITOR_KEY);
    if (existing) return existing;
    const next =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `v_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(VISITOR_KEY, next);
    return next;
  } catch {
    return null;
  }
}

export type TrackPayload = {
  profileId: string;
  type: "view" | "click";
  linkId?: string;
  linkHref?: string;
  linkIcon?: string;
  linkLabel?: string;
};

export function trackAnalyticsEvent(payload: TrackPayload) {
  if (typeof window === "undefined") return;
  const body = JSON.stringify({
    ...payload,
    visitorKey: getOrCreateVisitorKey(),
  });

  void fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // Tracking must never break the profile UX
  });
}
