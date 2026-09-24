import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest, type NextResponse } from "next/server";
import { getRedirectUrl, unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { config, proxy } from "@/proxy";

// These tests describe the behaviour of the password gate (pass / redirect / cookie set),
// not its cookie format, so they stay valid when the cookie scheme changes (#76).

const PASSWORD = "unit-test-password";
const ORIGIN = "http://localhost:3100";

function request(path: string, cookie?: string): NextRequest {
  const headers = cookie ? { cookie: `site-auth=${cookie}` } : undefined;
  return new NextRequest(new URL(path, ORIGIN), { headers });
}

function passes(response: NextResponse): boolean {
  return response.headers.get("x-middleware-next") === "1" && getRedirectUrl(response) === null;
}

function redirectsToLogin(response: NextResponse): boolean {
  return response.status === 307 && getRedirectUrl(response) === `${ORIGIN}/login`;
}

describe("proxy without SITE_PASSWORD", () => {
  beforeEach(() => {
    vi.stubEnv("SITE_PASSWORD", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("lets every request through", async () => {
    expect(passes(await proxy(request("/")))).toBe(true);
    expect(passes(await proxy(request("/projects/ml-agent-bachelor")))).toBe(true);
  });
});

describe("proxy with SITE_PASSWORD", () => {
  beforeEach(() => {
    vi.stubEnv("SITE_PASSWORD", PASSWORD);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("redirects a request without cookie to /login", async () => {
    expect(redirectsToLogin(await proxy(request("/")))).toBe(true);
    expect(redirectsToLogin(await proxy(request("/projects")))).toBe(true);
  });

  it("redirects a request with an unknown cookie to /login", async () => {
    expect(redirectsToLogin(await proxy(request("/", "not-a-valid-cookie")))).toBe(true);
  });

  it("redirects a wrong ?key= to /login without setting a cookie", async () => {
    const response = await proxy(request("/?key=wrong-password"));
    expect(redirectsToLogin(response)).toBe(true);
    expect(response.cookies.get("site-auth")).toBeUndefined();
  });

  it("lets the right ?key= through and sets the auth cookie", async () => {
    const response = await proxy(request(`/?key=${PASSWORD}`));
    expect(passes(response)).toBe(true);
    const cookie = response.cookies.get("site-auth");
    expect(cookie?.value).toBeTruthy();
    expect(cookie?.httpOnly).toBe(true);
    expect(cookie?.path).toBe("/");
  });

  it("accepts the cookie it set on a later request", async () => {
    const first = await proxy(request(`/?key=${PASSWORD}`));
    const cookie = first.cookies.get("site-auth")?.value;
    expect(cookie).toBeTruthy();
    expect(passes(await proxy(request("/projects", cookie)))).toBe(true);
  });

  it("does not accept a cookie set for a different password", async () => {
    const first = await proxy(request(`/?key=${PASSWORD}`));
    const cookie = first.cookies.get("site-auth")?.value;
    vi.stubEnv("SITE_PASSWORD", "another-password");
    expect(redirectsToLogin(await proxy(request("/", cookie)))).toBe(true);
  });
});

describe("proxy matcher", () => {
  it("runs on pages", () => {
    expect(unstable_doesMiddlewareMatch({ config, url: "/" })).toBe(true);
    expect(unstable_doesMiddlewareMatch({ config, url: "/projects/acms" })).toBe(true);
  });

  it("does not run on /login and framework assets", () => {
    expect(unstable_doesMiddlewareMatch({ config, url: "/login" })).toBe(false);
    expect(unstable_doesMiddlewareMatch({ config, url: "/_next/static/chunk.js" })).toBe(false);
  });
});
