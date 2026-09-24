"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  AUTH_COOKIE_NAME,
  authCookieOptions,
  createAuthToken,
  verifyPassword,
  wrongPasswordDelay,
} from "@/lib/auth";

export async function authenticate(_prevState: { error: string | null }, formData: FormData) {
  const password = formData.get("password");

  if (typeof password !== "string" || !(await verifyPassword(password))) {
    await wrongPasswordDelay();
    return { error: "Invalid password" };
  }

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, await createAuthToken(), authCookieOptions());

  redirect("/");
}
