import { findCatalogItem } from "./catalog-service";
import { getState } from "./mock-store";
import { nowIso } from "./utils";

export function listOrders() {
  return getState().orders;
}

export function listOrdersForUser(userId: string) {
  return getState().orders.filter((order) => order.userId === userId);
}

export function fulfillOrder(input: {
  orderId: string;
  trackingCode?: string;
  fulfillmentNotes: string;
}) {
  const order = getState().orders.find((candidate) => candidate.id === input.orderId);
  if (!order) throw new Error("Order not found");
  if (order.status !== "manual_fulfillment") {
    throw new Error("Only manually fulfilment-ready orders can be fulfilled");
  }

  order.status = "fulfilled";
  order.trackingCode = input.trackingCode;
  order.fulfillmentNotes = input.fulfillmentNotes;
  order.fulfilledAt = nowIso();
  return order;
}

export function getOrderView(orderId: string) {
  const order = getState().orders.find((candidate) => candidate.id === orderId);
  if (!order) return null;
  return {
    ...order,
    item: findCatalogItem(order.itemId)
  };
}
