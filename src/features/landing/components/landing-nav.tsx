import { Link } from "@tanstack/react-router";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/theme-provider";

/**
 * Marketing nav.
 *
 * These were bare fragments ("#features"), which resolve against whatever page
 * you are already on — so every one of them was dead from /pricing, /security
 * and the guides. Section links are written from the site root so they work
 * from anywhere, and the two destinations that earned their own page are
 * router links.
 */
const navLinks: Array<{ label: string; to: string; hash?: string }> = [
  { label: "Features", to: "/", hash: "features" },
  { label: "How it works", to: "/", hash: "workflow" },
  { label: "Pricing", to: "/pricing" },
  { label: "Security", to: "/security" },
  { label: "Guides", to: "/guides" },
];

export function LandingNav() {
  const { resolvedTheme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-200",
        scrolled ? "border-b border-border/60 bg-background/80 backdrop-blur-lg" : "bg-transparent",
      )}
    >
      <div className="page-container flex h-14 items-center justify-between gap-4">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="ProcureAI home">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="text-xs font-bold tracking-tight">P</span>
          </div>
          <span className="text-sm font-semibold tracking-tight">ProcureAI</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              // Spread rather than `hash={link.hash}`: under
              // exactOptionalPropertyTypes an explicit `undefined` is not the
              // same as an absent prop, and Link rejects it.
              {...(link.hash ? { hash: link.hash } : {})}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="size-8"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="size-4" aria-hidden="true" />
            ) : (
              <Moon className="size-4" aria-hidden="true" />
            )}
          </Button>

          <Link
            to="/login"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            Sign in
          </Link>

          <Button size="sm" className="hidden sm:inline-flex" asChild>
            <Link to="/signup">Start free trial</Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="size-8 md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu"
          >
            {mobileOpen ? (
              <X className="size-4" aria-hidden="true" />
            ) : (
              <Menu className="size-4" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div
          id="mobile-nav-menu"
          className="border-t border-border/60 bg-background/95 backdrop-blur-lg md:hidden"
        >
          <nav className="page-container flex flex-col gap-1 py-3" aria-label="Mobile">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                {...(link.hash ? { hash: link.hash } : {})}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
              <Link
                to="/login"
                className="px-3 py-2 text-sm text-muted-foreground"
                onClick={() => setMobileOpen(false)}
              >
                Sign in
              </Link>
              <Button size="sm" asChild>
                <Link to="/signup" onClick={() => setMobileOpen(false)}>
                  Start free trial
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
