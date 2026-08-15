import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bot, Cloud, Database, Loader2, MessageSquare, Plug, Users } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/empty-state";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { integrationService } from "@/lib/services/integrations-service";
import { formatRelativeDate } from "@/lib/utils";
import type { Integration } from "@/types/workspace";

const categoryIcons: Record<Integration["category"], typeof Database> = {
  data_source: Database,
  crm: Users,
  storage: Cloud,
  communication: MessageSquare,
  ai: Bot,
};

const categoryLabels: Record<Integration["category"], string> = {
  data_source: "Data source",
  crm: "CRM",
  storage: "Storage",
  communication: "Communication",
  ai: "AI",
};

const statusVariant: Record<Integration["status"], "success" | "secondary" | "destructive"> = {
  connected: "success",
  available: "secondary",
  error: "destructive",
};

export function IntegrationsPage() {
  const queryClient = useQueryClient();

  const integrationsQuery = useQuery({
    queryKey: ["integrations"],
    queryFn: () => integrationService.list(),
  });

  const connectMutation = useMutation({
    mutationFn: (id: string) => integrationService.connect(id),
    onSuccess: (integration) => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      toast.success("Integration connected", { description: integration.name });
    },
    onError: () => toast.error("Connection failed. Please try again."),
  });

  const disconnectMutation = useMutation({
    mutationFn: (id: string) => integrationService.disconnect(id),
    onSuccess: (integration) => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      toast.success("Integration disconnected", { description: integration.name });
    },
  });

  const integrations = integrationsQuery.data ?? [];
  const connectedCount = integrations.filter((item) => item.status === "connected").length;

  return (
    <PageShell
      title="Integrations"
      description="Connect data sources, CRMs, storage, and communication tools to ProcureAI."
      breadcrumbs={[{ label: "Workspace", href: "/app" }, { label: "Integrations" }]}
    >
      {integrationsQuery.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : integrationsQuery.isError ? (
        <EmptyState
          icon={Plug}
          title="Couldn't load integrations"
          description="Something went wrong while fetching your integration registry."
          action={{ label: "Retry", onClick: () => integrationsQuery.refetch() }}
        />
      ) : (
        <>
          <p className="mb-6 text-sm text-muted-foreground">
            {connectedCount} of {integrations.length} integrations connected
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {integrations.map((integration) => {
              const Icon = categoryIcons[integration.category];
              const isConnected = integration.status === "connected";
              const isBusy =
                (connectMutation.isPending && connectMutation.variables === integration.id) ||
                (disconnectMutation.isPending && disconnectMutation.variables === integration.id);

              return (
                <Card key={integration.id} className="flex flex-col">
                  <CardHeader className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="size-5 text-primary" aria-hidden="true" />
                      </div>
                      <Badge variant={statusVariant[integration.status]}>
                        {integration.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-base">{integration.name}</CardTitle>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {categoryLabels[integration.category]}
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {integration.description}
                    </p>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between gap-2 pt-0">
                    <div className="min-w-0 text-xs text-muted-foreground">
                      {isConnected && integration.lastSync ? (
                        <span>Synced {formatRelativeDate(integration.lastSync)}</span>
                      ) : (
                        <a
                          href={integration.docsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="underline-offset-2 hover:underline"
                        >
                          View docs
                        </a>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant={isConnected ? "outline" : "default"}
                      disabled={isBusy}
                      onClick={() =>
                        isConnected
                          ? disconnectMutation.mutate(integration.id)
                          : connectMutation.mutate(integration.id)
                      }
                    >
                      {isBusy && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
                      {isConnected ? "Disconnect" : "Connect"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </PageShell>
  );
}
