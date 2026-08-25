import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Bot,
  CalendarClock,
  ChevronDown,
  CheckCircle2,
  FileSearch,
  Kanban,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

import { LandingFooter } from "@/features/landing/components/landing-footer";
import { LandingNav } from "@/features/landing/components/landing-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { guides } from "@/data/guides";
import { faqItems, pricingPlans, securityItems, workflowSteps } from "@/data/marketing-content";
import { cn } from "@/lib/utils";

/**
 * Six features, six distinct things.
 *
 * The previous list shipped "Opportunity Pipeline" and "Pipeline Management"
 * as separate cards saying the same thing in different words, which is what a
 * generated feature grid looks like when nobody read it back. They are one
 * card now, and the freed slot went to the deadline calendar — a real part of
 * the product that was not represented at all.
 */
const features = [
  {
    icon: Kanban,
    title: "One shared pipeline",
    description:
      "Every pursuit your team is working, with stage, owner, due date, fit score and NAICS code in one place instead of four spreadsheets.",
  },
  {
    icon: FileSearch,
    title: "AI document analysis",
    description:
      "Upload a solicitation and its attachments. Requirements, submission instructions, evaluation factors and dates come back cited to the page they came from.",
  },
  {
    icon: Bot,
    title: "Proposal builder",
    description:
      "Section-by-section drafting against a compliance structure, with AI to get past the blank page and progress tracking so you know what is still open.",
  },
  {
    icon: CalendarClock,
    title: "Deadlines you can see coming",
    description:
      "Question deadlines, submission dates and internal review gates on one calendar, because the expensive miss is never the one you knew about.",
  },
  {
    icon: BarChart3,
    title: "Win-rate analytics",
    description:
      "Conversion by stage, pipeline velocity and revenue attribution — the numbers that tell you whether your bid decisions are getting better.",
  },
  {
    icon: Users,
    title: "Team collaboration",
    description:
      "Assign sections, share documents and keep capture, technical and pricing people looking at the same record.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-dvh bg-background">
      <LandingNav />

      <main id="main-content">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.45_0.14_250/0.12),transparent)]" />
          <div className="page-container section-padding relative">
            <div className="mx-auto max-w-3xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Badge variant="secondary" className="mb-6">
                  <Sparkles className="mr-1 size-3" aria-hidden="true" />
                  For government and enterprise capture teams
                </Badge>
                <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                  Stop losing bids to <span className="text-primary">process</span>
                </h1>
                {/*
                  This paragraph used to promise opportunity discovery, which
                  the FAQ on the same page correctly says the product does not
                  do. It now describes the product that exists.
                */}
                <p className="mt-6 text-balance text-lg text-muted-foreground sm:text-xl">
                  ProcureAI reads the solicitation, holds the pipeline and gives the proposal a
                  structure to write against — so responses go out compliant and on time.
                </p>
                <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button size="lg" asChild>
                    <Link to="/signup">
                      Start free trial
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  {/*
                    Previously "View demo dashboard", pointing at /app — which
                    bounces every signed-out visitor to the login page. There is
                    no public demo, so the button no longer claims one.
                  */}
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/" hash="workflow">
                      See how it works
                    </Link>
                  </Button>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  14-day trial · No card required · Cancel from inside the app
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mx-auto mt-16 max-w-5xl"
            >
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
                  <div className="size-3 rounded-full bg-destructive/60" />
                  <div className="size-3 rounded-full bg-warning/60" />
                  <div className="size-3 rounded-full bg-success/60" />
                  <span className="ml-2 text-xs text-muted-foreground">ProcureAI Dashboard</span>
                  <span className="ml-auto text-[11px] text-muted-foreground">Example data</span>
                </div>
                <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: "Pipeline Value", value: "$4.85M", change: "+12.4%" },
                    { label: "Win Rate", value: "34.2%", change: "+2.1%" },
                    { label: "Active Opps", value: "47", change: "+8 new" },
                    { label: "Revenue Won", value: "$1.24M", change: "+18.6%" },
                  ].map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-lg border border-border bg-background p-4"
                    >
                      <p className="text-xs text-muted-foreground">{metric.label}</p>
                      <p className="mt-1 text-xl font-semibold tabular-nums">{metric.value}</p>
                      <p className="mt-1 text-xs text-success-emphasis">{metric.change}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* What it does not do — stated before the feature list, not after */}
        <section className="border-b border-border bg-muted/30">
          <div className="page-container py-10">
            <p className="mx-auto max-w-3xl text-center text-sm leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">One thing to be clear about:</span>{" "}
              ProcureAI does not find opportunities for you. You bring the pursuit — from SAM.gov,
              an agency portal, a teaming partner — and the product does everything after that.
              Automated discovery is on the roadmap, not in the product.
            </p>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="section-padding border-b border-border scroll-mt-16">
          <div className="page-container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Everything after the solicitation lands
              </h2>
              <p className="mt-4 text-muted-foreground">
                The mechanical parts of capture work, done once and done properly.
              </p>
            </div>
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="border-border/60">
                  <CardHeader>
                    <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="size-5 text-primary" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription className="leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section
          id="workflow"
          className="section-padding border-b border-border bg-muted/30 scroll-mt-16"
        >
          <div className="page-container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                From solicitation to award
              </h2>
              <p className="mt-4 text-muted-foreground">
                Five steps, in the order a capture team actually works them.
              </p>
            </div>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
              {workflowSteps.map((item, i) => (
                <div key={item.step} className="relative text-center lg:text-left">
                  {i < workflowSteps.length - 1 && (
                    <div
                      className="absolute left-1/2 top-6 hidden h-px w-full bg-border lg:block"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative mx-auto flex size-12 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold text-primary lg:mx-0">
                    {item.step}
                  </div>
                  <h3 className="mt-4 font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="section-padding border-b border-border scroll-mt-16">
          <div className="page-container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Simple, transparent pricing
              </h2>
              <p className="mt-4 text-muted-foreground">
                Fourteen days free, without a card. Scale as your team grows.
              </p>
            </div>
            <div className="mt-16 grid gap-6 lg:grid-cols-3">
              {pricingPlans.map((plan) => (
                <Card
                  key={plan.slug}
                  className={cn(
                    "relative flex flex-col border-border/60",
                    plan.highlighted && "border-primary shadow-md ring-1 ring-primary/20",
                  )}
                >
                  {plan.highlighted && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                      Most popular
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-semibold tabular-nums">${plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </CardHeader>
                  <div className="flex flex-1 flex-col px-6 pb-6">
                    <ul className="flex-1 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <CheckCircle2
                            className="mt-0.5 size-4 shrink-0 text-success-emphasis"
                            aria-hidden="true"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="mt-8 w-full"
                      variant={plan.highlighted ? "default" : "outline"}
                      asChild
                    >
                      <Link to="/signup">Start free trial</Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-muted-foreground">
              <Link to="/pricing" className="font-medium text-primary hover:underline">
                Compare plans in detail
              </Link>{" "}
              — full feature lists and billing questions.
            </p>
          </div>
        </section>

        {/* Security */}
        <section id="security" className="section-padding border-b border-border scroll-mt-16">
          <div className="page-container">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="size-6 text-primary" aria-hidden="true" />
                </div>
                <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Built for data you cannot leak
                </h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Unreleased pricing and win themes are among the most sensitive things a company
                  holds. Tenant isolation is enforced in Postgres rather than in application code,
                  so a bug in the app returns an empty result instead of someone else&rsquo;s
                  pipeline.
                </p>
                {/*
                  Was "Request security brief" pointing at /signup — a CTA that
                  did something other than what it said. There is a security
                  page now, so it goes there.
                */}
                <Button className="mt-8" variant="outline" asChild>
                  <Link to="/security">
                    Read the security overview
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
              <ul className="space-y-4">
                {securityItems.slice(0, 4).map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <CheckCircle2
                      className="mt-0.5 size-5 shrink-0 text-success-emphasis"
                      aria-hidden="true"
                    />
                    <span>
                      <span className="text-sm font-medium">{item.title}</span>
                      <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">
                        {item.body}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Guides */}
        <section className="section-padding border-b border-border bg-muted/30">
          <div className="page-container">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Guides for capture teams
                </h2>
                <p className="mt-4 text-muted-foreground">
                  How to decide what to bid, and how to keep a response compliant once you have.
                </p>
              </div>
              <Link to="/guides" className="text-sm font-medium text-primary hover:underline">
                All guides
              </Link>
            </div>
            <ul className="mt-12 grid gap-6 md:grid-cols-3">
              {guides.map((guide) => (
                <li key={guide.slug}>
                  <Link
                    to="/guides/$slug"
                    params={{ slug: guide.slug }}
                    className="group flex h-full flex-col rounded-xl border border-border bg-background p-6 transition-colors hover:border-primary/40"
                  >
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {guide.readingMinutes} min read
                    </p>
                    <h3 className="mt-3 font-semibold leading-snug group-hover:text-primary">
                      {guide.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {guide.description}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="section-padding border-b border-border scroll-mt-16">
          <div className="page-container">
            <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
              Frequently asked questions
            </h2>
            <div className="mx-auto mt-16 max-w-2xl divide-y divide-border">
              {faqItems.map((item) => (
                <details key={item.question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
                    {item.question}
                    {/*
                      Was a Zap icon rotating 12 degrees, which reads as
                      decoration rather than as a control. A chevron that flips
                      is the convention people already know.
                    */}
                    <ChevronDown
                      className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding">
          <div className="page-container">
            <div className="rounded-2xl border border-border bg-primary px-8 py-16 text-center text-primary-foreground sm:px-16">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Try it on your next solicitation
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
                Upload a live RFP and see what comes back. Fourteen days, no card, no call.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/signup">
                    Start free trial
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <Link to="/login">Sign in</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
