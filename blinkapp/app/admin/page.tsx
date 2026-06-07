import { listCatalogItems } from "@/lib/catalog-service";
import { listDecisions } from "@/lib/decision-service";
import { listOrders } from "@/lib/order-service";
import { listSupportRequests } from "@/lib/support-service";
import { StatCard } from "@/components/ui/StatCard";
import { ClipboardCheck, Package, ShoppingBag, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const pending = listDecisions().filter((decision) => decision.status === "pending_admin_review");
  const manual = listOrders().filter((order) => order.status === "manual_fulfillment");

  return (
    <main className="page">
      <section className="hero-copy">
        <span className="tiny-note">Operations candy counter</span>
        <h1>Admin</h1>
        <p className="lede">
          Review AI gift picks, charge with PaymentIntents after approval, and record manual
          fulfilment.
        </p>
      </section>
      <section className="grid">
        <StatCard label="Pending decisions" value={String(pending.length)} tone="soft" />
        <StatCard label="Manual fulfilment" value={String(manual.length)} tone="mint" />
        <StatCard label="Catalog items" value={String(listCatalogItems().length)} tone="sunny" />
        <StatCard label="Support requests" value={String(listSupportRequests().length)} tone="sky" />
      </section>
      <section className="actions">
        <a className="button" href="/admin/decisions">
          <ClipboardCheck size={18} strokeWidth={3} />
          Decisions
        </a>
        <a className="button secondary" href="/admin/orders">
          <Package size={18} strokeWidth={3} />
          Orders
        </a>
        <a className="button secondary" href="/admin/catalog">
          <ShoppingBag size={18} strokeWidth={3} />
          Catalog
        </a>
        <a className="button secondary" href="/admin/users">
          <Users size={18} strokeWidth={3} />
          Users
        </a>
      </section>
    </main>
  );
}
