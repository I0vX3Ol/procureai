import { createFileRoute } from "@tanstack/react-router";

import { SecurityPage } from "@/features/marketing/security-page";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/security")({
  head: () =>
    seo({
      title: "Security — ProcureAI",
      description:
        "How ProcureAI protects bid data: encryption, tenant isolation enforced by Postgres row-level security, role-based access, subprocessors — and an honest list of what we do not have yet.",
      path: "/security",
    }),
  component: SecurityPage,
});
