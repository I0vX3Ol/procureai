import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FileText, Loader2, Search, Sparkles, Trash2, Upload, AlertCircle } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

import { EmptyState } from '@/components/common/empty-state'
import { PageShell } from '@/components/layout/page-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { documentStore } from '@/lib/services/documents-service'
import { opportunities } from '@/data/mock-data'
import { cn, formatRelativeDate } from '@/lib/utils'
import type { AnalysisStatus, DocumentKind, ProcurementDocument } from '@/types/workspace'

const kindLabels: Record<DocumentKind, string> = {
  rfp: 'RFP / RFQ',
  contract: 'Contract',
  proposal: 'Proposal',
  attachment: 'Attachment',
  past_performance: 'Past performance',
}

const statusVariant: Record<AnalysisStatus, 'secondary' | 'warning' | 'success' | 'destructive'> = {
  pending: 'secondary',
  analyzing: 'warning',
  complete: 'success',
  failed: 'destructive',
}

const kindFilters: Array<{ value: DocumentKind | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'rfp', label: 'RFPs' },
  { value: 'proposal', label: 'Proposals' },
  { value: 'contract', label: 'Contracts' },
  { value: 'attachment', label: 'Attachments' },
  { value: 'past_performance', label: 'Past performance' },
]

export function DocumentsPage() {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useState('')
  const [kind, setKind] = useState<DocumentKind | 'all'>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const documentsQuery = useQuery({
    queryKey: ['documents'],
    queryFn: () => documentStore.list(),
  })

  const uploadMutation = useMutation({
    mutationFn: (file: { name: string; sizeKb: number }) => documentStore.upload(file),
    onSuccess: (doc) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      setSelectedId(doc.id)
      toast.success('Document uploaded', { description: doc.name })
    },
    onError: () => toast.error('Upload failed. Please try again.'),
  })

  const analyzeMutation = useMutation({
    mutationFn: (id: string) => documentStore.analyze(id),
    onSuccess: (doc) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      toast.success('Analysis complete', { description: doc.name })
    },
    onError: () => toast.error('Analysis failed. Please retry.'),
  })

  const removeMutation = useMutation({
    mutationFn: (id: string) => documentStore.remove(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      if (selectedId === id) setSelectedId(null)
      toast.success('Document removed')
    },
  })

  const docs = documentsQuery.data ?? []

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return docs.filter((doc) => {
      const matchesKind = kind === 'all' || doc.kind === kind
      const matchesTerm =
        !term ||
        doc.name.toLowerCase().includes(term) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(term))
      return matchesKind && matchesTerm
    })
  }, [docs, kind, search])

  const selected = docs.find((doc) => doc.id === selectedId) ?? filtered[0] ?? null

  function handleFiles(files: FileList | null) {
    if (!files?.length) return
    Array.from(files).forEach((file) =>
      uploadMutation.mutate({ name: file.name, sizeKb: file.size / 1024 }),
    )
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <PageShell
      title="Documents"
      description="Upload RFPs, contracts, and supporting files for AI analysis."
      breadcrumbs={[{ label: 'Workspace', href: '/app' }, { label: 'Documents' }]}
      fullWidth
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search
            className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search documents or tags"
            className="pl-9"
            aria-label="Search documents"
          />
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="document-upload" className="sr-only">
            Upload documents
          </Label>
          <input
            id="document-upload"
            ref={fileInputRef}
            type="file"
            multiple
            className="sr-only"
            onChange={(event) => handleFiles(event.target.files)}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMutation.isPending}
          >
            {uploadMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Upload className="size-4" aria-hidden="true" />
            )}
            Upload
          </Button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter by document type">
        {kindFilters.map((filter) => (
          <Button
            key={filter.value}
            size="sm"
            variant={kind === filter.value ? 'default' : 'outline'}
            aria-pressed={kind === filter.value}
            onClick={() => setKind(filter.value)}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {documentsQuery.isLoading ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-20 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      ) : documentsQuery.isError ? (
        <EmptyState
          icon={AlertCircle}
          title="Couldn't load documents"
          description="Something went wrong while fetching your document library."
          action={{ label: 'Retry', onClick: () => documentsQuery.refetch() }}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={docs.length === 0 ? 'No documents yet' : 'No matching documents'}
          description={
            docs.length === 0
              ? 'Upload an RFP, contract, or proposal draft to start AI analysis.'
              : 'Try a different search term or clear the type filter.'
          }
          action={
            docs.length === 0
              ? { label: 'Upload a document', onClick: () => fileInputRef.current?.click() }
              : { label: 'Clear filters', onClick: () => { setSearch(''); setKind('all') } }
          }
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <ul className="space-y-3">
            {filtered.map((doc) => (
              <li key={doc.id}>
                <DocumentRow
                  document={doc}
                  active={selected?.id === doc.id}
                  onSelect={() => setSelectedId(doc.id)}
                  onAnalyze={() => analyzeMutation.mutate(doc.id)}
                  onRemove={() => removeMutation.mutate(doc.id)}
                  analyzing={analyzeMutation.isPending && analyzeMutation.variables === doc.id}
                />
              </li>
            ))}
          </ul>

          <DocumentDetail
            document={selected}
            analyzing={analyzeMutation.isPending}
            onAnalyze={() => selected && analyzeMutation.mutate(selected.id)}
          />
        </div>
      )}
    </PageShell>
  )
}

