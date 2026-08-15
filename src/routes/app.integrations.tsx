import { createFileRoute } from "@tanstack/react-router";

import { IntegrationsPage } from "@/features/integrations/integrations-page";

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
  component: IntegrationsPage,
});
