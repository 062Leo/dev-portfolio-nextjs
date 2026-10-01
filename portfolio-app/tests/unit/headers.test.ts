import { afterEach, describe, expect, it, vi } from "vitest";
import nextConfig from "../../next.config";
import { buildContentSecurityPolicy } from "@/lib/security-headers";

const EXPECTED_HEADERS = [
  "Content-Security-Policy",
  "Strict-Transport-Security",
  "X-Content-Type-Options",
  "Referrer-Policy",
  "Permissions-Policy",
  "X-Frame-Options",
];

// Returns the headers next.config.ts sets for every path, as a key -> value map.
async function headersForAllPaths(): Promise<Record<string, string>> {
  const rules = (await nextConfig.headers?.()) ?? [];
  const rule = rules.find((entry) => entry.source === "/(.*)");
  expect(rule, "no header rule for /(.*)").toBeDefined();
  return Object.fromEntries(rule!.headers.map(({ key, value }) => [key, value]));
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("security headers", () => {
  it("sets every security header for all paths", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const headers = await headersForAllPaths();
    for (const key of EXPECTED_HEADERS) expect(headers[key], key).toBeTruthy();
    expect(headers["Strict-Transport-Security"]).toBe("max-age=31536000; includeSubDomains");
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["Referrer-Policy"]).toBe("no-referrer");
    expect(headers["X-Frame-Options"]).toBe("DENY");
    expect(headers["Permissions-Policy"]).toBe(
      "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    );
  });

  it("uses the production CSP outside development", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const csp = (await headersForAllPaths())["Content-Security-Policy"];
    expect(csp).toBe(buildContentSecurityPolicy(false));
    expect(csp).not.toContain("'unsafe-eval'");
    expect(csp).not.toContain("ws:");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("default-src 'self'");
  });

  it("uses the development CSP in development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const csp = (await headersForAllPaths())["Content-Security-Policy"];
    expect(csp).toBe(buildContentSecurityPolicy(true));
  });
});

describe("buildContentSecurityPolicy", () => {
  it("differs in development only by eval and the HMR websocket", () => {
    const production = buildContentSecurityPolicy(false);
    const development = buildContentSecurityPolicy(true);
    expect(development).not.toBe(production);
    expect(development).toContain("script-src 'self' 'unsafe-inline' 'unsafe-eval'");
    expect(development).toContain("connect-src 'self' ws: wss:");
    expect(development.replace(" 'unsafe-eval'", "").replace(" ws: wss:", "")).toBe(production);
  });
});
