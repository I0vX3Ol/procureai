import { createFileRoute } from "@tanstack/react-router";

import { OpportunitiesPage } from "@/features/opportunities/opportunities-page";
import { RequireSubscription } from "@/lib/require-subscription";

export const Route = createFileRoute("/app/opportunities")({
  head: () => ({
    meta: [
      { title: "Opportunities — ProcureAI" },
      {
        name: "description",
        content: "Discover and qualify government and enterprise procurement opportunities.",
      },
      { property: "og:title", content: "Opportunities — ProcureAI" },
      {
        property: "og:description",
        content: "Discover and qualify government and enterprise procurement opportunities.",
      },
    ],
  }),
  component: () => (
    <RequireSubscription feature="Opportunity tracking">
      <OpportunitiesPage />
    </RequireSubscription>
  ),
});
