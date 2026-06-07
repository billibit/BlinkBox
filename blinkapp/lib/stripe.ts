import { makeId } from "./utils";

export async function createSetupSession(userId: string) {
  return {
    id: makeId("cs_setup"),
    userId,
    mode: "setup" as const,
    url: "/budget?setup=demo-complete"
  };
}

export async function createPaymentIntent(input: {
  userId: string;
  amountCents: number;
  idempotencyKey: string;
}) {
  return {
    id: makeId("pi_demo"),
    status: "succeeded" as const,
    amount: input.amountCents,
    userId: input.userId,
    idempotencyKey: input.idempotencyKey
  };
}
