import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { MarketingHeader, MarketingShell } from "@/features/marketing/marketing-shell";
import { Button } from "@/components/ui/button";
import { guideBySlug, type Guide, type GuideBlock } from "@/data/guides";

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function Block({ block }: { block: GuideBlock }) {
  switch (block.kind) {
    case "p":
      return <p className="mt-4 leading-[1.75] text-muted-foreground">{block.text}</p>;

    case "ul":
      return (
        <ul className="mt-4 space-y-2.5">
          {block.items.map((item) => (
            <li key={item} className="relative pl-5 leading-[1.75] text-muted-foreground">
              <span
                className="absolute left-0 top-[0.68em] size-1.5 rounded-full bg-primary/70"
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>
      );

    case "ol":
      return (
        <ol className="mt-4 space-y-2.5">
          {block.items.map((item, i) => (
            <li key={item} className="relative pl-8 leading-[1.75] text-muted-foreground">
              <span
                className="absolute left-0 top-[0.2em] flex size-5 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold tabular-nums text-primary"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ol>
      );

    case "note":
      return (
        <aside className="mt-6 rounded-lg border border-border bg-muted/40 p-5">
          <p className="text-sm font-semibold">{block.title}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{block.text}</p>
        </aside>
      );

    case "table":
      return (
        // Wide tables have to scroll inside their own box, or the whole page
        // scrolls sideways on a phone.
        <div className="mt-6 overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-muted/50">
                {block.head.map((cell) => (
                  <th key={cell} className="px-4 py-3 font-semibold">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join("|")} className="border-t border-border align-top">
                  {row.map((cell, i) => (
                    <td
                      key={cell}
                      className={
                        i === 0
                          ? "px-4 py-3 font-medium"
                          : "px-4 py-3 leading-relaxed text-muted-foreground"
                      }
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export function GuidePage({ slug }: { slug: string }) {
  const guide = guideBySlug(slug);

  // Route files pass a literal slug, so this is a programming error rather
  // than a user-reachable state — but rendering nothing beats crashing SSR.
  if (!guide) return null;

  const related = guide.related.map((s) => guideBySlug(s)).filter((g): g is Guide => Boolean(g));

  return (
    <MarketingShell>
      <MarketingHeader eyebrow="Guide" title={guide.title} />

      <div className="page-container pb-20 pt-12 sm:pb-24">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-12">
          <article className="max-w-2xl">
            <p className="text-sm text-muted-foreground">
              {guide.readingMinutes} min read
              <span aria-hidden="true"> · </span>
              Updated <time dateTime={guide.updated}>{formatDate(guide.updated)}</time>
            </p>

            <div className="mt-6 border-l-2 border-primary/40 pl-5">
              {guide.intro.map((text) => (
                <p key={text} className="mt-3 text-lg leading-[1.7] first:mt-0">
                  {text}
                </p>
              ))}
            </div>

            {guide.sections.map((section) => (
              <section key={section.id} id={section.id} className="mt-12 scroll-mt-20">
                <h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
                {section.blocks.map((block, i) => (
                  <Block key={i} block={block} />
                ))}
              </section>
            ))}

            <div className="mt-14 rounded-xl border border-border bg-muted/30 p-6 sm:p-8">
              <h2 className="text-lg font-semibold">Run this process in one workspace</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                ProcureAI holds the pipeline, reads the solicitation and gives the proposal a
                structure to write against. Fourteen days free, no card.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild>
                  <Link to="/signup">
                    Start free trial
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/pricing">See pricing</Link>
                </Button>
              </div>
            </div>

            {related.length > 0 && (
              <section className="mt-14">
                <h2 className="text-lg font-semibold">Read next</h2>
                <ul className="mt-4 space-y-3">
                  {related.map((g) => (
                    <li key={g.slug}>
                      <Link
                        to="/guides/$slug"
                        params={{ slug: g.slug }}
                        className="group block rounded-lg border border-border p-4 transition-colors hover:border-primary/40 hover:bg-muted/40"
                      >
                        <span className="font-medium group-hover:text-primary">{g.title}</span>
                        <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                          {g.description}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </article>

          <nav
            className="mt-14 hidden lg:sticky lg:top-20 lg:mt-0 lg:block lg:self-start"
            aria-label="On this page"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              On this page
            </p>
            <ul className="mt-3 space-y-2 border-l border-border">
              {guide.sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="-ml-px block border-l-2 border-transparent pl-4 text-sm leading-snug text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </MarketingShell>
  );
}
