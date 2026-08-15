import { AlertTriangle, Bell, CalendarClock, CheckCheck, Info, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/common/empty-state";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/providers/workspace-provider";
import type { Notification } from "@/types";

const typeVariants = {
  info: "secondary",
  success: "success",
  warning: "warning",
  deadline: "destructive",
} as const;

const typeLabels: Record<Notification["type"], string> = {
  info: "Update",
  success: "Completed",
  warning: "Warning",
  deadline: "Deadline",
};

const typeIcons: Record<Notification["type"], typeof Bell> = {
  info: Info,
  success: Sparkles,
  warning: AlertTriangle,
  deadline: CalendarClock,
};

const filters = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "deadline", label: "Deadlines" },
] as const;

type FilterValue = (typeof filters)[number]["value"];

export function NotificationsPage() {
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } =
    useWorkspace();
  const [filter, setFilter] = useState<FilterValue>("all");

  const visible = useMemo(() => {
    if (filter === "unread") return notifications.filter((item) => !item.read);
    if (filter === "deadline") return notifications.filter((item) => item.type === "deadline");
    return notifications;
  }, [notifications, filter]);

  return (
    <PageShell
      title="Notifications"
      description="Deadline alerts, AI activity, and team updates"
      breadcrumbs={[{ label: "Workspace", href: "/app" }, { label: "Notifications" }]}
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={markAllNotificationsRead}
          disabled={unreadCount === 0}
        >
          <CheckCheck className="size-4" aria-hidden="true" />
          Mark all read
        </Button>
      }
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter notifications">
          {filters.map((option) => (
            <Button
              key={option.value}
              size="sm"
              variant={filter === option.value ? "default" : "outline"}
              aria-pressed={filter === option.value}
              onClick={() => setFilter(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground" role="status">
          {unreadCount} unread of {notifications.length}
        </p>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={filter === "unread" ? "You're all caught up" : "Nothing here yet"}
          description={
            filter === "unread"
              ? "Every notification has been read. New alerts appear here as deadlines approach."
              : "Notifications about deadlines, AI analysis, and team activity will show up here."
          }
          {...(filter !== "all"
            ? { action: { label: "Show all", onClick: () => setFilter("all") } }
            : {})}
        />
      ) : (
        <ul className="space-y-2">
          {visible.map((notification) => {
            const Icon = typeIcons[notification.type];

            return (
              <li key={notification.id}>
                <Card
                  className={cn(
                    "transition-colors",
                    !notification.read && "border-primary/30 bg-primary/5",
                  )}
                >
                  <CardContent className="flex items-start gap-4 p-4">
                    <span
                      className={cn(
                        "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
                        notification.read ? "bg-muted" : "bg-primary/10",
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-4",
                          notification.read ? "text-muted-foreground" : "text-primary",
                        )}
                        aria-hidden="true"
                      />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2
                          className={cn(
                            "text-sm font-medium",
                            notification.read && "text-muted-foreground",
                          )}
                        >
                          {notification.title}
                        </h2>
                        <Badge variant={typeVariants[notification.type]} className="text-[10px]">
                          {typeLabels[notification.type]}
                        </Badge>
                        {!notification.read && (
                          <span className="text-xs font-medium text-primary">Unread</span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                      <time
                        className="mt-2 block text-xs text-muted-foreground"
                        dateTime={notification.createdAt.toISOString()}
                      >
                        {notification.createdAt.toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0"
                      onClick={() => markNotificationRead(notification.id, !notification.read)}
                    >
                      Mark {notification.read ? "unread" : "read"}
                      <span className="sr-only"> — {notification.title}</span>
                    </Button>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </PageShell>
  );
}
