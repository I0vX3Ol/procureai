import { Bell, CheckCheck } from 'lucide-react'
import { useState } from 'react'

import { PageShell } from '@/components/layout/page-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { notifications as initialNotifications } from '@/data/mock-data'
import { cn } from '@/lib/utils'
import type { Notification } from '@/types'

const typeVariants = {
  info: 'secondary',
  success: 'success',
  warning: 'warning',
  deadline: 'destructive',
} as const

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
    )
  }

  return (
    <PageShell
      title="Notifications"
      description={`${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
      actions={
        unreadCount > 0 ? (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck className="size-4" aria-hidden="true" />
            Mark all read
          </Button>
        ) : undefined
      }
    >
      <div className="space-y-2">
        {notifications.map((notif) => (
          <Card
            key={notif.id}
            className={cn(
              'cursor-pointer transition-colors hover:bg-muted/30',
              !notif.read && 'border-primary/30 bg-primary/5',
            )}
            onClick={() => toggleRead(notif.id)}
          >
            <CardContent className="flex items-start gap-4 p-4">
              <div
                className={cn(
                  'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full',
                  notif.read ? 'bg-muted' : 'bg-primary/10',
                )}
              >
                <Bell
                  className={cn('size-4', notif.read ? 'text-muted-foreground' : 'text-primary')}
                  aria-hidden="true"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className={cn('text-sm font-medium', notif.read && 'text-muted-foreground')}>
                    {notif.title}
                  </p>
                  <Badge variant={typeVariants[notif.type]} className="text-[10px]">
                    {notif.type}
                  </Badge>
                  {!notif.read && (
                    <span className="size-2 rounded-full bg-primary" aria-label="Unread" />
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{notif.message}</p>
                <time
                  className="mt-2 block text-xs text-muted-foreground"
                  dateTime={notif.createdAt.toISOString()}
                >
                  {notif.createdAt.toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  )
}
