"use client";

import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { language } = useLanguage();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
  }, []);

  return (
    <footer className="px-4 pb-6 pt-12 text-center text-sm text-foreground/70">
      © {new Date().getFullYear()} Leo. {" "}
      {language === "de" ? "Alle Rechte vorbehalten." : "All rights reserved."}
    </footer>
  );
}
