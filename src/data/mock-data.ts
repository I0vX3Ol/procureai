import type {
  AIActivity,
  AIRecommendation,
  ChartDataPoint,
  Notification,
  Opportunity,
  Project,
  Task,
  User,
} from "@/types";

export const currentUser: User = {
  id: "user-1",
  name: "Alex Chen",
  email: "alex@acme-procurement.com",
  role: "admin",
};

/**
 * Period-over-period deltas. Absolute metric values are derived from the
 * opportunity portfolio in `@/lib/metrics` so every surface agrees.
 */
export const metricTrends = {
  pipelineChange: 12.4,
  winRateChange: 2.1,
  revenueChange: 18.6,
  opportunityChange: 8.2,
};

export const opportunities: Opportunity[] = [
  {
    id: "opp-1",
    title: "Enterprise Cloud Infrastructure Modernization",
    agency: "Department of Veterans Affairs",
    type: "government",
    status: "in_progress",
    stage: "proposal",
    value: 2_400_000,
    fitScore: 92,
    probability: 55,
    deadline: new Date("2026-09-15"),
    postedAt: new Date("2026-07-01"),
    owner: "Alex Chen",
    solicitationNumber: "36C10B26R0114",
    naicsCode: "541512",
    location: "Washington, DC",
    tags: ["Cloud", "FedRAMP", "Infrastructure"],
    description:
      "Multi-year contract for cloud migration and infrastructure modernization across VA facilities nationwide.",
    requirements: ["FedRAMP High", "CMMC Level 2", "Past performance in federal cloud"],
    riskLevel: "medium",
    documentIds: ["doc-1"],
    proposalId: "prop-1",
    notes: [
      {
        id: "note-1",
        author: "Alex Chen",
        body: "Incumbent has held this since 2019. Win theme must lead with transition risk reduction and the 15% steady-state cost takeout.",
        createdAt: new Date("2026-07-12T14:20:00"),
      },
      {
        id: "note-2",
        author: "Priya Raman",
        body: "Confirmed our FedRAMP High ATO covers all three regions named in Section C.3.",
        createdAt: new Date("2026-08-02T09:10:00"),
      },
    ],
    timeline: [
      {
        id: "tl-1-1",
        label: "Solicitation released",
        date: new Date("2026-07-01"),
        complete: true,
      },
      {
        id: "tl-1-2",
        label: "Bid / no-bid decision",
        date: new Date("2026-07-10"),
        detail: "Bid approved by capture board.",
        complete: true,
      },
      {
        id: "tl-1-3",
        label: "Questions due",
        date: new Date("2026-08-01"),
        complete: true,
      },
      {
        id: "tl-1-4",
        label: "Pink team review",
        date: new Date("2026-08-24"),
        complete: false,
      },
      {
        id: "tl-1-5",
        label: "Red team review",
        date: new Date("2026-09-02"),
        complete: false,
      },
      { id: "tl-1-6", label: "Proposal due", date: new Date("2026-09-15"), complete: false },
    ],
  },
  {
    id: "opp-2",
    title: "Cybersecurity Operations Center Services",
    agency: "State of California",
    type: "rfp",
    status: "qualified",
    stage: "qualification",
    value: 890_000,
    fitScore: 87,
    probability: 40,
    deadline: new Date("2026-08-28"),
    postedAt: new Date("2026-07-18"),
    owner: "Priya Raman",
    solicitationNumber: "CA-DTS-2026-0472",
    naicsCode: "541519",
    location: "Sacramento, CA",
    tags: ["Cybersecurity", "SOC", "State"],
    description:
      "24/7 SOC services including threat detection, incident response, and compliance reporting.",
    requirements: ["SOC 2 Type II", "CISSP certified staff", "State vendor registration"],
    riskLevel: "low",
    documentIds: ["doc-2"],
    notes: [
      {
        id: "note-3",
        author: "Priya Raman",
        body: "State prefers in-state analysts. Sacramento delivery center gives us a scoring edge on Factor 3.",
        createdAt: new Date("2026-07-24T11:00:00"),
      },
    ],
    timeline: [
      {
        id: "tl-2-1",
        label: "Solicitation released",
        date: new Date("2026-07-18"),
        complete: true,
      },
      { id: "tl-2-2", label: "Capability demo", date: new Date("2026-07-22"), complete: true },
      { id: "tl-2-3", label: "Questions due", date: new Date("2026-08-20"), complete: false },
      { id: "tl-2-4", label: "Proposal due", date: new Date("2026-08-28"), complete: false },
    ],
  },
  {
    id: "opp-3",
    title: "Healthcare IT Staff Augmentation",
    agency: "Kaiser Permanente",
    type: "enterprise",
    status: "discovered",
    stage: "discovery",
    value: 1_200_000,
    fitScore: 78,
    probability: 20,
    deadline: new Date("2026-10-01"),
    postedAt: new Date("2026-08-04"),
    owner: "Jordan Vale",
    solicitationNumber: "KP-RFP-2026-118",
    naicsCode: "541511",
    location: "Oakland, CA",
    tags: ["Healthcare", "Staff Aug", "Epic"],
    description: "Enterprise RFP for IT staff augmentation supporting Epic EHR implementation.",
    requirements: ["Epic certification", "HIPAA compliance", "Minimum 50 FTE capacity"],
    riskLevel: "medium",
    documentIds: ["doc-3"],
    notes: [],
    timeline: [
      { id: "tl-3-1", label: "Intro call", date: new Date("2026-08-04"), complete: true },
      {
        id: "tl-3-2",
        label: "RFP release expected",
        date: new Date("2026-09-01"),
        complete: false,
      },
      { id: "tl-3-3", label: "Proposal due", date: new Date("2026-10-01"), complete: false },
    ],
  },
  {
    id: "opp-4",
    title: "Municipal Fleet Management System",
    agency: "City of Austin",
    type: "rfq",
    status: "submitted",
    stage: "submitted",
    value: 340_000,
    fitScore: 95,
    probability: 70,
    deadline: new Date("2026-07-20"),
    postedAt: new Date("2026-06-05"),
    owner: "Priya Raman",
    solicitationNumber: "COA-RFQ-8842",
    naicsCode: "541511",
    location: "Austin, TX",
    tags: ["SaaS", "Fleet", "Municipal"],
    description: "RFQ for cloud-based fleet management and maintenance tracking platform.",
    requirements: ["Local vendor preference", "API integration", "Mobile app"],
    riskLevel: "low",
    documentIds: ["doc-5"],
    notes: [
      {
        id: "note-4",
        author: "Priya Raman",
        body: "Award notice received. Kickoff scheduled with fleet services for late August.",
        createdAt: new Date("2026-07-16T08:45:00"),
      },
    ],
    timeline: [
      { id: "tl-4-1", label: "RFQ released", date: new Date("2026-06-05"), complete: true },
      { id: "tl-4-2", label: "Quote submitted", date: new Date("2026-07-18"), complete: true },
      { id: "tl-4-3", label: "Award announced", date: new Date("2026-07-20"), complete: true },
    ],
  },
  {
    id: "opp-5",
    title: "AI-Powered Document Processing Platform",
    agency: "NASA",
    type: "government",
    status: "in_progress",
    stage: "review",
    value: 1_800_000,
    fitScore: 88,
    probability: 60,
    deadline: new Date("2026-08-05"),
    postedAt: new Date("2026-06-20"),
    owner: "Jordan Vale",
    solicitationNumber: "80MSFC26R0031",
    naicsCode: "541715",
    location: "Remote",
    tags: ["AI/ML", "Document Processing", "Federal"],
    description: "Development of AI platform for automated document classification and extraction.",
    requirements: ["NIST 800-171", "AI/ML expertise", "SBIR Phase III eligible"],
    riskLevel: "high",
    documentIds: ["doc-4"],
    notes: [
      {
        id: "note-5",
        author: "Jordan Vale",
        body: "Color team flagged the staffing plan as the weakest volume — pricing alignment still open.",
        createdAt: new Date("2026-08-08T16:40:00"),
      },
    ],
    timeline: [
      {
        id: "tl-5-1",
        label: "Solicitation released",
        date: new Date("2026-06-20"),
        complete: true,
      },
      {
        id: "tl-5-2",
        label: "Draft volumes complete",
        date: new Date("2026-08-08"),
        complete: true,
      },
      { id: "tl-5-3", label: "Color team review", date: new Date("2026-08-12"), complete: true },
      { id: "tl-5-4", label: "Submission", date: new Date("2026-08-05"), complete: false },
    ],
  },
  {
    id: "opp-6",
    title: "Statewide Broadband Deployment Program Support",
    agency: "Commonwealth of Virginia",
    type: "rfp",
    status: "qualified",
    stage: "qualification",
    value: 3_100_000,
    fitScore: 71,
    probability: 30,
    deadline: new Date("2026-10-14"),
    postedAt: new Date("2026-08-01"),
    owner: "Alex Chen",
    solicitationNumber: "VA-DHCD-26-009",
    naicsCode: "541611",
    location: "Richmond, VA",
    tags: ["Broadband", "Program Management", "State"],
    description:
      "Program management and technical assistance for statewide broadband grant administration.",
    requirements: [
      "PMP certified program lead",
      "Grant administration experience",
      "State registration",
    ],
    riskLevel: "medium",
    documentIds: [],
    notes: [],
    timeline: [
      {
        id: "tl-6-1",
        label: "Solicitation released",
        date: new Date("2026-08-01"),
        complete: true,
      },
      { id: "tl-6-2", label: "Questions due", date: new Date("2026-09-05"), complete: false },
      { id: "tl-6-3", label: "Proposal due", date: new Date("2026-10-14"), complete: false },
    ],
  },
  {
    id: "opp-7",
    title: "Enterprise Data Warehouse Consolidation",
    agency: "Mercy Health System",
    type: "enterprise",
    status: "discovered",
    stage: "discovery",
    value: 760_000,
    fitScore: 64,
    probability: 15,
    deadline: new Date("2026-11-06"),
    postedAt: new Date("2026-08-10"),
    owner: "Sam Rivera",
    solicitationNumber: "MHS-2026-DW-04",
    naicsCode: "541512",
    location: "St. Louis, MO",
    tags: ["Data", "Healthcare", "Migration"],
    description:
      "Consolidation of six regional data warehouses into a single governed analytics platform.",
    requirements: [
      "HIPAA compliance",
      "Snowflake or Databricks experience",
      "Data governance framework",
    ],
    riskLevel: "medium",
    documentIds: [],
    notes: [],
    timeline: [
      {
        id: "tl-7-1",
        label: "Opportunity discovered",
        date: new Date("2026-08-10"),
        complete: true,
      },
      {
        id: "tl-7-2",
        label: "Bid / no-bid decision",
        date: new Date("2026-09-12"),
        complete: false,
      },
      { id: "tl-7-3", label: "Proposal due", date: new Date("2026-11-06"), complete: false },
    ],
  },
  {
    id: "opp-8",
    title: "Zero Trust Network Architecture Implementation",
    agency: "Department of Energy",
    type: "government",
    status: "won",
    stage: "awarded",
    value: 1_450_000,
    fitScore: 90,
    probability: 100,
    deadline: new Date("2026-05-29"),
    postedAt: new Date("2026-03-02"),
    owner: "Alex Chen",
    solicitationNumber: "89303026REM000117",
    naicsCode: "541519",
    location: "Oak Ridge, TN",
    tags: ["Zero Trust", "Federal", "Security"],
    description:
      "Design and implementation of zero trust network architecture across three national laboratory sites.",
    requirements: ["Q clearance staff", "NIST 800-207 alignment", "Federal past performance"],
    riskLevel: "low",
    documentIds: [],
    notes: [
      {
        id: "note-6",
        author: "Alex Chen",
        body: "Won on technical merit — evaluators cited the phased enforcement model as the discriminator.",
        createdAt: new Date("2026-06-30T10:00:00"),
      },
    ],
    timeline: [
      {
        id: "tl-8-1",
        label: "Solicitation released",
        date: new Date("2026-03-02"),
        complete: true,
      },
      { id: "tl-8-2", label: "Proposal submitted", date: new Date("2026-05-29"), complete: true },
      { id: "tl-8-3", label: "Award announced", date: new Date("2026-06-28"), complete: true },
    ],
  },
  {
    id: "opp-9",
    title: "Legacy Mainframe Application Rehosting",
    agency: "Social Security Administration",
    type: "government",
    status: "lost",
    stage: "submitted",
    value: 2_050_000,
    fitScore: 58,
    probability: 0,
    deadline: new Date("2026-04-17"),
    postedAt: new Date("2026-01-20"),
    owner: "Jordan Vale",
    solicitationNumber: "SSA-RFP-26-1043",
    naicsCode: "541512",
    location: "Baltimore, MD",
    tags: ["Mainframe", "Modernization", "Federal"],
    description: "Rehosting of COBOL benefit-processing applications to a supported cloud runtime.",
    requirements: [
      "COBOL modernization past performance",
      "FedRAMP Moderate",
      "Section 508 conformance",
    ],
    riskLevel: "high",
    documentIds: [],
    notes: [
      {
        id: "note-7",
        author: "Jordan Vale",
        body: "Lost on price — 18% above the awardee. Debrief noted our technical score was second highest.",
        createdAt: new Date("2026-05-20T15:30:00"),
      },
    ],
    timeline: [
      {
        id: "tl-9-1",
        label: "Solicitation released",
        date: new Date("2026-01-20"),
        complete: true,
      },
      { id: "tl-9-2", label: "Proposal submitted", date: new Date("2026-04-17"), complete: true },
      { id: "tl-9-3", label: "Debrief received", date: new Date("2026-05-20"), complete: true },
    ],
  },
];

