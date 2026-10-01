import { expect, test } from "@playwright/test";
import { PAGES } from "./pages";

// Runs in the mobile project only (see playwright.config.ts).
const MIN_TARGET = 44;

for (const path of PAGES) {
  test(`${path} has no visible link or button smaller than ${MIN_TARGET} px`, async ({ page }) => {
    await page.goto(path);
    const offenders = await page.evaluate((min) => {
      const found: string[] = [];
      for (const element of document.querySelectorAll<HTMLElement>("a, button")) {
        const box = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        const visible =
          box.width > 0 &&
          box.height > 0 &&
          style.visibility !== "hidden" &&
          style.pointerEvents !== "none";
        if (!visible || (box.width >= min && box.height >= min)) continue;
        const label =
          element.getAttribute("aria-label") ||
          element.textContent?.trim().replace(/\s+/g, " ").slice(0, 40) ||
          element.getAttribute("href") ||
          "(no label)";
        found.push(
          `${element.tagName.toLowerCase()} "${label}" ${Math.round(box.width)}x${Math.round(box.height)}`,
        );
      }
      return found;
    }, MIN_TARGET);
    expect(offenders, `targets below ${MIN_TARGET} px:\n${offenders.join("\n")}`).toEqual([]);
  });
}
