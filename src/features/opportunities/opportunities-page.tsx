import { Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { PageShell } from '@/components/layout/page-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { opportunities } from '@/data/mock-data'
import { cn, formatCurrency, formatRelativeDate } from '@/lib/utils'
import type { OpportunityStatus } from '@/types'

const statusLabels: Record<OpportunityStatus, string> = {
  discovered: 'Discovered',
  qualified: 'Qualified',
  in_progress: 'In Progress',
  submitted: 'Submitted',
  won: 'Won',
  lost: 'Lost',
}

const statusVariants: Record<OpportunityStatus, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  discovered: 'secondary',
  qualified: 'default',
  in_progress: 'warning',
  submitted: 'default',
  won: 'success',
  lost: 'destructive',
}

export function OpportunitiesPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | OpportunityStatus>('all')

  const filtered = useMemo(() => {
    return opportunities.filter((opp) => {
      const matchesSearch =
        !search ||
        opp.title.toLowerCase().includes(search.toLowerCase()) ||
        opp.agency.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'all' || opp.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter])

  return (
    <PageShell
      title="Opportunities"
      description={`${opportunities.length} opportunities in your pipeline`}
      actions={
        <Button
          size="sm"
          onClick={() =>
            toast.info('Opportunity creation', {
              description: 'Manual opportunity entry is coming soon. New matches sync automatically from your connected sources.',
            })
          }
        >
          <Plus className="size-4" aria-hidden="true" />
          Add opportunity
        </Button>
      }
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search
            className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            placeholder="Search opportunities…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search opportunities"
          />
        </div>
        <Tabs
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="discovered">Discovered</TabsTrigger>
            <TabsTrigger value="qualified">Qualified</TabsTrigger>
            <TabsTrigger value="in_progress">Active</TabsTrigger>
            <TabsTrigger value="submitted">Submitted</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              No opportunities match your filters.
            </CardContent>
          </Card>
        ) : (
          filtered.map((opp) => (
            <Card key={opp.id} className="transition-colors hover:bg-muted/30">
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium">{opp.title}</h3>
                    <Badge variant={statusVariants[opp.status]}>{statusLabels[opp.status]}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{opp.agency}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {opp.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-[10px]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-start gap-1 sm:items-end">
                  <span className="text-lg font-semibold tabular-nums">{formatCurrency(opp.value)}</span>
                  <span className="text-xs text-muted-foreground">
                    Due {formatRelativeDate(opp.deadline)}
                  </span>
                  <span
                    className={cn(
                      'text-xs font-medium',
                      opp.fitScore >= 90 ? 'text-success' : 'text-muted-foreground',
                    )}
                  >
                    {opp.fitScore}% fit
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </PageShell>
  )
}
