import { beforeEach, describe, expect, it } from "vitest";
import { POST } from "../app/api/budget/route";
import { getBudget } from "../lib/budget-service";
import { getState, resetStateForTests } from "../lib/mock-store";

function budgetRequest(monthlyLimit: string) {
  const formData = new FormData();
  formData.set("monthlyLimit", monthlyLimit);
  formData.set("paused", "false");
  formData.set("rolloverEnabled", "false");

  return new Request("http://localhost/api/budget", {
    method: "POST",
    body: formData
  });
}

describe("budget route", () => {
  beforeEach(() => resetStateForTests());

  it("saves budget and stays on budget when payment is already set", async () => {
    const response = await POST(budgetRequest("42"));

    expect(response.headers.get("location")).toBe("http://localhost/budget");
    expect(getBudget("user_beta_1")?.monthlyLimitCents).toBe(4200);
  });

  it("saves budget and starts Stripe setup when payment is missing", async () => {
    getState().paymentMethods = [];

    const response = await POST(budgetRequest("55"));

    expect(response.headers.get("location")).toBe("http://localhost/budget?setup=complete");
    expect(getBudget("user_beta_1")?.monthlyLimitCents).toBe(5500);
  });
});
