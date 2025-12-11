"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Briefcase, ChartNoAxesCombined, Code, Gamepad2 } from "lucide-react";
import { portfolioData } from "@/data/portfolio-data";
import { useThemeColors, type ThemeColorSet } from "@/components/colors";

export function About() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedTheme = window.localStorage.getItem("theme");
    if (storedTheme) {
      setIsDarkMode(storedTheme === "dark");
    }
  }, []);

  const colors = useThemeColors(isDarkMode);

  return (
    <section id="about" className="relative px-4 py-24">
      <div className="container mx-auto max-w-5xl">
        <h2
          className="mb-12 text-center text-3xl font-bold md:text-4xl"
          style={{ color: colors.aboutSectionTitleColor }}
        >
          About <span style={{ color: colors.aboutSectionAccentColor }}>Me</span>
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
            <h3 className="text-2xl font-semibold">Software- und Spiele-Entwickler</h3>

            {portfolioData.about.description.map((paragraph, index) => (
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
              Get In Touch
            </a>

              <a
                href="#"
                className="rounded-full border-3 border-primary px-6 py-2 font-bold outline outline-2 transition-colors duration-300"
                style={{
                  borderColor: colors.aboutSectionCardBorder,
                  color: colors.aboutSectionTitleColor,
                  outlineColor: colors.aboutSectionIconBackground,
                  backgroundColor: "transparent",
                }}
              >
                Download CV
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <InfoCard
              icon={<Code className="h-6 w-6" />}
              title="Software Development"
              description="Entwicklung moderner Anwendungen - von Web-Frontends bis zu Desktop- und Backend-Lösungen - mit Fokus auf sauberer Architektur und wartbarem Code."
              colors={colors}
            />
            <InfoCard
              icon={<Gamepad2 className="h-6 w-6" />}
              title="Game Development"
              description="Konzeption und Umsetzung von 2D- und 3D-Spielen mit Schwerpunkt Unity und C#, inklusive Projekten zu Multiplayer, KI und physikbasiertem Gameplay."
              colors={colors}
            />
            <InfoCard
              icon={<ChartNoAxesCombined className="h-6 w-6" />}
              title="Agile Collaboration"
              description="Zusammenarbeit in agilen Softwareprojekten mit Scrum, klarer Kommunikation und strukturierter Vorgehensweise von Planung bis Umsetzung."
              colors={colors}
            />
            <InfoCard
              icon={<Briefcase className="h-6 w-6" />}
              title="Professional Mindset"
              description="Hoher Qualitätsanspruch, Clean Code, Refactoring und die Bereitschaft, sich fachlich wie persönlich kontinuierlich weiterzuentwickeln."
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
