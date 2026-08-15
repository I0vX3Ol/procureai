import { createFileRoute } from "@tanstack/react-router";

import { AIWorkspacePage } from "@/features/ai-workspace/ai-workspace-page";

export const Route = createFileRoute("/app/ai")({
  head: () => ({
    meta: [
      { title: "AI Workspace — ProcureAI" },
      {
        name: "description",
        content: "Analyze RFPs, chat with your documents, and generate proposal content.",
      },
      { property: "og:title", content: "AI Workspace — ProcureAI" },
      {
        property: "og:description",
        content: "Analyze RFPs, chat with your documents, and generate proposal content.",
      },
    ],
  }),
  component: AIWorkspacePage,
});
