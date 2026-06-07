import { beforeEach, describe, expect, it } from "vitest";
import { approveDecision } from "../lib/decision-service";
import { getState, resetStateForTests } from "../lib/mock-store";

describe("admin decision flow", () => {
  beforeEach(() => resetStateForTests());

  it("does not create an order before admin approval", () => {
    expect(getState().decisions[0]?.status).toBe("pending_admin_review");
    expect(getState().orders).toHaveLength(0);
    expect(getState().ledger).toHaveLength(0);
  });

  it("creates an order and payment intent after approval", async () => {
    const order = await approveDecision("decision_1", "admin_1");

    expect(order.status).toBe("manual_fulfillment");
    expect(order.stripePaymentIntentId).toMatch(/^pi_demo/);
    expect(getState().ledger).toHaveLength(1);
  });
});
