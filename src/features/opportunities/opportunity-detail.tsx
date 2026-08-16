import { Link } from "@tanstack/react-router";
import { CheckCircle2, Circle, FileText, MessageSquarePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { fetchDocuments } from "@/lib/remote-data";
import { PIPELINE_STAGES, daysUntil } from "@/lib/metrics";
import { formatCurrency, formatRelativeDate } from "@/lib/utils";
import { useReturnFocus } from "@/hooks/use-return-focus";
import { useWorkspace } from "@/providers/workspace-provider";
import type { Opportunity, PipelineStage } from "@/types";

interface OpportunityDetailProps {
  opportunity: Opportunity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Slide-over detail for a single pursuit: terms, timeline, documents, notes. */
export function OpportunityDetail({ opportunity, open, onOpenChange }: OpportunityDetailProps) {
  const { moveOpportunity, updateProbability, addNote } = useWorkspace();
  const [note, setNote] = useState("");

  // Return focus to the row control that opened this panel.
  const onCloseAutoFocus = useReturnFocus();

  useEffect(() => {
    setNote("");
  }, [opportunity?.id]);

  const [documents, setDocuments] = useState<Awaited<ReturnType<typeof fetchDocuments>>>([]);
  useEffect(() => {
    let cancelled = false;
    void fetchDocuments().then((rows) => !cancelled && setDocuments(rows));
    return () => {
      cancelled = true;
    };
  }, []);

  if (!opportunity) return null;

  const linkedDocuments = documents.filter((document) =>
    opportunity.documentIds.includes(document.id),
  );
  const days = daysUntil(opportunity.deadline);
  const completedMilestones = opportunity.timeline.filter((entry) => entry.complete).length;

  function handleAddNote(event: React.FormEvent) {
    event.preventDefault();
    if (!opportunity) return;
    const body = note.trim();
    if (!body) {
      toast.error("Write a note before saving");
      return;
    }
    addNote(opportunity.id, body);
    setNote("");
    toast.success("Note added", { description: opportunity.title });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full p-0 sm:max-w-xl"
        onCloseAutoFocus={onCloseAutoFocus}
      >
        <ScrollArea className="h-full">
          <div className="p-6">
            <SheetHeader className="text-left">
              <SheetTitle className="pr-8 text-lg leading-snug">{opportunity.title}</SheetTitle>
              <SheetDescription>
                {opportunity.agency} · Solicitation {opportunity.solicitationNumber} · NAICS{" "}
                {opportunity.naicsCode}
              </SheetDescription>
            </SheetHeader>

            <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-xs text-muted-foreground">Contract value</dt>
                <dd className="mt-0.5 text-sm font-semibold tabular-nums">
                  {formatCurrency(opportunity.value)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Weighted</dt>
                <dd className="mt-0.5 text-sm font-semibold tabular-nums">
                  {formatCurrency((opportunity.value * opportunity.probability) / 100)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Fit score</dt>
                <dd className="mt-0.5 text-sm font-semibold tabular-nums">
                  {opportunity.fitScore}%
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Due</dt>
                <dd className="mt-0.5 text-sm">
                  <time dateTime={opportunity.deadline.toISOString()}>
                    {formatRelativeDate(opportunity.deadline)}
                  </time>
                  {days >= 0 && <span className="text-muted-foreground"> ({days}d)</span>}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Capture owner</dt>
                <dd className="mt-0.5 text-sm">{opportunity.owner}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Risk</dt>
                <dd className="mt-0.5 text-sm capitalize">{opportunity.riskLevel}</dd>
              </div>
            </dl>

            <Separator className="my-6" />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="detail-stage">Pipeline stage</Label>
                <Select
                  value={opportunity.stage}
                  onValueChange={(value) => {
                    moveOpportunity(opportunity.id, value as PipelineStage);
                    toast.success("Stage updated", {
                      description: `${opportunity.title} moved to ${value}`,
                    });
                  }}
                >
                  <SelectTrigger id="detail-stage" className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PIPELINE_STAGES.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="detail-probability">Win probability (%)</Label>
                <input
                  id="detail-probability"
                  type="number"
                  min={0}
                  max={100}
                  step={5}
                  value={opportunity.probability}
                  onChange={(event) =>
                    updateProbability(opportunity.id, Number(event.target.value))
                  }
                  className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>

            <Separator className="my-6" />

            <section aria-labelledby="detail-summary-heading">
              <h3 id="detail-summary-heading" className="text-sm font-semibold">
                Summary
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {opportunity.description}
              </p>
            </section>

            <section aria-labelledby="detail-requirements-heading" className="mt-6">
              <h3 id="detail-requirements-heading" className="text-sm font-semibold">
                Key requirements
              </h3>
              <ul className="mt-2 space-y-1.5">
                {opportunity.requirements.map((requirement) => (
                  <li key={requirement} className="flex items-start gap-2 text-sm">
                    <CheckCircle2
                      className="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="detail-timeline-heading" className="mt-6">
              <h3 id="detail-timeline-heading" className="text-sm font-semibold">
                Capture timeline
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {completedMilestones} of {opportunity.timeline.length} milestones complete
              </p>
              <Progress
                className="mt-2"
                value={(completedMilestones / Math.max(1, opportunity.timeline.length)) * 100}
                aria-label={`Capture timeline: ${completedMilestones} of ${opportunity.timeline.length} milestones complete`}
              />
              <ol className="mt-4 space-y-3">
                {opportunity.timeline.map((entry) => (
                  <li key={entry.id} className="flex items-start gap-3">
                    {entry.complete ? (
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
                    <div className="min-w-0">
                      <p className="text-sm">
                        {entry.label}
                        <span className="sr-only">
                          {entry.complete ? " — complete" : " — not complete"}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <time dateTime={entry.date.toISOString()}>
                          {formatRelativeDate(entry.date)}
                        </time>
                        {entry.detail ? ` · ${entry.detail}` : ""}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section aria-labelledby="detail-documents-heading" className="mt-6">
              <h3 id="detail-documents-heading" className="text-sm font-semibold">
                Linked documents
              </h3>
              {linkedDocuments.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  No documents linked yet.{" "}
                  <Link
                    to="/app/documents"
                    className="text-primary underline-offset-2 hover:underline"
                  >
                    Upload one
                  </Link>
                  .
                </p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {linkedDocuments.map((document) => (
                    <li
                      key={document.id}
                      className="flex items-center gap-3 rounded-lg border border-border p-3"
                    >
                      <FileText
                        className="size-4 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <span className="min-w-0 flex-1 truncate text-sm">{document.name}</span>
                      <Badge variant="outline">{document.pages} pp</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {opportunity.proposalId && (
              <section aria-labelledby="detail-proposal-heading" className="mt-6">
                <h3 id="detail-proposal-heading" className="text-sm font-semibold">
                  Linked proposal
                </h3>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <Link to="/app/proposals">Open in proposal builder</Link>
                </Button>
              </section>
            )}

            <section aria-labelledby="detail-notes-heading" className="mt-6">
              <h3 id="detail-notes-heading" className="text-sm font-semibold">
                Capture notes
              </h3>
              <form onSubmit={handleAddNote} className="mt-2 space-y-2">
                <Label htmlFor="detail-note" className="sr-only">
                  Add a note
                </Label>
                <Textarea
                  id="detail-note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Record a decision, a contact update, or a competitive insight…"
                  className="min-h-20"
                />
                <Button type="submit" size="sm" variant="outline">
                  <MessageSquarePlus className="size-4" aria-hidden="true" />
                  Add note
                </Button>
              </form>

              {opportunity.notes.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">No notes recorded yet.</p>
              ) : (
                <ol className="mt-4 space-y-4">
                  {opportunity.notes.map((entry) => (
                    <li key={entry.id} className="rounded-lg border border-border p-3">
                      <p className="text-sm leading-relaxed">{entry.body}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {entry.author} ·{" "}
                        <time dateTime={entry.createdAt.toISOString()}>
                          {formatRelativeDate(entry.createdAt)}
                        </time>
                      </p>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
