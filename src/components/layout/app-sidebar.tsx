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
  Moon,
  PanelLeft,
  Search,
  Settings,
  Sparkles,
  Sun,
  Users,
} from 'lucide-react'
import { Link, useRouterState } from '@tanstack/react-router'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { currentUser } from '@/data/mock-data'
import { cn, getInitials } from '@/lib/utils'
import { useTheme } from '@/providers/theme-provider'

const mainNav = [
  { title: 'Dashboard', href: '/app', icon: LayoutDashboard },
  { title: 'Opportunities', href: '/app/opportunities', icon: Briefcase, badge: 47 },
  { title: 'Pipeline', href: '/app/pipeline', icon: GitBranch },
  { title: 'Projects', href: '/app/projects', icon: FolderKanban },
  { title: 'Proposal Builder', href: '/app/proposals', icon: FileText },
  { title: 'AI Workspace', href: '/app/ai', icon: Sparkles },
  { title: 'Documents', href: '/app/documents', icon: FileText },
  { title: 'Analytics', href: '/app/analytics', icon: BarChart3 },
  { title: 'Calendar', href: '/app/calendar', icon: Calendar },
  { title: 'Customers', href: '/app/customers', icon: Users },
]

const secondaryNav = [
  { title: 'Organization', href: '/app/organization', icon: Building2 },
  { title: 'Integrations', href: '/app/integrations', icon: Link2 },
  { title: 'Notifications', href: '/app/notifications', icon: Bell },
  { title: 'Settings', href: '/app/settings', icon: Settings },
  { title: 'Support', href: '/app/support', icon: HelpCircle },
]

interface AppSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'flex h-full flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200',
          collapsed ? 'w-16' : 'w-60',
        )}
        aria-label="Main navigation"
      >
        <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Bot className="size-4" aria-hidden="true" />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-sidebar-accent-foreground">
                ProcureAI
              </p>
              <p className="truncate text-xs text-sidebar-foreground">Acme Procurement</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 text-sidebar-foreground"
            onClick={onToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <PanelLeft className="size-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 px-2 py-3">
          <nav aria-label="Primary">
            <ul className="space-y-0.5">
              {mainNav.map((item) => {
                const isActive =
                  item.href === '/app'
                    ? pathname === '/app'
                    : pathname.startsWith(item.href)
                const Icon = item.icon

                const link = (
                  <Link
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
                      collapsed && 'justify-center px-2',
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate">{item.title}</span>
                        {item.badge !== undefined && (
                          <Badge variant="secondary" className="ml-auto text-[10px]">
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </Link>
                )

                if (collapsed) {
                  return (
                    <li key={item.href}>
                      <Tooltip>
                        <TooltipTrigger asChild>{link}</TooltipTrigger>
                        <TooltipContent side="right">{item.title}</TooltipContent>
                      </Tooltip>
                    </li>
                  )
                }

                return <li key={item.href}>{link}</li>
              })}
            </ul>
          </nav>

          <Separator className="my-3" />

          <nav aria-label="Secondary">
            <ul className="space-y-0.5">
              {secondaryNav.map((item) => {
                const isActive = pathname.startsWith(item.href)
                const Icon = item.icon

                const link = (
                  <Link
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/60',
                      collapsed && 'justify-center px-2',
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    {!collapsed && <span className="truncate">{item.title}</span>}
                  </Link>
                )

                if (collapsed) {
                  return (
                    <li key={item.href}>
                      <Tooltip>
                        <TooltipTrigger asChild>{link}</TooltipTrigger>
                        <TooltipContent side="right">{item.title}</TooltipContent>
                      </Tooltip>
                    </li>
                  )
                }

                return <li key={item.href}>{link}</li>
              })}
            </ul>
          </nav>
        </ScrollArea>

        <div className="border-t border-sidebar-border p-2">
          <div
            className={cn(
              'flex items-center gap-2 rounded-md p-2',
              collapsed ? 'justify-center' : '',
            )}
          >
            <Avatar className="size-8">
              <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{currentUser.name}</p>
                <p className="truncate text-xs text-sidebar-foreground">{currentUser.email}</p>
              </div>
            )}
            {!collapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0"
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle theme"
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="size-4" />
                ) : (
                  <Moon className="size-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  )
}

interface AppHeaderProps {
  title: string
  description?: string | undefined
  breadcrumbs?: { label: string; href?: string }[] | undefined
}

export function AppHeader({ title, description, breadcrumbs }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-14 items-center gap-4 px-6">
        <div className="min-w-0 flex-1">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="mb-0.5">
              <ol className="flex items-center gap-1 text-xs text-muted-foreground">
                {breadcrumbs.map((crumb, i) => (
                  <li key={crumb.label} className="flex items-center gap-1">
                    {i > 0 && <ChevronRight className="size-3" aria-hidden="true" />}
                    {crumb.href ? (
                      <Link to={crumb.href} className="hover:text-foreground">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span>{crumb.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <h1 className="truncate text-lg font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="truncate text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        <div className="relative hidden w-64 md:block">
          <Search
            className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input placeholder="Search… (⌘K)" className="pl-9" aria-label="Search" />
        </div>

        <Button variant="outline" size="icon" className="relative" asChild>
          <Link to="/app/notifications" aria-label="Notifications">
            <Bell className="size-4" />
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              2
            </span>
          </Link>
        </Button>
      </div>
    </header>
  )
}
