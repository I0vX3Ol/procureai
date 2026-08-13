import type {
  AIActivity,
  ChartDataPoint,
  DashboardMetrics,
  Notification,
  Opportunity,
  Project,
  Task,
  User,
} from '@/types'

export const currentUser: User = {
  id: 'user-1',
  name: 'Alex Chen',
  email: 'alex@acme-procurement.com',
  role: 'admin',
}

export const dashboardMetrics: DashboardMetrics = {
  pipelineValue: 4_850_000,
  pipelineChange: 12.4,
  winRate: 34.2,
  winRateChange: 2.1,
  activeOpportunities: 47,
  upcomingDeadlines: 8,
  revenueWon: 1_240_000,
  revenueChange: 18.6,
}

export const opportunities: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Enterprise Cloud Infrastructure Modernization',
    agency: 'Department of Veterans Affairs',
    type: 'government',
    status: 'in_progress',
    stage: 'proposal',
    value: 2_400_000,
    fitScore: 92,
    deadline: new Date('2026-09-15'),
    location: 'Washington, DC',
    tags: ['Cloud', 'FedRAMP', 'Infrastructure'],
    description:
      'Multi-year contract for cloud migration and infrastructure modernization across VA facilities nationwide.',
    requirements: ['FedRAMP High', 'CMMC Level 2', 'Past performance in federal cloud'],
    riskLevel: 'medium',
  },
  {
    id: 'opp-2',
    title: 'Cybersecurity Operations Center Services',
    agency: 'State of California',
    type: 'rfp',
    status: 'qualified',
    stage: 'qualification',
    value: 890_000,
    fitScore: 87,
    deadline: new Date('2026-08-28'),
    location: 'Sacramento, CA',
    tags: ['Cybersecurity', 'SOC', 'State'],
    description: '24/7 SOC services including threat detection, incident response, and compliance reporting.',
    requirements: ['SOC 2 Type II', 'CISSP certified staff', 'State vendor registration'],
    riskLevel: 'low',
  },
  {
    id: 'opp-3',
    title: 'Healthcare IT Staff Augmentation',
    agency: 'Kaiser Permanente',
    type: 'enterprise',
    status: 'discovered',
    stage: 'discovery',
    value: 1_200_000,
    fitScore: 78,
    deadline: new Date('2026-10-01'),
    location: 'Oakland, CA',
    tags: ['Healthcare', 'Staff Aug', 'Epic'],
    description: 'Enterprise RFP for IT staff augmentation supporting Epic EHR implementation.',
    requirements: ['Epic certification', 'HIPAA compliance', 'Minimum 50 FTE capacity'],
    riskLevel: 'medium',
  },
  {
    id: 'opp-4',
    title: 'Municipal Fleet Management System',
    agency: 'City of Austin',
    type: 'rfq',
    status: 'submitted',
    stage: 'submitted',
    value: 340_000,
    fitScore: 95,
    deadline: new Date('2026-07-20'),
    location: 'Austin, TX',
    tags: ['SaaS', 'Fleet', 'Municipal'],
    description: 'RFQ for cloud-based fleet management and maintenance tracking platform.',
    requirements: ['Local vendor preference', 'API integration', 'Mobile app'],
    riskLevel: 'low',
  },
  {
    id: 'opp-5',
    title: 'AI-Powered Document Processing Platform',
    agency: 'NASA',
    type: 'government',
    status: 'in_progress',
    stage: 'review',
    value: 1_800_000,
    fitScore: 88,
    deadline: new Date('2026-08-05'),
    location: 'Remote',
    tags: ['AI/ML', 'Document Processing', 'Federal'],
    description: 'Development of AI platform for automated document classification and extraction.',
    requirements: ['NIST 800-171', 'AI/ML expertise', 'SBIR Phase III eligible'],
    riskLevel: 'high',
  },
]

export const projects: Project[] = [
  {
    id: 'proj-1',
    name: 'VA Cloud Migration Proposal',
    opportunityId: 'opp-1',
    status: 'active',
    progress: 68,
    teamSize: 6,
    dueDate: new Date('2026-09-01'),
  },
  {
    id: 'proj-2',
    name: 'CA SOC Qualification',
    opportunityId: 'opp-2',
    status: 'active',
    progress: 42,
    teamSize: 3,
    dueDate: new Date('2026-08-15'),
  },
  {
    id: 'proj-3',
    name: 'NASA AI Platform Response',
    opportunityId: 'opp-5',
    status: 'active',
    progress: 85,
    teamSize: 8,
    dueDate: new Date('2026-07-28'),
  },
]

export const tasks: Task[] = [
  {
    id: 'task-1',
    title: 'Complete technical volume for VA RFP',
    dueDate: new Date('2026-08-14'),
    priority: 'high',
    completed: false,
    assignee: 'Alex Chen',
    opportunityId: 'opp-1',
  },
  {
    id: 'task-2',
    title: 'Review compliance checklist — NASA',
    dueDate: new Date('2026-08-13'),
    priority: 'high',
    completed: false,
    assignee: 'Jordan Lee',
    opportunityId: 'opp-5',
  },
  {
    id: 'task-3',
    title: 'Schedule CA SOC site visit',
    dueDate: new Date('2026-08-16'),
    priority: 'medium',
    completed: false,
    assignee: 'Sam Rivera',
    opportunityId: 'opp-2',
  },
  {
    id: 'task-4',
    title: 'Update past performance references',
    dueDate: new Date('2026-08-18'),
    priority: 'low',
    completed: true,
    assignee: 'Alex Chen',
  },
]

