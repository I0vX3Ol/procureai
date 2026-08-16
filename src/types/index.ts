export type OpportunityStatus =
  "discovered" | "qualified" | "in_progress" | "submitted" | "won" | "lost";

export type OpportunityType = "rfp" | "rfq" | "government" | "enterprise" | "vendor_registration";

export type PipelineStage =
  "discovery" | "qualification" | "proposal" | "review" | "submitted" | "awarded";

export type UserRole = "owner" | "admin" | "member" | "viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: "starter" | "professional" | "enterprise";
  memberCount: number;
}

export interface OpportunityNote {
  id: string;
  author: string;
  body: string;
  createdAt: Date;
}

export interface TimelineEntry {
  id: string;
  label: string;
  date: Date;
  detail?: string;
  complete: boolean;
}

export interface Opportunity {
  id: string;
  title: string;
  agency: string;
  type: OpportunityType;
  status: OpportunityStatus;
  stage: PipelineStage;
  value: number;
  fitScore: number;
  /** Probability of win, 0–100. Drives the weighted forecast. */
  probability: number;
  deadline: Date;
  postedAt: Date;
  owner: string;
  solicitationNumber: string;
  naicsCode: string;
  location: string;
  tags: string[];
  description: string;
  requirements: string[];
  riskLevel: "low" | "medium" | "high";
  notes: OpportunityNote[];
  timeline: TimelineEntry[];
  documentIds: string[];
  proposalId?: string;
}

export interface ProjectMilestone {
  id: string;
  label: string;
  dueDate: Date;
  complete: boolean;
}

export interface Project {
  id: string;
  name: string;
  opportunityId: string;
  status: "active" | "on_hold" | "completed";
  /** Delivery health used for at-a-glance triage. */
  health: "on_track" | "at_risk" | "off_track";
  progress: number;
  teamSize: number;
  lead: string;
  dueDate: Date;
  milestones: ProjectMilestone[];
}

export interface Task {
  id: string;
  title: string;
  dueDate: Date;
  priority: "low" | "medium" | "high";
  completed: boolean;
  assignee?: string;
  opportunityId?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "deadline";
  read: boolean;
  createdAt: Date;
}

export interface AIActivity {
  id: string;
  action: string;
  target: string;
  timestamp: Date;
  type: "analysis" | "generation" | "extraction" | "recommendation";
}

export interface AIRecommendation {
  id: string;
  title: string;
  rationale: string;
  impact: "high" | "medium" | "low";
  opportunityId?: string;
  actionLabel: string;
  actionHref: string;
}

export interface DashboardMetrics {
  pipelineValue: number;
  winRate: number;
  activeOpportunities: number;
  upcomingDeadlines: number;
  revenueWon: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondary?: number;
}

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string | number;
  children?: NavItem[];
}
