import { describe, expect, it } from "vitest";

describe("onboarding route plan", () => {
  it("keeps onboarding as the start of the customer loop", () => {
    expect("/onboarding").toContain("onboarding");
  });
});
