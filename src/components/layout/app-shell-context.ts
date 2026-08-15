import { createContext, useContext } from "react";

export interface AppShellContextValue {
  /** Desktop rail collapsed to icons only. */
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  /** Mobile navigation drawer. */
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  /** Global ⌘K command palette. */
  commandOpen: boolean;
  setCommandOpen: (open: boolean) => void;
}

export const AppShellContext = createContext<AppShellContextValue | undefined>(undefined);

export function useAppShell(): AppShellContextValue {
  const context = useContext(AppShellContext);
  if (!context) throw new Error("useAppShell must be used within AppLayout");
  return context;
}
