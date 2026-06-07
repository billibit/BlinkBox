import { getCurrentUser } from "@/lib/auth";
import { getBudget } from "@/lib/budget-service";
import { getDefaultPaymentMethod } from "@/lib/payment-service";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const budget = getBudget(user.id);
  const payment = getDefaultPaymentMethod(user.id);

  return (
    <main className="page">
      <h1>Onboarding</h1>
      <p className="lede">
        The MVP captures preferences, address, budget, and a saved card before monthly gift
        decisions can be reviewed by an admin.
      </p>

      <section className="grid">
        <form className="card stack" action="/api/onboarding" method="post">
          <h2>Profile and preferences</h2>
          <label>
            Name
            <input name="name" defaultValue={user.name} required />
          </label>
          <label>
            AI personality
            <select name="personality" defaultValue="cozy">
              <option value="cozy">Cozy</option>
              <option value="curious">Curious</option>
              <option value="chaos">Playful chaos</option>
            </select>
          </label>
          <label>
            Blocked categories
            <input name="blockedCategories" placeholder="e.g. snacks, fragrance" />
          </label>
          <button type="submit">Save onboarding</button>
        </form>

        <section className="card stack">
          <h2>Status</h2>
          <p>Budget: {budget ? "configured" : "missing"}</p>
          <p>Payment method: {payment ? "saved" : "missing"}</p>
          <p className="muted">Demo user is preloaded so the MVP loop can be tested immediately.</p>
        </section>
      </section>
    </main>
  );
}
