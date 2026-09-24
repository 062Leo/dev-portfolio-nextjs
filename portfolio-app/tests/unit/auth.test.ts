import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createAuthToken, timingSafeEqualStrings, verifyPassword } from "@/lib/auth";

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("timingSafeEqualStrings", () => {
  it("is true for equal strings", async () => {
    expect(await timingSafeEqualStrings("secret", "secret")).toBe(true);
    expect(await timingSafeEqualStrings("", "")).toBe(true);
  });

  it("is false for strings of the same length that differ", async () => {
    expect(await timingSafeEqualStrings("secret", "secreT")).toBe(false);
    expect(await timingSafeEqualStrings("secret", "Secret")).toBe(false);
  });

  it("is false for strings of different length", async () => {
    expect(await timingSafeEqualStrings("secret", "secre")).toBe(false);
    expect(await timingSafeEqualStrings("secret", "")).toBe(false);
    expect(await timingSafeEqualStrings("", "secret")).toBe(false);
  });
});

describe("verifyPassword", () => {
  it("is false for empty input", async () => {
    vi.stubEnv("SITE_PASSWORD", "unit-test-password");
    expect(await verifyPassword("")).toBe(false);
  });

  it("is false without SITE_PASSWORD", async () => {
    vi.stubEnv("SITE_PASSWORD", "");
    expect(await verifyPassword("")).toBe(false);
    expect(await verifyPassword("anything")).toBe(false);
  });

  it("is true for the configured password only", async () => {
    vi.stubEnv("SITE_PASSWORD", "unit-test-password");
    expect(await verifyPassword("unit-test-password")).toBe(true);
    expect(await verifyPassword("unit-test-passwor")).toBe(false);
  });
});

describe("createAuthToken", () => {
  it("changes with the secret, the version and the password", async () => {
    vi.stubEnv("SITE_PASSWORD", "unit-test-password");
    vi.stubEnv("AUTH_SECRET", "secret-a");
    vi.stubEnv("AUTH_VERSION", "1");
    const base = await createAuthToken();
    expect(base).toMatch(/^[0-9a-f]{64}$/);
    expect(await createAuthToken()).toBe(base);

    vi.stubEnv("AUTH_SECRET", "secret-b");
    expect(await createAuthToken()).not.toBe(base);
    vi.stubEnv("AUTH_SECRET", "secret-a");

    vi.stubEnv("AUTH_VERSION", "2");
    expect(await createAuthToken()).not.toBe(base);
    vi.stubEnv("AUTH_VERSION", "1");

    vi.stubEnv("SITE_PASSWORD", "other-password");
    expect(await createAuthToken()).not.toBe(base);
  });

  it("throws without SITE_PASSWORD", async () => {
    vi.stubEnv("SITE_PASSWORD", "");
    await expect(createAuthToken()).rejects.toThrow();
  });
});
