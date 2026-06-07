import { getState } from "./mock-store";

export function getBudget(userId: string) {
  return getState().budgets.find((budget) => budget.userId === userId) ?? null;
}

export function getSpentThisCycle(userId: string) {
  return getState()
    .ledger.filter((entry) => entry.userId === userId && entry.type === "charge")
    .reduce((sum, entry) => sum + entry.amountCents, 0);
}

export function getRemainingBudget(userId: string) {
  const budget = getBudget(userId);
  if (!budget) return 0;
  return Math.max(0, budget.monthlyLimitCents - getSpentThisCycle(userId));
}

export function updateBudget(input: {
  userId: string;
  monthlyLimitCents: number;
  paused: boolean;
  rolloverEnabled: boolean;
}) {
  const state = getState();
  const existing = state.budgets.find((budget) => budget.userId === input.userId);

  if (existing) {
    existing.monthlyLimitCents = input.monthlyLimitCents;
    existing.paused = input.paused;
    existing.rolloverEnabled = input.rolloverEnabled;
    return existing;
  }

  const budget = {
    id: `budget_${input.userId}`,
    userId: input.userId,
    monthlyLimitCents: input.monthlyLimitCents,
    paused: input.paused,
    rolloverEnabled: input.rolloverEnabled,
    createdAt: new Date().toISOString()
  };
  state.budgets.push(budget);
  return budget;
}
