import { createFileRoute } from '@tanstack/react-router'

import { CalendarPage } from '@/features/calendar/calendar-page'

export const Route = createFileRoute('/app/calendar')({
  head: () => ({
    meta: [
      { title: 'Calendar — ProcureAI' },
      { name: 'description', content: 'Deadlines, milestones, and tasks across your procurement pipeline.' },
      { property: 'og:title', content: 'Calendar — ProcureAI' },
      { property: 'og:description', content: 'Deadlines, milestones, and tasks across your procurement pipeline.' },
    ],
  }),
  component: CalendarPage,
})
