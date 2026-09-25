import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest, type NextResponse } from "next/server";
import {
  getRedirectUrl,
  getRewrittenUrl,
  isRewrite,
  unstable_doesMiddlewareMatch,
} from "next/experimental/testing/server";
import { config, proxy } from "@/proxy";

// These tests describe the behaviour of the password gate (pass / redirect / cookie set)
// and of the language rewrite, not the cookie format, so they stay valid when the cookie
// scheme changes.

const PASSWORD = "unit-test-password";
const SECRET = "unit-test-secret";
const ORIGIN = "http://localhost:3100";

type RequestOptions = {
  cookie?: string;
  lang?: string;
  acceptLanguage?: string;
  method?: string;
};

function request(path: string, options: RequestOptions = {}): NextRequest {
  const cookies: string[] = [];
  if (options.cookie) cookies.push(`site-auth=${options.cookie}`);
  if (options.lang) cookies.push(`lang=${options.lang}`);
  const headers: Record<string, string> = {};
  if (cookies.length > 0) headers.cookie = cookies.join("; ");
  if (options.acceptLanguage) headers["accept-language"] = options.acceptLanguage;
  return new NextRequest(new URL(path, ORIGIN), { headers, method: options.method });
}

// The request reaches the app: either passed on unchanged or rewritten to a language.
function passes(response: NextResponse): boolean {
  const passedOn = response.headers.get("x-middleware-next") === "1";
  return (passedOn || isRewrite(response)) && getRedirectUrl(response) === null;
}

function redirectsToLogin(response: NextResponse): boolean {
  return response.status === 307 && getRedirectUrl(response) === `${ORIGIN}/login`;
}

// Path (plus query) the response was rewritten to, or null when it was not rewritten.
function rewrittenPath(response: NextResponse): string | null {
  const url = getRewrittenUrl(response);
  if (url === null) return null;
  const parsed = new URL(url);
  return `${parsed.pathname}${parsed.search}`;
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

  it("still rewrites pages to the language", async () => {
    expect(rewrittenPath(await proxy(request("/", { lang: "en" })))).toBe("/en");
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
    expect(redirectsToLogin(await proxy(request("/", { cookie: "not-a-valid-cookie" })))).toBe(
      true,
    );
  });

  it("lets /login through without a cookie, also for the server action POST", async () => {
    const page = await proxy(request("/login"));
    expect(passes(page)).toBe(true);
    expect(page.cookies.get("site-auth")).toBeUndefined();
    expect(passes(await proxy(request("/login", { method: "POST" })))).toBe(true);
  });

  it("gates /Login like any other path: the exclusion is case-sensitive", async () => {
    expect(redirectsToLogin(await proxy(request("/Login")))).toBe(true);
  });

  it("logs in with the right ?key= on /login and lands on /", async () => {
    const response = await proxy(request(`/login?key=${PASSWORD}`));
    expect(response.status).toBe(303);
    expect(getRedirectUrl(response)).toBe(`${ORIGIN}/`);
    expect(response.cookies.get("site-auth")?.value).toBeTruthy();
  });

  it("answers a wrong ?key= on /login with the delay and /login without the key", async () => {
    const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout");
    const response = await proxy(request("/login?key=wrong-password"));
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 500);
    expect(redirectsToLogin(response)).toBe(true);
    expect(response.cookies.get("site-auth")).toBeUndefined();
  });

  it("sends a logged-in visitor with ?key= on /login to /", async () => {
    const cookie = await loginCookie();
    const response = await proxy(request(`/login?key=${PASSWORD}`, { cookie }));
    expect(response.status).toBe(303);
    expect(getRedirectUrl(response)).toBe(`${ORIGIN}/`);
    expect(response.cookies.get("site-auth")).toBeUndefined();
  });

  it("redirects the internal language prefix away before the gate", async () => {
    for (const [path, target] of [
      ["/de", "/"],
      ["/en", "/"],
      ["/de/projects", "/projects"],
      ["/en/projects/x?a=1", "/projects/x?a=1"],
      ["/de/login", "/login"],
    ]) {
      const response = await proxy(request(path));
      expect(response.status, path).toBe(308);
      expect(getRedirectUrl(response), path).toBe(`${ORIGIN}${target}`);
    }
    // Only the prefix as a whole segment; other paths starting with the letters stay.
    expect(redirectsToLogin(await proxy(request("/design")))).toBe(true);
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
    expect(passes(await proxy(request("/projects", { cookie })))).toBe(true);
    expect(passes(await proxy(request("/Videos/Big/Arcanoid.mp4", { cookie })))).toBe(true);
  });

  it("removes a stray ?key= from the URL of a logged-in visitor", async () => {
    const cookie = await loginCookie();
    const response = await proxy(request(`/projects?key=${PASSWORD}&lang=de`, { cookie }));
    expect(response.status).toBe(303);
    const location = new URL(getRedirectUrl(response) as string);
    expect(location.pathname).toBe("/projects");
    expect(location.searchParams.has("key")).toBe(false);
    expect(location.searchParams.get("lang")).toBe("de");
    expect(response.cookies.get("site-auth")).toBeUndefined();
  });

  it("does not accept a cookie set for a different password", async () => {
    const cookie = await loginCookie();
    vi.stubEnv("SITE_PASSWORD", "another-password");
    expect(redirectsToLogin(await proxy(request("/", { cookie })))).toBe(true);
  });

  it("does not accept a cookie after AUTH_SECRET changed", async () => {
    const cookie = await loginCookie();
    vi.stubEnv("AUTH_SECRET", "rotated-secret");
    expect(redirectsToLogin(await proxy(request("/", { cookie })))).toBe(true);
  });

  it("does not accept a cookie after AUTH_VERSION changed", async () => {
    const cookie = await loginCookie();
    vi.stubEnv("AUTH_VERSION", "2");
    expect(redirectsToLogin(await proxy(request("/", { cookie })))).toBe(true);
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
    expect(passes(await proxy(request("/projects", { cookie })))).toBe(true);
  });

  it("rejects a cookie minted under a secret", async () => {
    vi.stubEnv("AUTH_SECRET", SECRET);
    const cookie = await loginCookie();
    vi.stubEnv("AUTH_SECRET", undefined);
    expect(redirectsToLogin(await proxy(request("/", { cookie })))).toBe(true);
  });
});

