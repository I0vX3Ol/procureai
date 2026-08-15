import { useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Briefcase,
  Building2,
  Calendar,
  FileText,
  FolderKanban,
  GitBranch,
  HelpCircle,
  LayoutDashboard,
  Link2,
  Moon,
  Settings,
  Sparkles,
  Sun,
  Users,
} from "lucide-react";
import { useEffect } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { customers, documents } from "@/data/workspace-data";
import { formatCurrency } from "@/lib/utils";
import { useTheme } from "@/providers/theme-provider";
import { useReturnFocus } from "@/hooks/use-return-focus";
import { useWorkspace } from "@/providers/workspace-provider";

const pages = [
  { title: "Dashboard", href: "/app", icon: LayoutDashboard },
  { title: "Opportunities", href: "/app/opportunities", icon: Briefcase },
  { title: "Pipeline", href: "/app/pipeline", icon: GitBranch },
  { title: "Projects", href: "/app/projects", icon: FolderKanban },
  { title: "Proposal Builder", href: "/app/proposals", icon: FileText },
  { title: "AI Workspace", href: "/app/ai", icon: Sparkles },
  { title: "Documents", href: "/app/documents", icon: FileText },
  { title: "Analytics", href: "/app/analytics", icon: BarChart3 },
  { title: "Calendar", href: "/app/calendar", icon: Calendar },
  { title: "Customers", href: "/app/customers", icon: Users },
  { title: "Organization", href: "/app/organization", icon: Building2 },
  { title: "Integrations", href: "/app/integrations", icon: Link2 },
  { title: "Notifications", href: "/app/notifications", icon: Bell },
  { title: "Settings", href: "/app/settings", icon: Settings },
  { title: "Support", href: "/app/support", icon: HelpCircle },
];

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Workspace-wide search and navigation. Opens with ⌘K / Ctrl+K, or from the
 * search control in the page header.
 */
export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const { opportunities } = useWorkspace();
  const { resolvedTheme, setTheme } = useTheme();
  const onCloseAutoFocus = useReturnFocus();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        onOpenChange(!open);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  function go(href: string) {
    onOpenChange(false);
    void navigate({ to: href });
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      onCloseAutoFocus={onCloseAutoFocus}
      title="Search ProcureAI"
      description="Jump to a page, opportunity, customer, or document."
    >
      <CommandInput placeholder="Search pages, opportunities, customers, documents…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Pages">
          {pages.map((page) => (
            <CommandItem
              key={page.href}
              value={`page ${page.title}`}
              onSelect={() => go(page.href)}
            >
              <page.icon className="mr-2 size-4" aria-hidden="true" />
              {page.title}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Opportunities">
          {opportunities.map((opportunity) => (
            <CommandItem
              key={opportunity.id}
              value={`opportunity ${opportunity.title} ${opportunity.agency} ${opportunity.solicitationNumber}`}
              onSelect={() => go("/app/opportunities")}
            >
              <Briefcase className="mr-2 size-4" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate">{opportunity.title}</span>
              <span className="ml-2 shrink-0 text-xs text-muted-foreground">
                {formatCurrency(opportunity.value)}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Customers">
          {customers.map((customer) => (
            <CommandItem
              key={customer.id}
              value={`customer ${customer.name} ${customer.location}`}
              onSelect={() => go("/app/customers")}
            >
              <Users className="mr-2 size-4" aria-hidden="true" />
              {customer.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Documents">
          {documents.map((document) => (
            <CommandItem
              key={document.id}
              value={`document ${document.name} ${document.tags.join(" ")}`}
              onSelect={() => go("/app/documents")}
            >
              <FileText className="mr-2 size-4" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate">{document.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem
            value="action toggle theme dark light appearance"
            onSelect={() => {
              setTheme(resolvedTheme === "dark" ? "light" : "dark");
              onOpenChange(false);
            }}
          >
            {resolvedTheme === "dark" ? (
              <Sun className="mr-2 size-4" aria-hidden="true" />
            ) : (
              <Moon className="mr-2 size-4" aria-hidden="true" />
            )}
            Switch to {resolvedTheme === "dark" ? "light" : "dark"} theme
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
