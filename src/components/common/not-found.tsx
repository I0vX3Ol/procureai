import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

/** Styled 404 used by the root route and as the router-wide fallback. */
export function NotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-dvh items-center justify-center bg-background px-4"
    >
      <div className="max-w-md text-center">
        <p className="text-7xl font-bold text-foreground">404</p>
        <h1 className="mt-4 text-xl font-semibold text-foreground">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button asChild>
            <Link to="/app">Go to dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
