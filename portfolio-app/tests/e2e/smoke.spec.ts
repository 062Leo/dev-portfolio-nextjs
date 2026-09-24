import { expect, test } from "@playwright/test";
import { PAGES, openAndCollectErrors } from "./pages";

const DETAIL_PAGE = "/projects/ml-agent-bachelor";

for (const path of PAGES) {
  test.describe(path, () => {
    test("loads with status 200 and without console errors", async ({ page }) => {
      const { status, errors } = await openAndCollectErrors(page, path);
      expect(status).toBe(200);
      expect(errors, errors.join("\n")).toEqual([]);
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
      test.fixme(
        testInfo.project.name === "mobile" && path === DETAIL_PAGE,
        "issue #62: the project title h1 is wider than the 375 px viewport and gets clipped",
      );
      await page.goto(path);
      const clipped = await page.evaluate(() => {
        const width = document.documentElement.clientWidth;
        const found: string[] = [];
        for (const element of document.querySelectorAll<HTMLElement>("h1, h2, h3, p")) {
          const box = element.getBoundingClientRect();
          if (box.width === 0 || (box.left >= 0 && box.right <= width)) continue;
          const text = element.textContent?.trim().replace(/\s+/g, " ").slice(0, 40);
          found.push(
            `${element.tagName.toLowerCase()} "${text}" ${Math.round(box.left)}..${Math.round(box.right)}`,
          );
        }
        return found;
      });
      expect(clipped, `elements outside the viewport:\n${clipped.join("\n")}`).toEqual([]);
    });
  });
}

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
