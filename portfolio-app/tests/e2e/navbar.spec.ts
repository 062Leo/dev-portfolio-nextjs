import { expect, test, type Page } from "@playwright/test";
import { de } from "../../src/i18n/de";

// The hamburger menu below md: it locks the page scroll while open and must never leave
// the lock behind, whichever way it closes.
const DESKTOP_VIEWPORT = { width: 1024, height: 768 };

function menu(page: Page) {
  return {
    openButton: page.getByRole("button", { name: de.nav.openMenu }),
    closeButton: page.getByRole("button", { name: de.nav.closeMenu }),
    panel: page.locator("#mobile-menu"),
  };
}

// A click before hydration does nothing; retry until the menu is open.
async function openMenu(page: Page) {
  const { openButton, panel } = menu(page);
  await expect(async () => {
    await openButton.click();
    await expect(panel).toBeVisible({ timeout: 1_000 });
  }).toPass();
  expect(await bodyOverflow(page)).toBe("hidden");
}

function bodyOverflow(page: Page) {
  return page.evaluate(() => document.body.style.overflow);
}

test.describe("mobile menu", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("closes when the viewport grows past md (mobile only)", async ({ page }, testInfo) => {
    if (testInfo.project.name !== "mobile") return;
    const viewport = page.viewportSize()!;
    await openMenu(page);

    await page.setViewportSize(DESKTOP_VIEWPORT);
    await expect.poll(() => bodyOverflow(page)).toBe("");

    // Back on a phone the menu stays closed.
    await page.setViewportSize(viewport);
    const { openButton, panel } = menu(page);
    await expect(openButton).toHaveAttribute("aria-expanded", "false");
    await expect(panel).toBeHidden();
    expect(await bodyOverflow(page)).toBe("");
  });

  test("closes with Escape and returns focus to its button (mobile only)", async ({
    page,
  }, testInfo) => {
    if (testInfo.project.name !== "mobile") return;
    await openMenu(page);

    await page.keyboard.press("Escape");
    const { openButton, panel } = menu(page);
    await expect(panel).toBeHidden();
    await expect(openButton).toBeFocused();
    expect(await bodyOverflow(page)).toBe("");
  });

  test("releases the scroll lock on a navigation (mobile only)", async ({ page }, testInfo) => {
    if (testInfo.project.name !== "mobile") return;
    await openMenu(page);
    await menu(page).panel.getByRole("link", { name: de.nav.projects, exact: true }).click();
    await expect(page).toHaveURL((url) => url.pathname === "/projects");
    await expect(menu(page).panel).toBeHidden();
    expect(await bodyOverflow(page)).toBe("");

    // Browser back with the menu open: the page changes without a click in the menu.
    await openMenu(page);
    await page.goBack();
    await expect(page).toHaveURL((url) => url.pathname === "/");
    await expect(menu(page).panel).toBeHidden();
    expect(await bodyOverflow(page)).toBe("");
  });
});
