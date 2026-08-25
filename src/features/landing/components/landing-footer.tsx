import { Link } from "@tanstack/react-router";

import { guides } from "@/data/guides";

/**
 * Footer navigation.
 *
 * Every entry resolves to a page that exists. The previous version shipped six
 * links pointing at "#" — About, Blog, Careers, Contact, DPA and Integrations —
 * which reload the current page and go nowhere. Dead links in a footer are the
 * clearest signal a site was generated rather than built, and they waste the
 * one place on the page where internal linking actually helps crawlers reach
 * deeper content. Nothing is listed here until there is something behind it.
 */
const productLinks = [
  { label: "Features", to: "/", hash: "features" },
  { label: "How it works", to: "/", hash: "workflow" },
  { label: "Pricing", to: "/pricing" },
  { label: "Security", to: "/security" },
];

const legalLinks = [
  { label: "Privacy", to: "/legal/privacy" },
  { label: "Terms", to: "/legal/terms" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="page-container section-padding pb-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5" aria-label="ProcureAI home">
              <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <span className="text-xs font-bold tracking-tight">P</span>
              </div>
              <span className="text-sm font-semibold tracking-tight">ProcureAI</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A pipeline and proposal workspace for teams bidding government and enterprise
              contracts. You bring the pursuit; ProcureAI handles everything after it.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium">Product</h3>
            <ul className="mt-3 space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    {...(link.hash ? { hash: link.hash } : {})}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium">Guides</h3>
            <ul className="mt-3 space-y-2.5">
              {guides.map((guide) => (
                <li key={guide.slug}>
                  <Link
                    to="/guides/$slug"
                    params={{ slug: guide.slug }}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {guide.navLabel}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/guides"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  All guides
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium">Legal</h3>
            <ul className="mt-3 space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} ProcureAI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
