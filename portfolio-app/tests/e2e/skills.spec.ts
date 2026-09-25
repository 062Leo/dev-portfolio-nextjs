import { expect, test, type Page } from "@playwright/test";
import { de } from "../../src/i18n/de";

// Below md the skills section is a list of chips per category; from md up it is the force
// graph with its rating filter (issue #63).
const MIN_TARGET = 44;
const MIN_FONT = 16;

function skills(page: Page) {
  const section = page.locator("#skills");
  return {
    section,
    headers: section.locator("button[aria-expanded]"),
    // The chips sit in a list inside each category's list item.
    chips: section.locator("ul ul > li"),
    graph: section.locator("svg circle"),
    filter: section.getByRole("button", { name: de.skills.applyFilter }),
  };
}

// The list is rendered after hydration only (the server does not know the viewport), so
// every mobile test waits for the first header before it counts or clicks anything.
async function listReady(page: Page) {
  const { headers } = skills(page);
  await expect(headers.first()).toBeVisible();
  return headers;
}

async function expandAll(page: Page) {
  const headers = await listReady(page);
  for (const header of await headers.all()) {
    if ((await header.getAttribute("aria-expanded")) === "false") await header.click();
  }
  await expect(headers.last()).toHaveAttribute("aria-expanded", "true");
}

test.describe("skills section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("shows the list on a phone and the graph on a desktop", async ({ page }, testInfo) => {
    const { headers, chips, graph, filter } = skills(page);
    if (testInfo.project.name === "mobile") {
      await listReady(page);
      await expect(graph).toHaveCount(0);
      await expect(filter).toHaveCount(0);
    } else {
      await expect(graph.first()).toBeAttached();
      await expect(filter).toBeVisible();
      await expect(headers).toHaveCount(0);
      await expect(chips).toHaveCount(0);
    }
  });

  test("folds each category with a 44 px header row", async ({ page }, testInfo) => {
    if (testInfo.project.name !== "mobile") return;
    const headers = await listReady(page);
    expect(await headers.count()).toBeGreaterThan(1);

    for (const header of await headers.all()) {
      const box = (await header.boundingBox())!;
      const label = await header.textContent();
      expect(box.height, `${label}: ${Math.round(box.height)} px high`).toBeGreaterThanOrEqual(
        MIN_TARGET,
      );
      expect(box.width, `${label}: ${Math.round(box.width)} px wide`).toBeGreaterThanOrEqual(
        MIN_TARGET,
      );
    }

    // The first category starts open, the others closed.
    const first = headers.first();
    const panel = page.locator(`#${await first.getAttribute("aria-controls")}`);
    await expect(first).toHaveAttribute("aria-expanded", "true");
    await expect(panel).toBeVisible();
    await expect(headers.nth(1)).toHaveAttribute("aria-expanded", "false");

    await first.click();
    await expect(first).toHaveAttribute("aria-expanded", "false");
    await expect(panel).toBeHidden();
    await first.click();
    await expect(first).toHaveAttribute("aria-expanded", "true");
    await expect(panel).toBeVisible();
  });

  test("keeps every chip readable and inside the viewport", async ({ page }, testInfo) => {
    if (testInfo.project.name !== "mobile") return;
    await expandAll(page);
    const width = page.viewportSize()!.width;
    const { chips } = skills(page);
    expect(await chips.count()).toBeGreaterThan(50);

    const offenders = await chips.evaluateAll(
      (elements, { minFont, width }) =>
        elements
          .map((chip) => {
            const box = chip.getBoundingClientRect();
            const size = parseFloat(getComputedStyle(chip).fontSize);
            const text = chip.textContent?.trim().slice(0, 30);
            if (size < minFont) return `${text}: font-size ${size}px`;
            if (box.left < 0 || box.right > width) {
              return `${text}: ${Math.round(box.left)}..${Math.round(box.right)}`;
            }
            return null;
          })
          .filter((entry): entry is string => entry !== null),
      { minFont: MIN_FONT, width },
    );
    expect(offenders, offenders.join("\n")).toEqual([]);
  });
});
