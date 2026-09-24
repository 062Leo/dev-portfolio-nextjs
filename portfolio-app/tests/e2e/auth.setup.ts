import { expect, test as setup } from "@playwright/test";
import { AUTH_STATE, E2E_PASSWORD } from "./env";

setup("log in with the key parameter", async ({ page }) => {
  const response = await page.goto(`/?key=${E2E_PASSWORD}`);
  expect(response?.status()).toBe(200);
  await expect(page).toHaveURL((url) => url.pathname === "/");
  // Only the session is stored: the language must come from the browser locale in every
  // test, not from the cookie this visit set.
  await page.context().clearCookies({ name: "lang" });
  await page.context().storageState({ path: AUTH_STATE });
});
