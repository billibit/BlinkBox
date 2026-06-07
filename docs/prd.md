# BlinkBox Product Requirements Document (PRD)

## Metadata

| Field | Value |
| --- | --- |
| Title | BlinkBox - AI-Powered Surprise Gifting App |
| Version | v1.0 |
| Authors | Product team (PM, Engineering, Design) |
| Date | 7 June 2026 |
| Revision history | Initial draft |

## Purpose and Scope

BlinkBox is an AI-powered emotional commerce platform where users give the system a small budget and the AI occasionally sends them a thoughtful physical or digital surprise. Unlike traditional recommendation engines that require users to pick items, BlinkBox acts as a companion agent: it learns about the user's preferences, monitors contextual signals such as weather or public events and triggers purchases within the pre-approved budget when the timing feels "right." The platform blends the charm of blind boxes with personalised discovery and AI personality. This document defines what the product should do and why, aligning stakeholders and reducing ambiguity.

### Goals

- **Emotional connection:** Deliver small surprises that make users feel seen and valued, reinforcing long-term engagement.
- **Seamless agent-driven commerce:** Demonstrate that AI can responsibly manage budgets and autonomously order goods or experiences within user-defined constraints.
- **Viral growth:** Design an experience that users love to share (e.g., unboxing videos), driving organic acquisition.
- **Foundation for AI agent infrastructure:** Create a modular platform that can eventually serve other AI agents via an MCP (Model Context Protocol) interface.

### Out of Scope

- High-risk purchases, regulated goods, gambling or financial instruments are not permitted.
- Deep emotion detection via invasive sensors or camera analysis is explicitly excluded; the system should rely on voluntary signals and contextual cues.
- Global shipping beyond initially supported regions is deferred until later phases.

## Background and Market Analysis

Consumers increasingly seek novelty and personalised experiences. Subscription boxes and mystery gift services exist, but they typically follow fixed schedules and manual curation. Several AI gift recommendation sites recommend products based on user input, yet they require the user to select and purchase items. None combine AI personalities, surprise timing and automated purchasing. By filling this gap, BlinkBox offers an innovative emotional commerce experience.

## Business Objectives and Success Metrics

| Objective | Success Metric |
| --- | --- |
| Acquire an engaged user base | Number of registered users and monthly active users (MAU) |
| Deliver emotional value | Average satisfaction score per gift and Net Promoter Score (NPS) |
| Drive subscription revenue | Subscription conversion rate and average revenue per user (ARPU) |
| Validate controlled agentic commerce | Percentage of AI gift picks approved by admins and fulfilled without engineering intervention |
| Maintain trust and safety | Number of payment disputes and negative incidents |

The PRD emphasises defining measurable outcomes, not just feature lists. Clear success metrics enable the team to gauge whether the product meets its goals.

## User Personas

- **Curious Trend-seeker (Gen Z):** Enjoys TikTok, loves unboxing content, and wants low-cost surprises that reflect memes and current trends.
- **Stressed Professional:** Uses BlinkBox as a way to unwind; expects the AI to know when they've been working late and send self-care items or quick entertainment.
- **Gift-Loving Couple/Friend Group:** Shares a joint BlinkBox account to enjoy surprises together and occasionally sends gifts to each other via the AI.
- **Early Tech Adopter:** Interested in experimenting with AI agents, budgets, and integration with other AI ecosystems (MCP).

## Use Cases

1. **User Onboarding:** A user signs up with an email or OAuth, selects their preferred AI personality (e.g., chaos, cozy, anime), sets a monthly budget (e.g., US$20), provides shipping address (for physical gifts), and optionally authorises a payment method via Stripe.
2. **Admin-Approved Surprise:** Each month, the system checks budget and preferences, chooses a candidate gift from the curated inventory, and creates a pending decision for admin review. After admin approval, BlinkBox charges the saved payment method with a PaymentIntent and the admin fulfils the gift manually. The user receives an email with a personalised note explaining the AI's reasoning.
3. **Digital Gift Delivery:** The AI sends a virtual item, such as a concert ticket or game key, delivered instantly via email or within the app. The cost is deducted from the user's budget.
4. **Budget Rollover:** At the end of the month, unused budget rolls over if enabled, and the AI may save up for a higher-value surprise next month.
5. **User Feedback Loop:** After receiving a gift, the user can rate it positive or negative and provide optional comments. The AI adapts its future choices based on feedback.
6. **Refund/Dispute:** If a user dislikes a gift or the item arrives damaged, they can request a replacement or refund within the app, triggering customer support workflows.

## Functional Requirements

The PRD lists functional requirements, which define what the system must do, and non-functional requirements, which define quality attributes. This section summarises key behaviours with priority indicators: Must, Should, or Could. Including functional requirements helps designers and engineers understand the scope.

