import { Building2, Mail, Phone, Search, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/empty-state";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { fetchCustomers, fetchProjects } from "@/lib/remote-data";
import { cn, formatCurrency, formatRelativeDate } from "@/lib/utils";
import { useWorkspace } from "@/providers/workspace-provider";
import type { Customer } from "@/types/workspace";
import type { Project } from "@/types";

const sectorLabels: Record<Customer["sector"], string> = {
  federal: "Federal",
  state_local: "State & Local",
  enterprise: "Enterprise",
  education: "Education",
};

const statusVariant: Record<Customer["status"], "success" | "warning" | "secondary"> = {
  active: "success",
  prospect: "warning",
  dormant: "secondary",
};

const sectorFilters: Array<{ value: Customer["sector"] | "all"; label: string }> = [
  { value: "all", label: "All sectors" },
  { value: "federal", label: "Federal" },
  { value: "state_local", label: "State & Local" },
  { value: "enterprise", label: "Enterprise" },
];

export function CustomersPage() {
  const { opportunities } = useWorkspace();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState<Customer["sector"] | "all">("all");
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    let cancelled = false;
    void fetchCustomers().then((records) => {
      if (cancelled) return;
      setCustomers(records);
      setSelectedId((current) => current || (records[0]?.id ?? ""));
    });
    void fetchProjects().then((records) => {
      if (!cancelled) setProjects(records);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return customers.filter((customer) => {
      const matchesSector = sector === "all" || customer.sector === sector;
      const matchesTerm =
        !term ||
        customer.name.toLowerCase().includes(term) ||
        customer.location.toLowerCase().includes(term) ||
        customer.relationshipOwner.toLowerCase().includes(term);
      return matchesSector && matchesTerm;
    });
  }, [search, sector]);

  const selected = filtered.find((customer) => customer.id === selectedId) ?? filtered[0] ?? null;

  return (
    <PageShell
      title="Customers"
      description="Manage agency relationships and past performance references."
      breadcrumbs={[{ label: "Workspace", href: "/app" }, { label: "Customers" }]}
      fullWidth
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search
            className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search customers, locations, owners"
            className="pl-9"
            aria-label="Search customers"
          />
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by sector">
          {sectorFilters.map((filter) => (
            <Button
              key={filter.value}
              size="sm"
              variant={sector === filter.value ? "default" : "outline"}
              aria-pressed={sector === filter.value}
              onClick={() => setSector(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No customers match your filters"
          description="Adjust your search term or choose a different sector."
          action={{
            label: "Clear filters",
            onClick: () => {
              setSearch("");
              setSector("all");
            },
          }}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
          <ul className="space-y-3">
            {filtered.map((customer) => (
              <li key={customer.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(customer.id)}
                  aria-current={selected?.id === customer.id ? "true" : undefined}
                  className={cn(
                    "w-full rounded-xl border bg-card p-4 text-left transition-colors",
                    selected?.id === customer.id
                      ? "border-primary/60 bg-accent/40"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{customer.name}</p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {sectorLabels[customer.sector]} · {customer.location}
                      </p>
                    </div>
                    <Badge variant={statusVariant[customer.status]}>{customer.status}</Badge>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {customer.openOpportunityIds.length} open ·{" "}
                    {formatCurrency(customer.lifetimeValue)} lifetime
                  </p>
                </button>
              </li>
            ))}
          </ul>

          {selected && (
            <CustomerDetail customer={selected} opportunities={opportunities} projects={projects} />
          )}
        </div>
      )}
    </PageShell>
  );
}

function CustomerDetail({
  customer,
  opportunities,
  projects,
}: {
  customer: Customer;
  opportunities: import("@/types").Opportunity[];
  projects: Project[];
}) {
  const relatedOpportunities = opportunities.filter((opportunity) =>
    customer.openOpportunityIds.includes(opportunity.id),
  );
  const relatedProjects = projects.filter((project) => customer.projectIds.includes(project.id));

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <CardTitle className="text-base">{customer.name}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {sectorLabels[customer.sector]} · {customer.location} · Owner{" "}
              {customer.relationshipOwner}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success("Activity logged", { description: customer.name })}
            >
              Log activity
            </Button>
            <Button size="sm" asChild>
              <a href={`mailto:${customer.contacts[0]?.email ?? ""}`}>
                <Mail className="size-4" aria-hidden="true" />
                Email
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <Metric label="Lifetime value" value={formatCurrency(customer.lifetimeValue)} />
          <Metric label="Open opportunities" value={String(relatedOpportunities.length)} />
          <Metric label="Active projects" value={String(relatedProjects.length)} />
          <Metric label="Contacts" value={String(customer.contacts.length)} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Contacts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {customer.contacts.map((contact) => (
              <div key={contact.id} className="rounded-lg border border-border p-3">
                <p className="text-sm font-medium">{contact.name}</p>
                <p className="text-xs text-muted-foreground">{contact.title}</p>
                <div className="mt-1 flex flex-col text-xs">
                  <a
                    className="-mx-1 flex min-h-9 items-center gap-1.5 rounded px-1 text-primary hover:underline sm:min-h-8"
                    href={`mailto:${contact.email}`}
                  >
                    <Mail className="size-3.5 shrink-0" aria-hidden="true" />
                    <span className="truncate">{contact.email}</span>
                  </a>
                  <a
                    className="-mx-1 flex min-h-9 items-center gap-1.5 rounded px-1 text-muted-foreground hover:underline sm:min-h-8"
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  >
                    <Phone className="size-3.5 shrink-0" aria-hidden="true" />
                    {contact.phone}
                  </a>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Activity history</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {customer.activity.map((item, index) => (
                <li key={item.id}>
                  <p className="text-sm">{item.summary}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.type} · {formatRelativeDate(item.date)}
                  </p>
                  {index < customer.activity.length - 1 && <Separator className="mt-4" />}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Related opportunities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {relatedOpportunities.length === 0 ? (
              <p className="text-sm text-muted-foreground">No open opportunities.</p>
            ) : (
              relatedOpportunities.map((opportunity) => (
                <div key={opportunity.id} className="rounded-lg border border-border p-3">
                  <p className="text-sm font-medium">{opportunity.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatCurrency(opportunity.value)} · Due{" "}
                    {formatRelativeDate(opportunity.deadline)} · Fit {opportunity.fitScore}%
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Related projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {relatedProjects.length === 0 ? (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="size-4" aria-hidden="true" />
                No delivery projects yet.
              </p>
            ) : (
              relatedProjects.map((project) => (
                <div key={project.id} className="rounded-lg border border-border p-3">
                  <p className="text-sm font-medium">{project.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {project.status} · {project.progress}% complete · due{" "}
                    {formatRelativeDate(project.dueDate)}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-semibold">{value}</p>
    </div>
  );
}
