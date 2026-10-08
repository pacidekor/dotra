"use client";

import { StatsPanel } from "@/components/dashboard/StatsPanel";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { chillax } from "@/lib/fonts";

export default function DashboardStatsPage() {
  const { state } = useDashboard();

  return (
    <div className="w-full space-y-6">
      <div>
        <h1
          className={`${chillax.className} text-[clamp(1.75rem,3vw,2.35rem)] leading-[1.05] font-bold tracking-[-0.035em] text-foreground`}
        >
          Statistiky
        </h1>
        <p className="mt-2 text-[15px] text-foreground/55">
          Návštěvy a prokliky z veřejného profilu za posledních 90 dní.
        </p>
      </div>
      <StatsPanel stats={state.stats} links={state.links} />
    </div>
  );
}