interface DocumentRowProps {
  document: ProcurementDocument
  active: boolean
  analyzing: boolean
  onSelect: () => void
  onAnalyze: () => void
  onRemove: () => void
}

function DocumentRow({ document, active, analyzing, onSelect, onAnalyze, onRemove }: DocumentRowProps) {
  const opportunity = opportunities.find((item) => item.id === document.opportunityId)

  return (
    <Card
      className={cn(
        'transition-colors',
        active ? 'border-primary/60 bg-accent/40' : 'hover:border-primary/40',
      )}
    >
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={onSelect}
          className="flex min-w-0 flex-1 items-start gap-3 text-left"
          aria-current={active}
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <FileText className="size-4 text-muted-foreground" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">{document.name}</span>
            <span className="mt-1 block truncate text-xs text-muted-foreground">
              {kindLabels[document.kind]} · {document.pages} pages ·{' '}
              {(document.sizeKb / 1024).toFixed(1)} MB · {formatRelativeDate(document.uploadedAt)}
              {opportunity ? ` · ${opportunity.title}` : ''}
            </span>
          </span>
        </button>

        <div className="flex shrink-0 items-center gap-2">
          <Badge variant={statusVariant[document.status]}>
            {document.status === 'analyzing' ? 'Analyzing' : document.status}
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={onAnalyze}
            disabled={analyzing}
            aria-label={`Analyze ${document.name}`}
          >
            {analyzing ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles className="size-4" aria-hidden="true" />
            )}
            Analyze
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={onRemove}
            aria-label={`Delete ${document.name}`}
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function DocumentDetail({
  document,
  analyzing,
  onAnalyze,
}: {
  document: ProcurementDocument | null
  analyzing: boolean
  onAnalyze: () => void
}) {
  if (!document) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Select a document to see its metadata and AI analysis.
        </CardContent>
      </Card>
    )
  }

  const opportunity = opportunities.find((item) => item.id === document.opportunityId)
  const related = opportunity
    ? [`Opportunity: ${opportunity.title}`, `Agency: ${opportunity.agency}`]
    : ['Not linked to an opportunity']

  return (
    <Card className="lg:sticky lg:top-20">
      <CardHeader>
        <CardTitle className="text-base">Document details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="rounded-lg border border-border bg-muted/40 p-3">
          <p className="truncate font-medium">{document.name}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Uploaded by {document.uploadedBy} · {formatRelativeDate(document.uploadedAt)}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <dt className="text-muted-foreground">Type</dt>
            <dd className="mt-0.5 font-medium">{kindLabels[document.kind]}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Pages</dt>
            <dd className="mt-0.5 font-medium">{document.pages}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Size</dt>
            <dd className="mt-0.5 font-medium">{(document.sizeKb / 1024).toFixed(1)} MB</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Status</dt>
            <dd className="mt-0.5">
              <Badge variant={statusVariant[document.status]}>{document.status}</Badge>
            </dd>
          </div>
        </dl>

        {document.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {document.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            AI analysis
          </h3>
          {document.status === 'failed' ? (
            <div className="mt-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
              Analysis failed for this file format. Re-upload as PDF or DOCX and try again.
            </div>
          ) : document.summary ? (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{document.summary}</p>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              No analysis yet. Run AI analysis to extract requirements, deadlines, and risks.
            </p>
          )}
        </div>

        <Button className="w-full" onClick={onAnalyze} disabled={analyzing}>
          {analyzing ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Sparkles className="size-4" aria-hidden="true" />
          )}
          {document.summary ? 'Re-run analysis' : 'Run AI analysis'}
        </Button>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Relationships
          </h3>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            {related.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
