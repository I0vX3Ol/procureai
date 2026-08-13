import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Circle,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react'
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
} from 'recharts'

import { PageShell } from '@/components/layout/page-shell'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  aiActivities,
  dashboardMetrics,
  opportunities,
  pipelineChartData,
  projects,
  tasks,
} from '@/data/mock-data'
import { cn, formatCurrency, formatPercent, formatRelativeDate } from '@/lib/utils'

function MetricCard({
  label,
  value,
  change,
  changeLabel,
}: {
  label: string
  value: string
  change: number
  changeLabel?: string
}) {
  const isPositive = change >= 0
  const Icon = isPositive ? ArrowUpRight : ArrowDownRight

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            'flex items-center gap-1 text-xs font-medium',
            isPositive ? 'text-success' : 'text-destructive',
          )}
        >
          <Icon className="size-3.5" aria-hidden="true" />
          <span>{formatPercent(Math.abs(change), 1)}</span>
          {changeLabel && <span className="text-muted-foreground font-normal">{changeLabel}</span>}
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardPage() {
  const upcomingOpportunities = [...opportunities]
    .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
    .slice(0, 4)

  return (
    <PageShell
      title="Dashboard"
      description="Overview of your procurement pipeline and team activity"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Pipeline Value"
          value={formatCurrency(dashboardMetrics.pipelineValue)}
          change={dashboardMetrics.pipelineChange}
          changeLabel="vs last month"
        />
        <MetricCard
          label="Revenue Won"
          value={formatCurrency(dashboardMetrics.revenueWon)}
          change={dashboardMetrics.revenueChange}
          changeLabel="YTD"
        />
        <MetricCard
          label="Win Rate"
          value={formatPercent(dashboardMetrics.winRate, 1)}
          change={dashboardMetrics.winRateChange}
          changeLabel="vs last quarter"
        />
        <MetricCard
          label="Active Opportunities"
          value={String(dashboardMetrics.activeOpportunities)}
          change={8.2}
          changeLabel="new this month"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-4 text-muted-foreground" aria-hidden="true" />
              Pipeline Growth
            </CardTitle>
            <CardDescription>Total pipeline value over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64" role="img" aria-label="Pipeline growth chart">
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
                    formatter={(value) => [formatCurrency(Number(value ?? 0)), 'Pipeline']}
                    contentStyle={{
                      background: 'var(--color-popover)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="size-4 text-muted-foreground" aria-hidden="true" />
              Upcoming Deadlines
            </CardTitle>
            <CardDescription>{dashboardMetrics.upcomingDeadlines} due within 30 days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingOpportunities.map((opp) => (
              <div key={opp.id} className="space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium leading-snug">{opp.title}</p>
                  <Badge variant={opp.fitScore >= 90 ? 'success' : 'secondary'}>
                    {opp.fitScore}%
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="size-3" aria-hidden="true" />
                  <time dateTime={opp.deadline.toISOString()}>{formatRelativeDate(opp.deadline)}</time>
                  <span>·</span>
                  <span>{formatCurrency(opp.value)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
            <CardDescription>Proposal and capture projects in progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {projects.map((project) => (
              <div key={project.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{project.name}</p>
                  <span className="text-xs text-muted-foreground tabular-nums">{project.progress}%</span>
                </div>
                <Progress value={project.progress} aria-label={`${project.name} progress`} />
                <p className="text-xs text-muted-foreground">
                  {project.teamSize} team members · Due {formatRelativeDate(project.dueDate)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>Your team's priority items</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3" aria-label="Task list">
              {tasks.map((task) => (
                <li key={task.id} className="flex items-start gap-3">
                  {task.completed ? (
                    <CheckCircle2 className="mt-0.5 size-4 text-success shrink-0" aria-hidden="true" />
                  ) : (
                    <Circle className="mt-0.5 size-4 text-muted-foreground shrink-0" aria-hidden="true" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        'text-sm',
                        task.completed && 'text-muted-foreground line-through',
                      )}
                    >
                      {task.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {task.assignee} · {formatRelativeDate(task.dueDate)}
                    </p>
                  </div>
                  <Badge
                    variant={
                      task.priority === 'high'
                        ? 'destructive'
                        : task.priority === 'medium'
                          ? 'warning'
                          : 'secondary'
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

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Opportunities discovered and qualified</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48" role="img" aria-label="Weekly activity chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineChartData.slice(-7)}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--color-popover)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="value" fill="var(--color-primary)" radius={[4, 4, 0, 0]} opacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" aria-hidden="true" />
              Recent AI Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {aiActivities.map((activity) => (
                <li key={activity.id}>
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.target}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {activity.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  {activity.id !== aiActivities[aiActivities.length - 1].id && (
                    <Separator className="mt-4" />
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}
