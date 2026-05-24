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

  const loginUrl = new URL("/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next|api|login).*)"],
};
