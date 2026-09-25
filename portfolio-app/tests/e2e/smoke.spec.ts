import { expect, test, type Page } from "@playwright/test";
import { PAGES, openAndCollectErrors } from "./pages";

const DETAIL_PAGE = "/projects/ml-agent-bachelor";
// The longest project title across the German and English data files, and a demo page;
// both set their title in Rubik Mono One (issue #62).
const LONGEST_TITLE_PAGE = "/projects/acms";
const DEMO_PAGE = "/projects/prop-hunt/demo";
// The narrowest phone viewport in common use.
const NARROW_VIEWPORT = { width: 320, height: 568 };

// Headings and paragraphs that stick out of the viewport, or whose text is wider than
// their own box.
async function clippedText(page: Page) {
  return page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const found: string[] = [];
    for (const element of document.querySelectorAll<HTMLElement>("h1, h2, h3, p")) {
      const box = element.getBoundingClientRect();
      const inside = box.left >= 0 && box.right <= width;
      const fits = element.scrollWidth <= element.clientWidth;
      if (box.width === 0 || (inside && fits)) continue;
      const text = element.textContent?.trim().replace(/\s+/g, " ").slice(0, 40);
      found.push(
        `${element.tagName.toLowerCase()} "${text}" ${Math.round(box.left)}..${Math.round(box.right)}` +
          ` scrollWidth ${element.scrollWidth} clientWidth ${element.clientWidth}`,
      );
    }
    return found;
  });
}

for (const path of PAGES) {
  test.describe(path, () => {
    test("loads with status 200 and without console errors", async ({ page }) => {
      const { status, errors } = await openAndCollectErrors(page, path);
      expect(status).toBe(200);
      expect(errors, errors.join("\n")).toEqual([]);
    });

    test("tells search engines not to index it", async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        "content",
        /^noindex, nofollow/,
      );
    });

    test("has no horizontal overflow", async ({ page }) => {
      await page.goto(path);
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(
        scrollWidth,
        `scrollWidth ${scrollWidth} > clientWidth ${clientWidth}`,
      ).toBeLessThanOrEqual(clientWidth);
    });

    // The page wrappers use overflow-x: hidden, so text that is too wide gets clipped instead of
    // widening the document. This test catches that case.
    test("has no heading or paragraph wider than the viewport", async ({ page }, testInfo) => {
      await page.goto(path);
      const clipped = await clippedText(page);
      expect(clipped, `elements outside the viewport:\n${clipped.join("\n")}`).toEqual([]);

      // The project title is the widest text on a narrow phone (issue #62).
      if (testInfo.project.name !== "mobile" || path !== DETAIL_PAGE) return;
      await page.setViewportSize(NARROW_VIEWPORT);
      const clippedNarrow = await clippedText(page);
      expect(
        clippedNarrow,
        `elements outside the 320 px viewport:\n${clippedNarrow.join("\n")}`,
      ).toEqual([]);
    });
  });
}

// Project titles are set in a wide display font; the longest one and a demo title have to
// wrap inside the viewport instead of being clipped (issue #62).
test.describe("long project titles", () => {
  for (const path of [LONGEST_TITLE_PAGE, DEMO_PAGE]) {
    test(`${path} keeps its headings inside the viewport`, async ({ page }, testInfo) => {
      await page.goto(path);
      const clipped = await clippedText(page);
      expect(clipped, `elements outside the viewport:\n${clipped.join("\n")}`).toEqual([]);

      if (testInfo.project.name !== "mobile") return;
      await page.setViewportSize(NARROW_VIEWPORT);
      const clippedNarrow = await clippedText(page);
      expect(
        clippedNarrow,
        `elements outside the 320 px viewport:\n${clippedNarrow.join("\n")}`,
      ).toEqual([]);
    });
  }
});

// The hero is as high as its card plus fixed spacing, not a full screen that grows and
// shrinks with the mobile browser bars (issue #68).
test.describe("hero section", () => {
  test("fits the viewport and keeps its card in the first screen", async ({ page }) => {
    await page.goto("/");
    const viewport = page.viewportSize();
    // #home > container > card
    const section = await page.locator("#home").boundingBox();
    const card = await page.locator("#home > div > div").first().boundingBox();
    expect(viewport).not.toBeNull();
    expect(section).not.toBeNull();
    expect(card).not.toBeNull();
    const height = viewport!.height;

    expect(section!.height).toBeLessThanOrEqual(height * 1.05);
    expect(card!.y).toBeGreaterThanOrEqual(0);
    expect(card!.y).toBeLessThan(height);
    // Space above and below the card, the scroll hint included.
    const empty = section!.height - card!.height;
    expect(empty, `${Math.round(empty)} px empty around the card`).toBeLessThanOrEqual(
      height * 0.25,
    );
  });
});

// The layout sets a title template: a page with its own title gets the brand appended,
// the home page keeps the default title.
test.describe("page titles", () => {
  test("differ between the home page and a project page", async ({ page }) => {
    await page.goto("/");
    const homeTitle = await page.title();
    await page.goto(DETAIL_PAGE);
    const detailTitle = await page.title();
    expect(homeTitle).not.toContain(" · leo.dev");
    expect(detailTitle).toMatch(/.+ · leo\.dev$/);
    expect(detailTitle).not.toBe(homeTitle);
  });
});

// The headers come from next.config.ts and are the same on every path, so one page is
// enough; CSP violations on the pages above surface as console errors.
test.describe("security headers", () => {
  test("are sent with the login page", async ({ request }) => {
    const response = await request.get("/login");
    expect(response.status()).toBe(200);
    const headers = response.headers();
    expect(headers["content-security-policy"]).toContain("default-src 'self'");
    expect(headers["strict-transport-security"]).toBeTruthy();
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("no-referrer");
    expect(headers["permissions-policy"]).toBeTruthy();
  });
});

// Images and videos under public/ are behind the password like every page (issue #76).
const MEDIA = ["/Bilder/Arcanoid/arcanoid.png", "/Videos/Big/Arcanoid.mp4"];

test.describe("media", () => {
  test("is served with a session", async ({ request }) => {
    for (const path of MEDIA) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(200);
    }
  });

  test("redirects to /login without a session", async ({ playwright, baseURL }) => {
    // A context created here inherits the project's storageState, so the session is
    // removed explicitly.
    const anonymous = await playwright.request.newContext({
      baseURL,
      storageState: { cookies: [], origins: [] },
    });
    try {
      for (const path of MEDIA) {
        const response = await anonymous.get(path, { maxRedirects: 0 });
        expect([302, 303, 307], path).toContain(response.status());
        expect(new URL(response.headers()["location"], response.url()).pathname, path).toBe(
          "/login",
        );
      }
    } finally {
      await anonymous.dispose();
    }
  });
});
