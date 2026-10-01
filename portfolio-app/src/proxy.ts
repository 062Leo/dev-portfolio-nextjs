import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  authCookieOptions,
  createAuthToken,
  isValidAuthCookie,
  readAuthEnv,
  verifyPassword,
} from "@/lib/auth";
import { clientKey, isBlocked, registerFailure, reset, retryAfterSeconds } from "@/lib/rate-limit";
import {
  LANG_COOKIE_NAME,
  type Lang,
  isLang,
  langCookieOptions,
  langFromAcceptLanguage,
} from "@/i18n/lang";

// Paths that are not pages: framework paths (/_next/..., the image optimizer included)
// and the folders under public/. They are passed on unchanged after the password check.
// Every other path is a page path and is rewritten to /<lang>/..., an unknown one too: it
// then ends in the [lang] catch-all and gets the site's 404 page in the visitor's language
// instead of the framework page without a lang attribute.
const NOT_A_PAGE = /^\/(_|(Bilder|Videos|Icons|fonts)\/)/;

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
  // checked, and a right one lands on / instead of the login page. A visitor who is
  // already logged in never sees the form: /login sends them to /.
  const onLoginPage = pathname === LOGIN_PATH;
  if (!onLoginPage || request.nextUrl.searchParams.has("key")) {
    const afterLogin = onLoginPage ? new URL("/", request.url) : cleanUrl(request);
    const gate = await passwordGate(request, afterLogin);
    if (gate) return gate;
  } else if (await isLoggedIn(request)) {
    return NextResponse.redirect(new URL("/", request.url), 303);
  }

  if (NOT_A_PAGE.test(pathname)) return NextResponse.next();
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
    // A blocked client is answered with 429 whatever the key says: letting a right key
    // through would make the block useless against online guessing.
    const client = clientKey(request.headers);
    if (isBlocked(client)) return tooManyAttempts(client);

    if (await verifyPassword(key)) {
      reset(client);
      // Redirect without the key, so the password neither stays in the address bar nor
      // lands in the browser history.
      const response = NextResponse.redirect(afterLogin, 303);
      response.cookies.set(AUTH_COOKIE_NAME, await createAuthToken(), authCookieOptions());
      return response;
    }
    registerFailure(client);
  }

  return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
}

function tooManyAttempts(client: string): NextResponse {
  return new NextResponse("Too many attempts", {
    status: 429,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "retry-after": String(retryAfterSeconds(client)),
    },
  });
}

async function isLoggedIn(request: NextRequest): Promise<boolean> {
  if (!readAuthEnv()) return false;
  return isValidAuthCookie(request.cookies.get(AUTH_COOKIE_NAME)?.value);
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
// Exclusions: framework chunks, the favicon, robots.txt, the fonts that globals.css loads
// on the login page and exactly three icons: the two language flags and the Open Graph
// image that link previews fetch without a cookie. Every other file under Icons/ is
// gated. /login is matched (it needs the language rewrite) but skips the password check
// above.
export const config = {
  matcher: [
    "/((?!_next/static|_next/data|favicon\\.ico|robots\\.txt|Icons/de_flag\\.png$|Icons/en_flag\\.png$|Icons/og-image\\.png$|fonts/).*)",
  ],
};
