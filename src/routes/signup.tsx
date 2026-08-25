import { createFileRoute } from "@tanstack/react-router";

import { SignupPage } from "@/features/auth/signup-page";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/signup")({
  head: () =>
    seo({
      title: "Start your free trial — ProcureAI",
      description:
        "Create a ProcureAI workspace. Fourteen days free, no card required, cancel from inside the app.",
      path: "/signup",
      noindex: true,
    }),
  component: SignupPage,
});
