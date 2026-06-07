import { DecisionCard } from "@/components/decision/DecisionCard";
import { listDecisions } from "@/lib/decision-service";

export const dynamic = "force-dynamic";

export default function AdminDecisionsPage() {
  const decisions = listDecisions();

  return (
    <main className="page">
      <h1>Decision review</h1>
      <p className="lede">
        Every AI gift in private beta must be approved here before a PaymentIntent is created.
      </p>
      <form action="/api/schedules/run" method="post" className="actions">
        <button type="submit">Run due schedules</button>
      </form>
      <div className="grid" style={{ marginTop: 18 }}>
        {decisions.length ? decisions.map((decision) => <DecisionCard key={decision.id} decision={decision} />) : <p className="muted">No decisions yet.</p>}
      </div>
    </main>
  );
}
