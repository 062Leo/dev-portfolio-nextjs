import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  authCookieOptions,
  createAuthToken,
  isValidAuthCookie,
  readAuthEnv,
  verifyPassword,
  wrongPasswordDelay,
} from "@/lib/auth";
import {
  LANG_COOKIE_NAME,
  type Lang,
  isLang,
  langCookieOptions,
  langFromAcceptLanguage,
} from "@/i18n/lang";

// Page paths that live under the internal [lang] segment: /, /projects..., /login. Only
// these are rewritten; everything else the matcher lets through (media under public/, the
// image optimizer) is passed on unchanged after the password check.
const PAGE_PATH = /^\/(projects(\/.*)?|login)?$/;

const LOGIN_PATH = "/login";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The login page (and the POST of its server action) must stay reachable without the
  // password; every other matched path is gated first.
  if (pathname !== LOGIN_PATH) {
    const gate = await passwordGate(request);
    if (gate) return gate;
  }

  if (!PAGE_PATH.test(pathname)) return NextResponse.next();
  return rewriteToLanguage(request);
}

// Password gate. Returns the response that ends the request (redirect) or null when the
// request may continue.
async function passwordGate(request: NextRequest): Promise<NextResponse | null> {
  if (!readAuthEnv()) return null;

  const key = request.nextUrl.searchParams.get("key");
  const cookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (await isValidAuthCookie(cookie)) {
    // Already logged in: a stray ?key= is only removed from the URL.
    return key === null ? null : NextResponse.redirect(cleanUrl(request), 303);
  }

  if (key !== null) {
    if (await verifyPassword(key)) {
      // Redirect to the same URL without the key, so the password neither stays in the
      // address bar nor lands in the browser history.
      const response = NextResponse.redirect(cleanUrl(request), 303);
      response.cookies.set(AUTH_COOKIE_NAME, await createAuthToken(), authCookieOptions());
      return response;
    }
    await wrongPasswordDelay();
  }

  return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
}

function cleanUrl(request: NextRequest): URL {
  const url = new URL(request.url);
  url.searchParams.delete("key");
  return url;
}

// Language: the lang cookie if it holds a known value, otherwise the browser's
// Accept-Language. The page is rewritten to /<lang><path>; the URL the visitor sees stays
// the same. A missing cookie is set on the way out so the choice is stable from now on.
function rewriteToLanguage(request: NextRequest): NextResponse {
  const cookieValue = request.cookies.get(LANG_COOKIE_NAME)?.value;
  const fromCookie = isLang(cookieValue);
  const lang: Lang = fromCookie
    ? cookieValue
    : langFromAcceptLanguage(request.headers.get("accept-language"));

  const { pathname, search } = request.nextUrl;
  const target = new URL(`/${lang}${pathname === "/" ? "" : pathname}${search}`, request.url);
  const response = NextResponse.rewrite(target);
  if (!fromCookie) response.cookies.set(LANG_COOKIE_NAME, lang, langCookieOptions());
  return response;
}

// Everything is protected, including /_next/image (the image optimizer would otherwise
// serve every file under public/ without the password) and every file under public/.
// Exclusions: framework chunks, the favicon, the UI icons and the fonts that globals.css
// loads on the login page. /login is matched (it needs the language rewrite) but skips
// the password check above.
export const config = {
  matcher: ["/((?!_next/static|_next/data|favicon\\.ico|Icons/|fonts/).*)"],
};
