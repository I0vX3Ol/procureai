import { createFileRoute } from "@tanstack/react-router";

import { NotificationsPage } from "@/features/notifications/notifications-page";

export const Route = createFileRoute("/app/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — ProcureAI" },
      {
        name: "description",
        content: "Deadline alerts, award updates, and AI activity notifications.",
      },
      { property: "og:title", content: "Notifications — ProcureAI" },
      {
        property: "og:description",
        content: "Deadline alerts, award updates, and AI activity notifications.",
      },
    ],
  }),
  component: NotificationsPage,
});
