import { FolderKanban } from 'lucide-react'

import { PageShell } from '@/components/layout/page-shell'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { opportunities, projects } from '@/data/mock-data'
import { formatRelativeDate } from '@/lib/utils'

export function ProjectsPage() {
  return (
    <PageShell
      title="Projects"
      description="Proposal and capture projects linked to active opportunities"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => {
          const opp = opportunities.find((o) => o.id === project.opportunityId)
          return (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{project.name}</CardTitle>
                  <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                    {project.status}
                  </Badge>
                </div>
                {opp && (
                  <CardDescription>{opp.agency}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium tabular-nums">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} aria-label={`${project.name} progress`} />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{project.teamSize} team members</span>
                  <span>Due {formatRelativeDate(project.dueDate)}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {projects.length === 0 && (
        <div className="mt-8 flex flex-col items-center py-16 text-center">
          <FolderKanban className="size-12 text-muted-foreground" aria-hidden="true" />
          <p className="mt-4 font-medium">No active projects</p>
          <p className="text-sm text-muted-foreground">Create a project from an opportunity to get started.</p>
        </div>
      )}
    </PageShell>
  )
}
