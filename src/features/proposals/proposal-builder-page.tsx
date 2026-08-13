import {
  CheckCircle2,
  Download,
  Eye,
  FileText,
  Loader2,
  Pencil,
  Save,
  Sparkles,
  WandSparkles,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { PageShell } from '@/components/layout/page-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { opportunities } from '@/data/mock-data'
import { proposals } from '@/data/workspace-data'
import { aiService } from '@/lib/ai/service'
import { cn, formatCurrency, formatRelativeDate } from '@/lib/utils'
import type { ProposalSection } from '@/types/workspace'

const statusLabels: Record<ProposalSection['status'], string> = {
  not_started: 'Not started',
  drafting: 'Drafting',
  review: 'In review',
  complete: 'Complete',
}

const statusVariant: Record<ProposalSection['status'], 'secondary' | 'warning' | 'success'> = {
  not_started: 'secondary',
  drafting: 'warning',
  review: 'warning',
  complete: 'success',
}

function wordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

export function ProposalBuilderPage() {
  const proposal = proposals[0]!
  const opportunity = opportunities.find((item) => item.id === proposal.opportunityId)

  const [sections, setSections] = useState<ProposalSection[]>(proposal.sections)
  const [activeId, setActiveId] = useState(proposal.sections[0]!.id)
  const [preview, setPreview] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const [busy, setBusy] = useState<'generate' | 'rewrite' | null>(null)

  const active = sections.find((section) => section.id === activeId)!

  const progress = useMemo(() => {
    const done = sections.filter((section) => section.status === 'complete').length
    return Math.round((done / sections.length) * 100)
  }, [sections])

  const totalWords = useMemo(
    () => sections.reduce((sum, section) => sum + wordCount(section.content), 0),
    [sections],
  )
  const targetWords = sections.reduce((sum, section) => sum + section.wordTarget, 0)

  function updateActive(patch: Partial<ProposalSection>) {
    setSections((prev) =>
      prev.map((section) => (section.id === active.id ? { ...section, ...patch } : section)),
    )
    setDirty(true)
  }

  function handleSave() {
    setDirty(false)
    setSavedAt(new Date())
    toast.success('Draft saved', { description: `${active.title} saved to this workspace.` })
  }

  async function handleGenerate() {
    setBusy('generate')
    try {
      const draft = await aiService.generateProposalSection(
        active.title,
        opportunity?.description ?? '',
      )
      updateActive({
        content: active.content ? `${active.content}\n\n${draft}` : draft,
        status: active.status === 'not_started' ? 'drafting' : active.status,
      })
      toast.success('AI draft added', { description: active.title })
    } catch {
      toast.error('AI generation failed. Please try again.')
    } finally {
      setBusy(null)
    }
  }

  async function handleRewrite() {
    if (!active.content.trim()) {
      toast.error('Nothing to rewrite', { description: 'Add or generate content first.' })
      return
    }
    setBusy('rewrite')
    try {
      const rewritten = await aiService.generateProposalSection(
        `${active.title} (rewrite for clarity and evaluator readability)`,
        active.content,
      )
      updateActive({ content: rewritten, status: 'review' })
      toast.success('Section rewritten', { description: active.title })
    } catch {
      toast.error('AI rewrite failed. Please try again.')
    } finally {
      setBusy(null)
    }
  }

  function handleExport() {
    const body = sections
      .map((section) => `## ${section.title}\n\n${section.content || '_Section not drafted._'}`)
      .join('\n\n')
    const markdown = `# ${proposal.title}\n\nDue ${proposal.dueDate.toDateString()} · Owner ${proposal.owner}\n\n${body}\n`

    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${proposal.title.replace(/\s+/g, '-').toLowerCase()}.md`
    anchor.click()
    URL.revokeObjectURL(url)
    toast.success('Proposal exported', { description: 'Markdown file downloaded.' })
  }

  return (
    <PageShell
      title="Proposal Builder"
      description="Draft, collaborate on, and export proposal volumes with AI assistance."
      breadcrumbs={[{ label: 'Workspace', href: '/app' }, { label: 'Proposal Builder' }]}
      fullWidth
    >
      <Card className="mb-6">
        <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold">{proposal.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {opportunity?.agency} · {opportunity ? formatCurrency(opportunity.value) : '—'} · Due{' '}
              {formatRelativeDate(proposal.dueDate)} · Owner {proposal.owner}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {opportunity?.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:w-72">
            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Completion</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="mt-1.5" aria-label="Proposal completion" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => setPreview((prev) => !prev)}>
                {preview ? <Pencil className="size-4" /> : <Eye className="size-4" />}
                {preview ? 'Edit mode' : 'Preview'}
              </Button>
              <Button size="sm" variant="outline" onClick={handleExport}>
                <Download className="size-4" />
                Export
              </Button>
              <Button size="sm" onClick={handleSave} disabled={!dirty}>
                <Save className="size-4" />
                {dirty ? 'Save draft' : 'Saved'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {preview ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {sections.map((section) => (
              <article key={section.id}>
                <h3 className="text-sm font-semibold">{section.title}</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                  {section.content || 'This section has not been drafted yet.'}
                </p>
                <Separator className="mt-6" />
              </article>
            ))}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
          <Card className="h-fit lg:sticky lg:top-20">
            <CardHeader>
              <CardTitle className="text-sm">Sections</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <nav aria-label="Proposal sections">
                <ul className="space-y-1">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <button
                        type="button"
                        onClick={() => setActiveId(section.id)}
                        aria-current={section.id === activeId ? 'true' : undefined}
                        className={cn(
                          'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors',
                          section.id === activeId
                            ? 'bg-accent text-accent-foreground'
                            : 'hover:bg-muted',
                        )}
                      >
                        {section.status === 'complete' ? (
                          <CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden="true" />
                        ) : (
                          <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                        )}
                        <span className="min-w-0 flex-1 truncate">{section.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
              <Separator className="my-3" />
              <p className="px-3 pb-2 text-xs text-muted-foreground">
                {totalWords.toLocaleString()} / {targetWords.toLocaleString()} words
                {savedAt && ` · saved ${savedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <CardTitle className="text-base">{active.title}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">{active.guidance}</p>
              </div>
              <Badge variant={statusVariant[active.status]}>{statusLabels[active.status]}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={handleGenerate} disabled={busy !== null}>
                  {busy === 'generate' ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Sparkles className="size-4" aria-hidden="true" />
                  )}
                  Generate with AI
                </Button>
                <Button size="sm" variant="outline" onClick={handleRewrite} disabled={busy !== null}>
                  {busy === 'rewrite' ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <WandSparkles className="size-4" aria-hidden="true" />
                  )}
                  Rewrite section
                </Button>
                <Button
                  size="sm"
                  variant={active.status === 'complete' ? 'secondary' : 'outline'}
                  onClick={() =>
                    updateActive({ status: active.status === 'complete' ? 'drafting' : 'complete' })
                  }
                >
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                  {active.status === 'complete' ? 'Reopen section' : 'Mark complete'}
                </Button>
              </div>

              <div>
                <label htmlFor="section-editor" className="sr-only">
                  {active.title} content
                </label>
                <Textarea
                  id="section-editor"
                  value={active.content}
                  onChange={(event) =>
                    updateActive({
                      content: event.target.value,
                      status: active.status === 'not_started' ? 'drafting' : active.status,
                    })
                  }
                  placeholder="Write this section, or generate a first draft with AI…"
                  className="min-h-[320px] resize-y font-sans text-sm leading-relaxed"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>
                  {wordCount(active.content).toLocaleString()} / {active.wordTarget.toLocaleString()}{' '}
                  words
                </span>
                <span>{dirty ? 'Unsaved changes' : 'All changes saved'}</span>
              </div>
              <Progress
                value={Math.min(100, (wordCount(active.content) / active.wordTarget) * 100)}
                aria-label="Section word target progress"
              />
            </CardContent>
          </Card>
        </div>
      )}
    </PageShell>
  )
}