export const projects: Project[] = [
  {
    id: "proj-1",
    name: "VA Cloud Migration Proposal",
    opportunityId: "opp-1",
    status: "active",
    health: "on_track",
    progress: 68,
    teamSize: 6,
    lead: "Alex Chen",
    dueDate: new Date("2026-09-01"),
    milestones: [
      {
        id: "ms-1-1",
        label: "Compliance matrix complete",
        dueDate: new Date("2026-08-08"),
        complete: true,
      },
      { id: "ms-1-2", label: "Pink team review", dueDate: new Date("2026-08-24"), complete: false },
      { id: "ms-1-3", label: "Red team review", dueDate: new Date("2026-09-02"), complete: false },
    ],
  },
  {
    id: "proj-2",
    name: "CA SOC Qualification",
    opportunityId: "opp-2",
    status: "active",
    health: "at_risk",
    progress: 42,
    teamSize: 3,
    lead: "Priya Raman",
    dueDate: new Date("2026-08-15"),
    milestones: [
      {
        id: "ms-2-1",
        label: "Vendor registration renewed",
        dueDate: new Date("2026-06-12"),
        complete: true,
      },
      {
        id: "ms-2-2",
        label: "Staffing letters signed",
        dueDate: new Date("2026-08-14"),
        complete: false,
      },
      {
        id: "ms-2-3",
        label: "Price volume complete",
        dueDate: new Date("2026-08-22"),
        complete: false,
      },
    ],
  },
  {
    id: "proj-3",
    name: "NASA AI Platform Response",
    opportunityId: "opp-5",
    status: "active",
    health: "off_track",
    progress: 85,
    teamSize: 8,
    lead: "Jordan Vale",
    dueDate: new Date("2026-07-28"),
    milestones: [
      {
        id: "ms-3-1",
        label: "Technical volume draft",
        dueDate: new Date("2026-08-08"),
        complete: true,
      },
      { id: "ms-3-2", label: "Color team review", dueDate: new Date("2026-08-12"), complete: true },
      {
        id: "ms-3-3",
        label: "Pricing alignment",
        dueDate: new Date("2026-08-16"),
        complete: false,
      },
    ],
  },
  {
    id: "proj-4",
    name: "DOE Zero Trust Delivery",
    opportunityId: "opp-8",
    status: "active",
    health: "on_track",
    progress: 22,
    teamSize: 11,
    lead: "Sam Rivera",
    dueDate: new Date("2026-12-18"),
    milestones: [
      {
        id: "ms-4-1",
        label: "Kickoff and site surveys",
        dueDate: new Date("2026-07-20"),
        complete: true,
      },
      {
        id: "ms-4-2",
        label: "Identity fabric pilot",
        dueDate: new Date("2026-09-30"),
        complete: false,
      },
      {
        id: "ms-4-3",
        label: "Enforcement wave 1",
        dueDate: new Date("2026-12-18"),
        complete: false,
      },
    ],
  },
  {
    id: "proj-5",
    name: "Austin Fleet Platform Rollout",
    opportunityId: "opp-4",
    status: "completed",
    health: "on_track",
    progress: 100,
    teamSize: 4,
    lead: "Priya Raman",
    dueDate: new Date("2026-07-25"),
    milestones: [
      { id: "ms-5-1", label: "Contract executed", dueDate: new Date("2026-07-15"), complete: true },
      {
        id: "ms-5-2",
        label: "Environment provisioned",
        dueDate: new Date("2026-07-25"),
        complete: true,
      },
    ],
  },
];

