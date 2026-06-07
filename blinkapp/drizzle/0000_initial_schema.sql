CREATE TYPE role AS ENUM ('user', 'admin');
CREATE TYPE gift_type AS ENUM ('physical', 'digital');
CREATE TYPE decision_status AS ENUM ('pending_admin_review', 'approved', 'rejected', 'order_created');
CREATE TYPE order_status AS ENUM ('payment_pending', 'paid', 'manual_fulfillment', 'fulfilled', 'failed', 'refunded');

CREATE TABLE users (
  id varchar(64) PRIMARY KEY,
  email varchar(255) NOT NULL UNIQUE,
  name varchar(255) NOT NULL,
  role role NOT NULL DEFAULT 'user',
  timezone varchar(100) NOT NULL DEFAULT 'America/Los_Angeles',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE addresses (
  id varchar(64) PRIMARY KEY,
  user_id varchar(64) NOT NULL REFERENCES users(id),
  recipient_name varchar(255) NOT NULL,
  line1 varchar(255) NOT NULL,
  city varchar(120) NOT NULL,
  state varchar(60) NOT NULL,
  zip varchar(30) NOT NULL,
  country varchar(2) NOT NULL DEFAULT 'US'
);

CREATE TABLE budgets (
  id varchar(64) PRIMARY KEY,
  user_id varchar(64) NOT NULL REFERENCES users(id),
  monthly_limit_cents integer NOT NULL,
  paused boolean NOT NULL DEFAULT false,
  rollover_enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE payment_methods (
  id varchar(64) PRIMARY KEY,
  user_id varchar(64) NOT NULL REFERENCES users(id),
  stripe_customer_id varchar(255) NOT NULL,
  stripe_payment_method_id varchar(255) NOT NULL,
  is_default boolean NOT NULL DEFAULT true,
  setup_complete boolean NOT NULL DEFAULT false
);

CREATE TABLE gift_schedules (
  id varchar(64) PRIMARY KEY,
  user_id varchar(64) NOT NULL REFERENCES users(id),
  cadence varchar(20) NOT NULL DEFAULT 'monthly',
  next_run_at timestamptz NOT NULL,
  last_run_at timestamptz,
  paused boolean NOT NULL DEFAULT false
);

CREATE TABLE gift_items (
  id varchar(64) PRIMARY KEY,
  name varchar(255) NOT NULL,
  type gift_type NOT NULL,
  price_cents integer NOT NULL,
  stock integer NOT NULL,
  category varchar(120) NOT NULL,
  mood_tags text NOT NULL,
  personality_tags text NOT NULL,
  supplier_notes text NOT NULL,
  active boolean NOT NULL DEFAULT true
);

CREATE TABLE decisions (
  id varchar(64) PRIMARY KEY,
  user_id varchar(64) NOT NULL REFERENCES users(id),
  item_id varchar(64) NOT NULL REFERENCES gift_items(id),
  status decision_status NOT NULL DEFAULT 'pending_admin_review',
  reasoning_text text NOT NULL,
  context_state text NOT NULL,
  risk_flags text NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by varchar(64)
);

CREATE TABLE orders (
  id varchar(64) PRIMARY KEY,
  user_id varchar(64) NOT NULL REFERENCES users(id),
  decision_id varchar(64) NOT NULL REFERENCES decisions(id),
  item_id varchar(64) NOT NULL REFERENCES gift_items(id),
  amount_cents integer NOT NULL,
  status order_status NOT NULL DEFAULT 'payment_pending',
  stripe_payment_intent_id varchar(255),
  tracking_code varchar(255),
  fulfillment_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  fulfilled_at timestamptz
);

CREATE TABLE ledger_entries (
  id varchar(64) PRIMARY KEY,
  user_id varchar(64) NOT NULL REFERENCES users(id),
  order_id varchar(64) REFERENCES orders(id),
  type varchar(40) NOT NULL,
  amount_cents integer NOT NULL,
  stripe_payment_intent_id varchar(255),
  idempotency_key varchar(255) NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
