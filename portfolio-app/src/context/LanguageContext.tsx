"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type SupportedLanguage = "de" | "en";

interface LanguageContextValue {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<SupportedLanguage>("de");

  useEffect(() => {
    if (typeof navigator === "undefined") {
      return;
    }

    const navigatorLanguage = navigator.language || "de";
    const initialLanguage: SupportedLanguage = navigatorLanguage.toLowerCase().startsWith("en") ? "en" : "de";
    setLanguage(initialLanguage);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
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
