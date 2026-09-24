import type { Page } from "@playwright/test";

export const PAGES = ["/", "/projects", "/projects/ml-agent-bachelor", "/login"];

// Opens a page and returns its status plus every console error and uncaught page error
// that occurred while it loaded.
export async function openAndCollectErrors(page: Page, path: string) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));

  const response = await page.goto(path);
  await page.waitForLoadState("load");
  return { status: response?.status(), errors };
}
