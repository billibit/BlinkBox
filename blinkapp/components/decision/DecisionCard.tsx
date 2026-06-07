import { findCatalogItem } from "@/lib/catalog-service";
import type { Decision } from "@/lib/types";
import { currency } from "@/lib/utils";
import { StatusBadge } from "../ui/StatusBadge";
import { BadgeDollarSign, ThumbsDown, WandSparkles } from "lucide-react";

export function DecisionCard({ decision }: { decision: Decision }) {
  const item = findCatalogItem(decision.itemId);

  return (
    <section className="card soft">
      <div className="actions" style={{ justifyContent: "space-between", marginTop: 0 }}>
        <h3>
          <WandSparkles size={18} strokeWidth={3} /> {item?.name ?? "Unknown gift"}
        </h3>
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
            <button type="submit">
              <BadgeDollarSign size={18} strokeWidth={3} />
              Approve and charge
            </button>
          </form>
          <form action={`/api/decisions/${decision.id}/reject`} method="post">
            <button className="danger" type="submit">
              <ThumbsDown size={18} strokeWidth={3} />
              Reject
            </button>
          </form>
        </div>
      ) : null}
    </section>
  );
}
