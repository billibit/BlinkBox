# BlinkBox MVP Design and Architecture

## Overview

BlinkBox is an AI-powered surprise gifting platform that lets a user approve a monthly budget, receive an AI-selected surprise, understand why it was chosen, and provide feedback. The MVP should prove the trust loop before introducing autonomous fulfilment or marketplace automation.

The MVP uses the same V1 stack pattern as the BeyondAgent design docs: a modular Next.js app on Vercel, Supabase Postgres as the source of truth, Drizzle migrations, Supabase Storage, Resend email, and narrow TypeScript scripts or scheduled handlers for background work. The repo is organized as `blinkapp/` for the product app, `agents/` for separately deployable agent skills, and `docs/` for product and architecture docs. Stripe Checkout setup mode / SetupIntents save payment methods, and Stripe PaymentIntents charge each admin-approved gift.

## High-Level Architecture

The MVP is a modular application, not a distributed microservices deployment. Modules should keep clear domain boundaries in code while sharing Supabase Postgres as durable product state. If volume, ownership, or integration complexity later justifies it, these modules can be split into independent services.

### Components

1. **Client Applications**
   - **Web App:** Next.js web app for signup, onboarding, budget setup, preferences, gift history, support requests, and feedback.
   - **Admin UI:** Admin screens for user review, catalog management, AI decision review, order approval, manual fulfilment, refunds, and support.
2. **API Layer**
   - Next.js Route Handlers and Server Actions handle authenticated product flows, Zod validation, Stripe webhooks, status reads, admin operations, and product actions.
3. **Auth Module**
   - Auth.js / NextAuth handles user sessions and role-based admin access with `AUTH_SECRET`.
4. **Budget & Payment Module**
   - Manages user budgets, saved Stripe references, ledger entries, and transaction histories. Uses Stripe Checkout setup mode / SetupIntents to save payment methods and PaymentIntents for admin-approved per-gift charges. Budget balance comes from ledger entries, not only mutable fields.
5. **Monthly Schedule & Context Module**
   - Stores each user's next monthly gift run in Supabase Postgres. A scheduled handler or operator script claims due schedules, checks pause state, gathers lightweight context such as weather/calendar signals, and creates pending gift decisions. No invasive emotion detection is used.
6. **AI Decision Module**
   - Uses context, preferences, remaining budget, guardrails, and random surprise scoring to create a pending gift decision. It selects from the curated catalog, generates reasoning text, and records an audit trail. Private beta decisions require admin approval before charge or fulfilment.
7. **Inventory Module**
   - Maintains a curated catalog of MVP-safe physical and digital gifts with price, category, availability, supplier/fulfilment notes, mood tags, personality tags, and shipping restrictions.
8. **Order & Manual Fulfilment Module**
   - Converts admin-approved decisions into orders, creates PaymentIntents, tracks payment state, and gives admins a workflow for manual fulfilment. Physical and digital gifts are fulfilled manually in MVP. Automated supplier integrations and agentic fulfilment adapters are post-MVP.
9. **Notification Module**
   - Sends email notifications for payment setup, gift/order updates, shipment/tracking, digital delivery, feedback requests, refunds, and support updates. Personalised AI reasoning can be included when safe.
10. **Feedback & Support Module**
    - Collects ratings, liked/disliked flags, comments, refund/replacement requests, and support actions. Feedback informs future decisions and catalog curation.
11. **Agent Workspace**
    - A top-level `agents/` folder contains deployable agent scripts, adapters, and skills. The first likely skill is `agents/skills/gift-picking`, which can research marketplace candidates and return a ranked shortlist. Skills recommend only; BlinkBox still validates guardrails, requires admin approval in beta, charges via Stripe, and owns fulfilment state.
12. **Repo Agent Instructions**
    - Root `AGENTS.md` contains repo-wide instructions for coding agents and contributors. It is separate from the deployable `agents/` workspace.
13. **Documentation Workspace**
    - `docs/` contains the PRD, design, tech stack, MVP scope, payment design, diagrams, and folder structure plan.

## Data Model Overview

Detailed schema definitions will be created during implementation. MVP entities should include:

