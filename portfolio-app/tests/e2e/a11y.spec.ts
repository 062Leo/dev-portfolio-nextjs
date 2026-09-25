import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { PAGES } from "./pages";

// Accessibility checks (issue #69): an axe audit of every page against WCAG 2.1 A and AA
// plus the axe best practices (landmarks, heading order and the like). Besides the pages
// of the smoke tests it covers a demo page and the 404 pages of an unknown project and of
// an unknown path.

const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"];
const AXE_PAGES = [
  ...PAGES,
  "/projects/prop-hunt/demo",
  "/projects/does-not-exist",
  "/does-not-exist",
];
const BLOCKING = new Set(["serious", "critical"]);

// The fade-in animations start at opacity 0; axe measures contrast on what is painted,
// so it runs once every finite animation has ended.
async function animationsDone(page: Page) {
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((animation) => animation.effect?.getComputedTiming().iterations !== Infinity)
        .map((animation) => animation.finished.catch(() => undefined)),
    ),
  );
}

test.describe("axe audit", () => {
  for (const path of AXE_PAGES) {
    test(`${path} has no serious or critical axe violation`, async ({ page }, testInfo) => {
      await page.goto(path);
      await page.waitForLoadState("load");
      await animationsDone(page);

      const { violations } = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
      const describe = (list: typeof violations) =>
        list
          .map((v) => `${v.impact} ${v.id} (${v.nodes.length}): ${v.nodes[0]?.target.join(" ")}`)
          .join("\n");

      // Moderate and minor findings are reported, not failed.
      const reported = violations.filter((v) => !BLOCKING.has(v.impact ?? ""));
      if (reported.length > 0) {
        console.log(`[axe ${testInfo.project.name}] ${path}\n${describe(reported)}`);
      }

      const blocking = violations.filter((v) => BLOCKING.has(v.impact ?? ""));
      expect(blocking, describe(blocking)).toEqual([]);
    });
  }
});
