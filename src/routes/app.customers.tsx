import { createFileRoute } from '@tanstack/react-router'

import { CustomersPage } from '@/features/customers/customers-page'

export const Route = createFileRoute('/app/customers')({
  head: () => ({
    meta: [
      { title: 'Customers — ProcureAI' },
      { name: 'description', content: 'Manage agency relationships and past performance references.' },
      { property: 'og:title', content: 'Customers — ProcureAI' },
      { property: 'og:description', content: 'Manage agency relationships and past performance references.' },
    ],
  }),
  component: CustomersPage,
})
