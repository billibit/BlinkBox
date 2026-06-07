import { getCurrentUser } from "@/lib/auth";
import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <main className="page">
      <h1>Onboarding</h1>
      <p className="lede">
        Tell BlinkBox what you like, where gifts should go, and how much you want to spend each
        month.
      </p>

      <section className="grid">
        <form className="card soft stack" action="/api/onboarding" method="post">
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
          <button type="submit">
            <Sparkles size={18} strokeWidth={3} />
            Save onboarding
          </button>
        </form>

        <section className="card mint stack">
          <h2>A quiet start</h2>
          <p className="muted">
            Your answers help BlinkBox understand your taste without revealing what comes next.
          </p>
          <p className="muted">You can update these details any time.</p>
        </section>
      </section>
    </main>
  );
}
