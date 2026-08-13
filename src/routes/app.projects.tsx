import { createFileRoute } from '@tanstack/react-router'

import { ProjectsPage } from '@/features/projects/projects-page'

export const Route = createFileRoute('/app/projects')({
  head: () => ({
    meta: [
      { title: 'Projects — ProcureAI' },
      { name: 'description', content: 'Manage capture projects, teams, and delivery milestones.' },
      { property: 'og:title', content: 'Projects — ProcureAI' },
      { property: 'og:description', content: 'Manage capture projects, teams, and delivery milestones.' },
    ],
  }),
  component: ProjectsPage,
})
