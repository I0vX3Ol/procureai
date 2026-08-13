import { createFileRoute } from '@tanstack/react-router'

import { LandingPage } from '@/features/landing/landing-page'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'ProcureAI — Win more government and enterprise contracts' },
      {
        name: 'description',
        content:
          'AI-powered procurement intelligence: discover opportunities, qualify bids, build proposals, and track your pipeline in one workspace.',
      },
      { property: 'og:title', content: 'ProcureAI — AI procurement intelligence' },
      {
        property: 'og:description',
        content:
          'Discover opportunities, qualify bids, and build winning proposals with AI assistance.',
      },
    ],
  }),
  component: LandingPage,
})
