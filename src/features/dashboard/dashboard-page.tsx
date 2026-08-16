import { Link } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Circle,
  Scale,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { useMemo, useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartCard } from "@/components/common/chart-card";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  fetchActivity,
  fetchProcureDashboard,
  fetchProjects,
  fetchTasks,
  EMPTY_PROCURE_DASHBOARD,
} from "@/lib/remote-data";
import {
  dashboardMetrics,
  daysUntil,
  deadlinesWithin,
  openOpportunities,
  weightedValue,
} from "@/lib/metrics";
import { cn, formatCurrency, formatPercent, formatRelativeDate } from "@/lib/utils";
import { useWorkspace } from "@/providers/workspace-provider";

const healthLabels = {
  on_track: "On track",
  at_risk: "At risk",
  off_track: "Off track",
} as const;

const healthVariants = {
  on_track: "success",
  at_risk: "warning",
  off_track: "destructive",
} as const;

const impactVariants = {
  high: "destructive",
  medium: "warning",
  low: "secondary",
} as const;

function MetricCard({
  label,
  value,
  change,
  changeLabel,
  hint,
}: {
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
  hint?: string;
}) {
  const isPositive = (change ?? 0) >= 0;
  const Icon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <Card>
      <CardHeader className="pb-2">
        {/* The label is the heading — a screen reader landing on a heading that
            reads "$10,490,000" has no idea what the number means. */}
        <CardTitle className="text-sm font-normal text-muted-foreground">{label}</CardTitle>
        <p className="text-2xl font-semibold tabular-nums">{value}</p>
      </CardHeader>
      <CardContent>
        {change !== undefined ? (
          <p
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              isPositive ? "text-success-emphasis" : "text-destructive-emphasis",
            )}
          >
            <Icon className="size-3.5" aria-hidden="true" />
            <span>
              {isPositive ? "Up" : "Down"} {formatPercent(Math.abs(change), 1)}
            </span>
            {changeLabel && (
              <span className="font-normal text-muted-foreground">{changeLabel}</span>
            )}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">{hint}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { opportunities } = useWorkspace();

  const metrics = useMemo(() => dashboardMetrics(opportunities), [opportunities]);
  const open = useMemo(() => openOpportunities(opportunities), [opportunities]);
  const forecast = useMemo(() => weightedValue(open), [open]);
  const upcoming = useMemo(() => deadlinesWithin(45, opportunities).slice(0, 5), [opportunities]);
  const [dashboard, setDashboard] = useState(EMPTY_PROCURE_DASHBOARD);
  const [projects, setProjects] = useState<Awaited<ReturnType<typeof fetchProjects>>>([]);
  const [tasks, setTasks] = useState<Awaited<ReturnType<typeof fetchTasks>>>([]);
  const [aiActivities, setAiActivities] = useState<Awaited<ReturnType<typeof fetchActivity>>>([]);

  useEffect(() => {
    let cancelled = false;
    void fetchProcureDashboard().then((d) => !cancelled && setDashboard(d));
    void fetchProjects().then((r) => !cancelled && setProjects(r));
    void fetchTasks().then((r) => !cancelled && setTasks(r));
    void fetchActivity().then((r) => !cancelled && setAiActivities(r));
    return () => {
      cancelled = true;
    };
  }, []);

  const pipelineChartData = dashboard.stages.map((stage) => ({
    label: stage.label,
    value: stage.amount,
  }));
  const opportunityTrendData = dashboard.months.map((m) => ({
    label: m.label,
    value: m.discovered,
  }));
  const activeProjects = projects.filter((project) => project.status === "active");
  const openTasks = tasks.filter((task) => !task.completed);

  return (
    <PageShell
      title="Dashboard"
      description="Pipeline, forecast, and the work that needs attention today"
      actions={
        <>
          <Button variant="outline" size="sm" asChild>
            <Link to="/app/analytics">View analytics</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/app/opportunities">Review opportunities</Link>
          </Button>
        </>
      }
    >
      <section aria-labelledby="kpi-heading">
        <h2 id="kpi-heading" className="sr-only">
          Key performance indicators
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Open pipeline"
            value={formatCurrency(metrics.pipelineValue)}
            changeLabel="vs last month"
          />
          <MetricCard
            label="Weighted forecast"
            value={formatCurrency(forecast)}
            hint={`Probability-adjusted across ${open.length} open pursuits`}
          />
          <MetricCard
            label="Win rate"
            value={formatPercent(metrics.winRate, 1)}
            changeLabel="vs last quarter"
          />
          <MetricCard
            label="Revenue won"
            value={formatCurrency(metrics.revenueWon)}
            changeLabel="year to date"
          />
        </div>
      </section>

      <section aria-labelledby="pipeline-heading" className="mt-6">
        <h2 id="pipeline-heading" className="sr-only">
          Pipeline and deadlines
        </h2>
        <div className="grid gap-6 lg:grid-cols-3">
          <ChartCard
            className="lg:col-span-2"
            title="Pipeline growth"
            description="Total qualified pipeline value by month"
            rows={pipelineChartData.map((point) => point.label)}
            series={[
              {
                label: "Pipeline value",
                values: pipelineChartData.map((point) => formatCurrency(point.value)),
              },
            ]}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={pipelineChartData}>
                <defs>
                  <linearGradient id="pipelineFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    color: "var(--color-popover-foreground)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-primary)"
                  fill="url(#pipelineFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="size-4 text-muted-foreground" aria-hidden="true" />
                Upcoming deadlines
              </CardTitle>
              <CardDescription>{metrics.upcomingDeadlines} closing within 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {upcoming.map((opportunity) => {
                  const days = daysUntil(opportunity.deadline);
                  return (
                    <li key={opportunity.id} className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-snug">{opportunity.title}</p>
                        <Badge variant={days <= 7 ? "destructive" : "secondary"}>{days}d</Badge>
                      </div>
                      <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="size-3" aria-hidden="true" />
                        <time dateTime={opportunity.deadline.toISOString()}>
                          {formatRelativeDate(opportunity.deadline)}
                        </time>
                        <span aria-hidden="true">·</span>
                        <span>{formatCurrency(opportunity.value)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{opportunity.owner}</span>
                      </p>
                    </li>
                  );
                })}
                {upcoming.length === 0 && (
                  <li className="text-sm text-muted-foreground">
                    No deadlines in the next 45 days.
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section aria-labelledby="ai-heading" className="mt-6">
        <h2 id="ai-heading" className="sr-only">
          AI recommendations
        </h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" aria-hidden="true" />
              Recommended next actions
            </CardTitle>
            <CardDescription>
              Generated from deadline pressure, review scores, and fit thresholds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-4 md:grid-cols-3">
              <p className="py-6 text-center text-sm text-muted-foreground">
                Automated recommendations are not switched on yet.
              </p>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="work-heading" className="mt-6">
        <h2 id="work-heading" className="sr-only">
          Projects and tasks
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
              <div>
                <CardTitle>Active projects</CardTitle>
                <CardDescription>Capture and delivery work in progress</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/app/projects">All projects</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-5">
              {activeProjects.map((project) => (
                <div key={project.id} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="min-w-0 truncate text-sm font-medium">{project.name}</p>
                    <Badge variant={healthVariants[project.health]}>
                      {healthLabels[project.health]}
                    </Badge>
                  </div>
                  <Progress
                    value={project.progress}
                    aria-label={`${project.name}: ${project.progress}% complete`}
                  />
                  <p className="text-xs text-muted-foreground">
                    {project.progress}% · {project.teamSize} people · led by {project.lead} · due{" "}
                    {formatRelativeDate(project.dueDate)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My tasks</CardTitle>
              <CardDescription>
                {openTasks.length} open of {tasks.length} assigned
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {tasks.map((task) => (
                  <li key={task.id} className="flex items-start gap-3">
                    {task.completed ? (
                      <CheckCircle2
                        className="mt-0.5 size-4 shrink-0 text-success-emphasis"
                        aria-hidden="true"
                      />
                    ) : (
                      <Circle
                        className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "text-sm",
                          task.completed && "text-muted-foreground line-through",
                        )}
                      >
                        {task.title}
                        <span className="sr-only">
                          {task.completed ? " (completed)" : " (open)"}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {task.assignee} ·{" "}
                        {task.dueDate ? formatRelativeDate(task.dueDate) : "No due date"}
                      </p>
                    </div>
                    <Badge
                      variant={
                        task.priority === "high"
                          ? "destructive"
                          : task.priority === "medium"
                            ? "warning"
                            : "secondary"
                      }
                    >
                      {task.priority}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section aria-labelledby="activity-heading" className="mt-6">
        <h2 id="activity-heading" className="sr-only">
          Activity
        </h2>
        <div className="grid gap-6 lg:grid-cols-3">
          <ChartCard
            className="lg:col-span-2"
            title="Weekly discovery activity"
            description="New opportunities matched to your profile each day"
            heightClassName="h-48"
            rows={opportunityTrendData.map((point) => point.label)}
            series={[
              {
                label: "Opportunities matched",
                values: opportunityTrendData.map((point) => String(point.value)),
              },
            ]}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={opportunityTrendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  formatter={(value) => [String(value ?? 0), "Opportunities"]}
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    color: "var(--color-popover-foreground)",
                  }}
                />
                <Bar dataKey="value" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="size-4 text-muted-foreground" aria-hidden="true" />
                Recent AI activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {aiActivities.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No activity recorded yet.
                  </p>
                ) : null}
                {aiActivities.map((activity, index) => (
                  <li key={activity.id}>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.actor}</p>
                    <time
                      className="mt-1 block text-[11px] text-muted-foreground"
                      dateTime={activity.createdAt.toISOString()}
                    >
                      {activity.createdAt.toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                    {index < aiActivities.length - 1 && <Separator className="mt-4" />}
                  </li>
                ))}
              </ol>
              <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
                <Scale className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                AI output is drafted for human review. Every generated section cites its source
                document.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </PageShell>
  );
}
