import type { AppState } from "./types";

const now = new Date("2026-06-07T12:00:00.000Z").toISOString();

const initialState: AppState = {
  users: [
    {
      id: "user_beta_1",
      email: "alex@example.com",
      name: "Alex Chen",
      role: "user",
      timezone: "America/Los_Angeles",
      createdAt: now
    },
    {
      id: "admin_1",
      email: "operator@blinkbox.test",
      name: "BlinkBox Operator",
      role: "admin",
      timezone: "America/Los_Angeles",
      createdAt: now
    }
  ],
  addresses: [
    {
      id: "addr_1",
      userId: "user_beta_1",
      recipientName: "Alex Chen",
      line1: "101 Market St",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      country: "US"
    }
  ],
  budgets: [
    {
      id: "budget_1",
      userId: "user_beta_1",
      monthlyLimitCents: 3500,
      paused: false,
      rolloverEnabled: false,
      createdAt: now
    }
  ],
  paymentMethods: [
    {
      id: "pm_ref_1",
      userId: "user_beta_1",
      stripeCustomerId: "cus_demo_alex",
      stripePaymentMethodId: "pm_demo_saved_card",
      default: true,
      setupComplete: true
    }
  ],
  schedules: [
    {
      id: "sched_1",
      userId: "user_beta_1",
      cadence: "monthly",
      nextRunAt: "2026-06-07T12:00:00.000Z",
      paused: false
    }
  ],
  catalog: [
    {
      id: "gift_tea_kit",
      name: "Rainy Day Tea Kit",
      type: "physical",
      priceCents: 1800,
      stock: 8,
      category: "self-care",
      moodTags: ["cozy", "calm"],
      personalityTags: ["cozy", "thoughtful"],
      supplierNotes: "Manual purchase from curated local supplier.",
      active: true
    },
    {
      id: "gift_indie_game",
      name: "Indie Game Night Code",
      type: "digital",
      priceCents: 1200,
      stock: 20,
      category: "entertainment",
      moodTags: ["playful", "surprise"],
      personalityTags: ["chaos", "curious"],
      supplierNotes: "Manual digital key delivery.",
      active: true
    },
    {
      id: "gift_desk_bloom",
      name: "Desk Bloom Mini Plant",
      type: "physical",
      priceCents: 2400,
      stock: 5,
      category: "home",
      moodTags: ["fresh", "focus"],
      personalityTags: ["cozy", "bright"],
      supplierNotes: "Manual fulfilment, avoid extreme-weather shipping days.",
      active: true
    }
  ],
  decisions: [
    {
      id: "decision_1",
      userId: "user_beta_1",
      itemId: "gift_tea_kit",
      status: "pending_admin_review",
      reasoningText:
        "A calm, low-cost surprise that fits Alex's cozy preference and today's rainy context.",
      contextState: "Rain expected in San Francisco; monthly surprise window is due.",
      riskFlags: [],
      createdAt: now
    }
  ],
  orders: [],
  ledger: [],
  feedback: [],
  support: []
};

declare global {
  var blinkboxState: AppState | undefined;
}

export function getState(): AppState {
  if (!globalThis.blinkboxState) {
    globalThis.blinkboxState = structuredClone(initialState);
  }

  return globalThis.blinkboxState;
}

export function resetStateForTests() {
  globalThis.blinkboxState = structuredClone(initialState);
}
