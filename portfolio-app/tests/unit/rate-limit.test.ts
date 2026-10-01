import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clientKey,
  isBlocked,
  MAX_FAILURES,
  registerFailure,
  reset,
  retryAfterSeconds,
  WINDOW_MS,
} from "@/lib/rate-limit";

// The limiter keeps its state in module scope; every test uses its own key so the tests
// cannot influence each other.

const START = new Date("2026-01-01T12:00:00Z").getTime();

function fail(key: string, times: number): void {
  for (let i = 0; i < times; i++) registerFailure(key);
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(START);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("clientKey", () => {
  it("takes the first address of X-Forwarded-For", () => {
    expect(clientKey(new Headers({ "x-forwarded-for": "203.0.113.5, 10.0.0.1" }))).toBe(
      "203.0.113.5",
    );
    expect(clientKey(new Headers({ "x-forwarded-for": " 203.0.113.5 " }))).toBe("203.0.113.5");
  });

  it("falls back to X-Real-IP, then to a shared key", () => {
    expect(clientKey(new Headers({ "x-forwarded-for": "", "x-real-ip": "198.51.100.7" }))).toBe(
      "198.51.100.7",
    );
    expect(clientKey(new Headers({ "x-real-ip": "198.51.100.7" }))).toBe("198.51.100.7");
    expect(clientKey(new Headers())).toBe("unknown");
  });
});

describe("sliding window", () => {
  it("blocks after MAX_FAILURES failures inside the window", () => {
    const key = "window-limit";
    fail(key, MAX_FAILURES - 1);
    expect(isBlocked(key)).toBe(false);
    fail(key, 1);
    expect(isBlocked(key)).toBe(true);
  });

  it("does not block a client that never failed", () => {
    expect(isBlocked("never-seen")).toBe(false);
  });

  it("forgets failures once they are older than the window", () => {
    const key = "window-expiry";
    fail(key, MAX_FAILURES);
    expect(isBlocked(key)).toBe(true);

    vi.setSystemTime(START + WINDOW_MS - 1);
    expect(isBlocked(key)).toBe(true);

    vi.setSystemTime(START + WINDOW_MS);
    expect(isBlocked(key)).toBe(false);
  });

  it("slides: only the failures of the last window count", () => {
    const key = "window-slide";
    fail(key, MAX_FAILURES - 1);
    vi.setSystemTime(START + WINDOW_MS / 2);
    fail(key, 1);
    expect(isBlocked(key)).toBe(true);

    // The first failures expire, the last one alone does not block.
    vi.setSystemTime(START + WINDOW_MS);
    expect(isBlocked(key)).toBe(false);
    fail(key, MAX_FAILURES - 2);
    expect(isBlocked(key)).toBe(false);
    fail(key, 1);
    expect(isBlocked(key)).toBe(true);
  });

  it("tells how long to wait until the oldest failure expires", () => {
    const key = "window-retry";
    fail(key, MAX_FAILURES);
    expect(retryAfterSeconds(key)).toBe(WINDOW_MS / 1000);

    vi.setSystemTime(START + WINDOW_MS - 1500);
    expect(retryAfterSeconds(key)).toBe(2);

    vi.setSystemTime(START + WINDOW_MS - 1);
    expect(retryAfterSeconds(key)).toBe(1);

    expect(retryAfterSeconds("never-seen")).toBe(1);
  });

  it("resets a client on success", () => {
    const key = "window-reset";
    fail(key, MAX_FAILURES);
    expect(isBlocked(key)).toBe(true);
    reset(key);
    expect(isBlocked(key)).toBe(false);
    fail(key, MAX_FAILURES - 1);
    expect(isBlocked(key)).toBe(false);
  });

  it("keeps clients apart", () => {
    fail("client-a", MAX_FAILURES);
    expect(isBlocked("client-a")).toBe(true);
    expect(isBlocked("client-b")).toBe(false);
  });
});

describe("memory bound", () => {
  it("drops the least recently active client once 10 000 clients are tracked", () => {
    // The map still holds the keys of the tests above; the numbers below leave room for
    // them and only need the order of eviction: least recently active first.
    const kept = "bound-kept";
    const dropped = "bound-dropped";
    fail(kept, MAX_FAILURES);
    fail(dropped, MAX_FAILURES);
    for (let i = 0; i < 9_000; i++) registerFailure(`bound-filler-${i}`);
    // A failure counts as activity and moves the client to the young end.
    registerFailure(kept);
    expect(isBlocked(kept)).toBe(true);
    expect(isBlocked(dropped)).toBe(true);

    // Well past the cap: the oldest clients go, "dropped" among them, "kept" not.
    for (let i = 9_000; i < 10_200; i++) registerFailure(`bound-filler-${i}`);
    expect(isBlocked(dropped)).toBe(false);
    expect(isBlocked(kept)).toBe(true);
  });
});
