"use client";

import { useEffect, useState } from "react";

export function Footer() {
  const [language, setLanguage] = useState<"de" | "en">("de");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedLanguage = window.localStorage.getItem("language");
    if (storedLanguage === "en") {
      setLanguage("en");
    } else {
      setLanguage("de");
    }
  }, []);

  return (
    <footer className="px-4 pb-6 pt-12 text-center text-sm text-foreground/70">
      © {new Date().getFullYear()} Leo. {" "}
      {language === "de" ? "Alle Rechte vorbehalten." : "All rights reserved."}
    </footer>
  );
}
