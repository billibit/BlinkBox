import { getRemainingBudget } from "./budget-service";
import { findCatalogItem } from "./catalog-service";
import { getState } from "./mock-store";
import { chargeGift } from "./payment-service";
import type { Order } from "./types";
import { makeId, nowIso } from "./utils";

export function listDecisions() {
  return getState().decisions;
}

export function getDecision(decisionId: string) {
  return getState().decisions.find((decision) => decision.id === decisionId) ?? null;
}

export async function approveDecision(decisionId: string, adminId: string) {
  const state = getState();
  const decision = getDecision(decisionId);
  if (!decision) throw new Error("Decision not found");
  if (decision.status !== "pending_admin_review") {
    throw new Error("Only pending decisions can be approved");
  }

  const item = findCatalogItem(decision.itemId);
  if (!item || !item.active || item.stock <= 0) {
    throw new Error("Gift item is unavailable");
  }

  if (item.priceCents > getRemainingBudget(decision.userId)) {
    throw new Error("Gift exceeds remaining budget");
  }

  const order: Order = {
    id: makeId("order"),
    userId: decision.userId,
    decisionId: decision.id,
    itemId: item.id,
    amountCents: item.priceCents,
    status: "payment_pending" as const,
    createdAt: nowIso()
  };

  state.orders.push(order);
  const paymentIntentId = await chargeGift({
    userId: order.userId,
    orderId: order.id,
    amountCents: order.amountCents
  });

  order.stripePaymentIntentId = paymentIntentId;
  order.status = "manual_fulfillment";
  item.stock -= 1;

  decision.status = "order_created";
  decision.reviewedAt = nowIso();
  decision.reviewedBy = adminId;

  return order;
}

export function rejectDecision(decisionId: string, adminId: string) {
  const decision = getDecision(decisionId);
  if (!decision) throw new Error("Decision not found");
  if (decision.status !== "pending_admin_review") {
    throw new Error("Only pending decisions can be rejected");
  }

  decision.status = "rejected";
  decision.reviewedAt = nowIso();
  decision.reviewedBy = adminId;
  return decision;
}
