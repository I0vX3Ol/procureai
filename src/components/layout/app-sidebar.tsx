import {
  BarChart3,
  Bell,
  Bot,
  Briefcase,
  Building2,
  Calendar,
  ChevronRight,
  FileText,
  FolderKanban,
  GitBranch,
  HelpCircle,
  LayoutDashboard,
  Link2,
  Menu,
  Moon,
  PanelLeft,
  Search,
  Settings,
  Sparkles,
  Sun,
  Users,
} from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";

import { useAppShell } from "@/components/layout/app-shell-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { currentUser } from "@/data/mock-data";
import { cn, getInitials } from "@/lib/utils";
import { useTheme } from "@/providers/theme-provider";
import { useWorkspace } from "@/providers/workspace-provider";

interface SidebarNavItem {
  title: string;
  href: string;
  icon: typeof LayoutDashboard;
  /** Which live count, if any, to surface as a badge. */
  badge?: "open" | "unread";
}

const mainNav: SidebarNavItem[] = [
  { title: "Dashboard", href: "/app", icon: LayoutDashboard },
  { title: "Opportunities", href: "/app/opportunities", icon: Briefcase, badge: "open" },
  { title: "Pipeline", href: "/app/pipeline", icon: GitBranch },
  { title: "Projects", href: "/app/projects", icon: FolderKanban },
  { title: "Proposal Builder", href: "/app/proposals", icon: FileText },
  { title: "AI Workspace", href: "/app/ai", icon: Sparkles },
  { title: "Documents", href: "/app/documents", icon: FileText },
  { title: "Analytics", href: "/app/analytics", icon: BarChart3 },
  { title: "Calendar", href: "/app/calendar", icon: Calendar },
  { title: "Customers", href: "/app/customers", icon: Users },
];

const secondaryNav: SidebarNavItem[] = [
  { title: "Organization", href: "/app/organization", icon: Building2 },
  { title: "Integrations", href: "/app/integrations", icon: Link2 },
  { title: "Notifications", href: "/app/notifications", icon: Bell, badge: "unread" },
  { title: "Settings", href: "/app/settings", icon: Settings },
  { title: "Support", href: "/app/support", icon: HelpCircle },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle?: () => void;
  className?: string;
}

export function AppSidebar({ collapsed, onToggle, className }: AppSidebarProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { resolvedTheme, setTheme } = useTheme();
  const { opportunities, unreadCount } = useWorkspace();

  const openCount = opportunities.filter(
    (item) => item.status !== "won" && item.status !== "lost",
  ).length;

  function badgeValue(kind?: "open" | "unread") {
    if (kind === "open") return openCount;
    if (kind === "unread") return unreadCount;
    return undefined;
  }

  function renderNav(
    items: SidebarNavItem[],
    { label, subtle }: { label: string; subtle?: boolean },
  ) {
    return (
      <nav aria-label={label}>
        <ul className="space-y-0.5">
          {items.map((item) => {
            const isActive =
              item.href === "/app" ? pathname === "/app" : pathname.startsWith(item.href);
            const Icon = item.icon;
            const count = badgeValue(item.badge);

            const link = (
              <Link
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-2.5 py-2 transition-colors",
                  subtle ? "text-sm" : "text-sm font-medium",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  collapsed && "justify-center px-2",
                )}
                aria-current={isActive ? "page" : undefined}
                aria-label={
                  collapsed ? (count ? `${item.title}, ${count}` : item.title) : undefined
                }
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.title}</span>
                    {count !== undefined && count > 0 && (
                      <Badge variant="secondary" className="ml-auto text-[10px]">
                        {count}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            );

            if (collapsed) {
              return (
                <li key={item.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>{link}</TooltipTrigger>
                    <TooltipContent side="right">{item.title}</TooltipContent>
                  </Tooltip>
                </li>
              );
            }

            return <li key={item.href}>{link}</li>;
          })}
        </ul>
      </nav>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex h-full flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200",
          collapsed ? "w-16" : "w-60",
          className,
        )}
        aria-label="Main navigation"
      >
        <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-3">
          <Link
            to="/app"
            className="flex min-w-0 flex-1 items-center gap-2 rounded-md"
            aria-label="ProcureAI dashboard"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Bot className="size-4" aria-hidden="true" />
            </span>
            {!collapsed && (
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-sidebar-accent-foreground">
                  ProcureAI
                </span>
                <span className="block truncate text-xs text-sidebar-foreground">
                  Acme Procurement
                </span>
              </span>
            )}
          </Link>
          {onToggle && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 text-sidebar-foreground"
              onClick={onToggle}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!collapsed}
            >
              <PanelLeft className="size-4" aria-hidden="true" />
            </Button>
          )}
        </div>

        <ScrollArea className="flex-1 px-2 py-3">
          {renderNav(mainNav, { label: "Primary" })}
          <Separator className="my-3" />
          {renderNav(secondaryNav, { label: "Workspace settings", subtle: true })}
        </ScrollArea>

        <div className="border-t border-sidebar-border p-2">
          <div
            className={cn("flex items-center gap-2 rounded-md p-2", collapsed && "justify-center")}
          >
            <Avatar className="size-8">
              <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{currentUser.name}</p>
                  <p className="truncate text-xs text-sidebar-foreground">{currentUser.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0"
                  onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                  aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
                >
                  {resolvedTheme === "dark" ? (
                    <Sun className="size-4" aria-hidden="true" />
                  ) : (
                    <Moon className="size-4" aria-hidden="true" />
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}

interface AppHeaderProps {
  title: string;
  description?: string | undefined;
  breadcrumbs?: { label: string; href?: string }[] | undefined;
}

export function AppHeader({ title, description, breadcrumbs }: AppHeaderProps) {
  const { setMobileNavOpen, setCommandOpen } = useAppShell();
  const { unreadCount } = useWorkspace();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 md:hidden"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" aria-hidden="true" />
        </Button>

        <div className="min-w-0 flex-1">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="mb-0.5 hidden sm:block">
              <ol className="flex items-center gap-1 text-xs text-muted-foreground">
                {breadcrumbs.map((crumb, i) => (
                  <li key={crumb.label} className="flex items-center gap-1">
                    {i > 0 && <ChevronRight className="size-3" aria-hidden="true" />}
                    {crumb.href ? (
                      <Link to={crumb.href} className="hover:text-foreground">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span aria-current="page">{crumb.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">{title}</h1>
          {description && (
            <p className="hidden truncate text-sm text-muted-foreground sm:block">{description}</p>
          )}
        </div>

        <Button
          variant="outline"
          className="hidden w-56 justify-start gap-2 text-muted-foreground lg:inline-flex"
          onClick={() => setCommandOpen(true)}
          aria-keyshortcuts="Meta+K Control+K"
        >
          <Search className="size-4" aria-hidden="true" />
          <span className="flex-1 text-left">Search…</span>
          <kbd className="pointer-events-none rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium">
            ⌘K
          </kbd>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="shrink-0 lg:hidden"
          onClick={() => setCommandOpen(true)}
          aria-label="Search ProcureAI"
        >
          <Search className="size-4" aria-hidden="true" />
        </Button>

        <Button variant="outline" size="icon" className="relative shrink-0" asChild>
          <Link
            to="/app/notifications"
            aria-label={
              unreadCount > 0
                ? `Notifications, ${unreadCount} unread`
                : "Notifications, none unread"
            }
          >
            <Bell className="size-4" aria-hidden="true" />
            {unreadCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground"
              >
                {unreadCount}
              </span>
            )}
          </Link>
        </Button>
      </div>
    </header>
  );
}
