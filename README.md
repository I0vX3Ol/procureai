# ProcureAI Polish

You are taking over the development of an existing application called ProcureAI.

GitHub repository:

https://github.com/I0vX3Ol/procure-ai

Branch:

main

The repository already contains substantial development work. Your responsibility is to finish and polish the existing ProcureAI application, not rebuild it from scratch.

PRIMARY OBJECTIVE

Take the existing ProcureAI codebase from its current state to a polished, cohesive, production-ready SaaS application.

The existing repository is the source of truth.

Do NOT:

Rebuild the application from scratch

Replace the existing architecture without a strong technical reason

Delete working functionality

Replace existing pages with generic templates

Discard the existing design system

Create superficial placeholder pages

Rewrite functioning code unnecessarily

Introduce unnecessary dependencies

Break existing routes

Replace existing functionality merely because you would implement it differently

Preserve what already works and build on it.

PHASE 1 — FULL REPOSITORY AUDIT

First inspect the entire repository before making major changes.

Analyze:

package.json

src/

public/

All routes

Route tree

React/TypeScript architecture

Components

Shared components

Layouts

Pages

Navigation

Sidebar

Header

Authentication

Theme system

State management

Mock data

AI service

API integrations

Environment configuration

TypeScript configuration

Vite configuration

Styling

Dependencies

Responsive behavior

Accessibility

Loading states

Empty states

Error states

Toast notifications

Existing TODOs

Placeholder pages

Broken imports

Dead code

Duplicate components

Runtime errors

Build errors

TypeScript errors

Understand the existing architecture before changing it.

PHASE 2 — VERIFY THE APPLICATION

Run the existing project and verify the actual application.

Run:

npm install
npm run build
npm run lint


Then run the development server and inspect the application.

Test:

Landing page

Login

Signup

Dashboard

Opportunities

Pipeline

Projects

AI Workspace

Analytics

Notifications

Every sidebar route

Every navigation link

Forms

Search

Filtering

Tables

Charts

Modals

Tabs

Dropdowns

AI interactions

Theme switching

Responsive layouts

Mobile navigation

Do not assume a feature works simply because its component exists.

Actually verify it.

PHASE 3 — PRESERVE THE EXISTING PROCUREAI PRODUCT

The current ProcureAI application is an AI-powered procurement intelligence platform.

The product should support workflows around:

Government and enterprise procurement opportunities

Opportunity discovery

Opportunity management

Sales/pipeline management

Projects

Proposal development

Documents

AI-assisted procurement workflows

Analytics

Notifications

Customers

Integrations

Preserve the existing product direction and visual identity.

Do not turn ProcureAI into a generic SaaS dashboard.

PHASE 4 — COMPLETE EVERY ROUTE

Create a complete route inventory.

For each route determine whether it is:

Complete

Partially complete

Placeholder

Broken

Missing

Then fix and complete all incomplete areas.

The previously identified incomplete areas include:

Proposal Builder

Documents

Calendar

Customers

Settings

Integrations

Do not assume those are the only incomplete areas. Inspect the repository and determine everything that still needs work.

Every intended route must provide a coherent product experience.

PHASE 5 — PROPOSAL BUILDER

Complete the Proposal Builder.

It should support:

Proposal overview

Opportunity information

Proposal sections

Section navigation

Section editing

AI-assisted section generation

AI-assisted rewriting

Save state

Progress indicators

Preview mode

Export-ready structure

Use the existing AI service architecture where appropriate.

Do not expose API keys in client-side code.

PHASE 6 — DOCUMENTS

Complete the Documents workspace.

Include:

Document list

Search

Filtering

Document metadata

Upload UI

Document preview

Analysis status

AI analysis results

Document relationships

Loading states

Empty states

Error states

If a real storage/backend is not available, create a clean service abstraction rather than pretending mock storage is production storage.

PHASE 7 — CUSTOMERS

Complete Customers.

Include:

Customer list

Search

Filtering

Customer details

Contacts

Related opportunities

Related projects

Activity/history

Status

Useful actions

Use the existing data architecture wherever appropriate.

PHASE 8 — CALENDAR

Complete Calendar functionality.

Include:

Calendar view

Upcoming deadlines

Opportunity deadlines

Proposal deadlines

Project milestones

Task deadlines

Event details

Responsive behavior

PHASE 9 — SETTINGS

Complete Settings.

Include appropriate sections for:

Profile

Organization

Appearance

Notifications

Security

Account

AI configuration

API configuration where appropriate

Never expose secrets.

