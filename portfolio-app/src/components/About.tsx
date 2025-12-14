"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Briefcase, ChartNoAxesCombined, Code, Gamepad2 } from "lucide-react";
import { portfolioData } from "@/data/portfolio-data";
import { portfolioData as portfolioDataEn } from "@/data/portfolio-data-en";
import { useThemeColors, type ThemeColorSet } from "@/components/colors";
import { useLanguage } from "@/context/LanguageContext";

export function About() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const { language } = useLanguage();
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(prefersDark);
    setIsReady(true);
  }, []);

  const colors = useThemeColors(isDarkMode);

  if (!isReady) {
    return null;
  }

  const currentPortfolioData = language === "en" ? portfolioDataEn : portfolioData;

  return (
    <section id="about" className="relative px-4 py-24">
      <div className="container mx-auto max-w-5xl">
        <h2
          className="mb-12 text-center text-3xl font-bold md:text-4xl"
          style={{ color: colors.aboutSectionTitleColor }}
        >
          {language === "de" ? (
            <>
              Über <span style={{ color: colors.aboutSectionAccentColor }}>mich</span>
            </>
          ) : (
            <>
              About <span style={{ color: colors.aboutSectionAccentColor }}>Me</span>
            </>
          )}
        </h2>

        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div
            className="space-y-6 rounded-xl p-6 text-center shadow-sm backdrop-blur md:text-left"
            style={{
              backgroundColor: colors.aboutSectionCardBackground,
              borderColor: colors.aboutSectionCardBorder,
              boxShadow: colors.aboutSectionCardShadow,
            }}
          >
            <h3 className="text-2xl font-semibold">
              {language === "de" ? "Software- und Spiele-Entwickler" : "Software and Game Developer"}
            </h3>

            {currentPortfolioData.about.description.map((paragraph, index) => (
              <p key={index}>
                {paragraph}
              </p>
            ))}

            <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
              <a
                href="#contact"
                className="cosmic-button inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold uppercase tracking-wide"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${colors.aboutMe_GetInTouchButton_G_Start}, ${colors.aboutMe_GetInTouchButton_G_End})`,
                  color: colors.aboutMe_GetInTouchButton_Text,
                  boxShadow: colors.aboutMe_GetInTouchButton_Glow,
                }}
              >
                {language === "de" ? "Kontakt aufnehmen" : "Get In Touch"}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <InfoCard
              icon={<Code className="h-6 w-6" />}
              title={
                language === "de" ? "Software Development" : "Software Development"
              }
              description={
                language === "de"
                  ? "Entwicklung moderner Anwendungen – von Web-Frontends bis zu Desktop- und Backend-Lösungen – mit Fokus auf sauberer Architektur und wartbarem Code."
                  : "Development of modern applications – from web frontends to desktop and backend solutions – with a focus on clean architecture and maintainable code."
              }
              colors={colors}
            />
            <InfoCard
              icon={<Gamepad2 className="h-6 w-6" />}
              title={language === "de" ? "Game Development" : "Game Development"}
              description={
                language === "de"
                  ? "Konzeption und Umsetzung von 2D- und 3D-Spielen mit Schwerpunkt Unity und C#, inklusive Projekten zu Multiplayer, KI, physikbasiertem Gameplay, Mobile-Entwicklung und Monetarisierungsstrategien."
                  : "Concept and implementation of 2D and 3D games with a focus on Unity and C#, including projects on multiplayer, AI, physics-based gameplay, mobile development and monetisation strategies."
              }
              colors={colors}
            />
            <InfoCard
              icon={<ChartNoAxesCombined className="h-6 w-6" />}
              title={language === "de" ? "Agile Collaboration" : "Agile Collaboration"}
              description={
                language === "de"
                  ? "Zusammenarbeit in agilen Softwareprojekten mit Scrum, klarer Kommunikation und strukturierter Vorgehensweise von Planung bis Umsetzung."
                  : "Collaboration in agile software projects using Scrum, clear communication and a structured approach from planning to implementation."
              }
              colors={colors}
            />
            <InfoCard
              icon={<Briefcase className="h-6 w-6" />}
              title={language === "de" ? "Professional Mindset" : "Professional Mindset"}
              description={
                language === "de"
                  ? "Hoher Qualitätsanspruch, Clean Code, Refactoring und die Bereitschaft, sich fachlich wie persönlich kontinuierlich weiterzuentwickeln."
                  : "High quality standards, clean code, refactoring and the willingness to continuously develop both professionally and personally."
              }
              colors={colors}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

type InfoCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  colors: ThemeColorSet;
};

function InfoCard({ icon, title, description, colors }: InfoCardProps) {
  return (
    <div
      className="gradient-border card-hover p-6 text-left"
      style={{
        backgroundColor: colors.aboutSectionCardBackground,
        borderColor: colors.aboutSectionCardBorder,
        boxShadow: colors.aboutSectionCardShadow,
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="rounded-full p-3"
          style={{
            backgroundColor: colors.aboutSectionIconBackground,
            color: colors.aboutSectionIconColor,
          }}
        >
          {icon}
        </div>
        <div>
          <h4 className="text-lg font-semibold" style={{ color: colors.aboutSectionTitleColor }}>
            {title}
          </h4>
          <p style={{ color: colors.aboutSectionDescriptionText }}>{description}</p>
        </div>
      </div>
    </div>
  );
}
