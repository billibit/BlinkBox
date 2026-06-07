import { getRemainingBudget } from "./budget-service";
import { findCatalogItem } from "./catalog-service";
import { getState } from "./mock-store";
import { makeId, nextRandomMonthlyDate, nowIso } from "./utils";

export function listDueSchedules(asOf = new Date()) {
  return getState().schedules.filter(
    (schedule) => !schedule.paused && new Date(schedule.nextRunAt).getTime() <= asOf.getTime()
  );
}

export function runDueSchedules(asOf = new Date()) {
  const state = getState();
  const created = [];

  for (const schedule of listDueSchedules(asOf)) {
    const user = state.users.find((candidate) => candidate.id === schedule.userId);
    const budget = state.budgets.find((candidate) => candidate.userId === schedule.userId);
    const hasPending = state.decisions.some(
      (decision) =>
        decision.userId === schedule.userId && decision.status === "pending_admin_review"
    );

    if (!user || budget?.paused || hasPending) {
      schedule.nextRunAt = nextRandomMonthlyDate(asOf);
      continue;
    }

    const item = state.catalog.find(
      (candidate) =>
        candidate.active &&
        candidate.stock > 0 &&
        candidate.priceCents <= getRemainingBudget(schedule.userId)
    );

    if (!item) {
      schedule.nextRunAt = nextRandomMonthlyDate(asOf);
      continue;
    }

    const decision = {
      id: makeId("decision"),
      userId: schedule.userId,
      itemId: item.id,
      status: "pending_admin_review" as const,
      reasoningText: buildReasoning(item.id),
      contextState: "Monthly surprise window is due; using lightweight date/weather context.",
      riskFlags: [],
      createdAt: nowIso()
    };

    state.decisions.push(decision);
    schedule.lastRunAt = nowIso();
    schedule.nextRunAt = nextRandomMonthlyDate(asOf);
    created.push(decision);
  }

  return created;
}

function buildReasoning(itemId: string) {
  const item = findCatalogItem(itemId);
  return item
    ? `${item.name} fits the user's current budget and keeps the beta surprise low-risk.`
    : "Gift candidate fits the user's current budget and beta guardrails.";
}
