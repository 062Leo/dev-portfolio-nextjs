"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useActionState } from "react";
import { authenticate } from "./actions";
import { Lock, Loader2, Mail, Eye, EyeOff } from "lucide-react";

const initialState = { error: null as string | null };

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    authenticate,
    initialState
  );

  const [mounted, setMounted] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [pendingLabel, setPendingLabel] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleExternalLink = (url: string, label: string) => {
    setPendingUrl(url);
    setPendingLabel(label);
    setShowDialog(true);
  };

  return (
    <>
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
                autoFocus
                className="w-full rounded-md border bg-transparent px-4 py-2.5 pr-10 outline-none transition-colors focus:border-purple-400"
                style={{
                  borderColor: "rgba(136, 102, 239, 0.65)",
                  color: "#d5dce8",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: "rgba(213, 220, 232, 0.5)" }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

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
          <button
            type="button"
            onClick={() => handleExternalLink("https://tally.so/r/KYx5ak", "Tally.so")}
            className="mt-2 flex items-center justify-center gap-1.5 text-m transition-colors hover:underline mx-auto"
            style={{ color: "rgba(167, 139, 250, 1)" }}
          >
            <Mail className="h-3.5 w-3.5" />
            Request access
          </button>
        </div>
      </main>

      {mounted && showDialog && pendingUrl && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
        >
          <div
            className="w-full max-w-md rounded-2xl px-8 py-10 shadow-2xl border"
            style={{
              background: "#0b111e",
              borderColor: "rgba(167, 139, 250, 0.3)",
              color: "#d5dce8",
            }}
          >
            <h2 className="mb-4 text-xl font-semibold">
              External link
            </h2>
            <p className="mb-3 text-base" style={{ color: "rgba(213, 220, 232, 0.85)" }}>
              You are about to leave this website and will be redirected to an external platform ({pendingLabel || "External Website"}).
            </p>
            <p className="mb-3 text-base" style={{ color: "rgba(213, 220, 232, 0.85)" }}>
              The processing of personal data on the destination website is the sole responsibility of the respective operator.
            </p>
            <p className="mb-8 text-sm break-all" style={{ color: "rgba(213, 220, 232, 0.5)" }}>
              (redirecting to: {pendingUrl})
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="rounded-md px-4 py-2 text-base font-medium border transition-all duration-150 hover:-translate-y-[2px]"
                style={{
                  borderColor: "rgba(38, 46, 66, 1)",
                  color: "#d5dce8",
                }}
                onClick={() => {
                  setShowDialog(false);
                  setPendingUrl(null);
                  setPendingLabel("");
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-md px-4 py-2 text-base font-semibold transition-all duration-150 hover:-translate-y-[2px]"
                style={{
                  background: "#d5dce8",
                  color: "#0b0d17",
                }}
                onClick={() => {
                  const url = pendingUrl;
                  setShowDialog(false);
                  setPendingUrl(null);
                  setPendingLabel("");
                  if (url) {
                    window.open(url, "_blank", "noopener,noreferrer");
                  }
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
