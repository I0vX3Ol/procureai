import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

import { MarketingHeader, MarketingShell } from "@/features/marketing/marketing-shell";
import { Button } from "@/components/ui/button";
import { securityItems } from "@/data/marketing-content";

/**
 * What we do not have, stated plainly.
 *
 * A security page that lists only strengths tells a procurement reviewer
 * nothing, because every vendor's page lists only strengths. The gaps are the
 * part they cannot get anywhere else, and finding one after a trust claim is
 * far more expensive than reading it here.
 */
const notYet = [
  {
    title: "SOC 2 Type II",
    body: "Not certified. If your procurement process requires a report before purchase, tell us and we will be straight with you about where that stands rather than pointing at a badge.",
  },
  {
    title: "Single sign-on and SCIM",
    body: "Not available. Authentication today is email and password with password reset. SSO is the most requested item we do not have.",
  },
  {
    title: "Customer-managed encryption keys",
    body: "Not available. Encryption at rest is managed by our infrastructure providers.",
  },
  {
    title: "FedRAMP authorization",
    body: "Not authorized. ProcureAI is a tool for organizations that bid on government work; it is not itself approved to host government data at any impact level. Do not put controlled unclassified information into it.",
  },
];

const subprocessors = [
  {
    name: "Supabase",
    purpose: "Application database, authentication and file storage",
    region: "United States (AWS us-east-1)",
  },
  {
    name: "Cloudflare",
    purpose: "Application hosting, TLS termination and CDN",
    region: "Global edge network",
  },
  { name: "Stripe", purpose: "Subscription billing and card processing", region: "United States" },
];

export function SecurityPage() {
  return (
    <MarketingShell>
      <MarketingHeader
        eyebrow="Security"
        title="How ProcureAI protects your bid data"
        lede="Unreleased pricing, teaming arrangements and win themes are among the most sensitive things a company holds. This page says what we do, what we do not do yet, and who else touches your data."
      />

      {/* What is in place */}
      <section className="page-container py-16 sm:py-20">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">What is in place</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {securityItems.map((item) => (
            <div key={item.title} className="rounded-xl border border-border p-6">
              <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
              <h3 className="mt-4 font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tenant isolation, in detail */}
      <section className="border-y border-border bg-muted/30">
        <div className="page-container section-padding">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              How tenant isolation actually works
            </h2>
            <p className="mt-5 leading-[1.75] text-muted-foreground">
              Every record in ProcureAI carries the id of the organization that owns it, and every
              table enforces a row-level security policy in Postgres that restricts reads and writes
              to the organization of the signed-in user. The check runs in the database, underneath
              the application.
            </p>
            <p className="mt-4 leading-[1.75] text-muted-foreground">
              This matters because the common way one customer sees another&rsquo;s data is an
              application bug — a missing filter on a query, a mistyped identifier in a new
              endpoint. When isolation is enforced only in application code, that bug is a breach.
              When it is enforced by the database, the same bug returns an empty result.
            </p>
            <p className="mt-4 leading-[1.75] text-muted-foreground">
              Subscription records are the one exception to normal write access: they are written
              only by our Stripe webhook using a server-side role, so no client request can grant
              itself a plan.
            </p>
          </div>
        </div>
      </section>

      {/* What we do not have */}
      <section className="page-container section-padding">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            What we do not have yet
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Listed so you find out now rather than during a security review.
          </p>
        </div>
        <dl className="mt-10 divide-y divide-border border-y border-border">
          {notYet.map((item) => (
            <div
              key={item.title}
              className="grid gap-2 py-5 sm:grid-cols-[14rem_minmax(0,1fr)] sm:gap-6"
            >
              <dt className="font-medium">{item.title}</dt>
              <dd className="text-sm leading-relaxed text-muted-foreground">{item.body}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Subprocessors */}
      <section className="border-t border-border bg-muted/30">
        <div className="page-container section-padding">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Subprocessors</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
            The third parties that process customer data on our behalf.
          </p>
          <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-background">
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Provider
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Purpose
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Region
                  </th>
                </tr>
              </thead>
              <tbody>
                {subprocessors.map((row) => (
                  <tr key={row.name} className="border-t border-border">
                    <th scope="row" className="px-4 py-3 text-left font-medium">
                      {row.name}
                    </th>
                    <td className="px-4 py-3 text-muted-foreground">{row.purpose}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.region}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/*
        No public security address is published yet, so this section points at
        the one channel that demonstrably exists — the in-app support form.
        Replace this with a dedicated address (security@…) once there is a real
        mailbox behind it; a reporting route that bounces is worse than none.
      */}
      <section className="page-container section-padding">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Reporting a vulnerability
          </h2>
          <p className="mt-4 leading-[1.75] text-muted-foreground">
            If you believe you have found a security issue, raise it through the support form in the
            app before disclosing it publicly and we will work the fix with you. We do not run a
            paid bounty programme, and we will not pursue anyone who reports a genuine issue in good
            faith.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/signup">Start free trial</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/legal/privacy">Read the privacy policy</Link>
            </Button>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
