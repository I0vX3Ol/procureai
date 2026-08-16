import { supabase } from "@/lib/supabase";
import type {
  Opportunity,
  OpportunityNote,
  OpportunityStatus,
  OpportunityType,
  PipelineStage,
  Project,
  TimelineEntry,
} from "@/types";
import type { Customer, Proposal, ProposalSection } from "@/types/workspace";

type OpportunityRow = {
  id: string;
  title: string;
  agency: string | null;
  type: string | null;
  status: string | null;
  stage: string | null;
  estimated_value: number | null;
  fit_score: number | null;
  probability: number | null;
  deadline: string | null;
  posted_at: string | null;
  owner: string | null;
  solicitation_number: string | null;
  naics_code: string | null;
  location: string | null;
  tags: string[] | null;
  description: string | null;
  requirements: string[] | null;
  risk_level: string | null;
  notes: { id: string; author: string; body: string; createdAt: string }[] | null;
  timeline:
    { id: string; label: string; date: string; detail?: string; complete: boolean }[] | null;
  document_ids: string[] | null;
  proposal_id: string | null;
};

function toOpportunity(row: OpportunityRow): Opportunity {
  return {
    id: row.id,
    title: row.title,
    agency: row.agency ?? "—",
    type: (row.type as OpportunityType) ?? "government",
    status: (row.status as OpportunityStatus) ?? "discovered",
    stage: (row.stage as PipelineStage) ?? "discovery",
    value: row.estimated_value ?? 0,
    fitScore: row.fit_score ?? 0,
    probability: row.probability ?? 0,
    deadline: row.deadline ? new Date(row.deadline) : new Date(),
    postedAt: row.posted_at ? new Date(row.posted_at) : new Date(),
    owner: row.owner ?? "—",
    solicitationNumber: row.solicitation_number ?? "—",
    naicsCode: row.naics_code ?? "—",
    location: row.location ?? "—",
    tags: row.tags ?? [],
    description: row.description ?? "",
    requirements: row.requirements ?? [],
    riskLevel: (row.risk_level as Opportunity["riskLevel"]) ?? "medium",
    notes: (row.notes ?? []).map((n): OpportunityNote => ({
      id: n.id,
      author: n.author,
      body: n.body,
      createdAt: new Date(n.createdAt),
    })),
    timeline: (row.timeline ?? []).map((t): TimelineEntry => ({
      id: t.id,
      label: t.label,
      date: new Date(t.date),
      ...(t.detail ? { detail: t.detail } : {}),
      complete: t.complete,
    })),
    documentIds: row.document_ids ?? [],
    ...(row.proposal_id ? { proposalId: row.proposal_id } : {}),
  };
}

let opportunityCache: { records: Opportunity[]; fetchedAt: number } | null = null;
const CACHE_TTL_MS = 30_000;

export async function fetchOpportunities(): Promise<Opportunity[]> {
  if (opportunityCache && Date.now() - opportunityCache.fetchedAt < CACHE_TTL_MS) {
    return opportunityCache.records;
  }
  const { data, error } = await supabase
    .from("procureai_pipeline_opportunities")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data || data.length === 0) {
    if (error) console.warn("Falling back to sample opportunities:", error.message);
    return [];
  }
  const records = (data as OpportunityRow[]).map(toOpportunity);
  opportunityCache = { records, fetchedAt: Date.now() };
  return records;
}

function invalidateOpportunityCache() {
  opportunityCache = null;
}

const statusForStage: Record<PipelineStage, OpportunityStatus> = {
  discovery: "discovered",
  qualification: "qualified",
  proposal: "in_progress",
  review: "in_progress",
  submitted: "submitted",
  awarded: "won",
};

export async function persistOpportunityStage(id: string, stage: PipelineStage) {
  const { error } = await supabase
    .from("procureai_pipeline_opportunities")
    .update({ stage, status: statusForStage[stage] })
    .eq("id", id);
  invalidateOpportunityCache();
  if (error) console.warn("Couldn't persist stage change:", error.message);
}

