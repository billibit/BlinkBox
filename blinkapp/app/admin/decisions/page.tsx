import { DecisionCard } from "@/components/decision/DecisionCard";
import { listDecisions } from "@/lib/decision-service";
import { CalendarDays } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminDecisionsPage() {
  const decisions = listDecisions();

  return (
    <main className="page">
      <h1>Decision review</h1>
      <p className="lede">
        Every AI gift must be approved here before a PaymentIntent is created.
      </p>
      <form action="/api/schedules/run" method="post" className="actions">
        <button type="submit">
          <CalendarDays size={18} strokeWidth={3} />
          Run due schedules
        </button>
      </form>
      <div className="grid section-band">
        {decisions.length ? (
          decisions.map((decision) => <DecisionCard key={decision.id} decision={decision} />)
        ) : (
          <section className="card sky">
            <h3>No decisions yet.</h3>
            <p className="muted">Run due schedules to make the next surprise candidate.</p>
          </section>
        )}
      </div>
    </main>
  );
}
