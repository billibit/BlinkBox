# BlinkBox Proposed Folder Structure

BlinkBox should keep the customer/admin product app, deployable agent workspace, and project documentation in one repo, but with clear top-level boundaries. The root should stay thin: repo instructions, the app package, the agent package, docs, and shared project config only when it truly needs to live at root.

```text
BlinkBox/
├── AGENTS.md
├── blinkapp/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── stripe/webhook/route.ts
│   │   │   ├── schedules/run/route.ts
│   │   │   ├── decisions/[id]/approve/route.ts
│   │   │   ├── decisions/[id]/reject/route.ts
│   │   │   └── support/[id]/reply/route.ts
│   │   ├── admin/
│   │   │   ├── page.tsx
│   │   │   ├── users/page.tsx
│   │   │   ├── catalog/page.tsx
│   │   │   ├── decisions/page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   └── support/page.tsx
│   │   ├── onboarding/page.tsx
│   │   ├── budget/page.tsx
│   │   ├── gifts/page.tsx
│   │   ├── support/page.tsx
│   │   ├── feedback/[orderId]/page.tsx
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── auth/
│   │   ├── onboarding/
│   │   ├── budget/
│   │   ├── catalog/
│   │   ├── decisions/
│   │   ├── orders/
│   │   ├── support/
│   │   └── ui/
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   ├── env.ts
│   │   ├── schema.ts
│   │   ├── user-service.ts
│   │   ├── preference-service.ts
│   │   ├── budget-service.ts
│   │   ├── payment-service.ts
│   │   ├── schedule-service.ts
│   │   ├── decision-service.ts
│   │   ├── catalog-service.ts
│   │   ├── order-service.ts
│   │   ├── fulfillment-service.ts
│   │   ├── notification-service.ts
│   │   ├── feedback-service.ts
│   │   ├── support-service.ts
│   │   ├── ledger.ts
│   │   ├── idempotency.ts
│   │   ├── stripe.ts
│   │   └── utils.ts
│   ├── scripts/
│   │   ├── migrate.mjs
│   │   ├── seed-catalog.ts
│   │   ├── run-due-schedules.ts
│   │   └── create-next-month-schedules.ts
│   ├── drizzle/
│   │   ├── meta/
│   │   └── 0000_initial_schema.sql
│   ├── e2e/
│   │   ├── onboarding.spec.ts
│   │   ├── admin-decision.spec.ts
│   │   ├── payment-intent.spec.ts
│   │   └── feedback.spec.ts
│   ├── public/
│   │   ├── icon.svg
│   │   └── og.png
│   ├── types/
│   │   └── next-auth.d.ts
│   ├── .env.example
│   ├── drizzle.config.ts
│   ├── next.config.js
│   ├── package.json
│   ├── playwright.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
├── agents/
│   ├── README.md
│   ├── package.json
│   ├── .env.example
│   ├── config/
│   │   ├── capabilities.json
│   │   └── sources.json
│   ├── scripts/
│   │   ├── pull-work.ts
│   │   ├── claim-work.ts
│   │   ├── run-skill.ts
│   │   ├── report-result.ts
│   │   └── fail-work.ts
│   ├── skills/
│   │   ├── gift-picking/
│   │   │   ├── SKILL.md
│   │   │   ├── schema.json
│   │   │   ├── prompts/
│   │   │   │   └── pick-gift.md
│   │   │   ├── references/
│   │   │   │   ├── sourcing-policy.md
│   │   │   │   └── safety-rules.md
│   │   │   └── examples/
│   │   │       └── ranked-candidates.json
│   │   └── fulfillment-research/
│   │       ├── SKILL.md
│   │       ├── schema.json
│   │       └── references/
│   ├── adapters/
│   │   ├── blinkbox-api.ts
│   │   ├── marketplace-search.ts
│   │   └── storage.ts
│   └── types/
│       ├── work-item.ts
│       └── skill-result.ts
├── docs/
│   ├── prd.md
│   ├── design.md
│   ├── techstack.md
│   ├── mvp-scope-action-plan.md
│   ├── stripe-payment-design.md
│   ├── system-design-diagram.md
│   ├── folder-structure.md
│   ├── blinkbox-mvp-system-design.png
│   ├── blinkbox-user-journey.png
│   └── blinkbox-admin-workflow.png
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

## Boundary Rules

- Root `AGENTS.md` contains repo-wide instructions for coding agents and contributors.
- `blinkapp/` owns the customer/admin product application: users, budgets, schedules, decisions, approvals, PaymentIntents, orders, fulfilment state, support, and audit logs.
- `agents/` owns portable agent capabilities and skills.
- `docs/` owns PRD, design, architecture diagrams, MVP scope, and implementation planning artifacts.
- Skills recommend or research; they do not charge cards, approve decisions, mutate order state directly, or fulfil purchases without app-side authorization.
- Agent deployments can run on different machines or scale separately, but they should communicate through narrow `blinkapp/` APIs or controlled work items.
- The MVP can ship without running the agent workspace. The first useful skill is `agents/skills/gift-picking`, which returns ranked candidates for admin review.
