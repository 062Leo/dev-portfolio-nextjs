// Brake for online password guessing: a sliding window of failed attempts per client.
//
// The state lives in memory of the running process. On Vercel (serverless) that is one
// instance among several, each with its own map, and an instance is recycled at any time.
// The limit therefore slows an attacker down instead of guaranteeing a hard ceiling; the
// real protection stays the password length. It costs nothing to run and needs no store.
//
// Shared by the proxy (?key= on any path) and the login server action (the form).

export const MAX_FAILURES = 10;
export const WINDOW_MS = 15 * 60 * 1000;

// Upper bound for the number of tracked clients; beyond it the least recently active
// client is dropped, so the map cannot grow without limit.
const MAX_KEYS = 10_000;

// Per client: timestamps (ms) of the failures inside the window, oldest first. A key is
// re-inserted on every update, so the map's insertion order is the order of last activity.
const failures = new Map<string, number[]>();

// Client key from the request headers: the first address in X-Forwarded-For (the address
// Vercel and other proxies put first), else X-Real-IP, else a shared fallback.
export function clientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0].trim();
  if (first) return first;
  const real = headers.get("x-real-ip")?.trim();
  if (real) return real;
  return "unknown";
}

// Failures of the client inside the window; expired ones are dropped on the way.
function recent(key: string, now: number): number[] {
  const stamps = failures.get(key);
  if (!stamps) return [];
  const kept = stamps.filter((stamp) => now - stamp < WINDOW_MS);
  if (kept.length === 0) {
    failures.delete(key);
  } else if (kept.length !== stamps.length) {
    failures.set(key, kept);
  }
  return kept;
}

export function registerFailure(key: string): void {
  const now = Date.now();
  const stamps = recent(key, now);
  stamps.push(now);
  // Re-insert so the key moves to the end of the insertion order (most recently active).
  failures.delete(key);
  if (failures.size >= MAX_KEYS) {
    const oldest = failures.keys().next().value;
    if (oldest !== undefined) failures.delete(oldest);
  }
  failures.set(key, stamps);
}

export function isBlocked(key: string): boolean {
  return recent(key, Date.now()).length >= MAX_FAILURES;
}

// Seconds until the oldest failure in the window expires and one more attempt is allowed.
// At least 1 so the header is meaningful even at the very end of the window.
export function retryAfterSeconds(key: string): number {
  const now = Date.now();
  const stamps = recent(key, now);
  if (stamps.length === 0) return 1;
  return Math.max(1, Math.ceil((stamps[0] + WINDOW_MS - now) / 1000));
}

// Called after a successful login so the client's earlier failures no longer count.
export function reset(key: string): void {
  failures.delete(key);
}
