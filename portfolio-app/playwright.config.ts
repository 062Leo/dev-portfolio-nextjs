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
  // One next start process serves every worker's browser, videos included. With the
  // default worker count (half the cores) a single round trip took up to six seconds and
  // navigation assertions timed out; four workers keep the server responsive.
  workers: process.env.CI ? 2 : 4,
  expect: { timeout: 10_000 },
  use: {
    baseURL: BASE_URL,
    // German browser: without a lang cookie the site takes the language from Accept-Language.
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
    // Always a fresh build of the current tree: a server still running on the port would
    // otherwise be tested instead, possibly with an old build or without the test password.
    reuseExistingServer: false,
    env: { SITE_PASSWORD: E2E_PASSWORD },
  },
});
