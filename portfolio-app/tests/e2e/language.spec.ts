import { expect, test, type Page } from "@playwright/test";

// The e2e browser is German (locale in playwright.config.ts) and the setup project stores
// the session without a lang cookie, so every test starts in German.

// Desktop button: aria-label. Mobile menu row: its visible text, the current language.
const TOGGLE = /Sprache wechseln|Toggle language|^Deutsch$|^English$/;

// On mobile the navbar links and the toggle sit in the hamburger menu, which has to be
// opened first. Switching the language refreshes the route and closes it again.
async function openMenu(page: Page, isMobile: boolean) {
  if (!isMobile) return;
  const openButton = page.getByRole("button", { name: /Menü öffnen|Open menu/ });
  if ((await openButton.count()) > 0) await openButton.click();
}

async function languageToggle(page: Page, isMobile: boolean) {
  await openMenu(page, isMobile);
  const toggle = page.getByRole("button", { name: TOGGLE });
  await expect(toggle).toBeVisible();
  return toggle;
}

// Clicks the toggle and, on mobile, waits until the menu has closed: the switch remounts
// the [lang] tree a moment after the lang attribute changes, and reopening the menu
// before that remount would be undone by it.
async function switchLanguage(page: Page, isMobile: boolean) {
  await (await languageToggle(page, isMobile)).click();
  if (isMobile) await expect(page.locator("#mobile-menu")).toBeHidden();
}

// Links in the navbar; the footer is a navigation landmark too. Role queries skip the
// variant that is display:none at the current breakpoint, and the closed mobile menu is
// invisible, so exactly one link matches.
function navLink(page: Page, name: string) {
  return page
    .getByRole("navigation")
    .filter({ has: page.getByRole("button", { name: TOGGLE }) })
    .getByRole("link", { name, exact: true });
}

test("the language toggle switches between German and English", async ({ page, isMobile }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "de");
  await openMenu(page, isMobile);
  await expect(navLink(page, "Über mich")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Hallo, ich bin");

  await switchLanguage(page, isMobile);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await openMenu(page, isMobile);
  await expect(navLink(page, "About")).toHaveCount(1);
  await expect(navLink(page, "Über mich")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Hi, I'm");

  await switchLanguage(page, isMobile);
  await expect(page.locator("html")).toHaveAttribute("lang", "de");
  await openMenu(page, isMobile);
  await expect(navLink(page, "Über mich")).toHaveCount(1);
});

test("the choice survives a reload and a navigation", async ({ page, isMobile }) => {
  await page.goto("/");
  await switchLanguage(page, isMobile);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Hi, I'm");

  // Client-side navigation must not fall back to a cached German page.
  await openMenu(page, isMobile);
  await navLink(page, "Projects").click();
  await expect(page).toHaveURL((url) => url.pathname === "/projects");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Featured");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

// A notFound() on a statically generated route is answered with a shell that the browser
// renders from the flight data, so this can only be asserted in a browser, not with curl.
test("an unknown project shows the 404 page with navbar and footer in the visitor's language", async ({
  page,
  isMobile,
}) => {
  const response = await page.goto("/projects/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.locator("html")).toHaveAttribute("lang", "de");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Seite nicht gefunden");
  await expect(page.getByRole("link", { name: "Zur Projektübersicht" })).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();

  await switchLanguage(page, isMobile);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
});

// Any other unknown path gets the same 404 page, not the framework page without a lang
// attribute: the proxy rewrites it into the [lang] tree, where a catch-all calls notFound().
for (const path of ["/does-not-exist", "/login/x", "/a/b/c"]) {
  test(`the unknown path ${path} shows the site's 404 page in the visitor's language`, async ({
    page,
    context,
  }) => {
    const german = await page.goto(path);
    expect(german?.status()).toBe(404);
    await expect(page.locator("html")).toHaveAttribute("lang", "de");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Seite nicht gefunden");
    await expect(page.getByRole("contentinfo")).toBeVisible();

    // Replaces the cookie the proxy set on the first visit (same name, domain and path).
    const domain = new URL(page.url()).hostname;
    await context.addCookies([{ name: "lang", value: "en", domain, path: "/" }]);
    const english = await page.goto(path);
    expect(english?.status()).toBe(404);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
  });
}

test.describe("English browser", () => {
  test.use({ locale: "en-US" });

  test("gets English on the first paint, without a cookie and without clicking", async ({
    page,
    context,
    isMobile,
  }) => {
    await context.clearCookies({ name: "lang" });

    // The HTML the server sends already carries the language: no flash on first load.
    const response = await page.request.get("/", {
      headers: { "accept-language": "en-US,en;q=0.9" },
    });
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain('<html lang="en"');
    expect(html).toContain("About");
    expect(html).not.toContain("Über mich");

    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await openMenu(page, isMobile);
    await expect(navLink(page, "About")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Hi, I'm");
  });
});
