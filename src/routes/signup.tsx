import { createFileRoute } from "@tanstack/react-router";

import { SignupPage } from "@/features/auth/signup-page";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your account — ProcureAI" },
      {
        name: "description",
        content: "Start a ProcureAI workspace and track procurement opportunities with AI.",
      },
      { property: "og:title", content: "Create your account — ProcureAI" },
      {
        property: "og:description",
        content: "Start a ProcureAI workspace and track procurement opportunities with AI.",
      },
    ],
  }),
  component: SignupPage,
});
