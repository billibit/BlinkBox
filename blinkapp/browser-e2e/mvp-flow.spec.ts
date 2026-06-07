import { expect, test } from "@playwright/test";

test.describe("BlinkBox browser flow", () => {
  test.beforeEach(async ({ request }) => {
    const response = await request.post("/api/test/reset");
    expect(response.ok()).toBeTruthy();
  });

  test("renders the customer dashboard", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "A little surprise, chosen for you." })).toBeVisible();
    await expect(page.getByText("Private beta loop")).toHaveCount(0);
    await expect(page.getByText(/beta/i)).toHaveCount(0);
    await expect(page.getByText(/MVP/i)).toHaveCount(0);
    await expect(page.getByText("Pending reviews")).toHaveCount(0);
    await expect(page.getByText("Remaining")).toHaveCount(0);
    await expect(page.getByText("Recent gifts")).toHaveCount(0);
    await expect(page.getByRole("link", { name: /Begin/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Set budget/ })).toBeVisible();
  });

  test("lets the customer update budget settings", async ({ page }) => {
    await page.goto("/budget");

    await expect(page.getByRole("heading", { name: "Budget", exact: true })).toBeVisible();
    await page.getByLabel("Monthly limit").fill("42");
    await page.getByRole("button", { name: "Save budget" }).click();

    await expect(page).toHaveURL(/\/budget$/);
    await expect(page.getByLabel("Monthly limit")).toHaveValue("42");
  });

  test("requires admin approval before creating an order and payment intent", async ({ page }) => {
    await page.goto("/admin/decisions");

    await expect(page.getByRole("heading", { name: "Decision review" })).toBeVisible();
    await expect(page.getByText("Rainy Day Tea Kit")).toBeVisible();
    await expect(page.getByText("pending admin review")).toBeVisible();

    await page.getByRole("button", { name: "Approve and charge" }).click();

    await expect(page).toHaveURL(/\/admin\/orders$/);
    await expect(page.getByText("Rainy Day Tea Kit")).toBeVisible();
    await expect(page.getByText("manual fulfillment")).toBeVisible();
    await expect(page.getByText("Payment confirmed")).toBeVisible();
  });

  test("lets admin manually fulfil an approved order", async ({ page }) => {
    await page.goto("/admin/decisions");
    await page.getByRole("button", { name: "Approve and charge" }).click();

    await page.getByLabel("Tracking code").fill("TRACK-E2E-123");
    await page.getByLabel("Fulfilment notes").fill("E2E manual fulfilment evidence.");
    await page.getByRole("button", { name: "Mark fulfilled" }).click();

    await expect(page).toHaveURL(/\/admin\/orders$/);
    await expect(page.getByText("fulfilled")).toBeVisible();
    await expect(page.getByText("TRACK-E2E-123")).toBeVisible();
  });

  test("records customer support requests", async ({ page }) => {
    await page.goto("/support");

    await page.getByLabel("Message").fill("Please help with my latest BlinkBox.");
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page).toHaveURL(/\/support$/);
    await expect(page.getByText("Please help with my latest BlinkBox.")).toBeVisible();
    await expect(page.getByText("question · open")).toHaveCount(0);
  });
});
