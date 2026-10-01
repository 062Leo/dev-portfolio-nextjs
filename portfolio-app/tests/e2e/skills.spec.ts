import { expect, test, type Locator, type Page } from "@playwright/test";
import { de } from "../../src/i18n/de";

// Below md the skills section is a list of chips per category; from md up it is the force
// graph with its rating filter (issue #63), plus the same list for screen readers only.
const MIN_TARGET = 44;
const MIN_FONT = 16;
// How long the tooltip stays after the pointer has left its node (tooltip.ts).
const TOOLTIP_LINGER_MS = 4_000;

type RecordingTooltip = HTMLElement & { wasHidden?: boolean };

function skills(page: Page) {
  const section = page.locator("#skills");
  return {
    section,
    headers: section.locator("button[aria-expanded]"),
    // The chips sit in a list inside each category's list item; the visible list only,
    // not the one for screen readers next to the graph.
    chips: section.locator(":scope > div:not(.sr-only) ul ul > li"),
    screenReaderList: section.locator(":scope > .sr-only"),
    graph: section.locator("svg circle"),
    graphImage: section.getByRole("img", { name: de.skills.graphLabel }),
    nodes: section.locator('svg circle[filter^="url(#sg-glow"]'),
    tooltip: section.getByRole("tooltip"),
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

// Centre of a node circle that is the topmost element there and lies well inside the
// graph, or null.
function freeNode(nodes: Locator) {
  return nodes.evaluateAll((circles: SVGCircleElement[]) => {
    const bounds = circles[0].ownerSVGElement!.getBoundingClientRect();
    for (const circle of circles) {
      const box = circle.getBoundingClientRect();
      const x = box.left + box.width / 2;
      const y = box.top + box.height / 2;
      const inside =
        x > bounds.left + 250 &&
        x < bounds.right - 250 &&
        y > bounds.top + 120 &&
        y < bounds.bottom - 120;
      if (inside && document.elementFromPoint(x, y) === circle) return { x, y };
    }
    return null;
  });
}

test.describe("skills section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("shows the list on a phone and the graph on a desktop", async ({ page }, testInfo) => {
    const { headers, chips, graph, graphImage, screenReaderList, filter } = skills(page);
    if (testInfo.project.name === "mobile") {
      await listReady(page);
      await expect(graph).toHaveCount(0);
      await expect(filter).toHaveCount(0);
      await expect(screenReaderList).toHaveCount(0);
    } else {
      await expect(graph.first()).toBeAttached();
      await expect(graphImage).toBeVisible();
      await expect(filter).toBeVisible();
      await expect(headers).toHaveCount(0);
      await expect(chips).toHaveCount(0);
      // Screen readers get the list with every category under a heading.
      expect(await screenReaderList.getByRole("heading", { level: 3 }).count()).toBeGreaterThan(1);
      expect(await screenReaderList.locator("ul ul > li").count()).toBeGreaterThan(50);
    }
  });

  test("marks the selected ratings of the filter as pressed (desktop only)", async ({
    page,
  }, testInfo) => {
    if (testInfo.project.name !== "desktop") return;
    const rating = skills(page).section.getByRole("button", { name: "1", exact: true });
    await expect(rating).toHaveAttribute("aria-pressed", "true");
    await expect(async () => {
      await rating.click();
      await expect(rating).toHaveAttribute("aria-pressed", "false", { timeout: 1_000 });
    }).toPass();
  });

  test("shows the tooltip again after a fast drag and hides it after the linger time (desktop only)", async ({
    page,
  }, testInfo) => {
    if (testInfo.project.name !== "desktop") return;
    const { section, nodes, tooltip } = skills(page);
    await section.scrollIntoViewIfNeeded();
    await expect(nodes.first()).toBeAttached();

    // Hover a node that is on top at its centre and well inside the graph and press the
    // button on it. The simulation may still move the node, so this is retried until the
    // tooltip shows and the drag has started (the graph shows the grabbing cursor).
    const graph = section.locator("svg").first();
    let point = { x: 0, y: 0 };
    await expect(async () => {
      const found = await freeNode(nodes);
      expect(found).not.toBeNull();
      point = found!;
      await page.mouse.move(point.x, point.y);
      await expect(tooltip).toBeVisible({ timeout: 1_000 });
      await page.mouse.down();
      const cursor = await graph.evaluate((svg: SVGSVGElement) => svg.style.cursor);
      if (cursor !== "grabbing") await page.mouse.up();
      expect(cursor).toBe("grabbing");
    }).toPass({ timeout: 20_000 });

    // Fast moves hide the tooltip while dragging: 120 px back and forth, at least a frame
    // apart (the speed is only measured between moves more than 8 ms apart). A second
    // without fast moves shows it again, so the hiding is recorded as it happens.
    await tooltip.evaluate((element: RecordingTooltip) => {
      element.wasHidden = false;
      new MutationObserver(() => {
        if (element.style.display === "none") element.wasHidden = true;
      }).observe(element, { attributes: true, attributeFilter: ["style"] });
    });
    for (const offset of [120, 0, 120, 0, 120]) {
      await page.mouse.move(point.x + offset, point.y + 40);
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(resolve)));
    }

    await page.mouse.up();
    await expect(tooltip).toBeVisible({ timeout: 500 });
    expect(await tooltip.evaluate((element: RecordingTooltip) => element.wasHidden)).toBe(true);

    // Off the graph the tooltip lingers, then goes.
    await page.mouse.move(point.x, 5);
    await expect(tooltip).toBeHidden({ timeout: TOOLTIP_LINGER_MS + 2_000 });
  });

  test("folds each category with a 44 px header row (mobile only)", async ({ page }, testInfo) => {
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

  test("keeps every chip readable and inside the viewport (mobile only)", async ({
    page,
  }, testInfo) => {
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
