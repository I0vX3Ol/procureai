import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { MarketingHeader, MarketingShell } from "@/features/marketing/marketing-shell";
import { guides } from "@/data/guides";

export function GuidesIndexPage() {
  return (
    <MarketingShell>
      <MarketingHeader
        eyebrow="Guides"
        title="Working notes on capture and proposal management"
        lede="How to decide what to bid, how to keep a response compliant, and how to build the documents that hold a proposal together. Written for the people doing the work."
      />

      <div className="page-container section-padding">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <li key={guide.slug}>
              <Link
                to="/guides/$slug"
                params={{ slug: guide.slug }}
                className="group flex h-full flex-col rounded-xl border border-border p-6 transition-colors hover:border-primary/40 hover:bg-muted/40"
              >
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {guide.readingMinutes} min read
                </p>
                <h2 className="mt-3 text-lg font-semibold leading-snug tracking-tight group-hover:text-primary">
                  {guide.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {guide.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  Read the guide
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </MarketingShell>
  );
}
