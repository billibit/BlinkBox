import { getBudget, getRemainingBudget } from "@/lib/budget-service";
import { listDecisions } from "@/lib/decision-service";
import { getCurrentUser } from "@/lib/auth";
import { listOrdersForUser } from "@/lib/order-service";
import { currency } from "@/lib/utils";
import { StatCard } from "@/components/ui/StatCard";
import { OrderCard } from "@/components/order/OrderCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const budget = getBudget(user.id);
  const orders = listOrdersForUser(user.id);
  const pendingDecisions = listDecisions().filter(
    (decision) => decision.userId === user.id && decision.status === "pending_admin_review"
  );

  return (
    <main className="page">
      <section className="hero">
        <div>
          <h1>Surprise gifting, with human approval.</h1>
          <p className="lede">
            BlinkBox lets beta users set a monthly budget while operators review every AI pick
            before a Stripe PaymentIntent is created and the gift is manually fulfilled.
          </p>
          <div className="actions">
            <a className="button" href="/onboarding">
              Finish onboarding
            </a>
            <a className="button secondary" href="/admin/decisions">
              Review decisions
            </a>
          </div>
        </div>
        <section className="card">
          <h2>Private beta loop</h2>
          <p className="muted">SetupIntent saves card. Admin approval creates PaymentIntent. Manual fulfilment closes the loop.</p>
          <div className="stack">
            <span className="pill">PaymentIntent per gift</span>
            <span className="pill">Postgres schedule rows</span>
            <span className="pill">Manual admin fulfilment</span>
          </div>
        </section>
      </section>

      <section className="grid">
        <StatCard label="Monthly limit" value={budget ? currency(budget.monthlyLimitCents) : "$0.00"} />
        <StatCard label="Remaining" value={currency(getRemainingBudget(user.id))} />
        <StatCard label="Pending reviews" value={String(pendingDecisions.length)} />
      </section>

      <section style={{ marginTop: 28 }}>
        <h2>Recent gifts</h2>
        <div className="grid">
          {orders.length ? orders.map((order) => <OrderCard key={order.id} order={order} />) : <p className="muted">No orders yet. Run the admin decision flow to create one.</p>}
        </div>
      </section>
    </main>
  );
}
