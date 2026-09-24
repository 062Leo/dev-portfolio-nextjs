import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest, type NextResponse } from "next/server";
import { getRedirectUrl, unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { config, proxy } from "@/proxy";

// These tests describe the behaviour of the password gate (pass / redirect / cookie set),
// not its cookie format, so they stay valid when the cookie scheme changes.

const PASSWORD = "unit-test-password";
const SECRET = "unit-test-secret";
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

// Logs in with ?key= and returns the cookie value the proxy set.
async function loginCookie(): Promise<string> {
  const response = await proxy(request(`/?key=${PASSWORD}`));
  const cookie = response.cookies.get("site-auth")?.value;
  expect(cookie).toBeTruthy();
  return cookie as string;
}

beforeEach(() => {
  // The fallback without AUTH_SECRET warns once per process.
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("proxy without SITE_PASSWORD", () => {
  beforeEach(() => {
    vi.stubEnv("SITE_PASSWORD", "");
  });

  it("lets every request through", async () => {
    expect(passes(await proxy(request("/")))).toBe(true);
    expect(passes(await proxy(request("/projects/ml-agent-bachelor")))).toBe(true);
    expect(passes(await proxy(request("/Bilder/Arcanoid/arcanoid.png")))).toBe(true);
  });
});

describe("proxy with SITE_PASSWORD and AUTH_SECRET", () => {
  beforeEach(() => {
    vi.stubEnv("SITE_PASSWORD", PASSWORD);
    vi.stubEnv("AUTH_SECRET", SECRET);
  });

  it("redirects a request without cookie to /login", async () => {
    expect(redirectsToLogin(await proxy(request("/")))).toBe(true);
    expect(redirectsToLogin(await proxy(request("/projects")))).toBe(true);
    expect(redirectsToLogin(await proxy(request("/Bilder/Arcanoid/arcanoid.png")))).toBe(true);
    expect(redirectsToLogin(await proxy(request("/Videos/Big/Arcanoid.mp4")))).toBe(true);
  });

  it("redirects a request with an unknown cookie to /login", async () => {
    expect(redirectsToLogin(await proxy(request("/", "not-a-valid-cookie")))).toBe(true);
  });

  it("redirects a wrong ?key= to /login without setting a cookie", async () => {
    const response = await proxy(request("/?key=wrong-password"));
    expect(redirectsToLogin(response)).toBe(true);
    expect(response.cookies.get("site-auth")).toBeUndefined();
  });

  it("waits before answering a wrong ?key=", async () => {
    const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout");
    await proxy(request("/?key=wrong-password"));
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 500);
  });

  it("redirects the right ?key= to the same URL without the key and sets the cookie", async () => {
    const response = await proxy(request(`/projects?key=${PASSWORD}&lang=de`));
    expect(response.status).toBe(303);
    const location = new URL(getRedirectUrl(response) as string);
    expect(location.pathname).toBe("/projects");
    expect(location.searchParams.has("key")).toBe(false);
    expect(location.searchParams.get("lang")).toBe("de");

    const cookie = response.cookies.get("site-auth");
    expect(cookie?.value).toBeTruthy();
    expect(cookie?.httpOnly).toBe(true);
    expect(cookie?.sameSite).toBe("strict");
    expect(cookie?.path).toBe("/");
    expect(cookie?.maxAge).toBe(60 * 60 * 24 * 7);
  });

  it("does not mark the cookie secure outside production", async () => {
    // Vitest runs with NODE_ENV=test; next start sets production and then secure is true.
    const response = await proxy(request(`/?key=${PASSWORD}`));
    expect(response.cookies.get("site-auth")?.secure).toBe(false);
  });

  it("accepts the cookie it set on a later request", async () => {
    const cookie = await loginCookie();
    expect(passes(await proxy(request("/projects", cookie)))).toBe(true);
    expect(passes(await proxy(request("/Videos/Big/Arcanoid.mp4", cookie)))).toBe(true);
  });

  it("does not accept a cookie set for a different password", async () => {
    const cookie = await loginCookie();
    vi.stubEnv("SITE_PASSWORD", "another-password");
    expect(redirectsToLogin(await proxy(request("/", cookie)))).toBe(true);
  });

  it("does not accept a cookie after AUTH_SECRET changed", async () => {
    const cookie = await loginCookie();
    vi.stubEnv("AUTH_SECRET", "rotated-secret");
    expect(redirectsToLogin(await proxy(request("/", cookie)))).toBe(true);
  });

  it("does not accept a cookie after AUTH_VERSION changed", async () => {
    const cookie = await loginCookie();
    vi.stubEnv("AUTH_VERSION", "2");
    expect(redirectsToLogin(await proxy(request("/", cookie)))).toBe(true);
  });
});

describe("proxy with SITE_PASSWORD but without AUTH_SECRET (fallback)", () => {
  beforeEach(() => {
    vi.stubEnv("SITE_PASSWORD", PASSWORD);
    vi.stubEnv("AUTH_SECRET", undefined);
  });

  it("still protects and accepts its own cookie", async () => {
    expect(redirectsToLogin(await proxy(request("/")))).toBe(true);
    const cookie = await loginCookie();
    expect(passes(await proxy(request("/projects", cookie)))).toBe(true);
  });

  it("rejects a cookie minted under a secret", async () => {
    vi.stubEnv("AUTH_SECRET", SECRET);
    const cookie = await loginCookie();
    vi.stubEnv("AUTH_SECRET", undefined);
    expect(redirectsToLogin(await proxy(request("/", cookie)))).toBe(true);
  });
});

describe("proxy matcher", () => {
  const matches = (url: string) => unstable_doesMiddlewareMatch({ config, url });

  it("runs on pages", () => {
    expect(matches("/")).toBe(true);
    expect(matches("/projects/acms")).toBe(true);
  });

  it("runs on media under public/ and on the image optimizer", () => {
    expect(matches("/Bilder/Arcanoid/arcanoid.png")).toBe(true);
    expect(matches("/Videos/Big/Arcanoid.mp4")).toBe(true);
    expect(matches("/_next/image?url=%2FBilder%2FArcanoid%2Farcanoid.png&w=640&q=75")).toBe(true);
  });

  it("does not run on /login, framework assets, the favicon, icons and fonts", () => {
    expect(matches("/login")).toBe(false);
    expect(matches("/_next/static/chunk.js")).toBe(false);
    expect(matches("/favicon.ico")).toBe(false);
    expect(matches("/Icons/de_flag.png")).toBe(false);
    expect(matches("/fonts/Press_Start_2P/PressStart2P-Regular.ttf")).toBe(false);
  });
});
