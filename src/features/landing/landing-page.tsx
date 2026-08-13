import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  FileSearch,
  Lock,
  Shield,
  Sparkles,
  Target,
  Users,
  Zap,
} from 'lucide-react'
import { motion } from 'motion/react'

import { LandingFooter } from '@/features/landing/components/landing-footer'
import { LandingNav } from '@/features/landing/components/landing-nav'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  enterpriseLogos,
  faqItems,
  pricingPlans,
  testimonials,
} from '@/data/mock-data'
import { cn } from '@/lib/utils'

const features = [
  {
    icon: FileSearch,
    title: 'Opportunity Discovery',
    description:
      'Aggregate SAM.gov, state portals, and enterprise feeds. AI matches opportunities to your NAICS codes and past performance.',
  },
  {
    icon: Sparkles,
    title: 'AI Document Analysis',
    description:
      'Extract requirements, deadlines, evaluation criteria, and compliance items from RFPs up to 500 pages in minutes.',
  },
  {
    icon: Target,
    title: 'Pipeline Management',
    description:
      'Track every bid from discovery through award with fit scores, stage gates, and deadline alerts.',
  },
  {
    icon: Bot,
    title: 'Proposal Assistant',
    description:
      'Draft technical volumes, executive summaries, and compliance matrices with cited source references.',
  },
  {
    icon: BarChart3,
    title: 'Win Rate Analytics',
    description:
      'Measure pipeline velocity, conversion by stage, and revenue attribution across your portfolio.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description:
      'Assign tasks, share documents, and coordinate capture teams with role-based access controls.',
  },
]

const workflowSteps = [
  { step: '01', title: 'Discover', description: 'AI scans procurement sources and surfaces high-fit opportunities.' },
  { step: '02', title: 'Analyze', description: 'Upload RFPs for instant requirement extraction and risk assessment.' },
  { step: '03', title: 'Qualify', description: 'Score fit, estimate win probability, and decide go/no-go.' },
  { step: '04', title: 'Respond', description: 'Build proposals with AI drafts, compliance checks, and team review.' },
  { step: '05', title: 'Win', description: 'Track outcomes, capture lessons learned, and refine your strategy.' },
]

const securityItems = [
  'SOC 2 Type II certified infrastructure',
  'AES-256 encryption at rest and TLS 1.3 in transit',
  'Role-based access control with SSO/SAML on Enterprise',
  'Organization-level data isolation',
  'Audit logs and custom data retention policies',
  'FedRAMP-aligned security controls',
]

export function LandingPage() {
  return (
    <div className="min-h-dvh bg-background">
      <LandingNav />

      <main>
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
                  AI-powered procurement intelligence
                </Badge>
                <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                  Win more bids with{' '}
                  <span className="text-primary">AI-driven</span> procurement
                </h1>
                <p className="mt-6 text-balance text-lg text-muted-foreground sm:text-xl">
                  Discover opportunities, analyze RFPs in minutes, and build winning proposals —
                  all in one platform built for modern procurement teams.
                </p>
                <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button size="lg" asChild>
                    <Link to="/signup">
                      Start free trial
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/app">View demo dashboard</Link>
                  </Button>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  No credit card required · 14-day free trial · Cancel anytime
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
                </div>
                <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: 'Pipeline Value', value: '$4.85M', change: '+12.4%' },
                    { label: 'Win Rate', value: '34.2%', change: '+2.1%' },
                    { label: 'Active Opps', value: '47', change: '+8 new' },
                    { label: 'Revenue Won', value: '$1.24M', change: '+18.6%' },
                  ].map((metric) => (
                    <div key={metric.label} className="rounded-lg border border-border bg-background p-4">
                      <p className="text-xs text-muted-foreground">{metric.label}</p>
                      <p className="mt-1 text-xl font-semibold tabular-nums">{metric.value}</p>
                      <p className="mt-1 text-xs text-success">{metric.change}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Logos */}
        <section className="border-b border-border py-12">
          <div className="page-container">
            <p className="text-center text-sm text-muted-foreground">
              Trusted by capture teams at leading contractors
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {enterpriseLogos.map((logo) => (
                <span key={logo} className="text-sm font-medium text-muted-foreground/70">
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="section-padding border-b border-border">
          <div className="page-container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Everything you need to win complex bids
              </h2>
              <p className="mt-4 text-muted-foreground">
                From opportunity discovery to proposal delivery — ProcureAI streamlines every step
                of your capture process.
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
                    <CardDescription className="leading-relaxed">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section id="workflow" className="section-padding border-b border-border bg-muted/30">
          <div className="page-container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                From discovery to award
              </h2>
              <p className="mt-4 text-muted-foreground">
                A structured workflow that keeps your team aligned and deadlines on track.
              </p>
            </div>
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
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
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="section-padding border-b border-border">
          <div className="page-container">
            <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
              Loved by procurement teams
            </h2>
            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <Card key={t.author} className="border-border/60">
                  <CardContent className="pt-6">
                    <p className="text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                    <div className="mt-6">
                      <p className="text-sm font-medium">{t.author}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.role}, {t.company}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="section-padding border-b border-border bg-muted/30">
          <div className="page-container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Simple, transparent pricing
              </h2>
              <p className="mt-4 text-muted-foreground">
                Start with a 14-day free trial. Scale as your team grows.
              </p>
            </div>
            <div className="mt-16 grid gap-6 lg:grid-cols-3">
              {pricingPlans.map((plan) => (
                <Card
                  key={plan.name}
                  className={cn(
                    'relative border-border/60',
                    plan.highlighted && 'border-primary shadow-md ring-1 ring-primary/20',
                  )}
                >
                  {plan.highlighted && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most popular</Badge>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-semibold tabular-nums">${plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <CheckCircle2
                            className="mt-0.5 size-4 shrink-0 text-success"
                            aria-hidden="true"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="mt-8 w-full"
                      variant={plan.highlighted ? 'default' : 'outline'}
                      asChild
                    >
                      <Link to="/signup">Start free trial</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Security */}
        <section id="security" className="section-padding border-b border-border">
          <div className="page-container">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="size-6 text-primary" aria-hidden="true" />
                </div>
                <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Enterprise-grade security
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Your bid data is sensitive. ProcureAI is built with the security controls
                  required for government and enterprise procurement workflows.
                </p>
                <Button className="mt-8" variant="outline" asChild>
                  <Link to="/signup">
                    <Lock className="size-4" aria-hidden="true" />
                    Request security brief
                  </Link>
                </Button>
              </div>
              <ul className="space-y-4">
                {securityItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="section-padding border-b border-border bg-muted/30">
          <div className="page-container">
            <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
              Frequently asked questions
            </h2>
            <div className="mx-auto mt-16 max-w-2xl divide-y divide-border">
              {faqItems.map((item) => (
                <details key={item.question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <Zap
                      className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-12"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
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
                Ready to transform your capture process?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
                Join procurement teams who respond faster, qualify smarter, and win more with
                ProcureAI.
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
  )
}
