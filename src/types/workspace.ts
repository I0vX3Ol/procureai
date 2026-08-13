export type DocumentKind = 'rfp' | 'contract' | 'proposal' | 'attachment' | 'past_performance'

export type AnalysisStatus = 'pending' | 'analyzing' | 'complete' | 'failed'

export interface ProcurementDocument {
  id: string
  name: string
  kind: DocumentKind
  sizeKb: number
  uploadedAt: Date
  uploadedBy: string
  opportunityId?: string
  status: AnalysisStatus
  pages: number
  summary?: string
  tags: string[]
}

export interface ProposalSection {
  id: string
  title: string
  guidance: string
  wordTarget: number
  content: string
  status: 'not_started' | 'drafting' | 'review' | 'complete'
}

export interface Proposal {
  id: string
  title: string
  opportunityId: string
  dueDate: Date
  owner: string
  sections: ProposalSection[]
}

export interface CustomerContact {
  id: string
  name: string
  title: string
  email: string
  phone: string
}

export interface CustomerActivity {
  id: string
  summary: string
  date: Date
  type: 'meeting' | 'email' | 'award' | 'submission' | 'note'
}

export interface Customer {
  id: string
  name: string
  sector: 'federal' | 'state_local' | 'enterprise' | 'education'
  status: 'active' | 'prospect' | 'dormant'
  location: string
  relationshipOwner: string
  lifetimeValue: number
  openOpportunityIds: string[]
  projectIds: string[]
  contacts: CustomerContact[]
  activity: CustomerActivity[]
}

export type CalendarEventType = 'opportunity' | 'proposal' | 'milestone' | 'task'

export interface CalendarEvent {
  id: string
  title: string
  date: Date
  type: CalendarEventType
  detail: string
  owner?: string
}

export type IntegrationStatus = 'connected' | 'available' | 'error'

export interface Integration {
  id: string
  name: string
  category: 'data_source' | 'crm' | 'storage' | 'communication' | 'ai'
  description: string
  status: IntegrationStatus
  lastSync?: Date
  docsUrl: string
  requiresBackend: boolean
}
