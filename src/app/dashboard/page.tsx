"use client";

import { StatsPanel } from "@/components/dashboard/StatsPanel";
import { useDashboard } from "@/components/dashboard/DashboardContext";

export default function DashboardStatsPage() {
  const { state } = useDashboard();

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Statistiky
        </h1>
        <p className="mt-1 text-sm text-muted">
          Přehled návštěv a prokliků (zatím mock data).
        </p>
      </div>
      <StatsPanel stats={state.stats} links={state.links} />
    </div>
  );
}
