import { integrations as seedIntegrations } from '@/data/workspace-data'
import type { Integration } from '@/types/workspace'

/**
 * Integration registry abstraction.
 *
 * Connections here are local workspace state only — no external credentials are
 * stored or transmitted from the browser. A real implementation performs the
 * OAuth handshake server-side and returns the persisted connection record.
 */
export interface IntegrationService {
  list(): Promise<Integration[]>
  connect(id: string): Promise<Integration>
  disconnect(id: string): Promise<Integration>
}

class LocalIntegrationService implements IntegrationService {
  private items: Integration[] = seedIntegrations.map((item) => ({ ...item }))

  async list(): Promise<Integration[]> {
    await delay(200)
    return this.items.map((item) => ({ ...item }))
  }

  async connect(id: string): Promise<Integration> {
    await delay(500)
    return this.update(id, { status: 'connected', lastSync: new Date() })
  }

  async disconnect(id: string): Promise<Integration> {
    await delay(300)
    const next = this.update(id, { status: 'available' })
    delete next.lastSync
    this.items = this.items.map((item) => (item.id === id ? next : item))
    return { ...next }
  }

  private update(id: string, patch: Partial<Integration>): Integration {
    const target = this.items.find((item) => item.id === id)
    if (!target) throw new Error('Integration not found')
    const next = { ...target, ...patch }
    this.items = this.items.map((item) => (item.id === id ? next : item))
    return { ...next }
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const integrationService: IntegrationService = new LocalIntegrationService()
