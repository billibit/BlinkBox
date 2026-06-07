import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);
export const giftTypeEnum = pgEnum("gift_type", ["physical", "digital"]);
export const decisionStatusEnum = pgEnum("decision_status", [
  "pending_admin_review",
  "approved",
  "rejected",
  "order_created"
]);
export const orderStatusEnum = pgEnum("order_status", [
  "payment_pending",
  "paid",
  "manual_fulfillment",
  "fulfilled",
  "failed",
  "refunded"
]);

export const users = pgTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  role: roleEnum("role").notNull().default("user"),
  timezone: varchar("timezone", { length: 100 }).notNull().default("America/Los_Angeles"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const addresses = pgTable("addresses", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("user_id", { length: 64 })
    .notNull()
    .references(() => users.id),
  recipientName: varchar("recipient_name", { length: 255 }).notNull(),
  line1: varchar("line1", { length: 255 }).notNull(),
  city: varchar("city", { length: 120 }).notNull(),
  state: varchar("state", { length: 60 }).notNull(),
  zip: varchar("zip", { length: 30 }).notNull(),
  country: varchar("country", { length: 2 }).notNull().default("US")
});

export const budgets = pgTable("budgets", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("user_id", { length: 64 })
    .notNull()
    .references(() => users.id),
  monthlyLimitCents: integer("monthly_limit_cents").notNull(),
  paused: boolean("paused").notNull().default(false),
  rolloverEnabled: boolean("rollover_enabled").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const paymentMethods = pgTable("payment_methods", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("user_id", { length: 64 })
    .notNull()
    .references(() => users.id),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }).notNull(),
  stripePaymentMethodId: varchar("stripe_payment_method_id", { length: 255 }).notNull(),
  isDefault: boolean("is_default").notNull().default(true),
  setupComplete: boolean("setup_complete").notNull().default(false)
});

export const giftSchedules = pgTable("gift_schedules", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("user_id", { length: 64 })
    .notNull()
    .references(() => users.id),
  cadence: varchar("cadence", { length: 20 }).notNull().default("monthly"),
  nextRunAt: timestamp("next_run_at", { withTimezone: true }).notNull(),
  lastRunAt: timestamp("last_run_at", { withTimezone: true }),
  paused: boolean("paused").notNull().default(false)
});

export const giftItems = pgTable("gift_items", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: giftTypeEnum("type").notNull(),
  priceCents: integer("price_cents").notNull(),
  stock: integer("stock").notNull(),
  category: varchar("category", { length: 120 }).notNull(),
  moodTags: text("mood_tags").notNull(),
  personalityTags: text("personality_tags").notNull(),
  supplierNotes: text("supplier_notes").notNull(),
  active: boolean("active").notNull().default(true)
});

export const decisions = pgTable("decisions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("user_id", { length: 64 })
    .notNull()
    .references(() => users.id),
  itemId: varchar("item_id", { length: 64 })
    .notNull()
    .references(() => giftItems.id),
  status: decisionStatusEnum("status").notNull().default("pending_admin_review"),
  reasoningText: text("reasoning_text").notNull(),
  contextState: text("context_state").notNull(),
  riskFlags: text("risk_flags").notNull().default("[]"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  reviewedBy: varchar("reviewed_by", { length: 64 })
});

export const orders = pgTable("orders", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("user_id", { length: 64 })
    .notNull()
    .references(() => users.id),
  decisionId: varchar("decision_id", { length: 64 })
    .notNull()
    .references(() => decisions.id),
  itemId: varchar("item_id", { length: 64 })
    .notNull()
    .references(() => giftItems.id),
  amountCents: integer("amount_cents").notNull(),
  status: orderStatusEnum("status").notNull().default("payment_pending"),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  trackingCode: varchar("tracking_code", { length: 255 }),
  fulfillmentNotes: text("fulfillment_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  fulfilledAt: timestamp("fulfilled_at", { withTimezone: true })
});

export const ledgerEntries = pgTable("ledger_entries", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("user_id", { length: 64 })
    .notNull()
    .references(() => users.id),
  orderId: varchar("order_id", { length: 64 }).references(() => orders.id),
  type: varchar("type", { length: 40 }).notNull(),
  amountCents: integer("amount_cents").notNull(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  idempotencyKey: varchar("idempotency_key", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});
