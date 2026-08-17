import { createFileRoute } from "@tanstack/react-router";

import { IntegrationsPage } from "@/features/integrations/integrations-page";
import { RequireSubscription } from "@/lib/require-subscription";

export const Route = createFileRoute("/app/integrations")({
  head: () => ({
    meta: [
      { title: "Integrations — ProcureAI" },
      {
        name: "description",
        content: "Connect data sources, CRMs, storage, and communication tools.",
      },
      { property: "og:title", content: "Integrations — ProcureAI" },
      {
        property: "og:description",
        content: "Connect data sources, CRMs, storage, and communication tools.",
      },
    ],
  }),
  component: () => (
    <RequireSubscription feature="Integrations" minimumPlan="professional">
      <IntegrationsPage />
    </RequireSubscription>
  ),
});
