import { createFileRoute } from "@tanstack/react-router";

import { LandingPage } from "@/features/landing/landing-page";
import { faqItems, pricingPlans } from "@/data/marketing-content";
import { SITE_NAME, SITE_URL, jsonLd, seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    ...seo({
      title: "ProcureAI — pipeline and proposal software for government bids",
      description:
        "A workspace for capture teams: track every pursuit, pull requirements out of a solicitation with AI, and build compliant proposals. 14-day trial, no card.",
      path: "/",
    }),
    scripts: [
      // The FAQ is the part of this page most likely to be quoted back by a
      // search or assistant answer, so it is the part worth marking up.
      jsonLd({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }),
      jsonLd({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: SITE_NAME,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: SITE_URL,
        description:
          "Pipeline and proposal workspace for teams bidding government and enterprise contracts.",
        offers: pricingPlans.map((plan) => ({
          "@type": "Offer",
          name: `${SITE_NAME} ${plan.name}`,
          price: String(plan.price),
          priceCurrency: "USD",
          url: `${SITE_URL}/pricing`,
          availability: "https://schema.org/InStock",
        })),
      }),
    ],
  }),
  component: LandingPage,
});
