import { PageShell } from '@/components/layout/page-shell'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { opportunities } from '@/data/mock-data'
import { cn, formatCurrency, formatRelativeDate } from '@/lib/utils'
import type { PipelineStage } from '@/types'

const stages: { id: PipelineStage; label: string }[] = [
  { id: 'discovery', label: 'Discovery' },
  { id: 'qualification', label: 'Qualification' },
  { id: 'proposal', label: 'Proposal' },
  { id: 'review', label: 'Review' },
  { id: 'submitted', label: 'Submitted' },
  { id: 'awarded', label: 'Awarded' },
]

const riskColors = {
  low: 'border-l-success',
  medium: 'border-l-warning',
  high: 'border-l-destructive',
} as const

export function PipelinePage() {
  const byStage = stages.map((stage) => ({
    ...stage,
    items: opportunities.filter((o) => o.stage === stage.id),
  }))

  const totalValue = opportunities.reduce((sum, o) => sum + o.value, 0)

  return (
    <PageShell
      title="Pipeline"
      description={`${formatCurrency(totalValue)} total pipeline value across ${opportunities.length} opportunities`}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {byStage.map((column) => (
          <div key={column.id} className="flex w-72 shrink-0 flex-col">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium">{column.label}</h3>
              <Badge variant="secondary">{column.items.length}</Badge>
            </div>
            <div className="flex flex-1 flex-col gap-3">
              {column.items.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                  No opportunities
                </div>
              ) : (
                column.items.map((opp) => (
                  <Card
                    key={opp.id}
                    className={cn('border-l-4', riskColors[opp.riskLevel])}
                  >
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium leading-snug">{opp.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 p-4 pt-0">
                      <p className="text-xs text-muted-foreground">{opp.agency}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium tabular-nums">{formatCurrency(opp.value)}</span>
                        <span className="text-muted-foreground">{formatRelativeDate(opp.deadline)}</span>
                      </div>
                      <Badge variant={opp.fitScore >= 90 ? 'success' : 'secondary'} className="text-[10px]">
                        {opp.fitScore}% fit
                      </Badge>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  )
}
