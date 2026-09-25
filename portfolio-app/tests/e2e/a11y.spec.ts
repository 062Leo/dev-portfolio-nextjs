import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { de } from "../../src/i18n/de";
import { PAGES } from "./pages";

// Accessibility checks (issue #69): an axe audit of every page against WCAG 2.1 A and AA,
// and the page under prefers-reduced-motion.

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21aa"];
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

// Canvas pixels as a data URL; equal snapshots mean nothing was drawn in between.
function canvasSnapshot(page: Page) {
  return page
    .locator("canvas")
    .first()
    .evaluate((canvas: HTMLCanvasElement) => canvas.toDataURL());
}

test.describe("axe audit", () => {
  for (const path of PAGES) {
    test(`${path} has no serious or critical WCAG 2.1 AA violation`, async ({ page }, testInfo) => {
      await page.goto(path);
      await page.waitForLoadState("load");
      await animationsDone(page);

      const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
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

test.describe("reduced motion", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("the home page shows its content at once and draws the background still", async ({
    page,
  }) => {
    await page.goto("/");

    // The scroll hint does not bounce.
    const hint = page.getByRole("button", { name: de.hero.scroll });
    await expect(hint).toBeVisible();
    const { name, duration } = await hint.evaluate((element) => {
      const style = getComputedStyle(element);
      return { name: style.animationName, duration: parseFloat(style.animationDuration) };
    });
    expect(name === "none" || duration <= 0.01, `animation ${name} ${duration}s`).toBe(true);

    // The hero fades in without delay: the elements end at full opacity immediately.
    const hero = page.locator("#home h1, #home h1 ~ *");
    await expect(hero).toHaveCount(3);
    for (const element of await hero.all()) {
      await expect(element).toHaveCSS("opacity", "1");
      const timing = await element.evaluate((node) => {
        const style = getComputedStyle(node);
        return parseFloat(style.animationDuration) + parseFloat(style.animationDelay);
      });
      expect(timing, "animation duration plus delay in seconds").toBeLessThanOrEqual(0.01);
    }

    // The network background is drawn once and then stands still.
    const canvas = page.locator("canvas").first();
    await expect(canvas).toBeAttached();
    await expect
      .poll(() =>
        canvas.evaluate((element: HTMLCanvasElement) => {
          const context = element.getContext("2d");
          if (!context || element.width === 0) return false;
          const { data } = context.getImageData(0, 0, element.width, element.height);
          for (let i = 3; i < data.length; i += 4) if (data[i] > 0) return true;
          return false;
        }),
      )
      .toBe(true);
    const first = await canvasSnapshot(page);
    await page.waitForTimeout(500);
    expect(await canvasSnapshot(page), "the canvas was redrawn").toBe(first);
  });

  test("the skills graph is laid out at once and does not drift", async ({ page }, testInfo) => {
    // The graph exists from md up; below it the skills are a list.
    if (testInfo.project.name !== "desktop") return;
    await page.goto("/");
    const nodes = page.locator("#skills svg circle");
    await expect(nodes.first()).toBeAttached();

    const positions = () =>
      nodes.evaluateAll((circles) =>
        circles.map((circle) => `${circle.getAttribute("cx")},${circle.getAttribute("cy")}`),
      );
    const settled = await positions();
    await page.waitForTimeout(500);
    expect(await positions()).toEqual(settled);
  });
});
