/**
 * Marketing copy for the public site. This is product positioning written by
 * us — it is not customer data and makes no claims about usage or results.
 *
 * One rule governs this file: nothing here may describe behaviour the product
 * does not have today. The page used to open with "AI scans procurement
 * sources and surfaces high-fit opportunities" while the FAQ four sections
 * below said automated discovery is "on our roadmap, not in the product
 * today". Both cannot be true, and the version a buyer acts on is the one at
 * the top. Roadmap items belong in the FAQ, labelled as roadmap.
 *
 * Prices are mirrored in Stripe. If one changes, the other has to change with
 * it — see `src/server/billing/plans.ts` for how a plan resolves to a price.
 */

export type PricingPlan = {
  slug: "starter" | "professional" | "enterprise";
  name: string;
  price: number;
  description: string;
  /** Shown on the landing page — the short list. */
  features: Array<string>;
  /** Shown on /pricing — the full list, grouped. */
  detail: Array<{ group: string; items: Array<string> }>;
  bestFor: string;
  highlighted?: boolean;
};

export const pricingPlans: Array<PricingPlan> = [
  {
    slug: "starter",
    name: "Starter",
    price: 199,
    description: "For small teams running a handful of pursuits at a time.",
    bestFor: "Teams bidding roughly one to four contracts a month.",
    features: [
      "Up to 5 team members",
      "50 tracked opportunities per month",
      "AI document analysis",
      "Pipeline and deadline tracking",
      "Email support",
    ],
    detail: [
      {
        group: "Team",
        items: ["Up to 5 team members", "Role-based access (owner, member)"],
      },
      {
        group: "Pipeline",
        items: [
          "50 tracked opportunities per month",
          "Stage tracking from discovery to award",
          "Fit scoring and win-probability fields",
          "Deadline tracking with calendar view",
        ],
      },
      {
        group: "Documents and AI",
        items: [
          "AI analysis of uploaded RFPs and attachments",
          "Requirement, deadline and evaluation-criteria extraction",
          "Answers cited back to the source document",
        ],
      },
      { group: "Support", items: ["Email support"] },
    ],
  },
  {
    slug: "professional",
    name: "Professional",
    price: 299,
    description: "For capture teams managing a full bid portfolio.",
    bestFor: "Teams where more than one person touches a proposal.",
    highlighted: true,
    features: [
      "Up to 25 team members",
      "Unlimited tracked opportunities",
      "Proposal builder with AI drafting",
      "Analytics and win-rate reporting",
      "Integrations",
      "Priority support",
    ],
    detail: [
      {
        group: "Team",
        items: ["Up to 25 team members", "Role-based access", "Shared pipeline and assignments"],
      },
      {
        group: "Pipeline",
        items: [
          "Unlimited tracked opportunities",
          "Everything in Starter",
          "Customer and project records linked to pursuits",
        ],
      },
      {
        group: "Proposals",
        items: [
          "Proposal builder with section structure",
          "AI drafting and rewriting per section",
          "Compliance matrix support",
          "Progress tracking across sections",
        ],
      },
      {
        group: "Reporting",
        items: [
          "Win-rate and pipeline-velocity analytics",
          "Conversion by stage",
          "Revenue attribution across the portfolio",
        ],
      },
      { group: "Support", items: ["Priority support", "Integrations"] },
    ],
  },
  {
    slug: "enterprise",
    name: "Enterprise",
    price: 499,
    description: "For organizations running multiple capture teams.",
    bestFor: "Groups that need seat count and access control to stop being a constraint.",
    features: [
      "Unlimited team members",
      "Everything in Professional",
      "API access",
      "Activity log",
      "Dedicated onboarding",
    ],
    detail: [
      {
        group: "Team",
        items: [
          "Unlimited team members",
          "Multiple capture teams in one workspace",
          "Role-based access",
        ],
      },
      { group: "Pipeline", items: ["Everything in Professional"] },
      {
        group: "Administration",
        items: [
          "Activity log for the whole organization",
          "API access with managed keys",
          "Organization-wide settings and member management",
        ],
      },
      { group: "Support", items: ["Dedicated onboarding", "Priority support"] },
    ],
  },
];

/**
 * How the product actually works, start to finish.
 *
 * Step one used to say the AI found opportunities for you. It does not. You
 * bring the pursuit; everything after that is where the product does its work.
 */
export const workflowSteps = [
  {
    step: "01",
    title: "Add the pursuit",
    description:
      "Bring in an opportunity you are already tracking — from SAM.gov, an agency portal, a teaming partner — and record the solicitation number, agency, NAICS code and due date.",
  },
  {
    step: "02",
    title: "Analyze the documents",
    description:
      "Upload the RFP and its attachments. ProcureAI extracts requirements, submission instructions, evaluation criteria and dates, and cites the page each one came from.",
  },
  {
    step: "03",
    title: "Decide go or no-go",
    description:
      "Score fit against your past performance and capacity, set a win probability, and make the bid decision before anyone writes a word.",
  },
  {
    step: "04",
    title: "Write the response",
    description:
      "Build the proposal section by section against a compliance matrix, with AI drafting and rewriting where it saves time and human review where it matters.",
  },
  {
    step: "05",
    title: "Track the outcome",
    description:
      "Record the award decision and debrief notes, and watch win rate and pipeline velocity move over time instead of guessing.",
  },
];