export const tasks: Task[] = [
  {
    id: "task-1",
    title: "Complete technical volume for VA RFP",
    dueDate: new Date("2026-08-14"),
    priority: "high",
    completed: false,
    assignee: "Alex Chen",
    opportunityId: "opp-1",
  },
  {
    id: "task-2",
    title: "Review compliance checklist — NASA",
    dueDate: new Date("2026-08-13"),
    priority: "high",
    completed: false,
    assignee: "Jordan Lee",
    opportunityId: "opp-5",
  },
  {
    id: "task-3",
    title: "Schedule CA SOC site visit",
    dueDate: new Date("2026-08-16"),
    priority: "medium",
    completed: false,
    assignee: "Sam Rivera",
    opportunityId: "opp-2",
  },
  {
    id: "task-4",
    title: "Update past performance references",
    dueDate: new Date("2026-08-18"),
    priority: "low",
    completed: true,
    assignee: "Alex Chen",
  },
];

export const notifications: Notification[] = [
  {
    id: "notif-1",
    title: "Deadline approaching",
    message: "NASA AI Platform RFP due in 3 days",
    type: "deadline",
    read: false,
    createdAt: new Date("2026-08-13T08:00:00"),
  },
  {
    id: "notif-2",
    title: "AI analysis complete",
    message: "Requirements extracted from VA Cloud RFP (142 pages)",
    type: "success",
    read: false,
    createdAt: new Date("2026-08-13T06:30:00"),
  },
  {
    id: "notif-3",
    title: "New opportunity match",
    message: "Healthcare IT Staff Aug — 78% fit score",
    type: "info",
    read: true,
    createdAt: new Date("2026-08-12T14:00:00"),
  },
];

