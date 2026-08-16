import { createFileRoute } from "@tanstack/react-router";

import { AppLayout } from "@/components/layout/app-layout";
import { RequireAuth } from "@/lib/require-auth";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
  component: () => (
    <RequireAuth>
      <AppLayout />
    </RequireAuth>
  ),
});
