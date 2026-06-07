# BlinkBox Stripe Payment Design

## Decision

Use Stripe Checkout setup mode backed by SetupIntents to collect and save a user's payment method during onboarding. Use PaymentIntents for later AI-triggered off-session gift charges, refunds, and payment lifecycle tracking.

Do not use Stripe Payment Links as the primary MVP payment integration. Payment Links are useful for a simple beta subscription or prepaid top-up, but BlinkBox needs server-side control over budget guardrails, saved payment references, idempotency, per-gift charging, and webhook reconciliation.

MVP decision: use the saved-card per-gift charging model. Every private-beta gift must be approved by an admin before BlinkBox creates the PaymentIntent or starts fulfilment.

## Stripe Features by Job

| BlinkBox job | Stripe feature | Why |
| --- | --- | --- |
| Save a payment method without charging immediately | Checkout Session in `setup` mode / SetupIntent | Hosted Stripe UI, payment method saved to a Customer, optimized for future off-session payments. |
| Charge for an AI-selected gift later | PaymentIntent with saved Customer payment method | Creates the actual charge when BlinkBox knows the gift amount and has checked budget guardrails. |
| Charge first month or prepaid wallet amount during onboarding | Checkout Session in `payment` mode with `payment_intent_data[setup_future_usage]=off_session` | Collects money now and saves the payment method for future off-session use. |
| Fixed recurring membership only | Stripe Subscription | Useful later for a membership fee, but not enough for variable per-gift charges by itself. |
| No-code/simple beta payment | Payment Link | Fastest to launch, but too limited for the core autonomous gift-spend loop. |

## MVP Recommendation

Use the saved-card model:

1. Onboarding creates or retrieves a Stripe Customer.
2. Backend creates a Checkout Session in `setup` mode.
3. User completes Stripe-hosted setup.
4. Webhook confirms the SetupIntent and saved PaymentMethod.
5. BlinkBox stores only Stripe IDs.
6. Monthly schedule creates a pending gift decision.
7. Admin reviews and approves the gift.
8. BlinkBox checks the budget ledger and creates a PaymentIntent for the exact gift amount.
9. If payment succeeds, the order moves to manual fulfilment.

The prepaid-wallet model is out of scope for MVP. It can be reconsidered later if the product changes toward top-ups or stored-value budgeting.

## Required Webhooks

Handle at least:

- `checkout.session.completed`
- `setup_intent.succeeded`
- `setup_intent.setup_failed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`

Webhook handlers must be idempotent and must update the Supabase Postgres ledger/order state, not only Stripe state.

## Data to Store

Store Stripe references, not card details:

- `stripe_customer_id`
- `stripe_payment_method_id`
- `stripe_setup_intent_id`
- `stripe_payment_intent_id`
- `stripe_charge_id`
- webhook event IDs for idempotency

Budget balance should still come from BlinkBox ledger transactions in Supabase Postgres.

## Guardrails

- Never create a PaymentIntent before checking remaining budget, gift eligibility, blocked categories, and order idempotency.
- Never create a PaymentIntent before admin approval in private beta.
- Use idempotency keys when creating SetupIntents, Checkout Sessions, PaymentIntents, refunds, and ledger transactions.
- Failed PaymentIntents must not create fulfilled orders.
- Failed fulfilment must not create duplicate charges.
- User-facing consent copy must explain future off-session gift charges within the approved budget.
