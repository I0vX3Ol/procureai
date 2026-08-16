import { useMemo, useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartCard } from "@/components/common/chart-card";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { EMPTY_PROCURE_DASHBOARD, fetchProcureDashboard } from "@/lib/remote-data";
import { fetchCustomers } from "@/lib/remote-data";
import { dashboardMetrics, valueByType, weightedValue, openOpportunities } from "@/lib/metrics";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { useWorkspace } from "@/providers/workspace-provider";

const chartColors = [
  "var(--color-primary)",
  "var(--color-success)",
  "var(--color-warning)",
  "var(--color-destructive)",
];

const tooltipStyle = {
  background: "var(--color-popover)",
  border: "1px solid var(--color-border)",
  borderRadius: "8px",
  color: "var(--color-popover-foreground)",
};

const ranges = [
  { value: "12m", label: "Last 12 months" },
  { value: "6m", label: "Last 6 months" },
  { value: "3m", label: "Last quarter" },
];

export function AnalyticsPage() {
  const { opportunities } = useWorkspace();
  const [range, setRange] = useState("12m");

  const metrics = useMemo(() => dashboardMetrics(opportunities), [opportunities]);
  const open = useMemo(() => openOpportunities(opportunities), [opportunities]);
  const forecast = useMemo(() => weightedValue(open), [open]);
  const mix = useMemo(() => valueByType(opportunities), [opportunities]);

  const [customers, setCustomers] = useState<Awaited<ReturnType<typeof fetchCustomers>>>([]);
  const [dashboard, setDashboard] = useState(EMPTY_PROCURE_DASHBOARD);

  const pipelineChartData = dashboard.stages.map((s2) => ({ label: s2.label, value: s2.amount }));
  const opportunityTrendData = dashboard.months.map((m) => ({
    label: m.label,
    value: m.discovered,
  }));
  const winRateChartData = dashboard.months.map((m) => ({
    label: m.label,
    value: m.won + m.lost > 0 ? Math.round((m.won / (m.won + m.lost)) * 100) : 0,
  }));
  const forecastData = dashboard.months.map((m) => ({
    label: m.label,
    committed: m.wonValue,
    weighted: Math.round(m.wonValue * 0.85),
  }));
  const proposalFunnelData = dashboard.funnel;
  const cycleTimeData = dashboard.months.map((m) => ({
    label: m.label,
    value: dashboard.avgCycleDays ?? 0,
  }));

  const months = range === "3m" ? 3 : range === "6m" ? 6 : pipelineChartData.length;
  const pipelineSeries = pipelineChartData.slice(-months);

  const mixTotal = mix.reduce((sum, item) => sum + item.value, 0);
  useEffect(() => {
    let cancelled = false;
    void fetchCustomers().then((rows) => {
      if (!cancelled) setCustomers(rows);
    });
    void fetchProcureDashboard().then((d) => {
      if (!cancelled) setDashboard(d);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const activeCustomers = customers.filter((customer) => customer.status === "active").length;

  const averageDeal = open.length > 0 ? metrics.pipelineValue / open.length : 0;

  const summaryCards = [
    {
      label: "Open pipeline",
      value: formatCurrency(metrics.pipelineValue),
      hint: `${open.length} active pursuits`,
    },
    {
      label: "Weighted forecast",
      value: formatCurrency(forecast),
      hint: "Probability-adjusted",
    },
    {
      label: "Win rate",
      value: formatPercent(metrics.winRate, 1),
      hint: "Decided pursuits, trailing 12 months",
    },
    {
      label: "Average deal size",
      value: formatCurrency(averageDeal),
      hint: `${activeCustomers} active customers`,
    },
  ];

  return (
    <PageShell
      title="Analytics"
      description="Pipeline health, forecast accuracy, conversion, and cycle time"
      breadcrumbs={[{ label: "Workspace", href: "/app" }, { label: "Analytics" }]}
      actions={
        <div className="flex items-center gap-2">
          <Label htmlFor="analytics-range" className="text-sm text-muted-foreground">
            Period
          </Label>
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger id="analytics-range" className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ranges.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
    >
      <section aria-labelledby="analytics-summary">
        <h2 id="analytics-summary" className="sr-only">
          Summary metrics
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((metric) => (
            <Card key={metric.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-normal text-muted-foreground">
                  {metric.label}
                </CardTitle>
                <p className="text-2xl font-semibold tabular-nums">{metric.value}</p>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{metric.hint}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="analytics-pipeline" className="mt-6">
        <h2 id="analytics-pipeline" className="sr-only">
          Pipeline and forecast
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Pipeline growth"
            description="Qualified pipeline value by month"
            rows={pipelineSeries.map((point) => point.label)}
            series={[
              {
                label: "Pipeline value",
                values: pipelineSeries.map((point) => formatCurrency(point.value)),
              },
            ]}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pipelineSeries}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value ?? 0)), "Pipeline"]}
                  contentStyle={tooltipStyle}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Forecast vs quota"
            description="Value won per month, with a weighted view"
            rows={forecastData.map((point) => point.label)}
            series={[
              {
                label: "Committed",
                values: forecastData.map((point) => formatCurrency(point.committed)),
              },
              {
                label: "Weighted",
                values: forecastData.map((point) => formatCurrency(point.weighted)),
              },
            ]}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value ?? 0))}
                  contentStyle={tooltipStyle}
                />
                <Legend />
                <Bar
                  dataKey="committed"
                  name="Committed"
                  fill="var(--color-primary)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="weighted"
                  name="Weighted"
                  fill="var(--color-success)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="target"
                  name="Target"
                  fill="var(--color-muted-foreground)"
                  radius={[4, 4, 0, 0]}
                  opacity={0.35}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </section>

      <section aria-labelledby="analytics-conversion" className="mt-6">
        <h2 id="analytics-conversion" className="sr-only">
          Conversion and win rate
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Capture funnel"
            description="Opportunities reaching each stage over the trailing twelve months"
            rows={proposalFunnelData.map((point) => point.label)}
            series={[
              {
                label: "Opportunities",
                values: proposalFunnelData.map((point) => String(point.value)),
              },
              {
                label: "Conversion from discovery",
                values: proposalFunnelData.map(
                  (point) =>
                    `${((point.value / (proposalFunnelData[0]?.value ?? 1)) * 100).toFixed(1)}%`,
                ),
              },
            ]}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={proposalFunnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={92}
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => [String(value ?? 0), "Opportunities"]}
                  contentStyle={tooltipStyle}
                />
                <Bar dataKey="value" fill="var(--color-primary)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Win rate by quarter"
            description="Your win rate compared with the industry benchmark"
            rows={winRateChartData.map((point) => point.label)}
            series={[
              {
                label: "Your win rate",
                values: winRateChartData.map((point) => `${point.value}%`),
              },
            ]}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={winRateChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(value, name) => [`${Number(value ?? 0)}%`, String(name)]}
                  contentStyle={tooltipStyle}
                />
                <Legend />
                <Bar
                  dataKey="value"
                  name="Your win rate"
                  fill="var(--color-primary)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="secondary"
                  name="Benchmark"
                  fill="var(--color-muted-foreground)"
                  radius={[4, 4, 0, 0]}
                  opacity={0.4}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </section>

      <section aria-labelledby="analytics-operations" className="mt-6">
        <h2 id="analytics-operations" className="sr-only">
          Portfolio mix and operations
        </h2>
        <div className="grid gap-6 lg:grid-cols-3">
          <ChartCard
            title="Pipeline by sector"
            description="Share of open pipeline value"
            rows={mix.map((point) => point.label)}
            series={[
              { label: "Value", values: mix.map((point) => formatCurrency(point.value)) },
              {
                label: "Share",
                values: mix.map((point) =>
                  mixTotal ? `${((point.value / mixTotal) * 100).toFixed(1)}%` : "0%",
                ),
              },
            ]}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mix}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {mix.map((entry, index) => (
                    <Cell
                      key={entry.label}
                      fill={chartColors[index % chartColors.length]}
                      stroke="var(--color-card)"
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [formatCurrency(Number(value ?? 0)), String(name)]}
                  contentStyle={tooltipStyle}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Median cycle time"
            description="Days spent in each capture stage"
            rows={cycleTimeData.map((point) => point.label)}
            series={[
              { label: "Days", values: cycleTimeData.map((point) => `${point.value} days`) },
            ]}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cycleTimeData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}d`}
                />
                <Tooltip
                  formatter={(value) => [`${Number(value ?? 0)} days`, "Median"]}
                  contentStyle={tooltipStyle}
                />
                <Bar dataKey="value" fill="var(--color-warning)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Weekly discovery"
            description="New matched opportunities per day"
            rows={opportunityTrendData.map((point) => point.label)}
            series={[
              {
                label: "Opportunities",
                values: opportunityTrendData.map((point) => String(point.value)),
              },
            ]}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={opportunityTrendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  formatter={(value) => [String(value ?? 0), "Opportunities"]}
                  contentStyle={tooltipStyle}
                />
                <Bar dataKey="value" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </section>
    </PageShell>
  );
}
