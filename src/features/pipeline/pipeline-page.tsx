import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OpportunityDetail } from "@/features/opportunities/opportunity-detail";
import { PIPELINE_STAGES, summariseStages, totalValue, weightedValue } from "@/lib/metrics";
import { cn, formatCurrency, formatRelativeDate } from "@/lib/utils";
import { useWorkspace } from "@/providers/workspace-provider";

const riskBorders = {
  low: "border-l-success",
  medium: "border-l-warning",
  high: "border-l-destructive",
} as const;

const riskLabels = {
  low: "Low risk",
  medium: "Medium risk",
  high: "High risk",
} as const;

export function PipelinePage() {
  const { opportunities, moveOpportunity } = useWorkspace();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const columns = useMemo(() => summariseStages(opportunities), [opportunities]);
  const total = totalValue(opportunities);
  const weighted = weightedValue(opportunities);
  const selected = opportunities.find((item) => item.id === selectedId) ?? null;

  function shift(id: string, title: string, direction: -1 | 1) {
    const current = opportunities.find((item) => item.id === id);
    if (!current) return;
    const index = PIPELINE_STAGES.findIndex((stage) => stage.id === current.stage);
    const next = PIPELINE_STAGES[index + direction];
    if (!next) return;
    moveOpportunity(id, next.id);
    toast.success("Stage updated", { description: `${title} moved to ${next.label}` });
  }

  return (
    <PageShell
      title="Pipeline"
      description="Capture stages from discovery through award"
      breadcrumbs={[{ label: "Workspace", href: "/app" }, { label: "Pipeline" }]}
      fullWidth
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal text-muted-foreground">
              Total pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums">{formatCurrency(total)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal text-muted-foreground">
              Weighted forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums">{formatCurrency(weighted)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal text-muted-foreground">Pursuits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums">{opportunities.length}</p>
          </CardContent>
        </Card>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        Use the arrow buttons on a card to advance or return a pursuit between stages.
      </p>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <section
            key={column.stage}
            aria-labelledby={`stage-${column.stage}`}
            className="flex w-72 shrink-0 flex-col"
          >
            <div className="mb-3">
              <div className="flex items-center justify-between gap-2">
                <h2 id={`stage-${column.stage}`} className="text-sm font-medium">
                  {column.label}
                </h2>
                <Badge variant="secondary">{column.items.length}</Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                {formatCurrency(column.value)} · {formatCurrency(column.weighted)} weighted
              </p>
            </div>

            <ul className="flex flex-1 flex-col gap-3">
              {column.items.length === 0 ? (
                <li className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                  No opportunities in {column.label.toLowerCase()}
                </li>
              ) : (
                column.items.map((opportunity) => {
                  const stageIndex = PIPELINE_STAGES.findIndex(
                    (stage) => stage.id === opportunity.stage,
                  );

                  return (
                    <li key={opportunity.id}>
                      <Card className={cn("border-l-4", riskBorders[opportunity.riskLevel])}>
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-sm font-medium leading-snug">
                            <button
                              type="button"
                              className="rounded text-left hover:underline"
                              onClick={() => setSelectedId(opportunity.id)}
                            >
                              {opportunity.title}
                            </button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 p-4 pt-0">
                          <p className="text-xs text-muted-foreground">{opportunity.agency}</p>
                          <p className="flex items-center justify-between text-xs">
                            <span className="font-medium tabular-nums">
                              {formatCurrency(opportunity.value)}
                            </span>
                            <time
                              className="text-muted-foreground"
                              dateTime={opportunity.deadline.toISOString()}
                            >
                              {formatRelativeDate(opportunity.deadline)}
                            </time>
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Badge
                              variant={opportunity.fitScore >= 90 ? "success" : "secondary"}
                              className="text-[10px]"
                            >
                              {opportunity.fitScore}% fit
                            </Badge>
                            <Badge variant="outline" className="text-[10px]">
                              {opportunity.probability}% win
                            </Badge>
                            <span className="sr-only">{riskLabels[opportunity.riskLevel]}</span>
                          </div>

                          <div className="flex justify-end gap-1 pt-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7"
                              disabled={stageIndex === 0}
                              onClick={() => shift(opportunity.id, opportunity.title, -1)}
                              aria-label={`Move ${opportunity.title} to the previous stage`}
                            >
                              <ChevronLeft className="size-4" aria-hidden="true" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7"
                              disabled={stageIndex === PIPELINE_STAGES.length - 1}
                              onClick={() => shift(opportunity.id, opportunity.title, 1)}
                              aria-label={`Move ${opportunity.title} to the next stage`}
                            >
                              <ChevronRight className="size-4" aria-hidden="true" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </li>
                  );
                })
              )}
            </ul>
          </section>
        ))}
      </div>

      <OpportunityDetail
        opportunity={selected}
        open={selected !== null}
        onOpenChange={(open) => !open && setSelectedId(null)}
      />
    </PageShell>
  );
}
