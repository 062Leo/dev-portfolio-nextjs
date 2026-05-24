import { NextRequest, NextResponse } from "next/server";

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function getExpectedHash(): Promise<string | null> {
  const password = process.env.SITE_PASSWORD;
  if (!password) return null;
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(password));
  return toHex(hashBuffer);
}

export async function proxy(request: NextRequest) {
  const expectedHash = await getExpectedHash();
  if (!expectedHash) return NextResponse.next();

  const { pathname } = request.nextUrl;

  if (pathname.match(/\.\w{2,6}$/)) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get("site-auth")?.value;
  if (cookie === expectedHash) return NextResponse.next();

  const key = request.nextUrl.searchParams.get("key");
  if (key === process.env.SITE_PASSWORD) {
    const response = NextResponse.next();
    response.cookies.set("site-auth", expectedHash, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  }

  const loginUrl = new URL("/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next|api|login).*)"],
};
