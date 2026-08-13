import { useMemo, useState } from 'react'
import { Briefcase, CalendarClock, CheckSquare, FileText, Flag } from 'lucide-react'

import { PageShell } from '@/components/layout/page-shell'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/common/empty-state'
import { calendarEvents } from '@/data/workspace-data'
import { formatRelativeDate } from '@/lib/utils'
import type { CalendarEvent, CalendarEventType } from '@/types/workspace'

const typeIcons: Record<CalendarEventType, typeof Briefcase> = {
  opportunity: Briefcase,
  proposal: FileText,
  milestone: Flag,
  task: CheckSquare,
}

const typeLabels: Record<CalendarEventType, string> = {
  opportunity: 'Opportunity',
  proposal: 'Proposal',
  milestone: 'Milestone',
  task: 'Task',
}

const typeVariant: Record<CalendarEventType, 'secondary' | 'warning' | 'success' | 'default'> = {
  opportunity: 'secondary',
  proposal: 'success',
  milestone: 'warning',
  task: 'default',
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function EventRow({ event }: { event: CalendarEvent }) {
  const Icon = typeIcons[event.type]

  return (
    <li className="flex items-start gap-3 rounded-lg border border-border p-3">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="text-sm font-medium leading-snug">{event.title}</p>
          <Badge variant={typeVariant[event.type]}>{typeLabels[event.type]}</Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{event.detail}</p>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <time dateTime={event.date.toISOString()}>{formatRelativeDate(event.date)}</time>
          {event.owner && (
            <>
              <span>·</span>
              <span>{event.owner}</span>
            </>
          )}
        </div>
      </div>
    </li>
  )
}

export function CalendarPage() {
  const [selected, setSelected] = useState<Date | undefined>(new Date('2026-08-13'))

  const eventDays = useMemo(() => calendarEvents.map((event) => event.date), [])

  const selectedEvents = useMemo(() => {
    if (!selected) return []
    return calendarEvents
      .filter((event) => isSameDay(event.date, selected))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [selected])

  const upcomingEvents = useMemo(
    () =>
      [...calendarEvents]
        .filter((event) => event.date.getTime() >= new Date('2026-08-13').getTime())
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .slice(0, 6),
    [],
  )

  return (
    <PageShell
      title="Calendar"
      description="Deadlines, milestones, and tasks across your procurement pipeline."
      breadcrumbs={[{ label: 'Workspace', href: '/app' }, { label: 'Calendar' }]}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,auto)_minmax(0,1fr)]">
        <Card className="h-fit">
          <CardContent className="p-3">
            <Calendar
              mode="single"
              selected={selected}
              onSelect={setSelected}
              modifiers={{ hasEvent: eventDays }}
              modifiersClassNames={{
                hasEvent:
                  'relative after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-primary',
              }}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <CalendarClock className="size-4 text-muted-foreground" aria-hidden="true" />
              <CardTitle className="text-base">
                {selected
                  ? selected.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Select a date'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedEvents.length === 0 ? (
                <EmptyState
                  icon={CalendarClock}
                  title="No events on this day"
                  description="Select another date on the calendar to view scheduled deadlines and milestones."
                  className="py-10"
                />
              ) : (
                <ul className="space-y-3" aria-label={`Events on ${selected?.toDateString() ?? ''}`}>
                  {selectedEvents.map((event) => (
                    <EventRow key={event.id} event={event} />
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3" aria-label="Upcoming events">
                {upcomingEvents.map((event) => (
                  <EventRow key={event.id} event={event} />
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  )
}
