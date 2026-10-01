import { expect, test, type Page } from "@playwright/test";
import { de } from "../../src/i18n/de";

// Every external link opens the same confirmation dialog (issue #65). The GitHub button
// under the project grid is one of its triggers.
const GITHUB_URL = "https://github.com/062Leo";
// A small phone: the dialog has to fit without scrolling.
const SMALL_PHONE = { width: 375, height: 667 };

async function openDialog(page: Page) {
  const trigger = page.getByRole("button", { name: de.projects.githubCta });
  const dialog = page.getByRole("dialog", { name: de.dialog.title });
  // A click before hydration does nothing; retry until the dialog shows up.
  await expect(async () => {
    await trigger.click();
    await expect(dialog).toBeVisible({ timeout: 1_000 });
  }).toPass();
  return { trigger, dialog };
}

test.describe("external link dialog", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    if (testInfo.project.name === "mobile") await page.setViewportSize(SMALL_PHONE);
    await page.goto("/projects");
  });

  test("names the platform and links to the URL in a new tab", async ({ page }) => {
    const { dialog } = await openDialog(page);
    await expect(dialog).toContainText(de.dialog.leaving("GitHub"));
    const next = dialog.getByRole("link", { name: de.dialog.continue });
    await expect(next).toHaveAttribute("href", GITHUB_URL);
    await expect(next).toHaveAttribute("target", "_blank");
    await expect(next).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("fits the viewport without scrolling", async ({ page }) => {
    const { dialog } = await openDialog(page);
    const viewport = page.viewportSize()!;
    const box = (await dialog.boundingBox())!;
    const size = `${Math.round(box.width)}x${Math.round(box.height)} at ${Math.round(box.x)},${Math.round(box.y)}`;
    expect(box.x, size).toBeGreaterThanOrEqual(0);
    expect(box.y, size).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width, size).toBeLessThanOrEqual(viewport.width);
    expect(box.y + box.height, size).toBeLessThanOrEqual(viewport.height);
    const { scrollHeight, clientHeight } = await dialog.evaluate((element) => ({
      scrollHeight: element.scrollHeight,
      clientHeight: element.clientHeight,
    }));
    expect(
      scrollHeight,
      `scrollHeight ${scrollHeight} > clientHeight ${clientHeight}`,
    ).toBeLessThanOrEqual(clientHeight);
  });

  test("closes with Escape and returns focus to the trigger", async ({ page }) => {
    const { trigger, dialog } = await openDialog(page);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("closes with the cancel button and returns focus to the trigger", async ({ page }) => {
    const { trigger, dialog } = await openDialog(page);
    await dialog.getByRole("button", { name: de.dialog.cancel }).click();
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("closes with a click on the backdrop", async ({ page }) => {
    const { dialog } = await openDialog(page);
    // The dialog keeps a 16 px margin to the viewport edge; the corner is backdrop.
    await page.mouse.click(4, 4);
    await expect(dialog).toBeHidden();
  });
});
