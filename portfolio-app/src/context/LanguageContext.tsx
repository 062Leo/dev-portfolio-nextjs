"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LANG_COOKIE_MAX_AGE_SECONDS, LANG_COOKIE_NAME, type Lang } from "@/i18n/lang";

interface LanguageContextValue {
  language: Lang;
  setLanguage: (language: Lang) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

interface LanguageProviderProps {
  lang: Lang;
  children: ReactNode;
}

// The language is decided on the server: the proxy rewrites every page to /<lang>/... from
// the lang cookie (or the Accept-Language header), and the [lang] layout passes it down
// here. Switching writes the cookie and refreshes the route, so the proxy rewrites to the
// other language while the URL stays the same.
export function LanguageProvider({ lang, children }: LanguageProviderProps) {
  const router = useRouter();

  const setLanguage = (next: Lang) => {
    const secure = window.location.protocol === "https:" ? "; secure" : "";
    document.cookie = `${LANG_COOKIE_NAME}=${next}; path=/; max-age=${LANG_COOKIE_MAX_AGE_SECONDS}; samesite=lax${secure}`;
    router.refresh();
  };

  return (
    <LanguageContext.Provider value={{ language: lang, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
