# BlinkBox MVP System Design Diagram

This diagram is intentionally written in Mermaid so it can be edited directly in Markdown or pasted into a Mermaid editor.

```mermaid
flowchart TB
  subgraph people["People"]
    BetaUser["Beta user"]
    Admin["Operator / admin"]
  end

  subgraph blinkapp["blinkapp/ on Vercel"]
    Web["Next.js web app<br/>onboarding, budget, gift history, feedback"]
    AdminUI["Admin screens<br/>catalog, decisions, orders, support"]
    API["Route Handlers / Server Actions<br/>synchronous app requests<br/>Zod validation, product actions"]
    Auth["Auth.js / NextAuth<br/>AUTH_SECRET, user sessions, admin roles"]
    Jobs["TypeScript scheduled jobs<br/>claim monthly schedules<br/>create pending decisions"]
  end

  subgraph supabase["Supabase"]
    PG[("Postgres<br/>users, addresses, preferences<br/>gift schedules, budgets, ledger<br/>catalog, decisions, orders<br/>notifications, feedback, support<br/>idempotency")]
    Storage["Private Storage<br/>receipts, gift notes<br/>fulfilment evidence, support files<br/>catalog assets"]
  end

  subgraph external["External services"]
    Stripe["Stripe<br/>Checkout setup, SetupIntent<br/>PaymentIntent charges<br/>refunds, webhooks"]
    Resend["Resend<br/>transactional email"]
    Weather["Weather API<br/>context signals"]
    Supplier["Gift suppliers<br/>manual admin fulfilment"]
  end

  subgraph agents["agents/ workspace (post-MVP / separately deployable)"]
    AgentScripts["Agent scripts<br/>pull, claim, run, report"]
    GiftSkill["agents/skills/gift-picking<br/>ranked candidates only"]
  end

  BetaUser -->|"sign up, configure preferences, set budget"| Web
  BetaUser -->|"view gifts, submit feedback, request support"| Web
  Admin -->|"review and operate"| AdminUI

  Web --> API
  AdminUI --> API
  API --> Auth
  API -->|"read/write product state"| PG
  API -->|"store private artifacts"| Storage

  API -->|"setup method, charge, refund"| Stripe
  Stripe -->|"webhooks"| API

  Jobs -->|"claim due schedules"| PG
  Jobs -->|"create pending decisions"| PG
  Jobs -->|"fetch context"| Weather
  Jobs -->|"send gift, tracking, feedback emails"| Resend

  API -->|"send immediate account/payment/support email"| Resend
  API -->|"manual fulfilment action"| Supplier
  API -.->|"controlled work items"| AgentScripts
  AgentScripts -.-> GiftSkill
  GiftSkill -.->|"candidate shortlist"| API

  PG -->|"status, history, feedback data"| API
  Storage -->|"signed/private access"| API
```

## Notes

- Supabase Postgres is the source of truth for product and operational state.
- Stripe stores payment methods and handles charges/refunds; BlinkBox stores only Stripe references.
- MVP uses Postgres schedule rows for monthly gift decisions; Supabase Queues are a post-MVP option.
- `blinkapp/` owns approvals, payments, orders, fulfilment state, support, and audit history.
- `agents/skills` can be deployed separately, but skills recommend only.
- `docs/` contains the editable PRD, design docs, Mermaid diagrams, and generated PNG diagrams.
- Admin actions should append auditable records instead of silently mutating history.
