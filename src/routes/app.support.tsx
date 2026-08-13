import { createFileRoute } from '@tanstack/react-router'

import { SupportPage } from '@/features/support/support-page'

export const Route = createFileRoute('/app/support')({
  head: () => ({
    meta: [
      { title: 'Support — ProcureAI' },
      { name: 'description', content: 'Find answers, browse documentation, or reach the ProcureAI team.' },
      { property: 'og:title', content: 'Support — ProcureAI' },
      { property: 'og:description', content: 'Find answers, browse documentation, or reach the ProcureAI team.' },
    ],
  }),
  component: SupportPage,
})
