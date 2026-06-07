# BlinkBox Agents

`agents/` contains portable agent capabilities that can run separately from the product app.

The first planned skill is `agents/skills/gift-picking`, which can research marketplace candidates and return a ranked shortlist for admin review.

Agent work should communicate with `blinkapp/` through narrow APIs or controlled work items. Skills recommend or research only; they do not approve decisions, charge users, mutate order state directly, or fulfil purchases without app-side authorization.
