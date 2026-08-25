/**
 * Writes public/sitemap.xml from the routes that actually exist.
 *
 * The previous sitemap listed exactly one URL — the home page — so every other
 * page was invisible to anything that discovers content through it. Hand-
 * maintaining the list would have gone stale the first time someone added a
 * page, which is how it got into that state, so the list is derived instead:
 * file names under src/routes are the source of truth, and a new marketing
 * page appears in the sitemap without anyone remembering to add it.
 *
 * Runs as part of `build`, so CI regenerates it and a stale committed copy
 * cannot ship.
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const routesDir = resolve(here, "..", "src", "routes");
const guidesFile = resolve(here, "..", "src", "data", "guides.ts");
const target = resolve(here, "..", "public", "sitemap.xml");

const ORIGIN = "https://procure.nexudel.com";

/**
 * Routes that exist but must never be submitted.
 *
 * `app.*` is the signed-in product. login and signup carry a noindex tag —
 * listing a noindex URL in a sitemap is a contradictory signal, so they are
 * excluded here too.
 */
const EXCLUDE_PREFIXES = ["app.", "app"];
const EXCLUDE_EXACT = new Set(["login", "signup", "__root"]);

/** Relative priority. Anything unlisted gets 0.6. */
const PRIORITY = {
  "/": "1.0",
  "/pricing": "0.9",
  "/guides": "0.8",
  "/security": "0.8",
};

const CHANGEFREQ = {
  "/": "weekly",
  "/pricing": "monthly",
  "/guides": "monthly",
};

function routeFileToPath(name) {
  const base = name.replace(/\.tsx$/, "");
  if (base === "index") return "/";
  // TanStack encodes nesting with dots: legal.privacy -> /legal/privacy
  const segments = base.split(".");
  // A trailing "index" is the parent's own path: guides.index -> /guides
  if (segments.at(-1) === "index") segments.pop();
  return `/${segments.join("/")}`;
}

const files = readdirSync(routesDir).filter((f) => f.endsWith(".tsx"));

const staticPaths = files
  .map((f) => f.replace(/\.tsx$/, ""))
  .filter((base) => !EXCLUDE_EXACT.has(base))
  .filter((base) => !EXCLUDE_PREFIXES.some((p) => base === p || base.startsWith(p)))
  // Dynamic segments cannot be enumerated from the file name; expanded below.
  .filter((base) => !base.includes("$"))
  .map((base) => routeFileToPath(`${base}.tsx`));

/**
 * Expand the one dynamic route: /guides/$slug.
 *
 * Slugs are read out of the guides module rather than duplicated here. If the
 * shape of that file changes this finds nothing, so it fails loudly instead of
 * quietly shipping a sitemap that has lost every guide.
 */
function guideSlugs() {
  const src = readFileSync(guidesFile, "utf8");
  const slugs = [...src.matchAll(/^\s{4}slug:\s*"([a-z0-9-]+)"/gm)].map((m) => m[1]);
  if (slugs.length === 0) {
    throw new Error(
      `No guide slugs found in ${guidesFile}. The sitemap generator's pattern is out of date.`,
    );
  }
  return slugs;
}

const hasDynamicGuides = files.includes("guides.$slug.tsx");
const guidePaths = hasDynamicGuides ? guideSlugs().map((s) => `/guides/${s}`) : [];

const paths = [...new Set([...staticPaths, ...guidePaths])].sort((a, b) => {
  // Home first, then alphabetical — purely so diffs on this file stay readable.
  if (a === "/") return -1;
  if (b === "/") return 1;
  return a.localeCompare(b);
});

const lastmod = new Date().toISOString().slice(0, 10);

const body = paths
  .map((p) => {
    const loc = p === "/" ? `${ORIGIN}/` : `${ORIGIN}${p}`;
    const changefreq = CHANGEFREQ[p] ?? "yearly";
    const priority = PRIORITY[p] ?? "0.6";
    return `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
  })
  .join("\n");

writeFileSync(
  target,
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
);

console.log(`sitemap.xml: ${paths.length} URLs`);
for (const p of paths) console.log(`  ${p}`);
