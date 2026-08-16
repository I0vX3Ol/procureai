import { supabase } from "@/lib/supabase";
import { fetchDocuments } from "@/lib/remote-data";
import type { ProcurementDocument } from "@/types/workspace";

/**
 * Procurement document metadata, stored per organisation in Supabase.
 *
 * Binary upload to object storage is not wired up yet, so `upload` records the
 * metadata row and the UI says as much rather than pretending a file landed
 * somewhere. Automated analysis is likewise not available.
 */
export interface DocumentStore {
  list(): Promise<ProcurementDocument[]>;
  upload(file: { name: string; sizeKb: number }): Promise<ProcurementDocument>;
  remove(id: string): Promise<void>;
  analyze(id: string): Promise<ProcurementDocument>;
}

function inferKind(name: string): ProcurementDocument["kind"] {
  const lower = name.toLowerCase();
  if (lower.includes("rfp") || lower.includes("rfq")) return "rfp";
  if (lower.includes("contract") || lower.includes("award")) return "contract";
  if (lower.includes("proposal") || lower.includes("volume")) return "proposal";
  if (lower.includes("past") || lower.includes("performance")) return "past_performance";
  return "attachment";
}

class SupabaseDocumentStore implements DocumentStore {
  async list(): Promise<ProcurementDocument[]> {
    return (await fetchDocuments()) as unknown as ProcurementDocument[];
  }

  async upload(file: { name: string; sizeKb: number }): Promise<ProcurementDocument> {
    const { data, error } = await supabase
      .from("procureai_documents")
      .insert({
        name: file.name,
        kind: inferKind(file.name),
        size_bytes: Math.max(1, Math.round(file.sizeKb)) * 1024,
      })
      .select("*")
      .single();
    if (error) throw error;
    const row = data as Record<string, unknown>;
    return {
      id: String(row["id"]),
      name: String(row["name"]),
      kind: inferKind(file.name),
      sizeKb: Math.max(1, Math.round(file.sizeKb)),
      uploadedAt: new Date(String(row["created_at"])),
      uploadedBy: "",
      status: "pending",
      pages: 0,
      tags: [],
    };
  }

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("procureai_documents").delete().eq("id", id);
    if (error) throw error;
  }

  async analyze(): Promise<ProcurementDocument> {
    throw new Error("Automated document analysis is not available yet.");
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const documentStore: DocumentStore = new SupabaseDocumentStore();