export const aiActivities: AIActivity[] = [
  {
    id: "ai-1",
    action: "Extracted requirements",
    target: "VA Cloud Infrastructure RFP",
    timestamp: new Date("2026-08-13T06:30:00"),
    type: "extraction",
  },
  {
    id: "ai-2",
    action: "Generated executive summary",
    target: "NASA AI Platform Proposal",
    timestamp: new Date("2026-08-12T16:45:00"),
    type: "generation",
  },
  {
    id: "ai-3",
    action: "Risk analysis completed",
    target: "CA SOC Services RFP",
    timestamp: new Date("2026-08-12T11:20:00"),
    type: "analysis",
  },
  {
    id: "ai-4",
    action: "Recommended next action",
    target: "Kaiser Staff Aug Opportunity",
    timestamp: new Date("2026-08-11T09:00:00"),
    type: "recommendation",
  },
];

export const pipelineChartData: ChartDataPoint[] = [
  { label: "Jan", value: 2_100_000 },
  { label: "Feb", value: 2_400_000 },
  { label: "Mar", value: 2_800_000 },
  { label: "Apr", value: 3_100_000 },
  { label: "May", value: 3_600_000 },
  { label: "Jun", value: 4_200_000 },
  { label: "Jul", value: 4_850_000 },
];

