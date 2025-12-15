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
      <div>
        © {new Date().getFullYear()} Leo. {" "}
        {language === "de" ? "Alle Rechte vorbehalten." : "All rights reserved."}
      </div>
      <div className="mt-2">
        {language === "de"
          ? "Private Portfolio-Website. Spielbare Demos öffnen externe Plattformen (z.B. itch.io). Diese Website speichert keine personenbezogenen Daten."
          : "Private portfolio website. Playable demos open external platforms (e.g. itch.io). This website does not store any personal data."}
      </div>
    </footer>
  );
}
