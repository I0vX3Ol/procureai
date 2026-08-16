/**
 * Marketing copy for the public site. This is product positioning written by
 * us — it is not customer data and makes no claims about usage or results.
 */

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
