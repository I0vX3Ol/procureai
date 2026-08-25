import { createFileRoute } from "@tanstack/react-router";

import { PricingPage } from "@/features/marketing/pricing-page";
import { billingFaqItems, pricingPlans } from "@/data/marketing-content";
import { SITE_NAME, SITE_URL, jsonLd, seo } from "@/lib/seo";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    ...seo({
      title: "Pricing — ProcureAI",
      description:
        "ProcureAI pricing: Starter $199, Professional $299 and Enterprise $499 per month, billed per workspace. Every plan starts with a 14-day trial and no card.",
      path: "/pricing",
    }),
    scripts: [
      jsonLd({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: billingFaqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }),
      ...pricingPlans.map((plan) =>
        jsonLd({
          "@context": "https://schema.org",
          "@type": "Product",
          name: `${SITE_NAME} ${plan.name}`,
          description: plan.description,
          url: `${SITE_URL}/pricing`,
          brand: { "@type": "Brand", name: SITE_NAME },
          offers: {
            "@type": "Offer",
            price: String(plan.price),
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/pricing`,
          },
        }),
      ),
    ],
  }),
  component: PricingPage,
});
