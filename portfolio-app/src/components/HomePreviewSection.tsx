"use client";

import { usePortfolioData, useOtherProjects } from "@/data/index";
import { useT } from "@/i18n";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
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
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="card-hover group overflow-hidden rounded-lg border border-accent/60 bg-bg/92 shadow-card"
            >
              <div className="h-44 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={600}
                  height={400}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold text-accent-2 transition-colors">
                  {project.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-text/90">{project.description}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 3).map((tag, index) => {
                    if (!tag || tag.trim() === "") return null;
                    return (
                      <span
                        key={`${project.id}-${index}`}
                        className="rounded-full border border-accent/40 bg-accent/18 px-2 py-0.5 text-xs font-medium text-accent"
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>
              </div>
            </Link>
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
