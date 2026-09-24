import { expect, test } from "@playwright/test";
import { E2E_PASSWORD } from "./env";

// Start every test logged out.
test.use({ storageState: { cookies: [], origins: [] } });

const onPath = (path: string) => (url: URL) => url.pathname === path;

test("redirects / to /login without a session", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(onPath("/login"));
});

test("shows an error for a wrong password and stays on /login", async ({ page }) => {
  await page.goto("/login");
  await page.locator('input[name="password"]').fill("wrong-password");
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(page.getByText("Invalid password")).toBeVisible();
  await expect(page).toHaveURL(onPath("/login"));
});

test("logs in with the right password and lands on /", async ({ page }) => {
  await page.goto("/login");
  await page.locator('input[name="password"]').fill(E2E_PASSWORD);
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(page).toHaveURL(onPath("/"));
  await expect(page.getByRole("heading", { name: "Protected Site" })).toHaveCount(0);
});

test("redirects a wrong key parameter to /login", async ({ page }) => {
  await page.goto("/?key=wrong-password");
  await expect(page).toHaveURL(onPath("/login"));
});
