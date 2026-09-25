"use client";

import { type ReactNode } from "react";
import { Bot, Briefcase, ChartNoAxesCombined, Code, Workflow } from "lucide-react";
import { usePortfolioData } from "@/data/index";
import { useT } from "@/i18n";

export function About() {
  const t = useT();
  const currentPortfolioData = usePortfolioData();
  const cards = t.about.cards;

  return (
    <section id="about" className="relative px-4 py-24">
      <div className="container mx-auto max-w-5xl">
        <h2 className="mb-12 text-center text-3xl font-bold text-accent-2/90 md:text-4xl">
          {t.about.titleStart} <span className="text-accent-2-light">{t.about.titleAccent}</span>
        </h2>

        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="space-y-6 rounded-xl bg-bg/95 p-6 text-center shadow-card backdrop-blur md:text-left">
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
            />
            <InfoCard
              icon={<Workflow className="h-6 w-6" />}
              title={cards.interactive.title}
              description={cards.interactive.description}
            />
            <InfoCard
              icon={<Bot className="h-6 w-6" />}
              title={cards.ai.title}
              description={cards.ai.description}
            />
            <InfoCard
              icon={<ChartNoAxesCombined className="h-6 w-6" />}
              title={cards.collaboration.title}
              description={cards.collaboration.description}
            />
            <InfoCard
              icon={<Briefcase className="h-6 w-6" />}
              title={cards.ownership.title}
              description={cards.ownership.description}
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
};

function InfoCard({ icon, title, description }: InfoCardProps) {
  return (
    <div className="gradient-border card-hover border-accent/60 p-6 text-left shadow-card">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-accent/10 p-3 text-accent-2">{icon}</div>
        <div>
          <h4 className="text-lg font-semibold text-accent-2/90">{title}</h4>
          <p className="text-text/90">{description}</p>
        </div>
      </div>
    </div>
  );
}
