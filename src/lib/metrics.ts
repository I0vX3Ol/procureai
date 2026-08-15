import { metricTrends, opportunities, projects } from "@/data/mock-data";
import type { DashboardMetrics, Opportunity, PipelineStage } from "@/types";

/**
 * Derived portfolio metrics.
 *
 * Every surface (dashboard, analytics, pipeline, sidebar badge) reads from these
 * selectors rather than hard-coded numbers, so the figures always reconcile.
 */

/** Opportunities still being worked — excludes closed-won and closed-lost. */
export const OPEN_STATUSES: Opportunity["status"][] = [
  "discovered",
  "qualified",
  "in_progress",
  "submitted",
];

/** The reference "today" for this dataset. */
export const TODAY = new Date("2026-08-13T09:00:00");

export function openOpportunities(items: Opportunity[] = opportunities): Opportunity[] {
  return items.filter((item) => OPEN_STATUSES.includes(item.status));
}

export function totalValue(items: Opportunity[]): number {
  return items.reduce((sum, item) => sum + item.value, 0);
}

/** Probability-adjusted value — the number a capture lead forecasts on. */
export function weightedValue(items: Opportunity[]): number {
  return items.reduce((sum, item) => sum + (item.value * item.probability) / 100, 0);
}

export function daysUntil(date: Date, from: Date = TODAY): number {
  return Math.round((date.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

export function deadlinesWithin(days: number, items: Opportunity[] = opportunities): Opportunity[] {
  return openOpportunities(items)
    .filter((item) => {
      const delta = daysUntil(item.deadline);
      return delta >= 0 && delta <= days;
    })
    .sort((a, b) => a.deadline.getTime() - b.deadline.getTime());
}

export function winRate(items: Opportunity[] = opportunities): number {
  const decided = items.filter((item) => item.status === "won" || item.status === "lost");
  if (decided.length === 0) return 0;
  const won = decided.filter((item) => item.status === "won").length;
  return (won / decided.length) * 100;
}

export function revenueWon(items: Opportunity[] = opportunities): number {
  return totalValue(items.filter((item) => item.status === "won"));
}

export function dashboardMetrics(items: Opportunity[] = opportunities): DashboardMetrics {
  const open = openOpportunities(items);
  return {
    pipelineValue: totalValue(open),
    pipelineChange: metricTrends.pipelineChange,
    winRate: winRate(items),
    winRateChange: metricTrends.winRateChange,
    activeOpportunities: open.length,
    upcomingDeadlines: deadlinesWithin(30, items).length,
    revenueWon: revenueWon(items),
    revenueChange: metricTrends.revenueChange,
  };
}

export interface StageSummary {
  stage: PipelineStage;
  label: string;
  items: Opportunity[];
  value: number;
  weighted: number;
}

export const PIPELINE_STAGES: { id: PipelineStage; label: string }[] = [
  { id: "discovery", label: "Discovery" },
  { id: "qualification", label: "Qualification" },
  { id: "proposal", label: "Proposal" },
  { id: "review", label: "Review" },
  { id: "submitted", label: "Submitted" },
  { id: "awarded", label: "Awarded" },
];

export function summariseStages(items: Opportunity[] = opportunities): StageSummary[] {
  return PIPELINE_STAGES.map(({ id, label }) => {
    const stageItems = items.filter((item) => item.stage === id);
    return {
      stage: id,
      label,
      items: stageItems,
      value: totalValue(stageItems),
      weighted: weightedValue(stageItems),
    };
  });
}

/** Pipeline value grouped by customer sector, for the analytics mix chart. */
export function valueByType(items: Opportunity[] = opportunities) {
  const labels: Record<Opportunity["type"], string> = {
    government: "Federal",
    rfp: "State & Local",
    rfq: "State & Local",
    enterprise: "Enterprise",
    vendor_registration: "Vendor registration",
  };

  const totals = new Map<string, number>();
  for (const item of openOpportunities(items)) {
    const label = labels[item.type];
    totals.set(label, (totals.get(label) ?? 0) + item.value);
  }
  return [...totals.entries()].map(([label, value]) => ({ label, value }));
}

export function activeProjects() {
  return projects.filter((project) => project.status === "active");
}
