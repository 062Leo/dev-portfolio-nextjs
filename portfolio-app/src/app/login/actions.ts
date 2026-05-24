"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash } from "crypto";

export async function authenticate(
  _prevState: { error: string | null },
  formData: FormData
) {
  const password = formData.get("password") as string;

  if (!password || password !== process.env.SITE_PASSWORD) {
    return { error: "Invalid password" };
  }

  const hash = createHash("sha256").update(password).digest("hex");

  const cookieStore = await cookies();
  cookieStore.set("site-auth", hash, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/");
}
