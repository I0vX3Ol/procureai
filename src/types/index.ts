export type OpportunityStatus =
  | 'discovered'
  | 'qualified'
  | 'in_progress'
  | 'submitted'
  | 'won'
  | 'lost'

export type OpportunityType = 'rfp' | 'rfq' | 'government' | 'enterprise' | 'vendor_registration'

export type PipelineStage =
  | 'discovery'
  | 'qualification'
  | 'proposal'
  | 'review'
  | 'submitted'
  | 'awarded'

export type UserRole = 'owner' | 'admin' | 'member' | 'viewer'

export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
  role: UserRole
}

export interface Organization {
  id: string
  name: string
  slug: string
  plan: 'starter' | 'professional' | 'enterprise'
  memberCount: number
}

export interface Opportunity {
  id: string
  title: string
  agency: string
  type: OpportunityType
  status: OpportunityStatus
  stage: PipelineStage
  value: number
  fitScore: number
  deadline: Date
  location: string
  tags: string[]
  description: string
  requirements: string[]
  riskLevel: 'low' | 'medium' | 'high'
}

export interface Project {
  id: string
  name: string
  opportunityId: string
  status: 'active' | 'on_hold' | 'completed'
  progress: number
  teamSize: number
  dueDate: Date
}

export interface Task {
  id: string
  title: string
  dueDate: Date
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  assignee?: string
  opportunityId?: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'deadline'
  read: boolean
  createdAt: Date
}

export interface AIActivity {
  id: string
  action: string
  target: string
  timestamp: Date
  type: 'analysis' | 'generation' | 'extraction' | 'recommendation'
}

export interface DashboardMetrics {
  pipelineValue: number
  pipelineChange: number
  winRate: number
  winRateChange: number
  activeOpportunities: number
  upcomingDeadlines: number
  revenueWon: number
  revenueChange: number
}

export interface ChartDataPoint {
  label: string
  value: number
  secondary?: number
}

export interface NavItem {
  title: string
  href: string
  icon: string
  badge?: string | number
  children?: NavItem[]
}
