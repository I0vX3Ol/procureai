import { createFileRoute } from "@tanstack/react-router";

import { AppLayout } from "@/components/layout/app-layout";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
  component: AppLayout,
});
