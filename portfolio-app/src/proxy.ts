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

// The internal language prefix must never be used from outside: a visitor who reached
// /de/... would keep that language whatever the cookie says.
const LANG_PREFIX = /^\/(de|en)(?=\/|$)/;

const LOGIN_PATH = "/login";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (LANG_PREFIX.test(pathname)) {
    const stripped = pathname.replace(LANG_PREFIX, "") || "/";
    return NextResponse.redirect(new URL(`${stripped}${search}`, request.url), 308);
  }

  // The login page (and the POST of its server action) must stay reachable without the
  // password; every other matched path is gated first. A ?key= on /login is still
  // checked, and a right one lands on / instead of the login page.
  const onLoginPage = pathname === LOGIN_PATH;
  if (!onLoginPage || request.nextUrl.searchParams.has("key")) {
    const afterLogin = onLoginPage ? new URL("/", request.url) : cleanUrl(request);
    const gate = await passwordGate(request, afterLogin);
    if (gate) return gate;
  }

  if (!PAGE_PATH.test(pathname)) return NextResponse.next();
  return rewriteToLanguage(request);
}

// Password gate. Returns the response that ends the request (redirect) or null when the
// request may continue. `afterLogin` is where a request that carried ?key= is sent.
async function passwordGate(request: NextRequest, afterLogin: URL): Promise<NextResponse | null> {
  if (!readAuthEnv()) return null;

  const key = request.nextUrl.searchParams.get("key");
  const cookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (await isValidAuthCookie(cookie)) {
    // Already logged in: a stray ?key= is only removed from the URL.
    return key === null ? null : NextResponse.redirect(afterLogin, 303);
  }

  if (key !== null) {
    if (await verifyPassword(key)) {
      // Redirect without the key, so the password neither stays in the address bar nor
      // lands in the browser history.
      const response = NextResponse.redirect(afterLogin, 303);
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