export const winRateChartData: ChartDataPoint[] = [
  { label: "Q1", value: 28, secondary: 32 },
  { label: "Q2", value: 31, secondary: 29 },
  { label: "Q3", value: 34, secondary: 35 },
  { label: "Q4", value: 38, secondary: 36 },
];

export const opportunityTrendData: ChartDataPoint[] = [
  { label: "Mon", value: 12 },
  { label: "Tue", value: 8 },
  { label: "Wed", value: 15 },
  { label: "Thu", value: 11 },
  { label: "Fri", value: 18 },
  { label: "Sat", value: 4 },
  { label: "Sun", value: 2 },
];

export const enterpriseLogos = ["Deloitte", "Accenture", "Booz Allen", "SAIC", "Leidos", "CACI"];

export const testimonials = [
  {
    quote:
      "ProcureAI cut our RFP response time by 60%. The AI extraction alone saves our team 20 hours per bid.",
    author: "Sarah Mitchell",
    role: "VP of Business Development",
    company: "TechGov Solutions",
  },
  {
    quote:
      "Finally, procurement software that feels as polished as Linear. Our win rate increased 12 points in six months.",
    author: "Marcus Webb",
    role: "Director of Capture",
    company: "Federal Systems Inc.",
  },
  {
    quote:
      "The pipeline visibility and deadline tracking transformed how our 40-person BD team operates.",
    author: "Elena Rodriguez",
    role: "Chief Growth Officer",
    company: "Meridian Contracting",
  },
];

