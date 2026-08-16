import { supabase } from "@/lib/supabase";
import { opportunities as sampleOpportunities, projects as sampleProjects } from "@/data/mock-data";
import { customers as sampleCustomers, proposals as sampleProposals } from "@/data/workspace-data";
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
    return sampleOpportunities;
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
    return sampleCustomers;
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
    return sampleProjects;
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
    return sampleProposals;
  }
  return (data as ProposalRow[]).map(toProposal);
}

export async function persistProposalSections(id: string, sections: ProposalSection[]) {
  const { error } = await supabase.from("procureai_proposals").update({ sections }).eq("id", id);
  if (error) console.warn("Couldn't persist proposal sections:", error.message);
}
