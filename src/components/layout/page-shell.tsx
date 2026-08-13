import type { ReactNode } from 'react'

import { AppHeader } from '@/components/layout/app-sidebar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface PageShellProps {
  title: string
  description?: string
  breadcrumbs?: { label: string; href?: string }[]
  actions?: ReactNode
  children: ReactNode
  className?: string
  fullWidth?: boolean
}

export function PageShell({
  title,
  description,
  breadcrumbs,
  actions,
  children,
  className,
  fullWidth,
}: PageShellProps) {
  return (
    <>
      <AppHeader title={title} description={description} breadcrumbs={breadcrumbs} />
      <ScrollArea className="flex-1">
        <main
          id="main-content"
          className={cn(
            'p-6',
            !fullWidth && 'mx-auto max-w-7xl',
            className,
          )}
        >
          {actions && <div className="mb-6 flex flex-wrap items-center justify-end gap-3">{actions}</div>}
          {children}
        </main>
      </ScrollArea>
    </>
  )
}