| Entity/Table | Key Attributes |
| --- | --- |
| User | user_id (PK), email, password_hash, registration_date, timezone, role |
| Address | address_id (PK), user_id (FK), recipient_name, line1, city, state, zip, country |
| UserPreference | preference_id (PK), user_id (FK), category, value, blocked_flag |
| PaymentMethod | payment_id (PK), user_id (FK), stripe_customer_id, stripe_payment_method_id, default_flag |
| Budget | budget_id (PK), user_id (FK), monthly_limit, paused, created_at |
| GiftSchedule | schedule_id (PK), user_id (FK), cadence, next_run_at, timezone, paused, last_run_at |
| GiftItem | item_id (PK), name, type, price, stock, mood_tags, personality_tags, supplier_notes |
| AI_Decision | decision_id (PK), user_id (FK), decision_time, context_state, item_id (FK), reasoning_text, approval_status |
| Order | order_id (PK), user_id (FK), decision_id (FK), item_id (FK), amount, status, stripe_payment_intent_id |
| LedgerEntry | entry_id (PK), user_id (FK), order_id (FK), type, amount, stripe_payment_intent_id, idempotency_key |
| Notification | notification_id (PK), user_id (FK), order_id (FK), channel, status, idempotency_key |
| Feedback | feedback_id (PK), order_id (FK), rating, liked_flag, comment, submitted_at |
| SupportRequest | support_id (PK), user_id (FK), order_id (FK), type, status, resolution |

Important constraints:

- Budget balance is calculated from ledger entries.
- Payment method details are never stored directly; only Stripe references are stored.
- Admin approval is required before creating a PaymentIntent in private beta.
- Orders, PaymentIntents, webhook handlers, fulfilment actions, notifications, refunds, and support actions must be idempotent.
- Support actions append records instead of silently rewriting history.

## Key Workflows

### User Onboarding

1. User accesses the BlinkBox web app.
2. User registers or signs in.
3. User sets preferences, blocked categories, shipping address, AI personality, and monthly budget.
4. Backend creates a Stripe Customer if needed.
5. Backend creates a Stripe Checkout Session in setup mode backed by a SetupIntent.
6. User completes Stripe-hosted payment method setup.
7. Stripe webhook confirms setup and BlinkBox stores Stripe references.
8. BlinkBox creates the user's GiftSchedule with a random `next_run_at` in the next monthly window.

### Monthly Gift Decision

1. A scheduled handler or operator script claims due GiftSchedule rows where `next_run_at <= now()` and `paused = false`.
2. The Decision module checks budget, pause state, user preferences, blocked categories, gift frequency, and catalog availability.
3. If conditions are met, the module selects a suitable GiftItem and writes an AI_Decision record with `approval_status = pending_admin_review`.
4. BlinkBox calculates and stores the next random monthly run date.
5. Admin is notified that a gift decision needs review.

### Admin Approval, Charge, and Manual Fulfilment

1. Admin reviews the decision, reasoning, user budget, gift candidate, and risk flags.
2. Admin approves, rejects, or requests a new pick.
3. If approved, BlinkBox creates an Order and a Stripe PaymentIntent for the exact gift amount.
4. If the PaymentIntent succeeds, the order moves to manual fulfilment.
5. Admin purchases or sends the gift manually and records tracking, receipt, notes, or fulfilment evidence.
6. BlinkBox sends the user a notification with the safe personalised note and any tracking/delivery details.
7. User receives the gift and submits feedback.

### Refund or Replacement

1. User opens a support request for damaged, disliked, missing, or failed gift.
2. Admin reviews order, payment, fulfilment evidence, and feedback history.
3. Admin issues a Stripe refund or replacement when appropriate.
4. BlinkBox records the support resolution and ledger/order state.

## Non-Functional Considerations

- **Scalability:** MVP modules run inside the Next.js application on Vercel. Supabase Postgres stores shared state. Split services later only when operational load justifies it.
- **Reliability:** Use row-level claiming for due schedules, idempotency keys, Stripe webhook reconciliation, and retryable admin operations. Supabase Queues are post-MVP unless async volume requires them.
- **Security:** Enforce HTTPS everywhere. Use Auth.js sessions, role-based admin checks, secret manager storage for API keys, and audit logs for payment/order/admin actions.
- **Privacy:** Avoid storing personally identifiable information beyond what is necessary. Give users clear privacy controls and data deletion options.
- **Monitoring and Observability:** Track payment failures, due schedule claims, decision generation, admin approvals, fulfilment status, notification sends, refunds, and support requests.