export async function persistOpportunityNote(id: string, note: OpportunityNote) {
  const { data, error: readErr } = await supabase
    .from("procureai_pipeline_opportunities")
    .select("notes")
    .eq("id", id)
    .single();
  if (readErr) {
    console.warn("Couldn't read notes before append:", readErr.message);
    return;
  }
  const existing = (data?.notes as unknown[] | null) ?? [];
  const { error } = await supabase
    .from("procureai_pipeline_opportunities")
    .update({ notes: [{ ...note, createdAt: note.createdAt.toISOString() }, ...existing] })
    .eq("id", id);
  invalidateOpportunityCache();
  if (error) console.warn("Couldn't persist note:", error.message);
}

export async function persistOpportunityProbability(id: string, probability: number) {
  const { error } = await supabase
    .from("procureai_pipeline_opportunities")
    .update({ probability })
    .eq("id", id);
  invalidateOpportunityCache();
  if (error) console.warn("Couldn't persist probability:", error.message);
}

export async function createOpportunity(input: {
  title: string;
  agency?: string;
  stage?: PipelineStage;
}) {
  const { data, error } = await supabase
    .from("procureai_pipeline_opportunities")
    .insert({
      stage: "discovery",
      status: "discovered",
      type: "government",
      risk_level: "medium",
      fit_score: 0,
      probability: 10,
      ...input,
    })
    .select("*")
    .single();
  invalidateOpportunityCache();
  if (error) throw error;
  return toOpportunity(data as OpportunityRow);
}

// ---- Customers ----

type CustomerRow = {
  id: string;
  name: string;
  sector: string | null;
  status: string | null;
  location: string | null;
  relationship_owner: string | null;
  lifetime_value: number | null;
  open_opportunity_ids: string[] | null;
  project_ids: string[] | null;
  contacts: Customer["contacts"] | null;
  activity: { id: string; summary: string; date: string; type: string }[] | null;
};

function toCustomer(row: CustomerRow): Customer {
  return {
    id: row.id,
    name: row.name,
    sector: (row.sector as Customer["sector"]) ?? "enterprise",
    status: (row.status as Customer["status"]) ?? "prospect",
    location: row.location ?? "—",
    relationshipOwner: row.relationship_owner ?? "—",
    lifetimeValue: row.lifetime_value ?? 0,
    openOpportunityIds: row.open_opportunity_ids ?? [],
    projectIds: row.project_ids ?? [],
    contacts: row.contacts ?? [],
    activity: (row.activity ?? []).map((a) => ({
      id: a.id,
      summary: a.summary,
      date: new Date(a.date),
      type: a.type as Customer["activity"][number]["type"],
    })),
  };
}

export async function fetchCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from("procureai_customers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data || data.length === 0) {
    if (error) console.warn("Falling back to sample customers:", error.message);
    return [];
  }
  return (data as CustomerRow[]).map(toCustomer);
}

export async function createCustomer(input: { name: string; sector?: string; status?: string }) {
  const { data, error } = await supabase
    .from("procureai_customers")
    .insert({ status: "prospect", sector: "enterprise", lifetime_value: 0, ...input })
    .select("*")
    .single();
  if (error) throw error;
  return toCustomer(data as CustomerRow);
}

// ---- Projects ----

type ProjectRow = {
  id: string;
  name: string;
  opportunity_id: string | null;
  status: string | null;
  health: string | null;
  progress: number | null;
  team_size: number | null;
  lead: string | null;
  due_date: string | null;
  milestones: Project["milestones"] | null;
};

function toProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    opportunityId: row.opportunity_id ?? "",
    status: (row.status as Project["status"]) ?? "active",
    health: (row.health as Project["health"]) ?? "on_track",
    progress: row.progress ?? 0,
    teamSize: row.team_size ?? 1,
    lead: row.lead ?? "—",
    dueDate: row.due_date ? new Date(row.due_date) : new Date(),
    milestones: row.milestones ?? [],
  };
}

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("procureai_projects")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data || data.length === 0) {
    if (error) console.warn("Falling back to sample projects:", error.message);
    return [];
  }
  return (data as ProjectRow[]).map(toProject);
}

// ---- Proposals ----

