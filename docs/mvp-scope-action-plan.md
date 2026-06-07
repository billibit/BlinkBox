# BlinkBox MVP Scope and Action Plan

## MVP Objective

The BlinkBox MVP should prove one core loop: a user can safely give BlinkBox a small monthly budget, configure gift preferences, receive an AI-selected surprise within that budget, understand why it was sent, and provide feedback that improves future decisions.

The MVP is not a full autonomous commerce platform yet. It is a trust-building release that validates whether users want AI-mediated surprise gifting and whether the team can operate the gift decision, payment, fulfilment, notification, and feedback loop with enough reliability to learn quickly.

## Success Criteria

| Area | MVP Target |
| --- | --- |
| Activation | At least 60% of invited users complete onboarding, including budget, preferences, address, and payment setup. |
| Trust | Fewer than 2% of orders require payment dispute, refund, or manual reversal. |
| Gift quality | Average gift rating of 4.0/5 or higher across delivered gifts. |
| Decision quality | At least 70% of AI-generated gift decisions are approved by admins without requiring engineering changes. |
| Retention signal | At least 40% of users keep their budget active after the first gift cycle. |
| Operations | Support can resolve damaged, disliked, or failed gifts from an admin workflow without direct database edits. |

## MVP User Segment

Focus on a private beta in one launch region, preferably the United States, with a limited invite list.

Primary MVP persona:

- Curious trend-seeker or early tech adopter.
- Comfortable with AI experimentation.
- Willing to set a low monthly budget, such as $15-$30.
- Open to physical or digital gifts.
- Will provide feedback after receiving a surprise.

Secondary personas, such as couples, friend groups, international users, and premium-personality customers, should be deferred until the core trust loop is validated.

## In Scope

### User Onboarding

- Email/password or OAuth sign-in.
- Basic profile with name, timezone, and email.
- Shipping address collection for physical gifts.
- Preference intake:
  - Gift categories.
  - Disliked categories.
  - Physical, digital, or either.
  - AI personality selection from a small fixed set.
  - Optional short free-text preference note.
- Consent screen explaining that BlinkBox may propose monthly gifts within the approved budget and charge only after admin approval during private beta.

### Budget and Payment

- Monthly budget setup with a minimum and maximum range.
- Stripe Checkout setup mode / SetupIntent for storing payment methods.
- PaymentIntent per gift after admin approval.
- Remaining monthly balance tracking.
- Spending history.
- Ability to pause future gifts.
- Hard enforcement that no purchase exceeds remaining budget.

### Gift Catalog

- Curated internal catalog of MVP-safe gifts.
- Support both physical and digital item types if fulfilment paths are manageable.
- Required metadata:
  - Name.
  - Type.
  - Price.
  - Supplier or fulfilment method.
  - Stock/availability.
  - Mood tags.
  - Personality tags.
  - Shipping restrictions.
- Admin-only catalog management can be simple, but it must avoid direct production database edits.

### Context and Decision Engine

- Rule-based decision engine with AI-generated reasoning text.
- MVP triggers:
  - Weather.
  - Calendar/date.
  - User preference fit.
  - Time since last gift.
  - Remaining budget.
  - Random surprise score.
- Configurable guardrails:
  - Maximum gifts per month.
  - Minimum days between gifts.
  - Blocked categories.
  - Maximum item price.
- Decision audit trail with trigger, candidate item, chosen item, budget state, and generated message.

### Fulfilment

- Physical fulfilment is manual admin fulfilment in MVP.
- Digital fulfilment is manual admin fulfilment in MVP unless a provider path is explicitly approved later.
- Required order statuses:
  - Pending decision.
  - Pending admin review.
  - Approved for charge.
  - Payment succeeded.
  - Ordered.
  - Shipped or delivered.
  - Failed.
  - Refunded or replaced.
- Tracking link support for physical gifts when available.

### Notifications

- Email notifications for:
  - Payment setup success.
  - Gift selected or ordered.
  - Shipment/tracking update.
  - Digital gift delivery.
  - Feedback request.
- Push notifications are optional for MVP unless the app stack already supports them cheaply.
- Every gift notification should include a short AI explanation that feels personal but does not expose sensitive or inferred data.

### Feedback and Support

- Rating after each gift.
- Liked/disliked flag.
- Optional comment.
- Refund or replacement request entry point.
- Internal support view for order, payment, gift, and feedback history.

