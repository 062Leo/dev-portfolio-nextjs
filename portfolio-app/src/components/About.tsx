"use client";

import { type ReactNode } from "react";
import { Bot, Briefcase, ChartNoAxesCombined, Code, Workflow } from "lucide-react";
import { portfolioData } from "@/data/portfolio-data";
import { portfolioData as portfolioDataEn } from "@/data/portfolio-data-en";
import { useThemeColors, type ThemeColorSet } from "@/components/colors";
import { useLanguage } from "@/context/LanguageContext";

export function About() {
  const { language } = useLanguage();

  const colors = useThemeColors(true);

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
              {language === "de" ? "Softwareentwickler mit Fokus auf Anwendungen, Tools & AI" : "Software Developer focused on applications, tools & AI"}
            </h3>

            {currentPortfolioData.about.description.map((paragraph, index) => (
              <p key={index}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6">
            <InfoCard
              icon={<Code className="h-6 w-6" />}
              title={
                language === "de" ? "Software Development" : "Software Development"
              }
              description={
                language === "de"
                  ? "Entwicklung moderner Anwendungen - von Web-Frontends über Desktop- bis Backend-Lösungen - mit Fokus auf sauberer Architektur, wartbarem Code und praxisnaher Umsetzbarkeit."
                  : "Development of modern applications - from web frontends to desktop and backend solutions - with a focus on clean architecture, maintainable code and practical delivery."
              }
              colors={colors}
            />
            <InfoCard
              icon={<Workflow className="h-6 w-6" />}
              title={language === "de" ? "Interactive Systems" : "Interactive Systems"}
              description={
                language === "de"
                  ? "Konzeption und Umsetzung interaktiver Systeme mit Unity und C# - von Spielen und Simulationen bis zu Anwendungen, in denen Echtzeit-Interaktion, Physik oder komplexe Abläufe gefragt sind."
                  : "Concept and implementation of interactive systems with Unity and C# - from games and simulations to applications where real-time interaction, physics or complex workflows matter."
              }
              colors={colors}
            />
            <InfoCard
              icon={<Bot className="h-6 w-6" />}
              title={language === "de" ? "AI & Automation" : "AI & Automation"}
              description={
                language === "de"
                  ? "Großes Interesse an Künstlicher Intelligenz (KI), insbesondere ihrem produktiven Einsatz im Arbeitsalltag und dem sinnvollen Einbau in Projekte und Apps - kombiniert mit Automatisierung via Python, TypeScript oder Browser-Workflows."
                  : "Strong interest in AI, its productive use in everyday work and its integration into projects and apps - combined with automation via Python, TypeScript or browser workflows."
              }
              colors={colors}
            />
            <InfoCard
              icon={<ChartNoAxesCombined className="h-6 w-6" />}
              title={language === "de" ? "Collaboration & Communication" : "Collaboration & Communication"}
              description={
                language === "de"
                  ? "Zusammenarbeit in agilen Projekten mit klarer Kommunikation, strukturierter Abstimmung und einem verlässlichen Vorgehen von der Planung bis zur Umsetzung."
                  : "Collaboration in agile projects with clear communication, structured alignment and a reliable approach from planning to delivery."
              }
              colors={colors}
            />
            <InfoCard
              icon={<Briefcase className="h-6 w-6" />}
              title={language === "de" ? "Ownership & Mindset" : "Ownership & Mindset"}
              description={
                language === "de"
                  ? "Eigeninitiative, selbstständiges Arbeiten, aktives Mitdenken und die Bereitschaft, Entscheidungen zu treffen und sich durch Projekte und Recherche kontinuierlich weiterzuentwickeln."
                  : "Initiative, independent work, active thinking and the willingness to make decisions and keep developing through projects and research."
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
