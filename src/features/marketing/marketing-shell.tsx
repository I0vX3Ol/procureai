import type { ReactNode } from "react";

import { LandingFooter } from "@/features/landing/components/landing-footer";
import { LandingNav } from "@/features/landing/components/landing-nav";

/**
 * Chrome for the public pages that are not the landing page.
 *
 * Shares the landing nav and footer so /pricing, /security and the guides sit
 * inside the same site rather than reading as detached microsites.
 */
export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      <LandingNav />
      <main id="main-content">{children}</main>
      <LandingFooter />
    </div>
  );
}

/** Standard page header: eyebrow, title, standfirst. */
export function MarketingHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
}) {
  return (
    <header className="border-b border-border">
      <div className="page-container py-16 sm:py-20">
        <div className="max-w-3xl">
          {eyebrow && <p className="text-sm font-medium text-primary">{eyebrow}</p>}
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            {title}
          </h1>
          {lede && (
            <p className="mt-5 text-balance text-lg leading-relaxed text-muted-foreground">
              {lede}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
