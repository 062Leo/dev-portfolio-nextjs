"use client";

import { usePortfolioData, useOtherProjects } from "@/data/index";
import { useT } from "@/i18n";
import { ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";
import Link from "next/link";

export function HomePreviewSection() {
  const t = useT();
  const mainProjects = usePortfolioData().projects.filter((p) => p.id !== "coming-soon");
  const otherProjectsList = useOtherProjects().projects.filter(
    (p) => p.id && p.id.trim() !== "" && p.id !== "coming-soon",
  );
  const allProjects = [...mainProjects, ...otherProjectsList];
  const totalCount = allProjects.length;
  const displayed = mainProjects.slice(0, 3);

  return (
    <section className="relative px-4 py-24">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-4 text-center text-3xl font-bold text-accent-2 md:text-4xl">
          {t.projectsPreview.titleStart}{" "}
          <span className="text-accent-2-light">{t.projectsPreview.titleAccent}</span>
        </h2>
        <p className="mx-auto mb-12 max-w-3xl text-center text-text/90">
          {t.projectsPreview.subtitle(totalCount)}
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {displayed.map((project) => (
            <ProjectCard key={project.id} project={project} variant="compact" />
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-3">
          <Link
            href="/projects"
            className="cosmic-button inline-flex items-center justify-center rounded-full bg-linear-135 from-accent-deep to-accent-deep/70 px-10 py-4 text-base font-bold uppercase tracking-wide text-text shadow-glow hover:scale-105 transition-transform"
          >
            {t.projectsPreview.viewAll(totalCount)}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