### Admin Operations

- View users and budgets.
- View and edit catalog items.
- Review AI decisions.
- Manually approve AI decisions before charge.
- Manually fulfil, retry, cancel, refund, or replace orders.
- View failed payments and failed fulfilment attempts.
- Export basic operational data for analysis.

## Out of Scope for MVP

- Mobile app.
- MCP adapter or external-agent API.
- Marketplace of AI personalities.
- Premium subscriptions beyond a simple budget model.
- International shipping.
- Multi-currency support.
- Fully automated merchant marketplace integrations.
- Deep emotion detection or camera/sensor-based inference.
- Social sharing, unboxing feeds, referrals, or viral loops.
- Complex analytics warehouse.
- Large-scale microservices deployment.
- Advanced inventory procurement or warehouse management.
- Real-time chat with the AI personality.
- Production use of deployable agent skills.

## Recommended MVP Architecture

Although the long-term design describes microservices, the MVP should use the same V1 stack pattern as the BeyondAgent design docs: Next.js on Vercel, Supabase Postgres as the source of truth, Drizzle migrations, Supabase Storage, Resend, TypeScript background scripts, and Postgres-backed monthly scheduling. Stripe is added as a required BlinkBox dependency for Checkout setup mode / SetupIntents, PaymentIntent per-gift charges, refunds, and webhook reconciliation.

The MVP should start as a modular monolith or small service set. The goal is to preserve domain boundaries without paying the full operational cost of distributed services before product-market learning exists.

Repo layout for the MVP:

- **`blinkapp/`:** Next.js customer/admin app, app-owned API routes, components, domain services, scripts, Drizzle migrations, tests, and app package config.
- **`agents/`:** Separately deployable agent scripts and skills. This is planned into the repo boundary now, but production use is post-MVP.
- **`docs/`:** PRD, architecture, tech stack, diagrams, MVP plan, and implementation notes.
- **`AGENTS.md`:** Root repo instructions for coding agents and contributors.

Recommended modules:

- **Web App:** User onboarding, budget dashboard, gift history, feedback, and admin views.
- **API/Application Backend:** Next.js Route Handlers and Server Actions for auth, user profile, budgets, catalog, decisions, orders, notifications, Stripe webhooks, and admin operations.
- **Auth:** Auth.js / NextAuth with `AUTH_SECRET` and role-based admin access.
- **Database:** Supabase Postgres for core product and operational state.
- **DB Layer:** Drizzle ORM with TypeScript schema and SQL migrations.
- **Files:** Supabase Storage for private receipts, generated gift notes, fulfilment evidence, support attachments, and optional catalog assets.
- **Email:** Resend for transactional notifications.
- **Monthly Scheduling:** Supabase Postgres schedule rows for each user's next monthly gift decision.
- **Background Jobs:** TypeScript scheduled handlers or operator scripts for claiming due schedules, generating pending decisions, notifications, and retryable admin tasks.
- **External Services:** Stripe for payments, weather API for context, and manually operated supplier/provider paths.
- **Agent Workspace:** `agents/` folder with portable `skills/` for post-MVP gift picking or fulfilment research.

Design the code around service boundaries from the architecture doc, but deploy it simply at first. Split into independent services only after there is meaningful load, team ownership, or integration complexity.

See [techstack.md](./techstack.md) for the dedicated MVP stack plan.

## MVP Data Model

Minimum entities:

- User.
- Address.
- PaymentMethod.
- Budget.
- GiftSchedule.
- GiftItem.
- Decision.
- Order.
- Transaction.
- Notification.
- Feedback.
- SupportRequest.

Important constraints:

- Budget balance must be calculated from ledgered transactions, not only mutable fields.
- Orders and transactions must be idempotent.
- Every decision must be auditable.
- Payment method details must never be stored directly; only Stripe identifiers should be stored.
- Support actions should create records instead of mutating history invisibly.

## Action Plan

### Phase 0: Product and Operational Setup (Week 1)

1. Define beta launch region, invite size, monthly budget range, and refund policy.
2. Choose initial gift categories and blocked categories.
3. Select 20-50 MVP catalog items with known availability and fulfilment path.
4. Define AI personalities for MVP, limited to 3 options.
5. Write trust and consent copy for autonomous spending.
6. Define manual admin fulfilment rules.
7. Create operational runbooks for failed payment, failed fulfilment, refund, replacement, and disliked gift.

