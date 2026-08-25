import { createFileRoute } from "@tanstack/react-router";

import { LoginPage } from "@/features/auth/login-page";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/login")({
  // noindex rather than a robots.txt Disallow. A disallowed URL can still be
  // indexed from inbound links — Google just never fetches it, so it never
  // sees a noindex tag either. Letting it crawl and read the tag is what
  // actually keeps the page out of results.
  head: () =>
    seo({
      title: "Sign in — ProcureAI",
      description: "Sign in to your ProcureAI workspace.",
      path: "/login",
      noindex: true,
    }),
  component: LoginPage,
});