## Technology Stack Suggestions

- **Frontend:** Next.js + React + TypeScript on Vercel for onboarding, budget setup, gift history, feedback, support, and admin screens.
- **Backend API:** Next.js Route Handlers and Server Actions for product flows, admin operations, Stripe webhooks, decision review, order updates, and status reads.
- **Authentication:** Auth.js / NextAuth with `AUTH_SECRET` for user sessions and role-based admin access.
- **Database:** Supabase Postgres as the source of truth for users, addresses, preferences, schedules, budgets, ledger transactions, catalog items, AI decisions, orders, notifications, feedback, and support requests.
- **DB layer:** Drizzle ORM with TypeScript schema in `blinkapp/lib/schema.ts` and generated SQL migrations in `blinkapp/drizzle/`.
- **Files:** Supabase Storage for private receipts, generated gift notes, fulfilment evidence, support attachments, and optional catalog assets.
- **Email:** Resend for payment setup notices, gift/order notifications, tracking updates, digital gift delivery, feedback requests, and support updates.
- **Payments:** Stripe Checkout setup mode / SetupIntents for payment method capture, PaymentIntents for admin-approved per-gift charges, plus refunds and webhook reconciliation.
- **Background jobs:** TypeScript scheduled handlers or operator scripts for claiming monthly schedules, creating pending gift decisions, and sending notifications.
- **Job transport:** Supabase Postgres schedule rows for MVP; Supabase Queues are a post-MVP option for higher-volume async work.
- **Validation:** Zod for request payloads, admin actions, webhooks, and state transitions.
- **Testing:** TypeScript tests for decisioning, ledgers, schedules, idempotency, and payment/order state transitions; Playwright for onboarding, payment setup, admin approval, gift history, support, and feedback flows.

See [techstack.md](./techstack.md) for the dedicated MVP stack plan.

## Development Plan (Phases)

1. **Prototype (4-6 weeks)**
   - Develop core web onboarding flow: registration, budget setup, and personality selection.
   - Integrate Stripe Checkout setup mode / SetupIntent for payment methods.
   - Implement GiftSchedule and a basic catalog.
   - Create a minimal Decision module with rule-based triggers and pending admin review.
   - Implement admin approval and manual fulfilment tracking.
2. **MVP Launch (3-4 months)**
   - Improve AI Decision module with personalities, context, and guardrails.
   - Add user feedback loops and basic analytics.
   - Deploy email notifications with Resend.
   - Implement PaymentIntent per-gift charges after admin approval.
   - Harden idempotency, webhook reconciliation, refunds, and support operations.
3. **Growth & Agentic Sourcing (post-MVP)**
   - Add `agents/skills/gift-picking` integration for marketplace candidate discovery.
   - Add supplier integrations or automated fulfilment only after admin workflows are stable.
   - Add Supabase Queues if async volume or worker specialization grows.
   - Introduce premium personalities, subscription tiers, mobile app, and MCP adapter only after the core trust loop is stable.

## Risks and Mitigations

- **Trust and Payment Concerns:** Users may hesitate to authorise future charges. Mitigate with clear consent, strict monthly budgets, admin approval in beta, transparent spending history, easy pause, and refund options.
- **Gift Quality and Inventory:** Poor-quality gifts will erode trust. Vet catalog items, monitor feedback, and continuously refine inventory. Start with small batches and manual fulfilment.
- **Manual Fulfilment Load:** Admin fulfilment does not scale indefinitely. Track operational time per gift and automate only the highest-value repeat paths after MVP.
- **System Complexity:** Keep modules inside the Next.js application and use Supabase Postgres as the source of truth. Add queues or service splits only when operational load justifies them.

## Future Service Split

The MVP should preserve clear module boundaries in code: user, budget/payment, schedule/context, decisioning, inventory, order/fulfilment, notification, feedback, and support. These modules can become independently deployed services later if product volume, team ownership, or external integration complexity makes that worth the added operational cost.

The `agents/` workspace has its own boundary. It can be deployed to different machines or scaled separately, but it should communicate with BlinkBox through narrow `blinkapp/` APIs or controlled work items. The app remains the authority for approvals, payments, orders, support, and audit history.

This design and architecture document should serve as a living blueprint for the BlinkBox engineering team. It will evolve as the system grows and new requirements emerge.
