import { expect, test } from "@playwright/test";

// Runs in the desktop project only: the toggle is not rendered below the md breakpoint.
test("the navbar language toggle switches between German and English", async ({ page }) => {
  await page.goto("/");
  // The footer is a navigation landmark too; take the one that holds the toggle.
  const toggle = page.getByRole("button", { name: "Toggle language" });
  const nav = page.getByRole("navigation").filter({ has: toggle });

  await expect(nav.getByRole("link", { name: "Über mich", exact: true })).toBeVisible();

  await toggle.click();
  await expect(nav.getByRole("link", { name: "About", exact: true })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Über mich", exact: true })).toHaveCount(0);

  await toggle.click();
  await expect(nav.getByRole("link", { name: "Über mich", exact: true })).toBeVisible();
});
