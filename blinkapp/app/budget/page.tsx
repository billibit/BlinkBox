import { getCurrentUser } from "@/lib/auth";
import { getBudget, getRemainingBudget } from "@/lib/budget-service";
import { getDefaultPaymentMethod } from "@/lib/payment-service";
import { currency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BudgetPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const budget = getBudget(user.id);
  const payment = getDefaultPaymentMethod(user.id);

  return (
    <main className="page">
      <h1>Budget</h1>
      <section className="grid">
        <form className="card stack" action="/api/budget" method="post">
          <h2>Monthly budget</h2>
          <label>
            Monthly limit
            <input
              name="monthlyLimit"
              type="number"
              min="5"
              step="1"
              defaultValue={budget ? budget.monthlyLimitCents / 100 : 35}
              required
            />
          </label>
          <label>
            Pause gifting
            <select name="paused" defaultValue={budget?.paused ? "true" : "false"}>
              <option value="false">Active</option>
              <option value="true">Paused</option>
            </select>
          </label>
          <label>
            Rollover
            <select name="rolloverEnabled" defaultValue={budget?.rolloverEnabled ? "true" : "false"}>
              <option value="false">Off for MVP</option>
              <option value="true">Enabled</option>
            </select>
          </label>
          <button type="submit">Save budget</button>
        </form>

        <section className="card stack">
          <h2>Payment setup</h2>
          <p>
            Saved card:{" "}
            <strong>{payment ? payment.stripePaymentMethodId : "not configured"}</strong>
          </p>
          <p>Remaining this cycle: {currency(getRemainingBudget(user.id))}</p>
          <form action="/api/payment/setup" method="post">
            <button type="submit">Start Stripe setup</button>
          </form>
          <p className="muted">
            In production this opens Stripe Checkout setup mode. In this local MVP it redirects
            back with a demo setup result.
          </p>
        </section>
      </section>
    </main>
  );
}
