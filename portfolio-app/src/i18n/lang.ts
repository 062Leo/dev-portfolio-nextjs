// Language codes and the cookie that carries the visitor's choice. Kept free of React and
// of the dictionaries so the proxy (Node.js runtime) can import it without pulling in either.

export const LANGS = ["de", "en"] as const;

export type Lang = (typeof LANGS)[number];

export function isLang(value: string | null | undefined): value is Lang {
  return (LANGS as readonly string[]).includes(value ?? "");
}

// Functional cookie: holds only "de" or "en", no identifier, no tracking. Not httpOnly on
// purpose, so the language toggle in the browser can write it as well.
export const LANG_COOKIE_NAME = "lang";
export const LANG_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year

export function langCookieOptions() {
  return {
    httpOnly: false,
    sameSite: "lax" as const,
    path: "/",
    maxAge: LANG_COOKIE_MAX_AGE_SECONDS,
    secure: process.env.NODE_ENV === "production",
  };
}

// The language a visitor without a cookie gets, decided from the Accept-Language header:
// a primary tag starting with "de" means German, everything else English.
export function langFromAcceptLanguage(header: string | null | undefined): Lang {
  const primary = (header ?? "").split(",")[0].trim().toLowerCase();
  return primary.startsWith("de") ? "de" : "en";
}
