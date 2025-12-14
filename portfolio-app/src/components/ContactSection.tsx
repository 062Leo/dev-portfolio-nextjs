"use client";

import { useEffect, useState } from "react";

import { useThemeColors } from "@/components/colors";
import { useLanguage } from "@/context/LanguageContext";

export function ContactSection() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(prefersDark);
  }, []);

  const colors = useThemeColors(isDarkMode);

  const isFormEnabled = false;

  return (
    <section id="contact" className="relative px-4 py-24">
      <div className="container mx-auto max-w-5xl">
        <h2
          className="mb-13 text-center text-3xl font-bold md:text-4xl"
          style={{ color: colors.contactSectionTitleColor }}
        >
          {language === "de" ? (
            <>
              Kontakt <span style={{ color: colors.contactSectionAccentColor }}>aufnehmen</span>
            </>
          ) : (
            <>
              Get In <span style={{ color: colors.contactSectionAccentColor }}>Touch</span>
            </>
          )}
        </h2>

        <div className="flex justify-center">
         
          <div
            className="relative w-full max-w-xl rounded-lg p-8 shadow-sm md:w-3/4 lg:w-2/3"
            style={{
              backgroundColor: colors.contactSectionCardBackground,
              borderColor: colors.contactSectionCardBorder,
              boxShadow: colors.contactSectionCardShadow,
            }}
          >
            <div className="pointer-events-none opacity-60">
            </div>

            {!isFormEnabled && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="rounded-full border px-6 py-2 text-sm font-semibold uppercase tracking-wide">
                  {language === "de" ? "Bald verfügbar" : "Coming Soon"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
