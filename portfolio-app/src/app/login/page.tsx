"use client";

import { useActionState } from "react";
import { authenticate } from "./actions";
import { Lock, Loader2, Mail } from "lucide-react";

const initialState = { error: null as string | null };

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    authenticate,
    initialState
  );

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 animate-fade-in"
      style={{ background: "#0b0d17" }}
    >
      <div
        className="w-full max-w-sm rounded-lg border p-8"
        style={{
          background: "#0b111e",
          borderColor: "rgba(136, 102, 239, 0.78)",
          boxShadow: "0 0 30px rgba(167, 139, 250, 0.15)",
        }}
      >
        <div className="mb-6 flex flex-col items-center gap-3">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full"
            style={{ background: "rgba(167, 139, 250, 0.12)" }}
          >
            <Lock className="h-6 w-6" style={{ color: "#a78bfa" }} />
          </div> 
          <h1 className="text-xl font-bold" style={{ color: "#d5dce8" }}>
            Protected Site
          </h1>
          <p
            className="text-center text-sm"
            style={{ color: "rgba(213, 220, 232, 0.76)" }}
          >
            Enter the password to continue
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            autoFocus
            className="w-full rounded-md border bg-transparent px-4 py-2.5 outline-none transition-colors focus:border-purple-400"
            style={{
              borderColor: "rgba(136, 102, 239, 0.65)",
              color: "#d5dce8",
            }}
          />

          {state.error && (
            <p className="text-center text-sm text-red-400">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 rounded-full px-6 py-2 font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-[0.97]"
            style={{
              background: "#a78bfaa8",
              color: "#d5dce8",
            }}
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending ? "Verifying..." : "Login"}
          </button>
        </form>
      </div>

      <div
        className="w-full max-w-sm rounded-lg border px-5 py-4"
        style={{
          background: "rgba(11, 17, 30, 0.9)",
          borderColor: "rgba(167, 139, 250, 0.3)",
        }}
      >
        <p
          className="text-center text-sm leading-relaxed"
          style={{ color: "rgba(213, 220, 232, 0.8)" }}
        >
          Find the password next to the website link at the source where you obtained the link, or request it from the website owner via the link below or any contact details you already have.
        </p>
        <a
          href="https://tally.so/r/KYx5ak"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center justify-center gap-1.5 text-m transition-colors hover:underline"
          style={{ color: "rgba(167, 139, 250, 1)" }}
        >
          <Mail className="h-3.5 w-3.5" />
          Request access
        </a>
      </div>
    </main>
  );
}
