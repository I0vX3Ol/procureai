import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";

import { MarketingHeader, MarketingShell } from "@/features/marketing/marketing-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { billingFaqItems, pricingPlans } from "@/data/marketing-content";
import { cn } from "@/lib/utils";

/** Rows for the comparison table, in the order buyers ask about them. */
const comparison: Array<{
  label: string;
  starter: string;
  professional: string;
  enterprise: string;
}> = [
  { label: "Team members", starter: "5", professional: "25", enterprise: "Unlimited" },
  {
    label: "Tracked opportunities",
    starter: "50 / month",
    professional: "Unlimited",
    enterprise: "Unlimited",
  },
  { label: "Pipeline and deadlines", starter: "Yes", professional: "Yes", enterprise: "Yes" },
  { label: "AI document analysis", starter: "Yes", professional: "Yes", enterprise: "Yes" },
  { label: "Proposal builder", starter: "—", professional: "Yes", enterprise: "Yes" },
  { label: "Analytics and win rate", starter: "—", professional: "Yes", enterprise: "Yes" },
  { label: "Integrations", starter: "—", professional: "Yes", enterprise: "Yes" },
  { label: "API access", starter: "—", professional: "—", enterprise: "Yes" },
  { label: "Activity log", starter: "—", professional: "—", enterprise: "Yes" },
  { label: "Support", starter: "Email", professional: "Priority", enterprise: "Priority" },
  {
    label: "Onboarding",
    starter: "Self-serve",
    professional: "Self-serve",
    enterprise: "Dedicated",
  },
];

export function PricingPage() {
  return (
    <MarketingShell>
      <MarketingHeader
        eyebrow="Pricing"
        title="Priced per workspace, billed monthly"
        lede="Every plan starts with a 14-day trial that does not ask for a card. Change plan or cancel from inside the app, without emailing anyone."
      />

      {/* Plans */}
      <section className="page-container py-16 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div
              key={plan.slug}
              className={cn(
                "relative flex flex-col rounded-xl border border-border/60 bg-card p-6 sm:p-8",
                plan.highlighted && "border-primary shadow-md ring-1 ring-primary/20",
              )}
            >
              {plan.highlighted && <Badge className="absolute -top-3 left-8">Most popular</Badge>}

              <h2 className="text-lg font-semibold">{plan.name}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">{plan.description}</p>

              <p className="mt-6">
                <span className="text-4xl font-semibold tabular-nums">${plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground">{plan.bestFor}</p>

              <Button
                className="mt-6 w-full"
                variant={plan.highlighted ? "default" : "outline"}
                asChild
              >
                <Link to="/signup">Start free trial</Link>
              </Button>

              <div className="mt-8 space-y-6">
                {plan.detail.map((group) => (
                  <div key={group.group}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {group.group}
                    </p>
                    <ul className="mt-3 space-y-2">
                      {group.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm">
                          <Check
                            className="mt-0.5 size-4 shrink-0 text-success-emphasis"
                            aria-hidden="true"
                          />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="border-y border-border bg-muted/30">
        <div className="page-container section-padding">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Compare plans</h2>
          <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-background">
            <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
              <caption className="sr-only">Feature comparison across ProcureAI plans</caption>
              <thead>
                <tr className="bg-muted/50">
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Feature
                  </th>
                  {pricingPlans.map((plan) => (
                    <th key={plan.slug} scope="col" className="px-4 py-3 font-semibold">
                      {plan.name}
                      <span className="ml-1.5 font-normal tabular-nums text-muted-foreground">
                        ${plan.price}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.label} className="border-t border-border">
                    <th scope="row" className="px-4 py-3 text-left font-medium">
                      {row.label}
                    </th>
                    <td className="px-4 py-3 text-muted-foreground">{row.starter}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.professional}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Billing FAQ */}
      <section className="page-container section-padding">
        <div className="lg:grid lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-12">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Billing questions</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Anything not covered here, ask before you subscribe rather than after.
            </p>
          </div>
          <dl className="mt-8 divide-y divide-border border-t border-border lg:mt-0 lg:border-t-0">
            {billingFaqItems.map((item) => (
              <div key={item.question} className="py-5 first:lg:pt-0">
                <dt className="text-sm font-medium">{item.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="page-container pb-20 sm:pb-24">
        <div className="rounded-2xl border border-border bg-primary px-8 py-14 text-center text-primary-foreground sm:px-16">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Try it on your next solicitation
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
            Fourteen days, no card, no call. Upload a live RFP and see what comes back.
          </p>
          <Button size="lg" variant="secondary" className="mt-7" asChild>
            <Link to="/signup">
              Start free trial
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </MarketingShell>
  );
}
