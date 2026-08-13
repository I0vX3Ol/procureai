import { createFileRoute } from '@tanstack/react-router'

import { DashboardPage } from '@/features/dashboard/dashboard-page'

export const Route = createFileRoute('/app/')({
  head: () => ({
    meta: [
      { title: 'Dashboard — ProcureAI' },
      { name: 'description', content: 'Pipeline value, win rate, deadlines, and AI activity at a glance.' },
      { property: 'og:title', content: 'Dashboard — ProcureAI' },
      { property: 'og:description', content: 'Pipeline value, win rate, deadlines, and AI activity at a glance.' },
    ],
  }),
  component: DashboardPage,
})
