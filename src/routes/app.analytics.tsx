import { createFileRoute } from '@tanstack/react-router'

import { AnalyticsPage } from '@/features/analytics/analytics-page'

export const Route = createFileRoute('/app/analytics')({
  head: () => ({
    meta: [
      { title: 'Analytics — ProcureAI' },
      { name: 'description', content: 'Win rate, pipeline trends, and procurement performance analytics.' },
      { property: 'og:title', content: 'Analytics — ProcureAI' },
      { property: 'og:description', content: 'Win rate, pipeline trends, and procurement performance analytics.' },
    ],
  }),
  component: AnalyticsPage,
})
