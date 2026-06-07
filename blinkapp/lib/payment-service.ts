import { getState } from "./mock-store";
import { createPaymentIntent, createSetupSession } from "./stripe";
import { makeId, nowIso } from "./utils";

export function getDefaultPaymentMethod(userId: string) {
  return (
    getState().paymentMethods.find(
      (method) => method.userId === userId && method.default && method.setupComplete
    ) ?? null
  );
}

export async function startPaymentSetup(userId: string) {
  return createSetupSession(userId);
}

export async function chargeGift(input: {
  userId: string;
  orderId: string;
  amountCents: number;
}) {
  const paymentMethod = getDefaultPaymentMethod(input.userId);
  if (!paymentMethod) {
    throw new Error("User does not have a saved payment method");
  }

  const idempotencyKey = `gift-charge:${input.orderId}`;
  const existing = getState().ledger.find((entry) => entry.idempotencyKey === idempotencyKey);
  if (existing?.stripePaymentIntentId) {
    return existing.stripePaymentIntentId;
  }

  const intent = await createPaymentIntent({
    userId: input.userId,
    amountCents: input.amountCents,
    idempotencyKey
  });

  getState().ledger.push({
    id: makeId("ledger"),
    userId: input.userId,
    orderId: input.orderId,
    type: "charge",
    amountCents: input.amountCents,
    stripePaymentIntentId: intent.id,
    idempotencyKey,
    createdAt: nowIso()
  });

  return intent.id;
}
