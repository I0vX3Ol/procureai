import { Outlet, useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { CommandPalette } from "@/components/common/command-palette";
import { AppShellContext } from "@/components/layout/app-shell-context";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { useInertBackground } from "@/hooks/use-inert-background";
import { WorkspaceProvider } from "@/providers/workspace-provider";

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  // Make the background genuinely inert (not just aria-hidden) while any modal
  // is open, so no focusable element is left inside an aria-hidden subtree.
  useInertBackground();

  // Navigating from the mobile drawer should dismiss it.
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  const toggleSidebar = useCallback(() => setSidebarCollapsed((prev) => !prev), []);

  const shell = useMemo(
    () => ({
      sidebarCollapsed,
      toggleSidebar,
      mobileNavOpen,
      setMobileNavOpen,
      commandOpen,
      setCommandOpen,
    }),
    [sidebarCollapsed, toggleSidebar, mobileNavOpen, commandOpen],
  );

  return (
    <WorkspaceProvider>
      <AppShellContext.Provider value={shell}>
        <div className="flex h-dvh overflow-hidden bg-background">
          {/* Desktop rail */}
          <AppSidebar
            className="hidden md:flex"
            collapsed={sidebarCollapsed}
            onToggle={toggleSidebar}
          />

          {/* Mobile drawer */}
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetContent side="left" className="w-64 p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SheetDescription className="sr-only">
                Move between ProcureAI workspace sections.
              </SheetDescription>
              <AppSidebar className="flex h-full w-full border-r-0" collapsed={false} />
            </SheetContent>
          </Sheet>

          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <Outlet />
          </div>
        </div>

        <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
      </AppShellContext.Provider>
    </WorkspaceProvider>
  );
}
