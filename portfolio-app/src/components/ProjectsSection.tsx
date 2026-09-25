"use client";

import { ExternalLinkDialog, useExternalLink } from "@/components/ui/ExternalLinkDialog";
import { ArrowRight } from "lucide-react";
import { usePortfolioData, useOtherProjects } from "@/data/index";
import { ProjectCard } from "@/components/ProjectCard";
import { useT } from "@/i18n";

export function ProjectsShowcase() {
  const { open: openExternalLink, dialogProps } = useExternalLink();
  const t = useT();

  const projects = usePortfolioData().projects;
  const moreProjects = useOtherProjects().projects.filter(
    (project) => project.id && project.id.trim() !== "",
  );

  return (
    <section className="relative px-4 py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="mb-4 text-center text-3xl font-bold text-accent-2 md:text-4xl">
          {t.projects.titleStart}{" "}
          <span className="text-accent-2-light">{t.projects.titleAccent}</span>
        </h2>
        <p className="mx-auto mb-12 max-w-3xl text-center text-text/90">{t.projects.intro}</p>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Weitere Projekte / More Projects */}
        <h3 className="mt-16 mb-4 text-center text-2xl font-semibold text-accent-2 md:text-3xl pt-4">
          {t.projects.moreTitle}
        </h3>
        <p className="mx-auto mb-12 max-w-3xl text-center text-text/90">{t.projects.moreIntro}</p>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {moreProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className=" mt-12 flex flex-col justify-center gap-4 pt-4 sm:flex-row">
          <button
            type="button"
            className="cosmic-button inline-flex items-center justify-center rounded-full bg-linear-135 from-accent-deep to-accent-deep/70 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-text shadow-glow"
            onClick={() => openExternalLink("https://github.com/062Leo", "GitHub")}
          >
            {t.projects.githubCta}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <ExternalLinkDialog {...dialogProps} />
    </section>
  );
}
