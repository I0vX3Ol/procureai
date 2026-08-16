import { fetchIntegrations, setIntegrationStatus } from "@/lib/remote-data";
import type { Integration } from "@/types/workspace";

/**
 * Integration registry, persisted per organisation in Supabase.
 *
 * No OAuth handshake exists yet, so "connecting" records that this workspace
 * wants the connector — it does not claim a live sync. The UI is worded to
 * match.
 */
export interface IntegrationService {
  list(): Promise<Integration[]>;
  connect(id: string): Promise<Integration>;
  disconnect(id: string): Promise<Integration>;
}

class SupabaseIntegrationService implements IntegrationService {
  async list(): Promise<Integration[]> {
    return (await fetchIntegrations()) as unknown as Integration[];
  }

  async connect(id: string): Promise<Integration> {
    await setIntegrationStatus(id, "requested");
    return this.find(id);
  }

  async disconnect(id: string): Promise<Integration> {
    await setIntegrationStatus(id, "available");
    return this.find(id);
  }

  private async find(id: string): Promise<Integration> {
    const all = await this.list();
    const found = all.find((item) => item.id === id);
    if (!found) throw new Error("Integration not found");
    return found;
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const integrationService: IntegrationService = new SupabaseIntegrationService();
