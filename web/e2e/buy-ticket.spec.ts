import { test, expect } from "@playwright/test";

test("user can load events and buy a ticket (QR appears)", async ({ page }) => {
  await page.goto("http://127.0.0.1:5173/");

  await expect(page.getByRole("heading", { name: "BEASTPass" })).toBeVisible();

  // Click the first Buy button
  const buyButtons = page.getByRole("button").filter({ hasText: "Buy" });
  await expect(buyButtons.first()).toBeVisible();
  await buyButtons.first().click();

  // QR section should appear
  await expect(page.getByText("Last issued ticket")).toBeVisible();
  await expect(page.getByAltText("Ticket QR")).toBeVisible();
});
