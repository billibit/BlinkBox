import { getState } from "./mock-store";
import { makeId, nowIso } from "./utils";

export function createFeedback(input: {
  orderId: string;
  rating: number;
  liked: boolean;
  comment: string;
}) {
  const feedback = {
    id: makeId("feedback"),
    orderId: input.orderId,
    rating: input.rating,
    liked: input.liked,
    comment: input.comment,
    createdAt: nowIso()
  };
  getState().feedback.push(feedback);
  return feedback;
}

export function listFeedback() {
  return getState().feedback;
}
