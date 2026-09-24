"use server";

import { cookies } from "next/headers";
import {
  AUTH_COOKIE_NAME,
  authCookieOptions,
  createAuthToken,
  verifyPassword,
  wrongPasswordDelay,
} from "@/lib/auth";

// The result is a status, not a message: the login page translates it. After
// "authenticated" the page navigates to / itself (the proxy then picks the language), so
// the client router never has to apply a server-action redirect that crosses the
// language rewrite.
export type LoginState = { status: "idle" | "invalid-password" | "authenticated" };

export async function authenticate(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = formData.get("password");

  if (typeof password !== "string" || !(await verifyPassword(password))) {
    await wrongPasswordDelay();
    return { status: "invalid-password" };
  }

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, await createAuthToken(), authCookieOptions());

  return { status: "authenticated" };
}
