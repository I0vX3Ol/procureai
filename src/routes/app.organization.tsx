import { createFileRoute } from "@tanstack/react-router";

import { OrganizationPage } from "@/features/organization/organization-page";

export const Route = createFileRoute("/app/organization")({
  head: () => ({
    meta: [
      { title: "Organization — ProcureAI" },
      {
        name: "description",
        content: "Manage your company profile, team members, and access roles.",
      },
      { property: "og:title", content: "Organization — ProcureAI" },
      {
        property: "og:description",
        content: "Manage your company profile, team members, and access roles.",
      },
    ],
  }),
  component: OrganizationPage,
});