Deliverables:

- Beta operating policy.
- Initial catalog spreadsheet or admin seed data.
- Refund/replacement rules.
- MVP personality definitions.

### Phase 1: Foundation Build (Weeks 2-3)

1. Build authentication and user profile flows.
2. Build onboarding for preferences, address, AI personality, and budget.
3. Integrate Stripe Checkout setup mode / SetupIntent and store Stripe customer/payment references.
4. Create core database schema and ledger model.
5. Build budget dashboard with remaining balance and pause control.
6. Add monthly gift schedule table and next-run calculation.
7. Add admin authentication and basic admin shell.

Deliverables:

- User can sign up and complete onboarding.
- User can attach a payment method.
- Budget and payment references are stored safely.
- Admin can view users and onboarding state.

### Phase 2: Catalog, Decisioning, and Auditability (Weeks 4-5)

1. Build GiftItem catalog model and admin catalog management.
2. Implement weather/date/context adapter.
3. Implement monthly schedule claimer that creates pending AI decisions.
4. Implement rule-based decision engine.
5. Add AI-generated gift reasoning text.
6. Add decision audit records.
7. Add guardrails for budget, gift frequency, blocked categories, and item availability.
8. Build admin decision review and approval view.

Deliverables:

- System can generate eligible gift candidates.
- System can choose a gift within budget and guardrails.
- Admin can approve or reject each decision before charge.
- Every decision can be reviewed by support/admin.

### Phase 3: Orders, Payments, and Fulfilment (Weeks 6-7)

1. Create order lifecycle and order status views.
2. Implement PaymentIntent per-gift charge flow after admin approval.
3. Add idempotency for charges and fulfilment actions.
4. Implement manual admin fulfilment workflow.
5. Record fulfilment evidence, tracking, and notes in admin.
6. Add refund and replacement handling.
7. Add failed payment and failed fulfilment recovery flows.

Deliverables:

- Approved decisions can become orders.
- Approved orders can charge the saved payment method with a PaymentIntent.
- Admin/support can manually fulfil, track, retry, refund, or replace orders.

### Phase 4: Notifications, Feedback, and Beta Readiness (Weeks 8-9)

1. Implement email notifications for onboarding, gift, shipping/delivery, digital delivery, and feedback.
2. Build gift history page.
3. Build feedback form.
4. Feed ratings and disliked categories back into future decision eligibility.
5. Add basic operational metrics.
6. Run end-to-end test cycles with internal users.
7. Fix trust, payment, and fulfilment edge cases before opening beta.

Deliverables:

- User receives a complete surprise journey.
- User can rate and comment on gifts.
- Team can measure activation, gift quality, disputes, and retention signal.

### Phase 5: Private Beta (Weeks 10-12)

1. Invite a small cohort.
2. Require admin approval for every generated decision before charge and fulfilment.
3. Track support requests and failed operations daily.
4. Review gift ratings and comments weekly.
5. Tune catalog, personality prompts, and decision rules.
6. Decide whether to expand beta, deepen automation, or pivot gift/category strategy.

Deliverables:

- MVP learning report.
- Go/no-go decision for broader launch.
- Prioritized backlog for post-MVP.

## Launch Readiness Checklist

- Users can complete onboarding without admin help.
- Stripe payment setup succeeds in test and live modes.
- No order can exceed remaining budget.
- Decision engine respects maximum gift frequency.
- No PaymentIntent is created before admin approval.
- Admin can inspect every decision and order.
- Admin can pause a user.
- Failed payment does not create a fulfilled order.
- Failed fulfilment does not double-charge the user.
- Gift notification includes safe, understandable AI reasoning.
- User can submit feedback.
- User can request refund or replacement.
- Support has a runbook for every expected failure mode.
- Logs exist for payments, decisions, orders, notifications, and support actions.

## Post-MVP Backlog

- Mobile app and push notifications.
- More sophisticated AI personalities.
- Merchant integrations with automated inventory sync.
- Supabase Queues for higher-volume async gift picking, fulfilment retries, and notification jobs.
- Deployable `agents/skills/gift-picking` workflow for marketplace candidate research.
- Subscription tiers and premium personalities.
- MCP adapter for external agents.
- Referral and sharing loops.
- Internationalization and multi-currency support.
- Data warehouse and advanced analytics.
- Separate services for wallet, decisioning, fulfilment, and notifications once operational load justifies it.
