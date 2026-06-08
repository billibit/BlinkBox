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
        Tell BlinkBox a little about yourself. Your AI companion will use it to understand your
        taste and prepare better surprises.
      </p>

      <section className="onboarding-flow">
        <form className="card soft stack center-card" action="/api/onboarding" method="post">
          <h2>Tell me about yourself</h2>
          <label>
            Name
            <input name="name" defaultValue={user.name} required />
          </label>
          <label>
            Tell me about yourself
            <textarea
              name="aboutYourself"
              placeholder="Things you love, things you avoid, tiny joys, hobbies, colors, snacks, routines, moods..."
              required
            />
          </label>
          <button type="submit">
            <Sparkles size={18} strokeWidth={3} />
            Save
          </button>
        </form>

        <section className="card mint stack quiet-note">
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
