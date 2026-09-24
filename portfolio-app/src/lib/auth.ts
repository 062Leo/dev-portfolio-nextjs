// Password gate: shared by the proxy (runs on every request) and the login server action.
// Uses only Web Crypto (crypto.subtle, TextEncoder), so the same code runs in the edge and
// Node runtimes alike.

export const AUTH_COOKIE_NAME = "site-auth";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days
const WRONG_PASSWORD_DELAY_MS = 500;

const encoder = new TextEncoder();

// Random per-process key for timingSafeEqualStrings. Never persisted; a restart only changes
// the intermediate digests, not the result of a comparison.
const comparisonKey = crypto.getRandomValues(new Uint8Array(32));

let warnedAboutMissingSecret = false;

type AuthEnv = {
  password: string;
  secret: string;
  version: string;
};

// Reads SITE_PASSWORD, AUTH_SECRET and AUTH_VERSION. Returns null when SITE_PASSWORD is
// unset or empty, which switches the protection off (local development).
//
// Fallback: without AUTH_SECRET the password itself is used as HMAC key. The gate still
// works, but the cookie value is then derivable from the password alone, so anyone who
// once knew the password can mint a cookie even after AUTH_VERSION is bumped. Set
// AUTH_SECRET in production.
export function readAuthEnv(): AuthEnv | null {
  const password = process.env.SITE_PASSWORD;
  if (!password) return null;

  const version = process.env.AUTH_VERSION || "1";
  const secret = process.env.AUTH_SECRET;
  if (secret) return { password, secret, version };

  if (!warnedAboutMissingSecret) {
    warnedAboutMissingSecret = true;
    console.warn(
      "AUTH_SECRET is not set: the auth cookie is derived from SITE_PASSWORD alone. Set AUTH_SECRET in production.",
    );
  }
  return { password, secret: password, version };
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacSha256(key: Uint8Array<ArrayBuffer>, message: string): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(message));
  return new Uint8Array(signature);
}

// Cookie value: hex HMAC-SHA256 over "<version>:<password>" keyed with AUTH_SECRET.
// Changing the secret, the version or the password invalidates every existing cookie.
export async function createAuthToken(): Promise<string> {
  const env = readAuthEnv();
  if (!env) throw new Error("SITE_PASSWORD is not set");
  return toHex(await hmacSha256(encoder.encode(env.secret), `${env.version}:${env.password}`));
}

// Constant-time string comparison. Both inputs are first HMAC'd under a random per-process
// key, then the two fixed-length digests are XOR-accumulated. Compared with a plain
// length check plus XOR loop this never branches on the inputs, so neither the length nor
// the position of the first differing byte of the secret leaks through timing.
export async function timingSafeEqualStrings(a: string, b: string): Promise<boolean> {
  const [digestA, digestB] = await Promise.all([
    hmacSha256(comparisonKey, a),
    hmacSha256(comparisonKey, b),
  ]);
  let diff = 0;
  for (let i = 0; i < digestA.length; i++) {
    diff |= digestA[i] ^ digestB[i];
  }
  return diff === 0;
}

export async function verifyPassword(input: string): Promise<boolean> {
  const env = readAuthEnv();
  if (!env) return false;
  return timingSafeEqualStrings(input, env.password);
}

export async function isValidAuthCookie(value: string | undefined): Promise<boolean> {
  if (!value) return false;
  return timingSafeEqualStrings(value, await createAuthToken());
}

// Fixed delay after a failed password check; makes brute-forcing slow without leaking
// anything about how the check failed.
export function wrongPasswordDelay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, WRONG_PASSWORD_DELAY_MS));
}

export function authCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
    secure: process.env.NODE_ENV === "production",
  };
}
