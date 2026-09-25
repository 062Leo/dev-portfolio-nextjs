"use client";

import { ExternalLinkDialog, useExternalLink } from "@/components/ui/ExternalLinkDialog";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { usePortfolioData, useOtherProjects } from "@/data/index";
import Link from "next/link";
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
            <div
              key={project.id}
              className="card-hover overflow-hidden rounded-lg border border-accent/60 bg-bg/92 shadow-card"
            >
              <div className="h-48 overflow-hidden">
                <Link href={`/projects/${project.id}`}>
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={600}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </Link>
              </div>

              <div className="p-6">
                <Link href={`/projects/${project.id}`} className="-my-2 block py-2">
                  <div className="mb-1 flex items-baseline gap-2 flex-wrap">
                    <h3 className="text-xl font-semibold text-accent-2 transition-colors">
                      {project.title}
                    </h3>
                    {project.subtitle && project.subtitle.trim() && (
                      <span className="text-l font-semibold text-accent-2">{project.subtitle}</span>
                    )}
                  </div>
                </Link>
                <p className="mb-4 text-sm text-text/90">{project.description}</p>

                <div className="mb-4 flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => {
                    if (!tag || tag.trim() === "") {
                      return null;
                    }

                    return (
                      <span
                        key={`${project.id}-${index}`}
                        className="rounded-full border border-accent/40 bg-accent/18 px-2 py-1 text-sm font-medium text-accent"
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>

                <div className="mb-4">
                  <Link
                    href={`/projects/${project.id}`}
                    className="-my-3 inline-flex items-center gap-1 py-3 text-sm font-semibold text-accent-2 transition-colors"
                  >
                    {t.projects.moreDetails}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Weitere Projekte / More Projects */}
        <h3 className="mt-16 mb-4 text-center text-2xl font-semibold text-accent-2 md:text-3xl pt-4">
          {t.projects.moreTitle}
        </h3>
        <p className="mx-auto mb-12 max-w-3xl text-center text-text/90">{t.projects.moreIntro}</p>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {moreProjects.map((project) => (
            <div
              key={project.id}
              className="card-hover overflow-hidden rounded-lg border border-accent/60 bg-bg/92 shadow-card"
            >
              <div className="h-48 overflow-hidden">
                <Link href={`/projects/${project.id}`}>
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={600}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </Link>
              </div>

              <div className="p-6">
                <Link href={`/projects/${project.id}`} className="-my-2 block py-2">
                  <div className="mb-1 flex items-baseline gap-2 flex-wrap">
                    <h3 className="text-xl font-semibold text-accent-2 transition-colors">
                      {project.title}
                    </h3>
                    {project.subtitle && project.subtitle.trim() && (
                      <span className="text-l font-semibold text-accent-2">{project.subtitle}</span>
                    )}
                  </div>
                </Link>
                <p className="mb-4 text-sm text-text/90">{project.description}</p>

                <div className="mb-4 flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => {
                    if (!tag || tag.trim() === "") {
                      return null;
                    }

                    return (
                      <span
                        key={`${project.id}-more-${index}`}
                        className="rounded-full border border-accent/40 bg-accent/18 px-2 py-1 text-sm font-medium text-accent"
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>

                <div className="mb-4">
                  <Link
                    href={`/projects/${project.id}`}
                    className="-my-3 inline-flex items-center gap-1 py-3 text-sm font-semibold text-accent-2 transition-colors"
                  >
                    {t.projects.moreDetails}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
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
