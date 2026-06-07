import { listCatalogItems } from "@/lib/catalog-service";
import { listDecisions } from "@/lib/decision-service";
import { listOrders } from "@/lib/order-service";
import { listSupportRequests } from "@/lib/support-service";
import { StatCard } from "@/components/ui/StatCard";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const pending = listDecisions().filter((decision) => decision.status === "pending_admin_review");
  const manual = listOrders().filter((order) => order.status === "manual_fulfillment");

  return (
    <main className="page">
      <h1>Admin</h1>
      <p className="lede">
        Private beta operations: review AI gift picks, charge with PaymentIntents after approval,
        and record manual fulfilment.
      </p>
      <section className="grid">
        <StatCard label="Pending decisions" value={String(pending.length)} />
        <StatCard label="Manual fulfilment" value={String(manual.length)} />
        <StatCard label="Catalog items" value={String(listCatalogItems().length)} />
        <StatCard label="Support requests" value={String(listSupportRequests().length)} />
      </section>
      <section className="actions">
        <a className="button" href="/admin/decisions">
          Decisions
        </a>
        <a className="button secondary" href="/admin/orders">
          Orders
        </a>
        <a className="button secondary" href="/admin/catalog">
          Catalog
        </a>
        <a className="button secondary" href="/admin/support">
          Support
        </a>
      </section>
    </main>
  );
}