describe("language rewrite", () => {
  let cookie: string;

  beforeEach(async () => {
    vi.stubEnv("SITE_PASSWORD", PASSWORD);
    vi.stubEnv("AUTH_SECRET", SECRET);
    cookie = await loginCookie();
  });

  it("rewrites every page path to the language of the lang cookie", async () => {
    expect(rewrittenPath(await proxy(request("/", { cookie, lang: "de" })))).toBe("/de");
    expect(rewrittenPath(await proxy(request("/", { cookie, lang: "en" })))).toBe("/en");
    expect(rewrittenPath(await proxy(request("/projects", { cookie, lang: "en" })))).toBe(
      "/en/projects",
    );
    expect(rewrittenPath(await proxy(request("/projects/x", { cookie, lang: "de" })))).toBe(
      "/de/projects/x",
    );
    expect(rewrittenPath(await proxy(request("/projects/x/demo", { cookie, lang: "en" })))).toBe(
      "/en/projects/x/demo",
    );
    expect(rewrittenPath(await proxy(request("/login", { lang: "en" })))).toBe("/en/login");
  });

  it("keeps the query string", async () => {
    expect(rewrittenPath(await proxy(request("/projects?a=1", { cookie, lang: "en" })))).toBe(
      "/en/projects?a=1",
    );
  });

  it("does not set the lang cookie again when it is present", async () => {
    const response = await proxy(request("/", { cookie, lang: "en" }));
    expect(response.cookies.get("lang")).toBeUndefined();
  });

  it("prefers the cookie over Accept-Language", async () => {
    const response = await proxy(
      request("/", { cookie, lang: "en", acceptLanguage: "de-DE,de;q=0.9" }),
    );
    expect(rewrittenPath(response)).toBe("/en");
  });

  it("falls back to Accept-Language and sets the cookie", async () => {
    const german = await proxy(request("/", { cookie, acceptLanguage: "de-DE,de;q=0.9" }));
    expect(rewrittenPath(german)).toBe("/de");
    expect(german.cookies.get("lang")?.value).toBe("de");

    const english = await proxy(request("/", { cookie, acceptLanguage: "en-US,en;q=0.9" }));
    expect(rewrittenPath(english)).toBe("/en");
    expect(english.cookies.get("lang")?.value).toBe("en");
  });

  it("defaults to English without Accept-Language and sets the cookie", async () => {
    const response = await proxy(request("/projects", { cookie }));
    expect(rewrittenPath(response)).toBe("/en/projects");
    expect(response.cookies.get("lang")?.value).toBe("en");
  });

  it("ignores an unknown cookie value", async () => {
    const response = await proxy(
      request("/", { cookie, lang: "fr", acceptLanguage: "de-DE,de;q=0.9" }),
    );
    expect(rewrittenPath(response)).toBe("/de");
    expect(response.cookies.get("lang")?.value).toBe("de");
  });

  it("sets the lang cookie for one year, readable by the browser, on the whole site", async () => {
    const response = await proxy(request("/", { cookie, acceptLanguage: "de" }));
    const lang = response.cookies.get("lang");
    expect(lang?.httpOnly).toBe(false);
    expect(lang?.sameSite).toBe("lax");
    expect(lang?.path).toBe("/");
    expect(lang?.maxAge).toBe(60 * 60 * 24 * 365);
    expect(lang?.secure).toBe(false);
  });

  it("does not rewrite media or the image optimizer", async () => {
    for (const path of [
      "/Bilder/Arcanoid/arcanoid.png",
      "/Videos/Big/Arcanoid.mp4",
      "/_next/image?url=%2FBilder%2FArcanoid%2Farcanoid.png&w=640&q=75",
    ]) {
      const response = await proxy(request(path, { cookie, lang: "en" }));
      expect(passes(response), path).toBe(true);
      expect(isRewrite(response), path).toBe(false);
      expect(response.cookies.get("lang"), path).toBeUndefined();
    }
  });

  it("redirects a direct /de or /en URL with a session instead of serving it", async () => {
    const projects = await proxy(request("/de/projects", { cookie, lang: "en" }));
    expect(projects.status).toBe(308);
    expect(getRedirectUrl(projects)).toBe(`${ORIGIN}/projects`);
    expect(isRewrite(projects)).toBe(false);

    const home = await proxy(request("/en", { cookie }));
    expect(home.status).toBe(308);
    expect(getRedirectUrl(home)).toBe(`${ORIGIN}/`);
  });

  it("does not rewrite a path that only starts like a page path", async () => {
    for (const path of ["/projectsx", "/loginx", "/login/x"]) {
      expect(isRewrite(await proxy(request(path, { cookie, lang: "en" }))), path).toBe(false);
    }
  });

  it("checks the password before the language", async () => {
    expect(redirectsToLogin(await proxy(request("/projects", { lang: "en" })))).toBe(true);
  });
});

describe("proxy matcher", () => {
  const matches = (url: string) => unstable_doesMiddlewareMatch({ config, url });

  it("runs on pages, including /login", () => {
    expect(matches("/")).toBe(true);
    expect(matches("/projects/acms")).toBe(true);
    expect(matches("/login")).toBe(true);
  });

  it("runs on media under public/ and on the image optimizer", () => {
    expect(matches("/Bilder/Arcanoid/arcanoid.png")).toBe(true);
    expect(matches("/Videos/Big/Arcanoid.mp4")).toBe(true);
    expect(matches("/_next/image?url=%2FBilder%2FArcanoid%2Farcanoid.png&w=640&q=75")).toBe(true);
  });

  it("does not run on framework assets, the favicon, robots.txt, icons and fonts", () => {
    expect(matches("/_next/static/chunk.js")).toBe(false);
    expect(matches("/favicon.ico")).toBe(false);
    expect(matches("/robots.txt")).toBe(false);
    expect(matches("/Icons/de_flag.png")).toBe(false);
    expect(matches("/Icons/og-image.png")).toBe(false);
    expect(matches("/fonts/Press_Start_2P/PressStart2P-Regular.ttf")).toBe(false);
  });
});
