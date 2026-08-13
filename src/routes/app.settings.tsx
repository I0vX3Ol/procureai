import { createFileRoute } from '@tanstack/react-router'

import { SettingsPage } from '@/features/settings/settings-page'

export const Route = createFileRoute('/app/settings')({
  head: () => ({
    meta: [
      { title: 'Settings — ProcureAI' },
      { name: 'description', content: 'Manage your account, notification preferences, and security.' },
      { property: 'og:title', content: 'Settings — ProcureAI' },
      { property: 'og:description', content: 'Manage your account, notification preferences, and security.' },
    ],
  }),
  component: SettingsPage,
})
