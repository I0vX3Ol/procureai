/**
 * Renders scripts/og-image.html to public/og.png at 1200x630.
 *
 * Run by hand (`node scripts/build-og-image.mjs`) after editing the HTML, not
 * as part of `build` — CI runners have no browser, and the card changes about
 * once a year. The PNG is committed.
 *
 * Needs a local Chrome. On macOS that is the standard install path below;
 * override with CHROME_PATH elsewhere.
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const source = resolve(here, "og-image.html");
const target = resolve(here, "..", "public", "og.png");

const CHROME =
  process.env["CHROME_PATH"] ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

if (!existsSync(CHROME)) {
  console.error(`No Chrome at ${CHROME}. Set CHROME_PATH to a Chrome or Chromium binary.`);
  process.exit(1);
}

// Chrome refuses to run headless without a writable profile directory.
const profile = mkdtempSync(join(tmpdir(), "procureai-og-"));

try {
  execFileSync(
    CHROME,
    [
      "--headless",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      "--window-size=1200,630",
      `--user-data-dir=${profile}`,
      `--screenshot=${target}`,
      // Web fonts need a moment; without this the card renders in a fallback face.
      "--virtual-time-budget=4000",
      `file://${source}`,
    ],
    { stdio: "inherit" },
  );
  console.log(`Wrote ${target}`);
} finally {
  rmSync(profile, { recursive: true, force: true });
}
