import { getState } from "./mock-store";
import { makeId, nowIso } from "./utils";

export function createSupportRequest(input: {
  userId: string;
  orderId?: string;
  type: "refund" | "replacement" | "question";
  message: string;
}) {
  const request = {
    id: makeId("support"),
    userId: input.userId,
    orderId: input.orderId,
    type: input.type,
    status: "open" as const,
    message: input.message,
    createdAt: nowIso()
  };
  getState().support.push(request);
  return request;
}

export function listSupportRequests() {
  return getState().support;
}

export function resolveSupportRequest(id: string, resolution: string) {
  const request = getState().support.find((candidate) => candidate.id === id);
  if (!request) throw new Error("Support request not found");

  request.status = "resolved";
  request.resolution = resolution;
  return request;
}
