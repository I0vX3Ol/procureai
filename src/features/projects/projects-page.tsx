import { Link } from "@tanstack/react-router";
import { CheckCircle2, Circle, FolderKanban, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/common/empty-state";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { fetchProjects } from "@/lib/remote-data";
import { daysUntil } from "@/lib/metrics";
import { cn, formatCurrency, formatRelativeDate } from "@/lib/utils";
import { useWorkspace } from "@/providers/workspace-provider";
import type { Project } from "@/types";

const statusLabels: Record<Project["status"], string> = {
  active: "Active",
  on_hold: "On hold",
  completed: "Completed",
};

const healthLabels: Record<Project["health"], string> = {
  on_track: "On track",
  at_risk: "At risk",
  off_track: "Off track",
};

const healthVariants: Record<Project["health"], "success" | "warning" | "destructive"> = {
  on_track: "success",
  at_risk: "warning",
  off_track: "destructive",
};

const filters: { value: Project["status"] | "all"; label: string }[] = [
  { value: "all", label: "All projects" },
  { value: "active", label: "Active" },
  { value: "on_hold", label: "On hold" },
  { value: "completed", label: "Completed" },
];

export function ProjectsPage() {
  const { opportunities } = useWorkspace();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<Project["status"] | "all">("all");

  useEffect(() => {
    let cancelled = false;
    void fetchProjects().then((records) => {
      if (!cancelled) setProjects(records);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = useMemo(
    () => (filter === "all" ? projects : projects.filter((project) => project.status === filter)),
    [filter, projects],
  );

  const atRisk = projects.filter(
    (project) => project.status === "active" && project.health !== "on_track",
  ).length;

  return (
    <PageShell
      title="Projects"
      description="Capture and delivery projects linked to your opportunities"
      breadcrumbs={[{ label: "Workspace", href: "/app" }, { label: "Projects" }]}
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by status">
          {filters.map((option) => (
            <Button
              key={option.value}
              size="sm"
              variant={filter === option.value ? "default" : "outline"}
              aria-pressed={filter === option.value}
              onClick={() => setFilter(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground" role="status">
          {visible.length} shown · {atRisk} active{" "}
          {atRisk === 1 ? "project needs" : "projects need"} attention
        </p>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects in this view"
          description="Create a project from an opportunity to coordinate proposal and delivery work."
          action={{ label: "Show all projects", onClick: () => setFilter("all") }}
        />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((project) => {
            const opportunity = opportunities.find((item) => item.id === project.opportunityId);
            const overdue = project.status !== "completed" && daysUntil(project.dueDate) < 0;
            const doneMilestones = project.milestones.filter((item) => item.complete).length;

            return (
              <li key={project.id}>
                <Card className="flex h-full flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base leading-snug">{project.name}</CardTitle>
                      <Badge variant={healthVariants[project.health]}>
                        {healthLabels[project.health]}
                      </Badge>
                    </div>
                    <CardDescription>
                      {opportunity ? (
                        <>
                          {opportunity.agency} · {formatCurrency(opportunity.value)}
                        </>
                      ) : (
                        "Not linked to an opportunity"
                      )}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex flex-1 flex-col gap-4">
                    <div>
                      <div className="mb-2 flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          {statusLabels[project.status]}
                        </span>
                        <span className="font-medium tabular-nums">{project.progress}%</span>
                      </div>
                      <Progress
                        value={project.progress}
                        aria-label={`${project.name}: ${project.progress}% complete`}
                      />
                    </div>

                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Milestones ({doneMilestones}/{project.milestones.length})
                      </h3>
                      <ul className="mt-2 space-y-1.5">
                        {project.milestones.map((milestone) => (
                          <li key={milestone.id} className="flex items-start gap-2 text-sm">
                            {milestone.complete ? (
                              <CheckCircle2
                                className="mt-0.5 size-3.5 shrink-0 text-success-emphasis"
                                aria-hidden="true"
                              />
                            ) : (
                              <Circle
                                className="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
                                aria-hidden="true"
                              />
                            )}
                            <span className="min-w-0 flex-1">
                              {milestone.label}
                              <span className="sr-only">
                                {milestone.complete ? " — complete" : " — outstanding"}
                              </span>
                              <span className="block text-xs text-muted-foreground">
                                <time dateTime={milestone.dueDate.toISOString()}>
                                  {formatRelativeDate(milestone.dueDate)}
                                </time>
                              </span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Users className="size-3.5" aria-hidden="true" />
                        {project.teamSize} · {project.lead}
                      </span>
                      <span className={cn(overdue && "font-medium text-destructive-emphasis")}>
                        Due{" "}
                        <time dateTime={project.dueDate.toISOString()}>
                          {formatRelativeDate(project.dueDate)}
                        </time>
                      </span>
                    </div>

                    {opportunity && (
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/app/opportunities">
                          View opportunity
                          <span className="sr-only"> for {project.name}</span>
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </PageShell>
  );
}
