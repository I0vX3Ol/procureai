import { Briefcase } from 'lucide-react'

import { EmptyState } from '@/components/common/empty-state'
import { PageShell } from '@/components/layout/page-shell'

interface PlaceholderPageProps {
  title: string
  description: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <PageShell title={title} description={description}>
      <EmptyState
        icon={Briefcase}
        title={`${title} coming soon`}
        description={`We're building ${title.toLowerCase()} features. Check back soon or explore the dashboard and AI workspace in the meantime.`}
        action={{ label: 'Go to dashboard', href: '/app' }}
        secondaryAction={{ label: 'AI Workspace', href: '/app/ai' }}
      />
    </PageShell>
  )
}