export const notifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'Deadline approaching',
    message: 'NASA AI Platform RFP due in 3 days',
    type: 'deadline',
    read: false,
    createdAt: new Date('2026-08-13T08:00:00'),
  },
  {
    id: 'notif-2',
    title: 'AI analysis complete',
    message: 'Requirements extracted from VA Cloud RFP (142 pages)',
    type: 'success',
    read: false,
    createdAt: new Date('2026-08-13T06:30:00'),
  },
  {
    id: 'notif-3',
    title: 'New opportunity match',
    message: 'Healthcare IT Staff Aug — 78% fit score',
    type: 'info',
    read: true,
    createdAt: new Date('2026-08-12T14:00:00'),
  },
]

export const aiActivities: AIActivity[] = [
  {
    id: 'ai-1',
    action: 'Extracted requirements',
    target: 'VA Cloud Infrastructure RFP',
    timestamp: new Date('2026-08-13T06:30:00'),
    type: 'extraction',
  },
  {
    id: 'ai-2',
    action: 'Generated executive summary',
    target: 'NASA AI Platform Proposal',
    timestamp: new Date('2026-08-12T16:45:00'),
    type: 'generation',
  },
  {
    id: 'ai-3',
    action: 'Risk analysis completed',
    target: 'CA SOC Services RFP',
    timestamp: new Date('2026-08-12T11:20:00'),
    type: 'analysis',
  },
  {
    id: 'ai-4',
    action: 'Recommended next action',
    target: 'Kaiser Staff Aug Opportunity',
    timestamp: new Date('2026-08-11T09:00:00'),
    type: 'recommendation',
  },
]

export const pipelineChartData: ChartDataPoint[] = [
  { label: 'Jan', value: 2_100_000 },
  { label: 'Feb', value: 2_400_000 },
  { label: 'Mar', value: 2_800_000 },
  { label: 'Apr', value: 3_100_000 },
  { label: 'May', value: 3_600_000 },
  { label: 'Jun', value: 4_200_000 },
  { label: 'Jul', value: 4_850_000 },
]

export const winRateChartData: ChartDataPoint[] = [
  { label: 'Q1', value: 28, secondary: 32 },
  { label: 'Q2', value: 31, secondary: 29 },
  { label: 'Q3', value: 34, secondary: 35 },
  { label: 'Q4', value: 38, secondary: 36 },
]

export const opportunityTrendData: ChartDataPoint[] = [
  { label: 'Mon', value: 12 },
  { label: 'Tue', value: 8 },
  { label: 'Wed', value: 15 },
  { label: 'Thu', value: 11 },
  { label: 'Fri', value: 18 },
  { label: 'Sat', value: 4 },
  { label: 'Sun', value: 2 },
]

export const enterpriseLogos = [
  'Deloitte',
  'Accenture',
  'Booz Allen',
  'SAIC',
  'Leidos',
  'CACI',
]

export const testimonials = [
  {
    quote:
      'ProcureAI cut our RFP response time by 60%. The AI extraction alone saves our team 20 hours per bid.',
    author: 'Sarah Mitchell',
    role: 'VP of Business Development',
    company: 'TechGov Solutions',
  },
  {
    quote:
      'Finally, procurement software that feels as polished as Linear. Our win rate increased 12 points in six months.',
    author: 'Marcus Webb',
    role: 'Director of Capture',
    company: 'Federal Systems Inc.',
  },
  {
    quote:
      'The pipeline visibility and deadline tracking transformed how our 40-person BD team operates.',
    author: 'Elena Rodriguez',
    role: 'Chief Growth Officer',
    company: 'Meridian Contracting',
  },
]

export const pricingPlans = [
  {
    name: 'Starter',
    price: 499,
    description: 'For small teams getting started with procurement intelligence.',
    features: [
      'Up to 5 team members',
      '50 opportunities/month',
      'AI document analysis',
      'Basic pipeline tracking',
      'Email support',
    ],
  },
  {
    name: 'Professional',
    price: 999,
    description: 'For growing teams managing complex bid portfolios.',
    features: [
      'Up to 25 team members',
      'Unlimited opportunities',
      'Advanced AI workspace',
      'Proposal builder',
      'Analytics & reporting',
      'Priority support',
    ],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 1999,
    description: 'For organizations with advanced security and scale requirements.',
    features: [
      'Unlimited team members',
      'Custom AI models',
      'SSO & SAML',
      'Dedicated success manager',
      'Audit logs & compliance',
      'SLA guarantee',
    ],
  },
]

export const faqItems = [
  {
    question: 'How does ProcureAI discover opportunities?',
    answer:
      'ProcureAI aggregates data from SAM.gov, state procurement portals, enterprise RFP platforms, and custom feeds. Our AI continuously scans and matches opportunities to your company profile and past performance.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Yes. ProcureAI is SOC 2 Type II certified, encrypts data at rest and in transit, and supports organization-level isolation with role-based access controls. Enterprise plans include SSO, audit logs, and custom data retention policies.',
  },
  {
    question: 'Can AI write our entire proposal?',
    answer:
      'AI assists with drafting, rewriting, and compliance checking — but human review remains essential. ProcureAI is designed to accelerate your team, not replace their expertise. All AI outputs include source citations from uploaded documents.',
  },
  {
    question: 'What file formats do you support?',
    answer:
      'PDF, DOCX, XLSX, CSV, and plain text. Our AI can extract requirements, deadlines, evaluation criteria, and compliance items from documents up to 500 pages.',
  },
]
