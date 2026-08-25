/**
 * Per-page SEO tags.
 *
 * Every public route builds its head through `seo()` so that canonical,
 * og:url and og:image can never be forgotten on a new page — the three tags
 * that were missing site-wide before this existed. Without a canonical, the
 * same content reachable at more than one URL (trailing slash, query string,
 * a future preview domain) splits its own ranking signals; without og:image
 * every share renders as a bare grey link.
 *
 * Values here are absolute by construction. Relative og:image URLs are
 * ignored by most crawlers, which is a silent failure — the tag is present,
 * the preview is still blank.
 */

export const SITE_URL = "https://procure.nexudel.com";
export const SITE_NAME = "ProcureAI";

/** 1200x630, the size Facebook, LinkedIn and X all crop cleanly. */
export const OG_IMAGE_PATH = "/og.png";
export const OG_IMAGE_ALT =
  "ProcureAI — a pipeline and proposal workspace for government and enterprise bids";

/**
 * Absolute URL for a route path.
 *
 * The home page keeps its trailing slash and nothing else gets one, matching
 * exactly what the Worker serves. A canonical that does not resolve to the
 * page it sits on is worse than no canonical at all.
 */
export function canonicalUrl(path: string): string {
  if (path === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${path.replace(/\/+$/, "")}`;
}

type SeoInput = {
  title: string;
  description: string;
  /** Route path, always leading-slashed. E.g. "/guides/bid-no-bid-decision". */
  path: string;
  /** Keeps the page out of the index. See the note in `src/routes/login.tsx`. */
  noindex?: boolean;
};

type MetaTag = Record<string, string>;
type LinkTag = Record<string, string>;

export function seo({ title, description, path, noindex = false }: SeoInput): {
  meta: Array<MetaTag>;
  links: Array<LinkTag>;
} {
  const url = canonicalUrl(path);
  const image = `${SITE_URL}${OG_IMAGE_PATH}`;

  const meta: Array<MetaTag> = [
    { title },
    { name: "description", content: description },

    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:image:alt", content: OG_IMAGE_ALT },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:type", content: "website" },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];

  if (noindex) meta.push({ name: "robots", content: "noindex, nofollow" });

  return { meta, links: [{ rel: "canonical", href: url }] };
}

/** An inline JSON-LD block for a route `head()`'s `scripts`. */
export function jsonLd(data: Record<string, unknown>): {
  type: string;
  children: string;
} {
  return { type: "application/ld+json", children: JSON.stringify(data) };
}