PHASE 10 — INTEGRATIONS

Complete the Integrations experience.

Include:

Available integrations

Connected integrations

Connection status

Configuration

Connect/disconnect states

Integration details

Service abstractions

Do not claim an external integration is actually connected unless the underlying integration exists.

PHASE 11 — AI FUNCTIONALITY

Review the existing AI service.

Preserve existing AI functionality and improve it where necessary.

Check:

AI assistant

Document analysis

AI chat

Proposal generation

AI loading states

AI error states

Suggested prompts

Contextual AI actions

If the current implementation is mocked, preserve a clean abstraction so a secure backend can later replace it.

The intended architecture should be:

Frontend → Backend/API → AI provider

Never expose production API keys in frontend code.

PHASE 12 — UX AND INTERACTION QUALITY

Do not only make the application visually attractive.

Make the application actually usable.

Verify:

Navigation

Search

Filtering

Sorting

Forms

Validation

Tabs

Dropdowns

Modals

Buttons

State changes

Toasts

Loading states

Empty states

Error states

Theme switching

Keyboard navigation

A button should not appear functional if it does nothing.

Where a real backend is unavailable, implement the interaction against the existing mock/service architecture and clearly isolate future backend functionality.

PHASE 13 — RESPONSIVE DESIGN

Test:

Desktop

Laptop

Tablet

Mobile

Fix:

Overflow

Broken grids

Tables

Charts

Sidebar behavior

Mobile navigation

Dialog sizing

Forms

Typography

Buttons

The entire application must remain usable on small screens.

PHASE 14 — ACCESSIBILITY

Review:

Keyboard navigation

Focus states

Semantic HTML

Form labels

Button labels

Dialog accessibility

Contrast

Screen-reader-friendly controls

Do not sacrifice accessibility for appearance.

PHASE 15 — DESIGN CONSISTENCY

Audit the entire application.

Ensure consistent:

Typography

Spacing

Buttons

Cards

Tables

Forms

Modals

Status indicators

Navigation

Shadows

Borders

Radius

Light mode

Dark mode

Reuse existing shared components.

Do not create duplicate components unnecessarily.

Maintain the existing ProcureAI design language.

PHASE 16 — CODE QUALITY

Maintain the existing TypeScript architecture.

Requirements:

Strong typing

Avoid unnecessary any

Reusable components

Clean imports

No dead code

No unnecessary dependencies

Clear service abstractions

Secure environment-variable handling

Do not make unnecessary architectural changes.

PHASE 17 — PRODUCTION VERIFICATION

Before declaring the project complete:

npm run build
npm run lint


Fix ALL:

Build errors

TypeScript errors

Broken imports

Broken routes

Runtime errors

Obvious UI bugs

Then verify the major user flows manually.

Check:

Desktop

Mobile

Light mode

Dark mode

Authentication

Dashboard

Opportunities

Pipeline

Projects

AI Workspace

Analytics

Notifications

Proposal Builder

Documents

Calendar

Customers

Settings

Integrations

PHASE 18 — GITHUB

The GitHub repository is:

I0vX3Ol/procure-ai

Branch:

main

Preserve the existing Git history.

Do not force-push.

Do not reset the repository destructively.

Do not commit:

API keys

Passwords

Credentials

.env files containing secrets

Private tokens

After completing a logical development phase, review the changes and synchronize them with the connected GitHub repository.

IMPORTANT RULE

Do not stop after the audit.

If you find an error, fix it.

If you find an incomplete route, finish it.

If you find a broken interaction, repair it.

If you find inconsistent UI, correct it.

If a feature genuinely requires a backend, implement everything that can safely be implemented now and clearly isolate the backend dependency.

Do not simply give me a report of what should be done.

Actually perform the implementation.

Work incrementally and verify the application after each major phase.

DEFINITION OF DONE

ProcureAI is finished when:

Every intended route exists

No major route is a placeholder

Navigation works

Major interactions work

Proposal Builder works

Documents works

Calendar works

Customers works

Settings works

Integrations works

AI functionality works within the available architecture

Build passes

Lint passes

TypeScript passes

No obvious runtime errors remain

Desktop works

Mobile works

Light mode works

Dark mode works

Loading states exist

Empty states exist

Error states exist

Existing functionality has been preserved

The product feels cohesive

The codebase remains maintainable

No secrets are exposed

Start by inspecting the existing ProcureAI repository and running the application.

Then complete the implementation.

Do not stop at the audit. Finish the application.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/38e88779-8aea-4db3-a16d-8aaed9a15b2a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
