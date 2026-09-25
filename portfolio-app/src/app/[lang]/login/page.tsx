"use client";

import { useEffect, useState } from "react";
import { ExternalLinkDialog, useExternalLink } from "@/components/ui/ExternalLinkDialog";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { authenticate, type LoginState } from "./actions";
import { Lock, Loader2, Mail, Eye, EyeOff } from "lucide-react";
import { useT } from "@/i18n";

const initialState: LoginState = { status: "idle" };

export default function LoginPage() {
  const t = useT();
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(authenticate, initialState);
  const authenticated = state.status === "authenticated";
  const busy = isPending || authenticated;

  // Navigate once the cookie is set; the proxy then serves / in the visitor's language.
  useEffect(() => {
    if (authenticated) router.push("/");
  }, [authenticated, router]);

  const { open: openExternalLink, dialogProps } = useExternalLink();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg px-4 animate-fade-in">
        <div className="w-full max-w-sm rounded-lg border border-accent/70 bg-surface p-8 shadow-glow-soft">
          <div className="mb-6 flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/12">
              <Lock className="h-6 w-6 text-accent" />
            </div>
            <h1 className="text-xl font-bold text-text">{t.login.title}</h1>
            <p className="text-center text-sm text-text/75">{t.login.prompt}</p>
          </div>

          <form action={formAction} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={t.login.passwordPlaceholder}
                required
                autoFocus
                className="w-full rounded-md border border-accent/65 bg-transparent px-4 py-2.5 pr-10 text-text outline-none transition-colors focus:border-accent"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute -right-0.5 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center text-text-muted transition-colors"
                aria-label={showPassword ? t.login.hidePassword : t.login.showPassword}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {state.status === "invalid-password" && (
              <p className="text-center text-sm text-accent-2-light">{t.login.invalidPassword}</p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-accent/65 px-6 py-2 max-md:min-h-11 font-medium text-text transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-[0.97]"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {busy ? t.login.verifying : t.login.submit}
            </button>
          </form>
        </div>

        <div className="w-full max-w-sm rounded-lg border border-accent/30 bg-surface/90 px-5 py-4">
          <p className="text-center text-sm leading-relaxed text-text/80">{t.login.help}</p>
          <button
            type="button"
            onClick={() => openExternalLink("https://tally.so/r/KYx5ak", "Tally.so")}
            className="-mt-0.5 -mb-2.5 flex items-center justify-center gap-1.5 py-2.5 text-m text-accent transition-colors hover:underline mx-auto"
          >
            <Mail className="h-3.5 w-3.5" />
            {t.login.requestAccess}
          </button>
        </div>
      </main>

      <ExternalLinkDialog {...dialogProps} />
    </>
  );
}
