/**
 * Long-form guides for the public site.
 *
 * These exist because the marketing site was a single page of 721 words. A
 * one-page site has nothing to rank with: there is no query it answers better
 * than the established competition, and no internal structure for a crawler to
 * follow. These pages target the questions capture teams actually search for,
 * and they are written to be useful whether or not the reader ever signs up.
 *
 * Content lives here rather than in the route files so the index page, the
 * footer and the related-links block all read from one list and cannot drift
 * apart. Each guide still gets its own route file — that is what puts it in
 * the generated sitemap.
 *
 * House rules for anything added here: name the real artefacts (Section L,
 * CPARS, the UCF), give numbers where numbers exist, and never imply ProcureAI
 * does something it does not. A guide that oversells the product is worth less
 * than no guide at all, because the reader finds out either way.
 */

export type GuideBlock =
  | { kind: "p"; text: string }
  | { kind: "ul"; items: Array<string> }
  | { kind: "ol"; items: Array<string> }
  | { kind: "note"; title: string; text: string }
  | { kind: "table"; head: Array<string>; rows: Array<Array<string>> };

export type GuideSection = {
  id: string;
  heading: string;
  blocks: Array<GuideBlock>;
};

export type Guide = {
  slug: string;
  /** Full page title, used for <h1> and <title>. */
  title: string;
  /** Short label for nav and footer, where the full title does not fit. */
  navLabel: string;
  description: string;
  readingMinutes: number;
  /** ISO date. Surfaced to readers and used for Article schema. */
  updated: string;
  intro: Array<string>;
  sections: Array<GuideSection>;
  /** Slugs of the other guides worth reading next. */
  related: Array<string>;
};

