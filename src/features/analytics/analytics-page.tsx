import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { PageShell } from '@/components/layout/page-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  dashboardMetrics,
  opportunityTrendData,
  pipelineChartData,
  winRateChartData,
} from '@/data/mock-data'
import { formatCurrency, formatPercent } from '@/lib/utils'

export function AnalyticsPage() {
  return (
    <PageShell
      title="Analytics"
      description="Pipeline performance, win rates, and team activity"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Pipeline Value', value: formatCurrency(dashboardMetrics.pipelineValue) },
          { label: 'Win Rate', value: formatPercent(dashboardMetrics.winRate, 1) },
          { label: 'Revenue Won YTD', value: formatCurrency(dashboardMetrics.revenueWon) },
          { label: 'Active Opportunities', value: String(dashboardMetrics.activeOpportunities) },
        ].map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="pb-2">
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="text-2xl tabular-nums">{metric.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Growth</CardTitle>
            <CardDescription>Monthly pipeline value trend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64" role="img" aria-label="Pipeline growth chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pipelineChartData}>
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
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Win Rate by Quarter</CardTitle>
            <CardDescription>Your win rate vs industry benchmark</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64" role="img" aria-label="Win rate comparison chart">
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
                    formatter={(value, name) => [
                      `${Number(value ?? 0)}%`,
                      name === 'value' ? 'Your win rate' : 'Benchmark',
                    ]}
                    contentStyle={{
                      background: 'var(--color-popover)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="value" name="Your win rate" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="secondary" name="Benchmark" fill="var(--color-muted-foreground)" radius={[4, 4, 0, 0]} opacity={0.4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Discovery Activity</CardTitle>
            <CardDescription>Opportunities discovered and qualified per day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48" role="img" aria-label="Weekly activity chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={opportunityTrendData}>
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
      </div>
    </PageShell>
  )
}
