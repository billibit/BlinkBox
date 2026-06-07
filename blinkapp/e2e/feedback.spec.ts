import { describe, expect, it } from "vitest";
import { createFeedback } from "../lib/feedback-service";
import { getState, resetStateForTests } from "../lib/mock-store";

describe("feedback", () => {
  it("records gift feedback for learning loops", () => {
    resetStateForTests();
    createFeedback({
      orderId: "order_demo",
      rating: 5,
      liked: true,
      comment: "Great fit"
    });

    expect(getState().feedback[0]?.comment).toBe("Great fit");
  });
});
