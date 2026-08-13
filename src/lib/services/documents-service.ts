import { aiService } from '@/lib/ai/service'
import { documents as seedDocuments } from '@/data/workspace-data'
import type { ProcurementDocument } from '@/types/workspace'

/**
 * Storage abstraction for procurement documents.
 *
 * The in-memory implementation below keeps the UI fully interactive without a
 * backend. Swap `InMemoryDocumentStore` for an implementation that talks to a
 * real object store + server API — no UI changes required.
 */
export interface DocumentStore {
  list(): Promise<ProcurementDocument[]>
  upload(file: { name: string; sizeKb: number }): Promise<ProcurementDocument>
  remove(id: string): Promise<void>
  analyze(id: string): Promise<ProcurementDocument>
}

function inferKind(name: string): ProcurementDocument['kind'] {
  const lower = name.toLowerCase()
  if (lower.includes('rfp') || lower.includes('rfq')) return 'rfp'
  if (lower.includes('contract') || lower.includes('award')) return 'contract'
  if (lower.includes('proposal') || lower.includes('volume')) return 'proposal'
  if (lower.includes('past') || lower.includes('performance')) return 'past_performance'
  return 'attachment'
}

class InMemoryDocumentStore implements DocumentStore {
  private items: ProcurementDocument[] = [...seedDocuments]

  async list(): Promise<ProcurementDocument[]> {
    await delay(250)
    return [...this.items].sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
  }

  async upload(file: { name: string; sizeKb: number }): Promise<ProcurementDocument> {
    await delay(600)
    const doc: ProcurementDocument = {
      id: crypto.randomUUID(),
      name: file.name,
      kind: inferKind(file.name),
      sizeKb: Math.max(1, Math.round(file.sizeKb)),
      uploadedAt: new Date(),
      uploadedBy: 'Alex Chen',
      status: 'pending',
      pages: Math.max(1, Math.round(file.sizeKb / 60)),
      tags: [],
    }
    this.items = [doc, ...this.items]
    return doc
  }

  async remove(id: string): Promise<void> {
    await delay(200)
    this.items = this.items.filter((item) => item.id !== id)
  }

  async analyze(id: string): Promise<ProcurementDocument> {
    const target = this.items.find((item) => item.id === id)
    if (!target) throw new Error('Document not found')

    target.status = 'analyzing'
    const result = await aiService.analyzeDocument({ documentId: id, type: 'summary' })
    target.status = 'complete'
    target.summary = result.content
    this.items = this.items.map((item) => (item.id === id ? { ...target } : item))
    return { ...target }
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const documentStore: DocumentStore = new InMemoryDocumentStore()
