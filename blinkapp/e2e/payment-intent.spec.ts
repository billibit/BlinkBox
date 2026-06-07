import { beforeEach, describe, expect, it } from "vitest";
import { approveDecision } from "../lib/decision-service";
import { getState, resetStateForTests } from "../lib/mock-store";

describe("payment intent guardrail", () => {
  beforeEach(() => resetStateForTests());

  it("creates exactly one charge ledger entry for an approved decision", async () => {
    await approveDecision("decision_1", "admin_1");

    const charges = getState().ledger.filter((entry) => entry.type === "charge");
    expect(charges).toHaveLength(1);
    expect(charges[0]?.idempotencyKey).toContain("gift-charge:");
  });
});
