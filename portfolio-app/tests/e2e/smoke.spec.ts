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
