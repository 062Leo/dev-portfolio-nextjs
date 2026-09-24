import { defineConfig, devices } from "@playwright/test";
import { AUTH_STATE, E2E_PASSWORD } from "./tests/e2e/env";

const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: BASE_URL,
    // German browser: the site detects the language from navigator.language.
    locale: "de-DE",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: "mobile",
      use: {
        ...devices["Pixel 7"],
        browserName: "chromium",
        viewport: { width: 375, height: 812 },
        storageState: AUTH_STATE,
      },
      dependencies: ["setup"],
      // The language toggle is only rendered from the md breakpoint up.
      testIgnore: /language\.spec\.ts/,
    },
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
        storageState: AUTH_STATE,
      },
      dependencies: ["setup"],
      testIgnore: /touch-targets\.spec\.ts/,
    },
  ],
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: `${BASE_URL}/login`,
    timeout: 240_000,
    reuseExistingServer: !process.env.CI,
    env: { SITE_PASSWORD: E2E_PASSWORD },
  },
});
