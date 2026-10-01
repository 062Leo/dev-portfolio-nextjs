import { expect, test } from "@playwright/test";
import { de } from "../../src/i18n/de";

// Project cards fill their grid cell and push the details link to the bottom, so the cards
// of one row end with their links on one line instead of leaving empty blocks under the
// shorter ones (issue #67).
const MAX_OFFSET = 4;

test.describe("project cards", () => {
  test("align their details links within each grid row", async ({ page }, testInfo) => {
    await page.goto("/projects");
    const rows = await page.evaluate((linkText) => {
      const byTop = new Map<number, number[]>();
      for (const link of document.querySelectorAll("a")) {
        if (link.textContent?.trim() !== linkText) continue;
        const card = link.closest(".card-hover");
        if (!card) continue;
        const top = Math.round(card.getBoundingClientRect().top + window.scrollY);
        const bottom = link.getBoundingClientRect().bottom + window.scrollY;
        byTop.set(top, [...(byTop.get(top) ?? []), bottom]);
      }
      return [...byTop.entries()].sort(([a], [b]) => a - b).map(([, bottoms]) => bottoms);
    }, de.projects.moreDetails);

    expect(rows.length).toBeGreaterThan(0);
    // Desktop (1440 px) shows three cards per row.
    if (testInfo.project.name === "desktop") expect(rows[0]).toHaveLength(3);
    for (const [index, bottoms] of rows.entries()) {
      const spread = Math.max(...bottoms) - Math.min(...bottoms);
      expect(spread, `row ${index + 1}: link bottoms ${bottoms.join(", ")}`).toBeLessThanOrEqual(
        MAX_OFFSET,
      );
    }
  });

  // Every card image sits in a 3:2 box, so images of different formats line up. (The sizes
  // hint of the cards is not rendered while images.unoptimized is on in next.config.ts.)
  for (const path of ["/", "/projects"]) {
    test(`${path} shows every card image in a 3:2 box`, async ({ page }) => {
      await page.goto(path);
      const images = page.locator(".card-hover img");
      expect(await images.count()).toBeGreaterThan(0);
      const off = await images.evaluateAll((elements) =>
        elements
          .map((image) => {
            const box = image.getBoundingClientRect();
            return { alt: image.getAttribute("alt"), ratio: box.width / box.height };
          })
          .filter(({ ratio }) => Math.abs(ratio - 1.5) > 0.02)
          .map(({ alt, ratio }) => `${alt}: ${ratio.toFixed(3)}`),
      );
      expect(off, `images not in a 3:2 box:\n${off.join("\n")}`).toEqual([]);
    });
  }
});