type ProposalRow = {
  id: string;
  title: string;
  opportunity_id: string | null;
  due_date: string | null;
  owner: string | null;
  sections: ProposalSection[] | null;
};

function toProposal(row: ProposalRow): Proposal {
  return {
    id: row.id,
    title: row.title,
    opportunityId: row.opportunity_id ?? "",
    dueDate: row.due_date ? new Date(row.due_date) : new Date(),
    owner: row.owner ?? "—",
    sections: row.sections ?? [],
  };
}

export async function fetchProposals(): Promise<Proposal[]> {
  const { data, error } = await supabase
    .from("procureai_proposals")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data || data.length === 0) {
    if (error) console.warn("Falling back to sample proposals:", error.message);
    return [];
  }
  return (data as ProposalRow[]).map(toProposal);
}

export async function persistProposalSections(id: string, sections: ProposalSection[]) {
  const { error } = await supabase.from("procureai_proposals").update({ sections }).eq("id", id);
  if (error) console.warn("Couldn't persist proposal sections:", error.message);
}

/* ---------------------------------------------------------------------------
 * Workspace tables: notifications, documents, calendar, integrations, activity,
 * API keys, profile and organisation. All org-scoped by row-level security.
 * ------------------------------------------------------------------------- */

type WsRow = Record<string, unknown>;

const wsStr = (v: unknown, fallback = "") => (typeof v === "string" && v ? v : fallback);
const wsNum = (v: unknown, fallback = 0) => (typeof v === "number" ? v : fallback);

async function selectRows(view: string, orderBy = "created_at", ascending = false) {
  const { data, error } = await supabase.from(view).select("*").order(orderBy, { ascending });
  if (error) {
    console.error(`Failed to load ${view}:`, error.message);
    return [] as WsRow[];
  }
  return (data ?? []) as unknown as WsRow[];
}

export type ProcureDashboard = {
  months: {
    label: string;
    monthStart: string;
    discovered: number;
    won: number;
    lost: number;
    wonValue: number;
  }[];
  stages: { label: string; value: number; amount: number }[];
  funnel: { label: string; value: number }[];
  avgCycleDays: number | null;
  kpis: {
    openCount: number;
    openValue: number;
    weightedValue: number;
    wonValue: number;
    winRate: number | null;
    dueSoon: number;
    proposals: number;
    openTasks: number;
    customers: number;
    projects: number;
  };
};

export const EMPTY_PROCURE_DASHBOARD: ProcureDashboard = {
  months: [],
  stages: [],
  funnel: [],
  avgCycleDays: null,
  kpis: {
    openCount: 0,
    openValue: 0,
    weightedValue: 0,
    wonValue: 0,
    winRate: null,
    dueSoon: 0,
    proposals: 0,
    openTasks: 0,
    customers: 0,
    projects: 0,
  },
};

export async function fetchProcureDashboard(): Promise<ProcureDashboard> {
  const { data, error } = await supabase.rpc("procureai_dashboard");
  if (error || !data || (data as WsRow)["error"]) {
    if (error) console.error("Failed to load dashboard metrics:", error.message);
    return EMPTY_PROCURE_DASHBOARD;
  }
  return data as unknown as ProcureDashboard;
}

export async function fetchNotifications() {
  return (await selectRows("procureai_notifications")).map((r) => ({
    id: String(r["id"]),
    title: wsStr(r["title"]),
    message: wsStr(r["body"]),
    type: (wsStr(r["kind"], "info") as "info" | "success" | "warning" | "deadline") ?? "info",
    read: r["read_at"] != null,
    createdAt: new Date(String(r["created_at"])),
  }));
}

export async function persistNotificationRead(id: string, read: boolean) {
  await supabase
    .from("procureai_notifications")
    .update({ read_at: read ? new Date().toISOString() : null })
    .eq("id", id);
}

export async function persistAllNotificationsRead() {
  await supabase
    .from("procureai_notifications")
    .update({ read_at: new Date().toISOString() })
    .is("read_at", null);
}

