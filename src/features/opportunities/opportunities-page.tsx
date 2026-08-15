import { Link } from "@tanstack/react-router";
import { ArrowUpDown, Briefcase, Filter, Plus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/empty-state";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OpportunityDetail } from "@/features/opportunities/opportunity-detail";
import { daysUntil, totalValue, weightedValue } from "@/lib/metrics";
import { cn, formatCurrency, formatRelativeDate } from "@/lib/utils";
import { useWorkspace } from "@/providers/workspace-provider";
import type { Opportunity, OpportunityStatus } from "@/types";

const statusLabels: Record<OpportunityStatus, string> = {
  discovered: "Discovered",
  qualified: "Qualified",
  in_progress: "In progress",
  submitted: "Submitted",
  won: "Won",
  lost: "Lost",
};

const statusVariants: Record<
  OpportunityStatus,
  "default" | "secondary" | "success" | "warning" | "destructive"
> = {
  discovered: "secondary",
  qualified: "default",
  in_progress: "warning",
  submitted: "default",
  won: "success",
  lost: "destructive",
};

type SortKey = "deadline" | "value" | "fit" | "probability" | "title";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "deadline", label: "Deadline (soonest)" },
  { value: "value", label: "Contract value (highest)" },
  { value: "fit", label: "Fit score (highest)" },
  { value: "probability", label: "Win probability (highest)" },
  { value: "title", label: "Title (A–Z)" },
];

