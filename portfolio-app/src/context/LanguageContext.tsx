"use client";

import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from "react";

export type SupportedLanguage = "de" | "en";

interface LanguageContextValue {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

// The browser language is read like an external store: the server snapshot and the
// hydration render use German, and React re-renders with the browser language
// right after hydration. No subscription: a later change of navigator.language is
// not followed, as before.
const subscribeToNavigatorLanguage = () => () => {};

function getNavigatorLanguage(): SupportedLanguage {
  const navigatorLanguage = navigator.language || "de";
  return navigatorLanguage.toLowerCase().startsWith("de") ? "de" : "en";
}

function getServerLanguage(): SupportedLanguage {
  return "de";
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const detectedLanguage = useSyncExternalStore(
    subscribeToNavigatorLanguage,
    getNavigatorLanguage,
    getServerLanguage
  );
  // A language chosen by the user wins over the detected one.
  const [chosenLanguage, setLanguage] = useState<SupportedLanguage | null>(null);
  const language = chosenLanguage ?? detectedLanguage;

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