export async function fetchDocuments() {
  return (await selectRows("procureai_documents")).map((r) => ({
    id: String(r["id"]),
    name: wsStr(r["name"]),
    kind: wsStr(r["kind"], "other"),
    sizeKb: Math.round(wsNum(r["size_bytes"]) / 1024),
    uploadedAt: new Date(String(r["created_at"])),
    uploadedBy: "",
    opportunityId: (r["opportunity_id"] as string | null) ?? undefined,
    status: "ready",
    pages: 0,
    tags: [] as string[],
  }));
}

export async function fetchCalendarEvents() {
  return (await selectRows("procureai_calendar_events", "starts_at", true)).map((r) => ({
    id: String(r["id"]),
    title: wsStr(r["title"]),
    date: new Date(String(r["starts_at"])),
    type: wsStr(r["kind"], "milestone"),
    detail: wsStr(r["notes"]),
  }));
}

export async function fetchIntegrations() {
  await supabase.rpc("procureai_sync_integration_catalogue");
  return (await selectRows("procureai_integrations", "provider", true)).map((r) => ({
    id: String(r["id"]),
    name: wsStr(r["provider"]),
    category: wsStr(r["category"]),
    description: wsStr(r["description"]),
    status: wsStr(r["status"], "available"),
  }));
}

export async function setIntegrationStatus(id: string, status: string) {
  const { error } = await supabase
    .from("procureai_integrations")
    .update({ status, connected_at: status === "connected" ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) throw error;
}

export async function fetchActivity() {
  return (await selectRows("procureai_activity")).slice(0, 12).map((r) => ({
    id: String(r["id"]),
    actor: wsStr(r["actor"]),
    action: wsStr(r["action"]),
    kind: wsStr(r["kind"], "team"),
    createdAt: new Date(String(r["created_at"])),
  }));
}

export async function fetchTasks() {
  return (await selectRows("procureai_tasks", "due_date", true)).map((r) => ({
    id: String(r["id"]),
    title: wsStr(r["title"]),
    status: wsStr(r["status"], "todo"),
    priority: wsStr(r["priority"], "medium"),
    assignee: wsStr(r["assignee"]),
    dueDate: r["due_date"] ? new Date(String(r["due_date"])) : null,
    completed: r["completed_at"] != null,
  }));
}

export async function fetchProfile() {
  const { data, error } = await supabase.from("procureai_profiles").select("*").maybeSingle();
  if (error || !data) return null;
  const r = data as WsRow;
  return {
    id: String(r["id"]),
    name: wsStr(r["full_name"], wsStr(r["email"])),
    email: wsStr(r["email"]),
    role: wsStr(r["role"], "member"),
    title: wsStr(r["title"]),
  };
}

export async function updateProfile(patch: Record<string, unknown>) {
  const { data: me } = await supabase.auth.getUser();
  if (!me.user) return;
  const { error } = await supabase.from("procureai_profiles").update(patch).eq("id", me.user.id);
  if (error) throw error;
}

export async function fetchOrganization() {
  const { data, error } = await supabase.from("procureai_organizations").select("*").maybeSingle();
  if (error || !data) return null;
  const r = data as WsRow;
  return {
    id: String(r["id"]),
    name: wsStr(r["name"]),
    plan: wsStr(r["plan"], "Starter"),
    seats: wsNum(r["seats"], 5),
  };
}

export async function fetchApiKeys() {
  return (await selectRows("procureai_api_keys"))
    .filter((r) => r["revoked_at"] == null)
    .map((r) => ({
      id: String(r["id"]),
      name: wsStr(r["name"]),
      prefix: wsStr(r["prefix"]),
      createdAt: new Date(String(r["created_at"])),
      lastUsedAt: r["last_used_at"] ? new Date(String(r["last_used_at"])) : null,
    }));
}

/** Returns the plaintext secret exactly once — only its hash is stored. */
export async function createApiKey(name: string, env: "live" | "test" = "live") {
  const { data, error } = await supabase.rpc("procureai_create_api_key", {
    p_name: name,
    p_env: env,
  });
  if (error) throw error;
  return data as { id: string; name: string; prefix: string; secret: string };
}

export async function revokeApiKey(id: string) {
  const { error } = await supabase.rpc("procureai_revoke_api_key", { p_id: id });
  if (error) throw error;
}
