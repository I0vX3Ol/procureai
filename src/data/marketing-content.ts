/**
 * Marketing copy for the public site. This is product positioning written by
 * us — it is not customer data and makes no claims about usage or results.
 */

export const pricingPlans = [
  {
    name: "Starter",
    price: 199,
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
    price: 299,
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
    price: 499,
    description: "For organizations with advanced security and scale requirements.",
    features: [
      "Unlimited team members",
      "Advanced AI workspace",
      "Dedicated success manager",
      "Activity log",
      "Priority support",
    ],
  },
];

export const faqItems = [
  {
    question: "Does ProcureAI find opportunities for us automatically?",
    answer:
      "Not yet — ProcureAI is a pipeline and proposal workspace, not an opportunity feed. Your team adds the opportunities you are already tracking (from SAM.gov, an agency portal, a referral, anywhere), and ProcureAI takes it from there: stage tracking, fit scoring, deadlines, and AI-assisted analysis of the documents you upload. Automated opportunity discovery is on our roadmap, not in the product today.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Your data is encrypted at rest and in transit, and every organisation's data is isolated at the database level — one company can never read another's records, enforced by Postgres row-level security rather than application code alone. We are not yet SOC 2 certified; if that is a requirement for your organisation, tell us and we will let you know where that stands before you commit to anything.",
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
