"use server";

import { cookies, headers } from "next/headers";
import { AUTH_COOKIE_NAME, authCookieOptions, createAuthToken, verifyPassword } from "@/lib/auth";
import { clientKey, isBlocked, registerFailure, reset } from "@/lib/rate-limit";

// The result is a status, not a message: the login page translates it. After
// "authenticated" the page navigates to / itself (the proxy then picks the language), so
// the client router never has to apply a server-action redirect that crosses the
// language rewrite.
export type LoginState = {
  status: "idle" | "invalid-password" | "too-many-attempts" | "authenticated";
};

export async function authenticate(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = formData.get("password");

  // Same brake as for ?key= in the proxy: after too many wrong passwords the client is
  // turned away for a while, a right password included.
  const client = clientKey(await headers());
  if (isBlocked(client)) return { status: "too-many-attempts" };

  if (typeof password !== "string" || !(await verifyPassword(password))) {
    registerFailure(client);
    return { status: "invalid-password" };
  }
  reset(client);

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, await createAuthToken(), authCookieOptions());

  return { status: "authenticated" };
}
