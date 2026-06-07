export type Role = "user" | "admin";

export type GiftType = "physical" | "digital";

export type DecisionStatus =
  | "pending_admin_review"
  | "approved"
  | "rejected"
  | "order_created";

export type OrderStatus =
  | "payment_pending"
  | "paid"
  | "manual_fulfillment"
  | "fulfilled"
  | "failed"
  | "refunded";

export type LedgerEntryType = "charge" | "refund" | "adjustment";

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  timezone: string;
  createdAt: string;
};

export type Address = {
  id: string;
  userId: string;
  recipientName: string;
  line1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type Budget = {
  id: string;
  userId: string;
  monthlyLimitCents: number;
  paused: boolean;
  rolloverEnabled: boolean;
  createdAt: string;
};

export type PaymentMethod = {
  id: string;
  userId: string;
  stripeCustomerId: string;
  stripePaymentMethodId: string;
  default: boolean;
  setupComplete: boolean;
};

export type GiftSchedule = {
  id: string;
  userId: string;
  cadence: "monthly";
  nextRunAt: string;
  lastRunAt?: string;
  paused: boolean;
};

export type GiftItem = {
  id: string;
  name: string;
  type: GiftType;
  priceCents: number;
  stock: number;
  category: string;
  moodTags: string[];
  personalityTags: string[];
  supplierNotes: string;
  active: boolean;
};

export type Decision = {
  id: string;
  userId: string;
  itemId: string;
  status: DecisionStatus;
  reasoningText: string;
  contextState: string;
  riskFlags: string[];
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
};

export type Order = {
  id: string;
  userId: string;
  decisionId: string;
  itemId: string;
  amountCents: number;
  status: OrderStatus;
  stripePaymentIntentId?: string;
  trackingCode?: string;
  fulfillmentNotes?: string;
  createdAt: string;
  fulfilledAt?: string;
};

export type LedgerEntry = {
  id: string;
  userId: string;
  orderId?: string;
  type: LedgerEntryType;
  amountCents: number;
  stripePaymentIntentId?: string;
  idempotencyKey: string;
  createdAt: string;
};

export type Feedback = {
  id: string;
  orderId: string;
  rating: number;
  liked: boolean;
  comment: string;
  createdAt: string;
};

export type SupportRequest = {
  id: string;
  userId: string;
  orderId?: string;
  type: "refund" | "replacement" | "question";
  status: "open" | "resolved";
  message: string;
  resolution?: string;
  createdAt: string;
};

export type AppState = {
  users: User[];
  addresses: Address[];
  budgets: Budget[];
  paymentMethods: PaymentMethod[];
  schedules: GiftSchedule[];
  catalog: GiftItem[];
  decisions: Decision[];
  orders: Order[];
  ledger: LedgerEntry[];
  feedback: Feedback[];
  support: SupportRequest[];
};
