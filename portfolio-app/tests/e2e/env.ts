// Password the e2e web server is started with; only used by the local test server.
export const E2E_PASSWORD = "e2e-test-password";

// Logged-in browser state written by the setup project. Lives in the Playwright output
// folder, which is ignored by git and recreated on every run.
export const AUTH_STATE = "test-results/.auth/state.json";
