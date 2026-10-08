"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { DashboardStats } from "@/data/dashboard-mock";
import type { ProfileLink } from "@/data/types";

type StatsPanelProps = {
  stats: DashboardStats;
  links: ProfileLink[];
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("cs-CZ").format(value);
}

const visitsConfig = {
  visits: {
    label: "Návštěvy",
    color: "#111111",
  },
} satisfies ChartConfig;

const activityConfig = {
  visits: {
    label: "Návštěvy",
    color: "#111111",
  },
  clicks: {
    label: "Prokliky",
    color: "#ccfc4e",
  },
} satisfies ChartConfig;

export function StatsPanel({ stats, links }: StatsPanelProps) {
  const topLinks = [...links]
    .map((link) => ({
      link,
      clicks: stats.clicksByLink[link.id] ?? 0,
    }))
    .sort((a, b) => b.clicks - a.clicks);

  const maxClicks = Math.max(...topLinks.map((item) => item.clicks), 1);

  return (
    <section className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          label="Návštěvy"
          value={formatNumber(stats.visits)}
          tone="lime"
        />
        <StatCard
          label="Načtení stránky"
          value={formatNumber(stats.pageViews)}
          tone="ink"
        />
        <StatCard
          label="Prokliky celkem"
          value={formatNumber(stats.totalClicks)}
          tone="soft"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="rounded-2xl border-black/[0.06] bg-white/90 shadow-none ring-0">
          <CardHeader>
            <CardTitle>Návštěvy za posledních 7 dní</CardTitle>
            <CardDescription>
              Celkový počet návštěv veřejného profilu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={visitsConfig}
              className="aspect-auto h-[260px] w-full"
            >
              <AreaChart
                accessibilityLayer
                data={stats.visitsOverTime}
                margin={{ top: 8, left: 0, right: 8, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="fillVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--color-visits)"
                      stopOpacity={0.28}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-visits)"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="4 6"
                  className="stroke-border/60"
                />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={36}
                  tickMargin={8}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                />
                <ChartTooltip
                  cursor={{
                    stroke: "var(--border)",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  dataKey="visits"
                  type="monotone"
                  fill="url(#fillVisits)"
                  stroke="var(--color-visits)"
                  strokeWidth={2.25}
                  animationDuration={900}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-black/[0.06] bg-white/90 shadow-none ring-0">
          <CardHeader>
            <CardTitle>Aktivita podle dne</CardTitle>
            <CardDescription>
              Návštěvy a prokliky ve stacked přehledu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={activityConfig}
              className="aspect-auto h-[260px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={stats.visitsOverTime}
                margin={{ top: 8, left: 0, right: 8, bottom: 0 }}
                barCategoryGap="28%"
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="4 6"
                  className="stroke-border/60"
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("cs-CZ", {
                      weekday: "short",
                    })
                  }
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={36}
                  tickMargin={8}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                />
                <ChartTooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.45 }}
                  content={<ChartTooltipContent />}
                />
                <Bar
                  dataKey="visits"
                  stackId="a"
                  fill="var(--color-visits)"
                  radius={[0, 0, 6, 6]}
                  animationDuration={900}
                  animationEasing="ease-out"
                />
                <Bar
                  dataKey="clicks"
                  stackId="a"
                  fill="var(--color-clicks)"
                  radius={[6, 6, 0, 0]}
                  animationDuration={900}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-black/[0.06] bg-white/90 shadow-none ring-0">
        <CardHeader>
          <CardTitle>Prokliky podle karet</CardTitle>
          <CardDescription>
            Které odkazy lidé používají nejčastěji
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3.5">
            {topLinks.map(({ link, clicks }) => (
              <li key={link.id}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                  <span className="truncate text-foreground">{link.label}</span>
                  <span className="text-muted-foreground shrink-0 tabular-nums">
                    {formatNumber(clicks)}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#ececef]">
                  <div
                    className="h-full rounded-full bg-[#ccfc4e] transition-[width] duration-700 ease-out"
                    style={{ width: `${(clicks / maxClicks) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "lime" | "ink" | "soft";
}) {
  const toneClass =
    tone === "lime"
      ? "border-[#ccfc4e]/70 bg-[#ccfc4e]"
      : tone === "ink"
        ? "border-black/90 bg-[#111111] text-white"
        : "border-black/[0.06] bg-white/90";

  const labelClass =
    tone === "ink" ? "text-white/60" : "text-foreground/55";
  const valueClass = tone === "ink" ? "text-white" : "text-foreground";

  return (
    <Card className={`rounded-2xl shadow-none ring-0 ${toneClass}`}>
      <CardHeader className="pb-2">
        <CardDescription className={labelClass}>{label}</CardDescription>
        <CardTitle
          className={`text-2xl tracking-tight tabular-nums ${valueClass}`}
        >
          {value}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
