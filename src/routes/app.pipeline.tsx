import { createFileRoute } from "@tanstack/react-router";

import { PipelinePage } from "@/features/pipeline/pipeline-page";

export const Route = createFileRoute("/app/pipeline")({
  head: () => ({
    meta: [
      { title: "Pipeline — ProcureAI" },
      {
        name: "description",
        content: "Track every bid through discovery, qualification, proposal, and award.",
      },
      { property: "og:title", content: "Pipeline — ProcureAI" },
      {
        property: "og:description",
        content: "Track every bid through discovery, qualification, proposal, and award.",
      },
    ],
  }),
  component: PipelinePage,
});
