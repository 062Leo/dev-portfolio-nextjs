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

export async function proxy(request: NextRequest) {
  if (!readAuthEnv()) return NextResponse.next();

  const cookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (await isValidAuthCookie(cookie)) return NextResponse.next();

  const key = request.nextUrl.searchParams.get("key");
  if (key !== null) {
    if (await verifyPassword(key)) {
      // Redirect to the same URL without the key, so the password neither stays in the
      // address bar nor lands in the browser history.
      const cleanUrl = new URL(request.url);
      cleanUrl.searchParams.delete("key");
      const response = NextResponse.redirect(cleanUrl, 303);
      response.cookies.set(AUTH_COOKIE_NAME, await createAuthToken(), authCookieOptions());
      return response;
    }
    await wrongPasswordDelay();
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

// Everything is protected, including /_next/image (the image optimizer would otherwise
// serve every file under public/ without the password) and every file under public/.
// Exclusions: framework chunks, the login page, the favicon, the UI icons and the fonts
// that globals.css loads on the login page.
export const config = {
  matcher: ["/((?!_next/static|_next/data|login|favicon\\.ico|Icons/|fonts/).*)"],
};