export const faqItems = [
  {
    question: "Does ProcureAI find opportunities for us automatically?",
    answer:
      "No. ProcureAI is a pipeline and proposal workspace, not an opportunity feed. Your team adds the opportunities you are already tracking — from SAM.gov, an agency portal, a teaming partner, anywhere — and ProcureAI takes it from there: stage tracking, fit scoring, deadlines, and AI analysis of the documents you upload. Automated discovery is on our roadmap. It is not in the product today, and we would rather tell you that now than after you have paid for it.",
  },
  {
    question: "What does the AI actually do?",
    answer:
      "It reads the documents you upload and pulls out the things you would otherwise find by hand: requirements, submission instructions, evaluation factors, page limits and dates. It drafts and rewrites proposal sections on request. Every extraction and every generated passage points back to the source document it came from, so you can check it. It does not decide whether to bid, and it does not submit anything.",
  },
  {
    question: "Can AI write our entire proposal?",
    answer:
      "It can produce a first draft of a section. It cannot produce a submission. Evaluators score against Section M criteria, and a response that reads as generic loses on exactly the factors that decide awards. Treat the draft as a starting point that saves you the blank page, not as the deliverable.",
  },
  {
    question: "Is our bid data secure?",
    answer:
      "Data is encrypted in transit and at rest, and each organization's records are isolated at the database level by Postgres row-level security rather than by application code alone — so a bug in the app cannot expose one customer's pipeline to another. We are not SOC 2 certified. If that is a procurement requirement on your side, ask us where it stands before you commit to anything.",
  },
  {
    question: "What file formats can it read?",
    answer:
      "PDF, DOCX, XLSX, CSV and plain text, up to 500 pages per document. Scanned PDFs with no text layer will not extract cleanly — if your agency still issues those, run OCR first.",
  },
  {
    question: "What happens when the trial ends?",
    answer:
      "The 14-day trial does not ask for a card, so nothing is charged when it ends. Your workspace and every record in it stays exactly where it is. The working areas — pipeline, documents, proposals, AI analysis, analytics — ask you to pick a plan before you can open them again; your dashboard, settings and support stay available. Nothing is deleted.",
  },
];

/** Billing questions, for /pricing. Kept separate so the landing FAQ stays short. */
export const billingFaqItems = [
  {
    question: "Do you need a card to start the trial?",
    answer:
      "No. The 14-day trial starts without payment details. You enter a card when you choose to subscribe, not before.",
  },
  {
    question: "How does per-seat counting work?",
    answer:
      "Plan limits are on people in the workspace, not on named licences you have to assign. Remove someone and the seat frees up immediately.",
  },
  {
    question: "Can we change plans later?",
    answer:
      "Yes, in both directions, from the billing settings inside the app. Stripe prorates the difference on the next invoice.",
  },
  {
    question: "How do we cancel?",
    answer:
      "From billing settings. Cancellation takes effect at the end of the period you have already paid for, and you keep access until then. You can undo it before that date without contacting anyone.",
  },
  {
    question: "What shows up on our card statement?",
    answer: "NEXUDEL PROCUREAI.",
  },
  {
    question: "Do you offer annual billing or invoicing?",
    answer:
      "Not through self-serve checkout today — plans are billed monthly by card. If your organization needs annual terms or payment by invoice, get in touch before you subscribe.",
  },
];

/**
 * Security claims. Each one maps to something that exists: RLS policies on
 * every table in the `procureai` schema, the `activity` table, and the role
 * column on `profiles`. Nothing aspirational goes in this list.
 */
export const securityItems = [
  {
    title: "Encrypted in transit and at rest",
    body: "TLS on every connection, and encryption at rest on the database and file storage.",
  },
  {
    title: "Tenant isolation enforced by the database",
    body: "Every table carries a row-level security policy keyed to your organization. One customer reading another's pipeline would require a Postgres policy failure, not just an application bug.",
  },
  {
    title: "Role-based access inside your workspace",
    body: "Owners manage members, billing and organization settings. Members work the pipeline. Access is checked server-side on every request.",
  },
  {
    title: "Activity log",
    body: "Who did what, and when, recorded per organization and readable by owners.",
  },
  {
    title: "Secrets never reach the browser",
    body: "API keys and service credentials live in the server runtime only. The build fails if a server-side secret is ever found in the client bundle.",
  },
  {
    title: "Payments handled by Stripe",
    body: "Card details go to Stripe directly and are never seen by, or stored on, our servers.",
  },
];
