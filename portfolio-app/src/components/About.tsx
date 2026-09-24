"use client";

import { type ReactNode } from "react";
import { Bot, Briefcase, ChartNoAxesCombined, Code, Workflow } from "lucide-react";
import { usePortfolioData } from "@/data/index";
import { useThemeColors, type ThemeColorSet } from "@/components/colors";
import { useT } from "@/i18n";

export function About() {
  const t = useT();
  const colors = useThemeColors(true);
  const currentPortfolioData = usePortfolioData();
  const cards = t.about.cards;

  return (
    <section id="about" className="relative px-4 py-24">
      <div className="container mx-auto max-w-5xl">
        <h2
          className="mb-12 text-center text-3xl font-bold md:text-4xl"
          style={{ color: colors.aboutSectionTitleColor }}
        >
          {t.about.titleStart}{" "}
          <span style={{ color: colors.aboutSectionAccentColor }}>{t.about.titleAccent}</span>
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
            <h3 className="text-2xl font-semibold">{t.about.headline}</h3>

            {currentPortfolioData.about.description.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6">
            <InfoCard
              icon={<Code className="h-6 w-6" />}
              title={cards.development.title}
              description={cards.development.description}
              colors={colors}
            />
            <InfoCard
              icon={<Workflow className="h-6 w-6" />}
              title={cards.interactive.title}
              description={cards.interactive.description}
              colors={colors}
            />
            <InfoCard
              icon={<Bot className="h-6 w-6" />}
              title={cards.ai.title}
              description={cards.ai.description}
              colors={colors}
            />
            <InfoCard
              icon={<ChartNoAxesCombined className="h-6 w-6" />}
              title={cards.collaboration.title}
              description={cards.collaboration.description}
              colors={colors}
            />
            <InfoCard
              icon={<Briefcase className="h-6 w-6" />}
              title={cards.ownership.title}
              description={cards.ownership.description}
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