export const pricingPlans = [
  {
    name: "Starter",
    price: 499,
    description: "For small teams getting started with procurement intelligence.",
    features: [
      "Up to 5 team members",
      "50 opportunities/month",
      "AI document analysis",
      "Basic pipeline tracking",
      "Email support",
    ],
  },
  {
    name: "Professional",
    price: 999,
    description: "For growing teams managing complex bid portfolios.",
    features: [
      "Up to 25 team members",
      "Unlimited opportunities",
      "Advanced AI workspace",
      "Proposal builder",
      "Analytics & reporting",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: 1999,
    description: "For organizations with advanced security and scale requirements.",
    features: [
      "Unlimited team members",
      "Custom AI models",
      "SSO & SAML",
      "Dedicated success manager",
      "Audit logs & compliance",
      "SLA guarantee",
    ],
  },
];

export const faqItems = [
  {
    question: "How does ProcureAI discover opportunities?",
    answer:
      "ProcureAI aggregates data from SAM.gov, state procurement portals, enterprise RFP platforms, and custom feeds. Our AI continuously scans and matches opportunities to your company profile and past performance.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. ProcureAI is SOC 2 Type II certified, encrypts data at rest and in transit, and supports organization-level isolation with role-based access controls. Enterprise plans include SSO, audit logs, and custom data retention policies.",
  },
  {
    question: "Can AI write our entire proposal?",
    answer:
      "AI assists with drafting, rewriting, and compliance checking — but human review remains essential. ProcureAI is designed to accelerate your team, not replace their expertise. All AI outputs include source citations from uploaded documents.",
  },
  {
    question: "What file formats do you support?",
    answer:
      "PDF, DOCX, XLSX, CSV, and plain text. Our AI can extract requirements, deadlines, evaluation criteria, and compliance items from documents up to 500 pages.",
  },
];

/** Committed vs weighted (probability-adjusted) forecast against quota. */
export const forecastData: {
  label: string;
  committed: number;
  weighted: number;
  target: number;
}[] = [
  { label: "Q1", committed: 1_450_000, weighted: 1_180_000, target: 1_600_000 },
  { label: "Q2", committed: 2_050_000, weighted: 1_540_000, target: 1_800_000 },
  { label: "Q3", committed: 2_400_000, weighted: 1_820_000, target: 2_000_000 },
  { label: "Q4", committed: 3_100_000, weighted: 2_240_000, target: 2_400_000 },
];

/** Conversion through the capture funnel over the trailing twelve months. */
export const proposalFunnelData: { label: string; value: number }[] = [
  { label: "Discovered", value: 214 },
  { label: "Qualified", value: 96 },
  { label: "Proposal", value: 58 },
  { label: "Submitted", value: 41 },
  { label: "Awarded", value: 14 },
];

/** Median days spent in each capture stage — the cycle-time bottleneck view. */
export const cycleTimeData: ChartDataPoint[] = [
  { label: "Discovery", value: 9 },
  { label: "Qualification", value: 14 },
  { label: "Proposal", value: 27 },
  { label: "Review", value: 8 },
  { label: "Submitted", value: 42 },
];

export const aiRecommendations: AIRecommendation[] = [
  {
    id: "rec-1",
    title: "Escalate the NASA staffing plan",
    rationale:
      "Colour team scored the staffing volume lowest and pricing alignment is still open with six days to submission.",
    impact: "high",
    opportunityId: "opp-5",
    actionLabel: "Open proposal",
    actionHref: "/app/proposals",
  },
  {
    id: "rec-2",
    title: "Submit clarification questions for CA SOC",
    rationale:
      "The question window closes 20 August. Two Section 3 staffing requirements remain ambiguous.",
    impact: "medium",
    opportunityId: "opp-2",
    actionLabel: "Review opportunity",
    actionHref: "/app/opportunities",
  },
  {
    id: "rec-3",
    title: "Re-score the Mercy Health data warehouse fit",
    rationale:
      "Fit score of 64% is below your 70% bid threshold, but the NAICS and sector match your two most recent wins.",
    impact: "low",
    opportunityId: "opp-7",
    actionLabel: "Analyse in AI workspace",
    actionHref: "/app/ai",
  },
];
