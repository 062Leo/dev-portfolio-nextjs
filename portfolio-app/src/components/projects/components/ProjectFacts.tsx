"use client";

import {
  Award,
  CheckCircle,
  Clock,
  Code,
  DollarSign,
  Download,
  Eye,
  Layers,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import type { Project } from "@/data/index";
import { useT } from "@/i18n";
import { renderMarkdownText } from "@/lib/markdown";

// Features, tech stack and stats of a project: one column on a phone, two from md up.
// The retro headings stay in Press Start 2P at 16 px on a phone, where the longest one
// ("KEY FEATURES", 12 glyphs of 1 em) takes 192 px of the 288 px a 320 px viewport
// leaves, so no heading breaks inside a word.

const iconMap = {
  Clock,
  Star,
  Code,
  Zap,
  Users,
  Target,
  Award,
  Layers,
  Download,
  Eye,
  TrendingUp,
  DollarSign,
};

const HEADING_CLASS =
  "mb-4 font-press-start text-base font-semibold text-accent-2-light md:text-xl";

function Features({ features }: { features: string[] }) {
  const t = useT();
  return (
    <div>
      <h3 className={HEADING_CLASS}>{t.projectDetail.keyFeatures}</h3>
      <ul className="space-y-2 text-base leading-relaxed text-text md:text-lg">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle
              className="mt-1.5 mr-2 h-4 w-4 shrink-0 text-success md:mt-2"
              aria-hidden="true"
            />
            <div className="flex-1">{renderMarkdownText(feature, "text-text") || feature}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TechStack({ techStack }: { techStack: string[] }) {
  const t = useT();
  return (
    <div>
      <h3 className={HEADING_CLASS}>{t.projectDetail.techStack}</h3>
      <ul className="flex flex-wrap gap-3">
        {techStack.map((tech) => (
          <li
            key={tech}
            className="rounded-md bg-accent/33 px-3 py-1.5 font-mono text-base uppercase text-text md:text-sm"
          >
            {tech}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stats({ stats }: { stats: NonNullable<Project["stats"]> }) {
  const t = useT();
  return (
    <div>
      <h3 className={HEADING_CLASS}>{t.projectDetail.stats}</h3>
      <ul className="space-y-2 text-base leading-relaxed text-text md:text-lg">
        {stats.map((stat, index) => {
          const Icon = iconMap[stat.icon];
          return (
            <li key={index} className="flex items-start">
              {Icon && <Icon className="mt-1.5 mr-2 h-4 w-4 shrink-0 text-gold md:mt-2" />}
              <span>
                {stat.label}: {stat.value}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ProjectFacts({ project }: { project: Project }) {
  const features = project.features ?? [];
  const techStack = project.techStack ?? [];
  const stats = project.stats ?? [];
  if (features.length === 0 && techStack.length === 0 && stats.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
      {features.length > 0 && <Features features={features} />}
      {(techStack.length > 0 || stats.length > 0) && (
        <div className="space-y-8">
          {techStack.length > 0 && <TechStack techStack={techStack} />}
          {stats.length > 0 && <Stats stats={stats} />}
        </div>
      )}
    </div>
  );
}
