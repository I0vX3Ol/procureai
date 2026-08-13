import { Link } from '@tanstack/react-router'

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Security', href: '#security' },
    { label: 'Integrations', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  Legal: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'SOC 2', href: '#security' },
    { label: 'DPA', href: '#' },
  ],
}

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="page-container section-padding pb-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <span className="text-xs font-bold tracking-tight">P</span>
              </div>
              <span className="text-sm font-semibold tracking-tight">ProcureAI</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              AI-powered procurement intelligence for teams that win complex bids. Discover,
              qualify, and respond faster.
            </p>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-sm font-medium">{group}</h3>
              <ul className="mt-3 space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} ProcureAI, Inc. All rights reserved.
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
  )
}
