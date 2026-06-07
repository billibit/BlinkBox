# BlinkBox Agent Instructions

This file contains repo-wide guidance for coding agents and contributors.

## Repository Boundaries

- `blinkapp/` owns the customer/admin product app, API routes, domain services, database schema, migrations, tests, and app package config.
- `agents/` owns separately deployable agent scripts, adapters, and skills.
- `docs/` owns PRD, architecture, diagrams, MVP scope, payment design, and implementation planning artifacts.

## Operating Rules

- Keep approvals, payments, orders, fulfilment state, support, and audit history inside `blinkapp/`.
- Agent skills may recommend, rank, research, or enrich candidates, but they must not charge cards, approve decisions, mutate orders directly, or fulfil purchases without app-side authorization.
- Prefer Postgres-backed MVP scheduling before adding queue infrastructure.
- Use Stripe SetupIntent or Checkout setup mode to save payment methods, then Stripe PaymentIntent per admin-approved gift.
- During private beta, every AI gift decision requires admin approval before charge or fulfilment.
