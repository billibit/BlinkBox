# BlinkBox MVP Tech Stack

BlinkBox should use the same V1 application stack pattern as the BeyondAgent design docs: customer web on Vercel, shared Supabase product state, Drizzle-managed schema, private Supabase Storage for artifacts/files, Resend for email, and narrow TypeScript worker/admin scripts for background operations. BlinkBox uses Supabase Postgres schedule rows for the MVP monthly gift cadence. The repo should be organized as `blinkapp/` for the product app, `agents/` for portable skills that can be deployed on different machines or scaled separately, and `docs/` for product/design artifacts. BlinkBox adds Stripe as a required payment provider because budgeted gifting is part of the core product loop.

## Summary

BlinkBox MVP runs as a Next.js application on Vercel. Supabase Postgres is the source of truth for users, budgets, catalog items, AI decisions, orders, transactions, notifications, feedback, and support requests. Drizzle owns the TypeScript schema and SQL migrations. Supabase Storage stores private order artifacts, generated notes, receipts, fulfilment evidence, and optional uploaded support files. Resend handles transactional email. Stripe Checkout setup mode / SetupIntents store payment methods, and PaymentIntents process budgeted off-session gift charges.

Background work should start as TypeScript scheduled handlers or scripts inside the same repo. Supabase Postgres stores each user's next monthly gift run, durable product state, retry state, and audit history. Supabase Queues are not required for the core MVP flow and can be added later for higher-volume async gift picking or fulfilment automation.

## Component Choices

| Component | MVP Choice | Notes |
| --- | --- | --- |
| Frontend | Next.js on Vercel | Onboarding, budget setup, preferences, gift history, feedback, support, and admin screens. |
| Backend API | Next.js Route Handlers / Server Actions | Authenticated product actions, Stripe setup/checkout/webhooks, decision review, order updates, support actions, and status reads. |
| Authentication | Auth.js / NextAuth | User sessions for beta users and role-based admin access. Use `AUTH_SECRET` for session signing. |
| Database | Supabase Postgres | Source of truth for product state and operational state. |
| DB layer | Drizzle ORM | TypeScript schema in `blinkapp/lib/schema.ts`; SQL migrations in `blinkapp/drizzle/`. |
| Files | Supabase Storage | Private receipts, generated gift notes, fulfilment evidence, support attachments, and optional catalog assets. |
| Email | Resend | Payment setup notices, gift/order notices, tracking updates, digital gift delivery, feedback requests, and support updates. |
| Payments | Stripe Checkout setup mode, SetupIntents, PaymentIntents | Save payment methods during onboarding, then charge each admin-approved gift with a PaymentIntent. |
| Background jobs | TypeScript scripts / scheduled handlers | Claim due monthly schedules, generate pending gift decisions, send notifications, and support admin maintenance. |
| Job transport | Supabase Postgres schedule rows | V1 core flow does not need a queue. Each user's monthly gift cadence is represented by durable schedule rows. |
| Hosting | Vercel | Customer app, API routes, admin app, and scheduled/serverless work where appropriate. |
| Validation | Zod | Request payloads, admin actions, webhook payloads, and typed decision/order state transitions. |
| Testing | TypeScript tests + Playwright | Unit tests for business rules and ledgers; E2E tests for onboarding, payment setup, decision, order, and feedback flows. |
| Product app workspace | `blinkapp/` | Next.js app, components, app-owned scripts, Drizzle migrations, tests, and product package config. |
| Agent workspace | `agents/` folder with `skills/` | Portable skills such as gift picking. Skills recommend; the app validates, approves, charges, and records orders. |
| Docs workspace | `docs/` | PRD, design docs, diagrams, MVP scope, and implementation planning. |
| Agent instructions | Root `AGENTS.md` | Repo-wide operating instructions for coding agents and contributors. |

## Environment Variables

Core app variables:

```text
AUTH_SECRET
POSTGRES_URL
POSTGRES_URL_NON_POOLING
RESEND_API_KEY
RESEND_FROM_EMAIL
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_BUCKET_blinkbox_artifacts
```

Optional background/job variables:

```text
WORKER_ID
WEATHER_API_KEY
FULFILLMENT_PROVIDER_API_KEY
```

Credential boundary:

- Public browser code may receive only public keys, such as `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and public Supabase URL/anon values if needed.
- Stripe secret keys, Supabase service role keys, database URLs, and fulfilment provider secrets must stay server-side.
- Admin and worker scripts should read secrets from environment variables and must not print them.
- Public users must never choose arbitrary job types, shell commands, tools, suppliers, or fulfilment adapters.

## Database and Migrations

Use the BeyondAgent database workflow:

1. Define tables and enums in `blinkapp/lib/schema.ts`.
2. Generate SQL migrations with Drizzle Kit.
3. Apply migrations with an app script equivalent to `pnpm --filter blinkapp run db:migrate`.
4. Use `POSTGRES_URL` for pooled runtime access.
5. Use `POSTGRES_URL_NON_POOLING` for migration DDL.

Postgres should be authoritative for:

- Users and roles.
- Addresses and preferences.
- Payment method references.
- Budget ledgers and transactions.
- Gift schedules.
- Gift catalog items.
- AI decisions.
- Orders and fulfilment state.
- Notifications.
- Feedback.
- Support requests.
- Idempotency keys.

## Reliability Rules

- Use idempotency keys for onboarding submission, Stripe setup, Stripe charges, webhook handling, decision creation, order creation, fulfilment actions, notification sends, refunds, and replacements.
- Use unguessable IDs or tokens for any customer-facing status links.
- Treat the ledger as the source for budget balance.
- Store every AI decision with the evaluated guardrails, candidate item set, selected item, generated reason, and budget state.
- Failed payments must not create fulfilled orders.
- Failed fulfilment must not double-charge users.
- Support actions must append records instead of silently rewriting history.

## Future Options

- Split wallet, decisioning, fulfilment, and notification modules into services only after product volume or team ownership justifies it.
- Add Supabase Queues once asynchronous work volume, agentic gift picking, fulfilment automation, or worker specialization grows.
- Add a mobile app after the web MVP validates activation, gift quality, and retention.
- Add MCP adapter support after the core budgeted gifting trust loop is stable.
