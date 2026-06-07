import { findCatalogItem } from "@/lib/catalog-service";
import type { Order } from "@/lib/types";
import { currency } from "@/lib/utils";
import { StatusBadge } from "../ui/StatusBadge";

export function OrderCard({ order, admin = false }: { order: Order; admin?: boolean }) {
  const item = findCatalogItem(order.itemId);

  return (
    <section className="card">
      <div className="actions" style={{ justifyContent: "space-between", marginTop: 0 }}>
        <h3>{item?.name ?? "Gift order"}</h3>
        <StatusBadge status={order.status} />
      </div>
      <p>
        <strong>{currency(order.amountCents)}</strong>
        {order.stripePaymentIntentId ? ` · ${order.stripePaymentIntentId}` : ""}
      </p>
      {order.trackingCode ? <p>Tracking: {order.trackingCode}</p> : null}
      {order.fulfillmentNotes ? <p className="muted">{order.fulfillmentNotes}</p> : null}
      {admin && order.status === "manual_fulfillment" ? (
        <form className="stack" action={`/api/orders/${order.id}/fulfill`} method="post">
          <label>
            Tracking code
            <input name="trackingCode" placeholder="Optional for digital gifts" />
          </label>
          <label>
            Fulfilment notes
            <textarea name="fulfillmentNotes" required placeholder="Receipt, supplier, digital key, or notes" />
          </label>
          <button type="submit">Mark fulfilled</button>
        </form>
      ) : null}
      {!admin && order.status === "fulfilled" ? (
        <div className="actions">
          <a className="button secondary" href={`/feedback/${order.id}`}>
            Leave feedback
          </a>
        </div>
      ) : null}
    </section>
  );
}
