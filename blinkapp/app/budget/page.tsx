import { getCurrentUser } from "@/lib/auth";
import { getBudget } from "@/lib/budget-service";
import { CreditCard, Save } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BudgetPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const budget = getBudget(user.id);

  return (
    <main className="page">
      <h1>Budget</h1>
      <section className="grid">
        <form className="card sunny stack" action="/api/budget" method="post">
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
              <option value="false">Off</option>
              <option value="true">Enabled</option>
            </select>
          </label>
          <button type="submit">
            <Save size={18} strokeWidth={3} />
            Save budget
          </button>
        </form>

        <section className="card sky stack">
          <h2>Payment setup</h2>
          <form action="/api/payment/setup" method="post">
            <button type="submit">
              <CreditCard size={18} strokeWidth={3} />
              Start Stripe setup
            </button>
          </form>
          <p className="muted">
            BlinkBox uses secure Stripe setup for future gifts, while the surprise itself stays
            under wraps.
          </p>
        </section>
      </section>
    </main>
  );
}
