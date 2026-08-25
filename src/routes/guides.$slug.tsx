import { createFileRoute, notFound } from "@tanstack/react-router";

import { GuidePage } from "@/features/marketing/guide-page";
import { guideBySlug } from "@/data/guides";
import { OG_IMAGE_PATH, SITE_NAME, SITE_URL, canonicalUrl, jsonLd, seo } from "@/lib/seo";

export const Route = createFileRoute("/guides/$slug")({
  // Resolved before render so an unknown slug is a real 404 rather than a
  // blank page that still returns 200 — which would let crawlers index an
  // unlimited number of empty URLs under /guides/.
  loader: ({ params }) => {
    const guide = guideBySlug(params.slug);
    if (!guide) throw notFound();
    return { guide };
  },

  head: ({ loaderData }) => {
    const guide = loaderData?.guide;
    if (!guide) return {};

    const path = `/guides/${guide.slug}`;

    return {
      ...seo({ title: `${guide.title} — ProcureAI`, description: guide.description, path }),
      scripts: [
        jsonLd({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.description,
          datePublished: guide.updated,
          dateModified: guide.updated,
          image: `${SITE_URL}${OG_IMAGE_PATH}`,
          mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl(path) },
          author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
          publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        }),
        jsonLd({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/guides` },
            { "@type": "ListItem", position: 3, name: guide.title, item: canonicalUrl(path) },
          ],
        }),
      ],
    };
  },

  component: GuideRoute,
});

function GuideRoute() {
  const { slug } = Route.useParams();
  return <GuidePage slug={slug} />;
}
