import { createFileRoute } from "@tanstack/react-router";

import { GuidesIndexPage } from "@/features/marketing/guides-index-page";
import { guides } from "@/data/guides";
import { SITE_URL, jsonLd, seo } from "@/lib/seo";

export const Route = createFileRoute("/guides/")({
  head: () => ({
    ...seo({
      title: "Guides for capture and proposal teams — ProcureAI",
      description:
        "Practical guides on responding to RFPs, making bid/no-bid decisions, and building a compliance matrix that survives a Red team review.",
      path: "/guides",
    }),
    scripts: [
      jsonLd({
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: guides.map((guide, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE_URL}/guides/${guide.slug}`,
          name: guide.title,
        })),
      }),
    ],
  }),
  component: GuidesIndexPage,
});
