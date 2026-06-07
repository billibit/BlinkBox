import { findCatalogItem } from "@/lib/catalog-service";
import type { Decision } from "@/lib/types";
import { currency } from "@/lib/utils";
import { StatusBadge } from "../ui/StatusBadge";

export function DecisionCard({ decision }: { decision: Decision }) {
  const item = findCatalogItem(decision.itemId);

  return (
    <section className="card">
      <div className="actions" style={{ justifyContent: "space-between", marginTop: 0 }}>
        <h3>{item?.name ?? "Unknown gift"}</h3>
        <StatusBadge status={decision.status} />
      </div>
      <p className="muted">{decision.contextState}</p>
      <p>{decision.reasoningText}</p>
      {item ? (
        <p>
          <strong>{currency(item.priceCents)}</strong> · {item.category} · {item.type}
        </p>
      ) : null}
      {decision.status === "pending_admin_review" ? (
        <div className="actions">
          <form action={`/api/decisions/${decision.id}/approve`} method="post">
            <button type="submit">Approve and charge</button>
          </form>
          <form action={`/api/decisions/${decision.id}/reject`} method="post">
            <button className="danger" type="submit">
              Reject
            </button>
          </form>
        </div>
      ) : null}
    </section>
  );
}
