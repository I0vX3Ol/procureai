import { createFileRoute } from "@tanstack/react-router";

import { DocumentsPage } from "@/features/documents/documents-page";
import { RequireSubscription } from "@/lib/require-subscription";

export const Route = createFileRoute("/app/documents")({
  head: () => ({
    meta: [
      { title: "Documents — ProcureAI" },
      {
        name: "description",
        content: "Upload RFPs, contracts, and supporting files for AI analysis.",
      },
      { property: "og:title", content: "Documents — ProcureAI" },
      {
        property: "og:description",
        content: "Upload RFPs, contracts, and supporting files for AI analysis.",
      },
    ],
  }),
  component: () => (
    <RequireSubscription feature="AI document analysis">
      <DocumentsPage />
    </RequireSubscription>
  ),
});
