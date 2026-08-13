import { createFileRoute } from '@tanstack/react-router'

import { LoginPage } from '@/features/auth/login-page'

export const Route = createFileRoute('/login')({
  head: () => ({
    meta: [
      { title: 'Sign in — ProcureAI' },
      { name: 'description', content: 'Sign in to your ProcureAI procurement workspace.' },
      { property: 'og:title', content: 'Sign in — ProcureAI' },
      { property: 'og:description', content: 'Sign in to your ProcureAI procurement workspace.' },
    ],
  }),
  component: LoginPage,
})