| # | Requirement | Priority | Notes |
| --- | --- | --- | --- |
| 1 | Account Management: Users shall register/login via email/OAuth. | Must | Provide basic profile management and password reset. |
| 2 | Budget Setup: Users shall define a monthly spending limit and enable or disable budget rollover. | Must | Use Stripe Checkout setup mode / SetupIntents to save payment methods and PaymentIntents for later approved gift charges; budgets may be increased or decreased by the user. |
| 3 | AI Personality Selection: Users shall select an AI personality that influences gift style and messaging. | Must | Default personality available; premium personalities unlocked via subscription. |
| 4 | Shipping & Billing Details: Users shall provide shipping addresses for physical gifts and billing information for digital purchases. | Must | Addresses validated through third-party API. |
| 5 | Context Monitoring: The system shall ingest contextual triggers, including weather, public holidays, market events, and scheduled patterns, to inform gift timing. | Should | Do not collect intrusive user data; rely on voluntary signals and public APIs. |
| 6 | Decision Engine: The AI shall decide when to send a gift, ensuring spending remains within budget and following configured rules such as minimum days between gifts. | Must | The engine uses randomness to maintain surprise while respecting constraints. |
| 7 | Gift Inventory: The platform shall maintain a curated list of physical and virtual gifts with metadata such as price, category, stock, and shipping constraints. | Must | Inventory management ensures quality and avoids out-of-stock items. |
| 8 | Order Placement: For an admin-approved gift, the system shall create an order, charge the saved payment method with a PaymentIntent, track manual fulfilment, update inventory, and record ledger entries. | Must | Ensure idempotent payment, order, and fulfilment operations. |
| 9 | Personalised Messaging: Each gift shall include a short explanation generated by the AI that references the trigger. | Should | Must not reveal sensitive data; should feel thoughtful. |
| 10 | Notifications: The platform shall notify users via email when a gift is ordered, dispatched, delivered, or ready for feedback. | Must | In-app history summarises past surprises. |
| 11 | User Feedback: Users shall be able to rate gifts, mark them as liked or disliked, and leave comments. | Should | Feedback informs AI tuning and inventory curation. |
| 12 | Budget & Billing Dashboard: Users shall view spending history, remaining budget, and upcoming deliveries. | Should | Should also allow pausing the service or adjusting budgets. |
| 13 | Refund & Support: Users shall request refunds or replacements via the app. | Should | Provide automated responses with escalation to human support as needed. |
| 14 | MCP API Integration: The platform shall expose an API enabling other AI agents, such as ChatGPT, to trigger surprise gifts or query budgets on behalf of the user. | Could | Future work; must include authentication and rate limits. |

## Non-Functional Requirements

- **Performance and scalability:** The system shall handle at least 100,000 concurrent users with an average response time under 300 ms for API calls. Microservices architecture will allow independent scaling of services.
- **Reliability:** 99.9% uptime, or <=8.76 hours downtime per year. Use redundancy, health checks, and retry mechanisms.
- **Security:** Payment information shall be stored using PCI-compliant processors such as Stripe. All traffic between client and server shall be encrypted via TLS. The system shall follow least-privilege and audit logging practices.
- **Privacy:** The platform shall minimise data collection to what is necessary, with no real-time emotion detection. Users shall be informed about what data is used for triggers and may opt out of certain signals. Comply with relevant privacy regulations, including GDPR and CCPA.
- **Usability:** The UI shall be intuitive, with minimal steps to configure budgets and personalities. Provide clear explanations of AI actions to build trust.
- **Localization:** Support multiple languages and regional gift options. Time zones should respect the user's locale.
- **Maintainability:** Codebase shall be modular with independent services to facilitate updates without downtime.

## Assumptions and Constraints

- Users will voluntarily provide shipping addresses and payment methods; the system cannot operate without at least one valid payment method for virtual gifts.
- The initial launch will support shipping within the United States; international fulfilment will come later.
- The AI cannot read users' emotions directly; triggers rely on contextual cues such as weather, calendar, user interaction times, and user feedback.
- Third-party merchants must supply inventory information and honour orders; service level agreements (SLAs) will be negotiated.
- Payment failures or fraud may occur; fallback flows must be in place.

## Acceptance Criteria

- User can sign up, select an AI personality, set a monthly budget, and provide shipping/billing information.
- The system respects the budget and does not exceed user-specified limits; budgets roll over if the user enables that option.
- The AI decision engine creates a pending gift decision when monthly schedule, contextual conditions, and random impulses align, never creating more than the allowed number of gift decisions per month.
- Admin approval is required before creating a PaymentIntent or starting fulfilment in private beta.
- Physical gifts are packaged with BlinkBox branding and shipped successfully; digital gifts are delivered instantly via email or in-app.
- The user receives personalised notifications with explanations, can track shipments, and can rate or request a refund.
- Payment processing uses Stripe or another PCI-compliant provider; no credit-card details are stored on BlinkBox servers.
- System performance meets the non-functional requirements for response time and availability.

## Open Questions

- Which merchant partners will provide the initial inventory? Are there minimum order quantities?
- How will the AI personality models be tuned and updated? Will there be a marketplace of custom personalities?
- What is the pricing model for premium personalities or additional budgets? Will there be tiered subscriptions?
- How will the MCP API authenticate external agents and prevent abuse?
- What regulatory requirements apply to sending digital tickets or vouchers, such as event policies?

## Appendix

This PRD follows widely accepted structures for product requirements documents, including defining purpose and scope, business objectives, personas, use cases, functional and non-functional requirements, assumptions, and acceptance criteria. Good PRDs align stakeholders and prevent scope creep by explicitly listing out-of-scope items and success metrics.