const statusTabs: { value: "all" | OpportunityStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "discovered", label: "Discovered" },
  { value: "qualified", label: "Qualified" },
  { value: "in_progress", label: "Active" },
  { value: "submitted", label: "Submitted" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

export function OpportunitiesPage() {
  const { opportunities } = useWorkspace();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OpportunityStatus>("all");
  const [agencyFilter, setAgencyFilter] = useState("all");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [sort, setSort] = useState<SortKey>("deadline");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const agencies = useMemo(
    () => [...new Set(opportunities.map((item) => item.agency))].sort(),
    [opportunities],
  );
  const owners = useMemo(
    () => [...new Set(opportunities.map((item) => item.owner))].sort(),
    [opportunities],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const matches = opportunities.filter((opportunity) => {
      const matchesSearch =
        !term ||
        opportunity.title.toLowerCase().includes(term) ||
        opportunity.agency.toLowerCase().includes(term) ||
        opportunity.solicitationNumber.toLowerCase().includes(term) ||
        opportunity.tags.some((tag) => tag.toLowerCase().includes(term));
      const matchesStatus = statusFilter === "all" || opportunity.status === statusFilter;
      const matchesAgency = agencyFilter === "all" || opportunity.agency === agencyFilter;
      const matchesOwner = ownerFilter === "all" || opportunity.owner === ownerFilter;
      return matchesSearch && matchesStatus && matchesAgency && matchesOwner;
    });

    const sorters: Record<SortKey, (a: Opportunity, b: Opportunity) => number> = {
      deadline: (a, b) => a.deadline.getTime() - b.deadline.getTime(),
      value: (a, b) => b.value - a.value,
      fit: (a, b) => b.fitScore - a.fitScore,
      probability: (a, b) => b.probability - a.probability,
      title: (a, b) => a.title.localeCompare(b.title),
    };

    return [...matches].sort(sorters[sort]);
  }, [opportunities, search, statusFilter, agencyFilter, ownerFilter, sort]);

  const selected = opportunities.find((item) => item.id === selectedId) ?? null;
  const filtersActive =
    search !== "" || statusFilter !== "all" || agencyFilter !== "all" || ownerFilter !== "all";

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setAgencyFilter("all");
    setOwnerFilter("all");
  }

  return (
    <PageShell
      title="Opportunities"
      description="Search, qualify, and track every pursuit in one place"
      breadcrumbs={[{ label: "Workspace", href: "/app" }, { label: "Opportunities" }]}
      fullWidth
      actions={
        <Button
          size="sm"
          onClick={() =>
            toast.info("Opportunity creation", {
              description:
                "Manual entry opens once a data source is connected. Matches sync automatically from SAM.gov and your configured portals.",
            })
          }
        >
          <Plus className="size-4" aria-hidden="true" />
          Add opportunity
        </Button>
      }
    >
      <section aria-labelledby="opportunity-filters" className="mb-6 space-y-4">
        <h2 id="opportunity-filters" className="sr-only">
          Filter and sort opportunities
        </h2>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full lg:max-w-sm">
            <Label htmlFor="opportunity-search" className="sr-only">
              Search opportunities
            </Label>
            <div className="relative">
              <Search
                className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="opportunity-search"
                placeholder="Search title, agency, or solicitation number"
                className="pl-9"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <div className="w-44">
              <Label htmlFor="agency-filter" className="text-xs text-muted-foreground">
                Agency / customer
              </Label>
              <Select value={agencyFilter} onValueChange={setAgencyFilter}>
                <SelectTrigger id="agency-filter" className="mt-1">
                  <SelectValue placeholder="All agencies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All agencies</SelectItem>
                  {agencies.map((agency) => (
                    <SelectItem key={agency} value={agency}>
                      {agency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-40">
              <Label htmlFor="owner-filter" className="text-xs text-muted-foreground">
                Capture owner
              </Label>
              <Select value={ownerFilter} onValueChange={setOwnerFilter}>
                <SelectTrigger id="owner-filter" className="mt-1">
                  <SelectValue placeholder="All owners" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All owners</SelectItem>
                  {owners.map((owner) => (
                    <SelectItem key={owner} value={owner}>
                      {owner}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-52">
              <Label htmlFor="sort-order" className="text-xs text-muted-foreground">
                Sort by
              </Label>
              <Select value={sort} onValueChange={(value) => setSort(value as SortKey)}>
                <SelectTrigger id="sort-order" className="mt-1">
                  <ArrowUpDown className="size-3.5 text-muted-foreground" aria-hidden="true" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {filtersActive && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="size-4" aria-hidden="true" />
                Clear filters
              </Button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <Tabs
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}
          >
            <TabsList aria-label="Filter by status">
              {statusTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <p className="text-sm text-muted-foreground" role="status">
          {filtered.length} {filtered.length === 1 ? "opportunity" : "opportunities"} ·{" "}
          {formatCurrency(totalValue(filtered))} total value ·{" "}
          {formatCurrency(weightedValue(filtered))} weighted
        </p>
      </section>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Filter}
          title="No opportunities match your filters"
          description="Try a broader search term, or clear the status, agency, and owner filters."
          action={{ label: "Clear filters", onClick: clearFilters }}
        />
      ) : (
        <ul className="space-y-3">
          {filtered.map((opportunity) => {
            const days = daysUntil(opportunity.deadline);
            const closed = opportunity.status === "won" || opportunity.status === "lost";

            return (
              <li key={opportunity.id}>
                <Card className="transition-colors hover:border-primary/40">
                  <CardContent className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => setSelectedId(opportunity.id)}
                            className="rounded text-left hover:underline"
                          >
                            {opportunity.title}
                          </button>
                        </h3>
                        <Badge variant={statusVariants[opportunity.status]}>
                          {statusLabels[opportunity.status]}
                        </Badge>
                        {!closed && days >= 0 && days <= 7 && (
                          <Badge variant="destructive">Due in {days}d</Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {opportunity.agency} · {opportunity.solicitationNumber} ·{" "}
                        {opportunity.location} · {opportunity.owner}
                      </p>
                      <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Tags">
                        {opportunity.tags.map((tag) => (
                          <li key={tag}>
                            <Badge variant="outline" className="text-[10px]">
                              {tag}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <dl className="grid shrink-0 grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4 lg:w-[26rem]">
                      <div>
                        <dt className="text-xs text-muted-foreground">Value</dt>
                        <dd className="text-sm font-semibold tabular-nums">
                          {formatCurrency(opportunity.value)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">Due</dt>
                        <dd className="text-sm tabular-nums">
                          <time dateTime={opportunity.deadline.toISOString()}>
                            {formatRelativeDate(opportunity.deadline)}
                          </time>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">Fit</dt>
                        <dd
                          className={cn(
                            "text-sm font-medium tabular-nums",
                            opportunity.fitScore >= 90
                              ? "text-success-emphasis"
                              : "text-foreground",
                          )}
                        >
                          {opportunity.fitScore}%
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">P(win)</dt>
                        <dd className="text-sm tabular-nums">{opportunity.probability}%</dd>
                      </div>
                    </dl>

                    <div className="flex shrink-0 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedId(opportunity.id)}
                      >
                        Details
                        <span className="sr-only"> for {opportunity.title}</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-8 text-sm text-muted-foreground">
        Looking for the board view?{" "}
        <Link to="/app/pipeline" className="text-primary underline-offset-2 hover:underline">
          Open the pipeline
          <Briefcase className="ml-1 inline size-3.5" aria-hidden="true" />
        </Link>
      </p>

      <OpportunityDetail
        opportunity={selected}
        open={selected !== null}
        onOpenChange={(open) => !open && setSelectedId(null)}
      />
    </PageShell>
  );
}