export const guides: Array<Guide> = [
  {
    slug: "rfp-response-process",
    title: "How to respond to an RFP: the process that keeps bids compliant",
    navLabel: "Responding to an RFP",
    description:
      "A step-by-step process for responding to a government RFP, from reading Section M first through to submitting early. Covers the Uniform Contract Format, color team reviews, and the mistakes that get proposals thrown out before they are scored.",
    readingMinutes: 9,
    updated: "2026-08-24",
    intro: [
      "Most losing proposals are not badly written. They are non-compliant, late, or answering a question the evaluator was never asked to score. Those are process failures, and process failures are fixable.",
      "This is the sequence a capture team should run for a federal RFP issued under the Uniform Contract Format. It maps onto commercial and state solicitations with different section labels but the same underlying logic: find out how you will be scored, work out whether you can win, then write to the score.",
    ],
    sections: [
      {
        id: "read-m-first",
        heading: "1. Read Section M before anything else",
        blocks: [
          {
            kind: "p",
            text: "A federal solicitation in the Uniform Contract Format runs from Section A to Section M. Two of those sections decide whether you win. Section M sets out the evaluation factors for award: what the government will score, in what order of importance, and how technical merit trades against price. Section L gives the instructions to offerors: what to submit, in what format, in how many pages, through which portal.",
          },
          {
            kind: "p",
            text: "Read M first. It tells you what the proposal is for. Then read L, which tells you what shape it has to take. Then read Section C, the statement of work, which tells you what the job actually is. Reading them in that order stops you writing an elegant response to a requirement nobody is scoring.",
          },
          {
            kind: "note",
            title: "The cross-walk that catches most gaps",
            text: "Put Section L and Section M side by side. Every evaluation factor in M should have somewhere in L where you are permitted to address it. When a factor in M has no obvious home in L, that is the ambiguity to raise in questions — not after award.",
          },
        ],
      },
      {
        id: "decide",
        heading: "2. Make the bid decision on purpose",
        blocks: [
          {
            kind: "p",
            text: "The most expensive proposal is the one you should not have written. Bid and proposal money is real, and the people spending it are the same people who would otherwise be delivering work. Decide deliberately, in a meeting, against criteria you set before you saw this particular opportunity.",
          },
          {
            kind: "p",
            text: "If the first you heard of the requirement was the RFP itself, treat that as a signal. On most competitive procurements the shaping happens months earlier, through sources sought notices, RFIs and industry days. Coming in cold is not disqualifying, but it should lower your estimate of winning rather than be quietly ignored.",
          },
          {
            kind: "p",
            text: "We wrote a longer treatment of this, including a scoring model you can copy, in the bid/no-bid guide.",
          },
        ],
      },
      {
        id: "compliance-matrix",
        heading: "3. Build the compliance matrix before you write",
        blocks: [
          {
            kind: "p",
            text: "Pull every binding requirement out of Sections L, M, C and H, and give each one a row: the requirement verbatim, where it came from, which volume and section will answer it, who owns it, and whether it is done. This document is the spine of the response. It is also the thing you hand a reviewer so they can check coverage rather than opinion.",
          },
          {
            kind: "p",
            text: "Do this before drafting, not after. A matrix built at the end is an audit. A matrix built at the start is an outline.",
          },
          {
            kind: "ul",
            items: [
              "Extract on the words that create obligations: shall, must, will, is required to.",
              "Keep the requirement text verbatim. Paraphrasing is where coverage gaps get introduced.",
              "One row per requirement, even when three of them arrive in a single sentence.",
              "Record the source section and page. You will need it during review, and again if there is a debrief.",
            ],
          },
        ],
      },
      {
        id: "questions",
        heading: "4. Ask questions before the deadline closes",
        blocks: [
          {
            kind: "p",
            text: "The question deadline usually falls well before the proposal is due, and it is often the only chance to get an ambiguity resolved on the record. Questions and answers are typically issued to all offerors by amendment, so treat them as free intelligence about what your competitors are worried about.",
          },
          {
            kind: "p",
            text: "Ask about contradictions between sections, page limits that cannot accommodate the required content, and evaluation factors with no matching submission instruction. Do not ask questions that reveal your solution.",
          },
        ],
      },
      {
        id: "volumes",
        heading: "5. Write to the volume structure you were given",
        blocks: [
          {
            kind: "p",
            text: "Section L will tell you how to split the response. A common federal structure is four volumes: Technical, Management, Past Performance, and Cost or Price. Each usually has its own page limit, and cost is almost always excluded from the technical page count.",
          },
          {
            kind: "table",
            head: ["Volume", "What it has to prove", "Common failure"],
            rows: [
              [
                "Technical",
                "That your approach meets the requirement and reduces the government's risk",
                "Describing what you will do without saying why it works",
              ],
              [
                "Management",
                "That you can staff, govern and transition the work",
                "An org chart in place of a staffing plan",
              ],
              [
                "Past Performance",
                "That you have done work of similar size, scope and complexity",
                "Citing contracts that are recent but not relevant",
              ],
              [
                "Cost / Price",
                "That your price is realistic and traceable to the technical approach",
                "A price that does not match the labour described in the technical volume",
              ],
            ],
          },
          {
            kind: "p",
            text: "Relevance beats recency on past performance. Three references at similar scope will outscore six that merely happened lately. Where the agency uses CPARS ratings, assume the evaluator will pull them, and pick citations you would be happy to have read closely.",
          },
        ],
      },
      {
        id: "reviews",
        heading: "6. Run real color team reviews",
        blocks: [
          {
            kind: "p",
            text: "Color teams only work when the reviewers are not the authors and the review has a defined question to answer. Scheduling them is not the hard part; protecting the dates when drafting slips is.",
          },
          {
            kind: "ol",
            items: [
              "Pink team — an early, incomplete draft. The question is whether the approach and structure are right, while changing them is still cheap.",
              "Red team — near-final. Reviewers score it as an evaluator would, against Section M, with the compliance matrix in hand.",
              "Gold team — final executive read for consistency, risk and sign-off. Not the moment to rewrite the solution.",
            ],
          },
          {
            kind: "note",
            title: "Give reviewers the scoresheet",
            text: "A Red team that reads for quality produces opinions. A Red team handed the Section M factors and asked to assign a rating produces findings you can act on. The difference is entirely in the brief.",
          },
        ],
      },
      {
        id: "submit",
        heading: "7. Submit early, and treat the portal as the deadline",
        blocks: [
          {
            kind: "p",
            text: "Late is not a judgement call. A proposal that arrives after the time specified in the solicitation is generally ineligible for award, and the timestamp that matters belongs to the government's system, not to your outbox.",
          },
          {
            kind: "ul",
            items: [
              "Confirm your SAM.gov registration is active and your UEI and CAGE code are current. This lapses quietly and takes days to fix.",
              "Upload a full dry run at least a day early if the portal allows it. File size caps and rejected formats are discovered at the worst possible moment.",
              "Follow file naming instructions literally, including capitalisation.",
              "Keep the submission confirmation. It is your only evidence.",
            ],
          },
        ],
      },
      {
        id: "debrief",
        heading: "8. Take the debrief, win or lose",
        blocks: [
          {
            kind: "p",
            text: "A debrief tells you how the evaluators actually read your response, which is the only reliable correction to what you assumed they would read. Record the findings against the opportunity while they are fresh. Two years of debrief notes is the cheapest competitive intelligence you will ever own.",
          },
        ],
      },
      {
        id: "where-procureai-fits",
        heading: "Where ProcureAI fits in this",
        blocks: [
          {
            kind: "p",
            text: "ProcureAI does not find the opportunity for you. You bring the solicitation. From there it does the parts of this process that are mechanical: reading the documents and pulling out requirements, dates, page limits and evaluation factors with a citation back to the page each came from; holding the pipeline so deadlines do not arrive by surprise; and giving the proposal a section structure to write against, with AI drafting where a blank page is the obstacle.",
          },
          {
            kind: "p",
            text: "The bid decision, the solution and the review are still yours. Those are the parts that win.",
          },
        ],
      },
    ],
    related: ["bid-no-bid-decision", "compliance-matrix"],
  },

  {
    slug: "bid-no-bid-decision",
    title: "The bid/no-bid decision: a scoring framework you can actually hold to",
    navLabel: "Bid/no-bid decisions",
    description:
      "A weighted scoring model for deciding which contracts to pursue, with the seven factors that predict win probability, how to set a threshold, and why a lower bid volume usually raises win rate.",
    readingMinutes: 8,
    updated: "2026-08-24",
    intro: [
      "Teams that bid everything win a smaller share of a larger number of pursuits, exhaust the people who write the proposals, and cannot tell you afterwards which decisions were wrong. Teams that bid selectively win more of what they chase.",
      "The hard part is not agreeing with that. It is having a decision you can defend at the moment someone senior wants to bid something for reasons that are not on the list. A written framework, scored before the debate, is what makes the answer hold.",
    ],
    sections: [
      {
        id: "cost",
        heading: "First, price the decision",
        blocks: [
          {
            kind: "p",
            text: "A bid costs money whether or not you win. Add up the loaded hours your capture lead, solution architects, pricers and writers will spend, plus any teaming or consultant cost. That number is what you are wagering, and it is usually larger than people expect because the hours come from senior staff.",
          },
          {
            kind: "p",
            text: "Once you can state the cost of a bid, the question stops being whether the contract is attractive. It becomes whether this wager, at this probability, beats spending the same money on the next one.",
          },
        ],
      },
      {
        id: "factors",
        heading: "The seven factors worth scoring",
        blocks: [
          {
            kind: "p",
            text: "Score each factor from 1 to 5, multiply by its weight, and total. The weights below are a reasonable default for a services business selling into federal agencies; adjust them to your own history rather than treating them as given.",
          },
          {
            kind: "table",
            head: ["Factor", "Weight", "A 5 looks like"],
            rows: [
              [
                "Customer knowledge",
                "25%",
                "You have worked with this office, know the contracting officer, and shaped the requirement through an RFI or sources sought response",
              ],
              [
                "Past performance fit",
                "20%",
                "You can cite contracts of similar scope, size and complexity, recent, with ratings you are happy to have read",
              ],
              [
                "Competitive position",
                "15%",
                "No entrenched incumbent, or an incumbent with known performance problems and a customer willing to move",
              ],
              [
                "Solution readiness",
                "15%",
                "You can staff and deliver this with people who exist today, not people you would hire on award",
              ],
              [
                "Price-to-win confidence",
                "10%",
                "You know roughly what this should cost, from history or from the prior contract's public value, and you can be there profitably",
              ],
              [
                "Contract vehicle access",
                "10%",
                "You hold the vehicle, or a teaming route onto it that is already agreed rather than hoped for",
              ],
              [
                "Capacity to bid well",
                "5%",
                "The people who would write this are not already committed to another response due the same fortnight",
              ],
            ],
          },
        ],
      },
      {
        id: "threshold",
        heading: "Set the threshold before you need it",
        blocks: [
          {
            kind: "p",
            text: "Pick the number that means yes, and pick it while no specific opportunity is on the table. A weighted score below roughly 3.0 out of 5 is a no-bid for most teams. Between 3.0 and 3.5 is a bid only if you can name the specific thing that will change before submission — a teaming agreement signed, a named programme manager committed.",
          },
          {
            kind: "note",
            title: "The rule that does the most work",
            text: "If the first you heard about the requirement was the solicitation itself, cap customer knowledge at 2. It is the single most predictive factor and the one teams most often talk themselves out of scoring honestly.",
          },
        ],
      },
      {
        id: "disqualifiers",
        heading: "Disqualifiers that override the score",
        blocks: [
          {
            kind: "p",
            text: "Some conditions mean no regardless of how attractive the rest looks. Keep this list short enough that it is actually applied.",
          },
          {
            kind: "ul",
            items: [
              "You do not meet a mandatory eligibility requirement — a set-aside you do not qualify for, a clearance level you cannot staff, a certification you do not hold.",
              "The vehicle is closed and you have no agreed route onto it.",
              "You cannot be price-competitive without a margin you would refuse if you won.",
              "Delivery would require a capability you would be building for the first time on a contract that cannot absorb the risk.",
              "The response is due inside a window where your proposal team is already committed.",
            ],
          },
        ],
      },
      {
        id: "record",
        heading: "Record the score, then check it later",
        blocks: [
          {
            kind: "p",
            text: "The framework earns its keep at the point you can compare predicted scores against outcomes. After twenty pursuits you will find at least one factor you have been weighting wrongly — commonly price-to-win confidence, which teams reliably overrate, or capacity, which they reliably ignore.",
          },
          {
            kind: "p",
            text: "Store the score against the opportunity rather than in someone's spreadsheet. A decision you cannot find again is a decision you cannot learn from.",
          },
          {
            kind: "p",
            text: "In ProcureAI this is the fit score and win-probability field on the opportunity record, kept next to the stage and the deadline. It is a place to put your judgement and find it again later. It does not generate the judgement for you, and a tool that claimed to would be selling you something.",
          },
        ],
      },
      {
        id: "volume",
        heading: "Expect bid volume to fall and win rate to rise",
        blocks: [
          {
            kind: "p",
            text: "The first quarter after adopting a threshold usually feels like retreat: fewer submissions, a thinner-looking pipeline, and someone asking why. The number to watch is not submissions. It is wins per pound of bid and proposal spend, and the direction of travel there is what justifies the discipline.",
          },
        ],
      },
    ],
    related: ["rfp-response-process", "compliance-matrix"],
  },

  {
    slug: "compliance-matrix",
    title: "How to build a compliance matrix from an RFP",
    navLabel: "Building a compliance matrix",
    description:
      "What belongs in a proposal compliance matrix, which solicitation sections to extract from, the column structure that survives a Red team review, and how to turn it into the cross-reference matrix evaluators ask for.",
    readingMinutes: 7,
    updated: "2026-08-24",
    intro: [
      "A compliance matrix is a row for every binding requirement in the solicitation, mapped to the place in your response where you answer it. It is unglamorous and it is the difference between a proposal that gets scored and one that gets set aside.",
      "Evaluators are generally not hunting for your answer. If a requirement is not where the instructions said it would be, the reasonable assumption is that it is not there at all.",
    ],
    sections: [
      {
        id: "sources",
        heading: "Where requirements come from",
        blocks: [
          {
            kind: "p",
            text: "Four sections of a Uniform Contract Format solicitation generate obligations, and they generate different kinds.",
          },
          {
            kind: "table",
            head: ["Section", "What it contains", "What it produces"],
            rows: [
              [
                "L — Instructions to Offerors",
                "How to submit: volumes, page limits, formats, deadlines",
                "Rules that make a response compliant or not",
              ],
              [
                "M — Evaluation Factors",
                "What is scored and how factors trade off",
                "The things your content has to earn points against",
              ],
              [
                "C — Statement of Work",
                "The work itself",
                "Technical obligations you must show you can meet",
              ],
              [
                "H — Special Contract Requirements",
                "Clauses specific to this procurement",
                "Conditions that are easy to miss and expensive to breach",
              ],
            ],
          },
          {
            kind: "p",
            text: "Amendments change all of the above. Re-extract when one lands rather than patching the matrix by memory.",
          },
        ],
      },
      {
        id: "extract",
        heading: "Extract on obligation words",
        blocks: [
          {
            kind: "p",
            text: "Requirements announce themselves. Search for shall, must, will, is required to, and at a minimum. Treat each as a separate row even when several arrive in one sentence — a sentence containing three shalls is three requirements, and partial coverage of it scores as a gap.",
          },
          {
            kind: "ul",
            items: [
              "Keep text verbatim. The moment you paraphrase, the matrix stops being checkable against the source.",
              "Record section and page for every row. Reviewers will ask, and so will the debrief.",
              "Flag anything conditional — requirements that apply only to certain offerors or certain task orders.",
              "Note where two sections contradict each other. That is a question for the Q&A deadline.",
            ],
          },
        ],
      },
      {
        id: "columns",
        heading: "The columns that survive contact with a review",
        blocks: [
          {
            kind: "table",
            head: ["Column", "Why it is there"],
            rows: [
              ["Requirement ID", "So people can refer to a row out loud without ambiguity"],
              ["Source", "Section and page in the solicitation or amendment"],
              ["Requirement text", "Verbatim, not summarised"],
              ["Type", "Instruction, evaluation factor, technical, or contractual"],
              ["Response location", "Volume, section and page where it is answered"],
              ["Owner", "One named person, never a team"],
              ["Status", "Not started, drafted, reviewed, complete"],
              ["Evidence", "The proof point or past-performance citation that backs the claim"],
            ],
          },
          {
            kind: "note",
            title: "One owner per row",
            text: "Rows assigned to a team are the ones that turn up unwritten at Red team. A row with a name against it has someone who notices it is missing.",
          },
        ],
      },
      {
        id: "using-it",
        heading: "Use it as the review instrument",
        blocks: [
          {
            kind: "p",
            text: "At Pink team the matrix answers one question: does every requirement have a home? At Red team it answers a harder one: is what is written there actually responsive, or does it merely mention the topic. Reviewers work down the rows rather than reading front to back, which is much closer to how the response will be evaluated.",
          },
          {
            kind: "p",
            text: "Any row still marked not started forty-eight hours before submission is a decision, not an oversight. Decide it deliberately.",
          },
        ],
      },
      {
        id: "cross-reference",
        heading: "Turn it into the cross-reference matrix",
        blocks: [
          {
            kind: "p",
            text: "Many solicitations ask for a cross-reference matrix in the response itself, showing where each requirement is addressed. If you have kept the compliance matrix properly, that deliverable is a filtered view of it rather than a new document written under deadline.",
          },
          {
            kind: "p",
            text: "Check whether it counts against your page limit. Section L usually says, and the answer is often that it does not — which makes it free, useful real estate for showing coverage.",
          },
        ],
      },
      {
        id: "tooling",
        heading: "Tooling, honestly",
        blocks: [
          {
            kind: "p",
            text: "A spreadsheet works. Plenty of winning proposals have been built on one, and a well-maintained spreadsheet beats a badly maintained tool every time.",
          },
          {
            kind: "p",
            text: "What a spreadsheet does not do is the extraction, which is the slow part: reading several hundred pages and pulling out every obligation with its page reference. That is the step ProcureAI automates — you upload the solicitation and its attachments, and it returns requirements, dates, page limits and evaluation factors, each cited back to where it came from. You still decide what is a real requirement, who owns it, and whether the answer is good. Reviewing an extracted list is a different job from building one from nothing.",
          },
        ],
      },
    ],
    related: ["rfp-response-process", "bid-no-bid-decision"],
  },
];

export function guideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
