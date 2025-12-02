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
            <h3 className="text-2xl font-semibold">Aspiring Developer</h3>

            {portfolioData.about.description.map((paragraph, index) => (
              <p key={index}>
                {paragraph}
              </p>
            ))}

            <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
              <a href="#contact" className="cosmic-button">
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
              title="Web Development"
              description="Creating responsive websites and applications with modern frameworks."
              colors={colors}
            />
            <InfoCard
              icon={<Gamepad2 className="h-6 w-6" />}
              title="Game Engines"
              description="Developing interactive games and simulations with engines like Unity."
              colors={colors}
            />
            <InfoCard
              icon={<ChartNoAxesCombined className="h-6 w-6" />}
              title="Agile Methodologies"
              description="Applying Scrum and agile practices in collaborative software projects."
              colors={colors}
            />
            <InfoCard
              icon={<Briefcase className="h-6 w-6" />}
              title="Professional Mindset"
              description="Constantly learning and striving to deliver high-quality, maintainable code."
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
