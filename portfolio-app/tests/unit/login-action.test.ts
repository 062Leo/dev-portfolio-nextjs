import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { authenticate } from "@/app/[lang]/login/actions";
import { MAX_FAILURES } from "@/lib/rate-limit";

// The server action runs outside a request here: next/headers is replaced by a cookie
// jar and the request headers each test sets. Every test uses its own client address so
// the limiter's state cannot leak between tests.

const PASSWORD = "unit-test-password";

const setCookie = vi.fn();
let requestHeaders = new Headers();

vi.mock("next/headers", () => ({
  cookies: async () => ({ set: setCookie }),
  headers: async () => requestHeaders,
}));

function form(password: string | null): FormData {
  const data = new FormData();
  if (password !== null) data.set("password", password);
  return data;
}

async function submit(password: string | null) {
  return authenticate({ status: "idle" }, form(password));
}

beforeEach(() => {
  vi.stubEnv("SITE_PASSWORD", PASSWORD);
  vi.stubEnv("AUTH_SECRET", "unit-test-secret");
  setCookie.mockClear();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("authenticate", () => {
  let clients = 0;

  beforeEach(() => {
    clients += 1;
    requestHeaders = new Headers({ "x-forwarded-for": `203.0.113.${clients}` });
  });

  it("sets the auth cookie for the right password", async () => {
    expect(await submit(PASSWORD)).toEqual({ status: "authenticated" });
    expect(setCookie).toHaveBeenCalledTimes(1);
    const [name, value, options] = setCookie.mock.calls[0];
    expect(name).toBe("site-auth");
    expect(value).toMatch(/^[0-9a-f]{64}$/);
    expect(options.httpOnly).toBe(true);
  });

  it("reports a wrong or missing password without setting a cookie", async () => {
    expect(await submit("wrong-password")).toEqual({ status: "invalid-password" });
    expect(await submit(null)).toEqual({ status: "invalid-password" });
    expect(setCookie).not.toHaveBeenCalled();
  });

  it("turns the client away after MAX_FAILURES wrong passwords, the right one included", async () => {
    for (let i = 0; i < MAX_FAILURES; i++) {
      expect(await submit("wrong-password")).toEqual({ status: "invalid-password" });
    }
    expect(await submit("wrong-password")).toEqual({ status: "too-many-attempts" });
    expect(await submit(PASSWORD)).toEqual({ status: "too-many-attempts" });
    expect(setCookie).not.toHaveBeenCalled();
  });

  it("forgets the failures after a successful login", async () => {
    for (let i = 0; i < MAX_FAILURES - 1; i++) await submit("wrong-password");
    expect(await submit(PASSWORD)).toEqual({ status: "authenticated" });
    for (let i = 0; i < MAX_FAILURES - 1; i++) {
      expect(await submit("wrong-password")).toEqual({ status: "invalid-password" });
    }
  });

  it("counts clients separately", async () => {
    for (let i = 0; i < MAX_FAILURES; i++) await submit("wrong-password");
    expect(await submit(PASSWORD)).toEqual({ status: "too-many-attempts" });

    requestHeaders = new Headers({ "x-forwarded-for": "198.51.100.42" });
    expect(await submit(PASSWORD)).toEqual({ status: "authenticated" });
  });
});
