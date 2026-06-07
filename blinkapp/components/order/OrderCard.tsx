import { findCatalogItem } from "@/lib/catalog-service";
import type { Order } from "@/lib/types";
import { currency } from "@/lib/utils";
import { StatusBadge } from "../ui/StatusBadge";
import { MessageCircleHeart, PackageCheck, Truck } from "lucide-react";

export function OrderCard({ order, admin = false }: { order: Order; admin?: boolean }) {
  const item = findCatalogItem(order.itemId);

  return (
    <section className="card mint">
      <div className="actions" style={{ justifyContent: "space-between", marginTop: 0 }}>
        <h3>
          <PackageCheck size={18} strokeWidth={3} />{" "}
          {admin ? item?.name ?? "Gift order" : "A BlinkBox surprise"}
        </h3>
        {admin ? <StatusBadge status={order.status} /> : null}
      </div>
      {admin ? (
        <p>
          <strong>{currency(order.amountCents)}</strong>
          {order.stripePaymentIntentId ? " · Payment confirmed" : ""}
        </p>
      ) : (
        <p className="muted">Details stay tucked away until the reveal.</p>
      )}
      {admin && order.trackingCode ? (
        <p>
          <Truck size={16} strokeWidth={3} /> Tracking: {order.trackingCode}
        </p>
      ) : null}
      {admin && order.fulfillmentNotes ? <p className="muted">{order.fulfillmentNotes}</p> : null}
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
          <button type="submit">
            <PackageCheck size={18} strokeWidth={3} />
            Mark fulfilled
          </button>
        </form>
      ) : null}
      {!admin && order.status === "fulfilled" ? (
        <div className="actions">
          <a className="button secondary" href={`/feedback/${order.id}`}>
            <MessageCircleHeart size={18} strokeWidth={3} />
            Leave feedback
          </a>
        </div>
      ) : null}
    </section>
  );
}
