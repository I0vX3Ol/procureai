import { createFileRoute } from '@tanstack/react-router'

import { ProposalBuilderPage } from '@/features/proposals/proposal-builder-page'

export const Route = createFileRoute('/app/proposals')({
  head: () => ({
    meta: [
      { title: 'Proposal Builder — ProcureAI' },
      { name: 'description', content: 'Draft, collaborate on, and export proposal volumes with AI assistance.' },
      { property: 'og:title', content: 'Proposal Builder — ProcureAI' },
      { property: 'og:description', content: 'Draft, collaborate on, and export proposal volumes with AI assistance.' },
    ],
  }),
  component: ProposalBuilderPage,
})
