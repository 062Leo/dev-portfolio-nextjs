import { expect, test } from "@playwright/test";
import { E2E_PASSWORD } from "./env";

// Start every test logged out. The e2e browser is German (locale in playwright.config.ts),
// so the login page shows its German strings.
test.use({ storageState: { cookies: [], origins: [] } });

const onPath = (path: string) => (url: URL) => url.pathname === path;

test("redirects / to /login without a session", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(onPath("/login"));
});

test("shows an error for a wrong password and stays on /login", async ({ page }) => {
  await page.goto("/login");
  await page.locator('input[name="password"]').fill("wrong-password");
  await page.getByRole("button", { name: "Anmelden", exact: true }).click();
  await expect(page.getByText("Falsches Passwort")).toBeVisible();
  await expect(page).toHaveURL(onPath("/login"));
});

test("logs in with the right password and lands on /", async ({ page }) => {
  await page.goto("/login");
  await page.locator('input[name="password"]').fill(E2E_PASSWORD);
  await page.getByRole("button", { name: "Anmelden", exact: true }).click();
  await expect(page).toHaveURL(onPath("/"));
  await expect(page.getByRole("heading", { name: "Geschützte Website" })).toHaveCount(0);
});

test("sends a logged-in visitor from /login to /", async ({ page }) => {
  await page.goto(`/?key=${E2E_PASSWORD}`);
  await expect(page).toHaveURL(onPath("/"));

  const response = await page.request.get("/login", { maxRedirects: 0 });
  expect(response.status()).toBe(303);
  expect(new URL(response.headers()["location"], response.url()).pathname).toBe("/");

  await page.goto("/login");
  await expect(page).toHaveURL(onPath("/"));
  await expect(page.getByRole("heading", { name: "Geschützte Website" })).toHaveCount(0);
});

test("redirects a wrong key parameter to /login", async ({ page }) => {
  await page.goto("/?key=wrong-password");
  await expect(page).toHaveURL(onPath("/login"));
});

test("logs in with the key parameter and redirects to the URL without the key", async ({
  page,
}) => {
  // The proxy answers ?key= with a redirect that drops the key, so the password never
  // stays in the address bar or the browser history.
  const response = await page.request.get(`/projects?key=${E2E_PASSWORD}&lang=de`, {
    maxRedirects: 0,
  });
  expect(response.status()).toBe(303);
  const location = new URL(response.headers()["location"], response.url());
  expect(location.pathname).toBe("/projects");
  expect(location.searchParams.has("key")).toBe(false);
  expect(location.searchParams.get("lang")).toBe("de");

  await page.goto(`/?key=${E2E_PASSWORD}`);
  await expect(page).toHaveURL((url) => url.pathname === "/" && !url.searchParams.has("key"));
});
