"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { usePortfolioData, useOtherProjects } from "@/data/index";
import Link from "next/link";
import { useThemeColors } from "@/components/colors";
import { useT } from "@/i18n";

export function ProjectsShowcase() {
  const [showDialog, setShowDialog] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const t = useT();

  const colors = useThemeColors(true);

  const projects = usePortfolioData().projects;
  const moreProjects = useOtherProjects().projects.filter(
    (project) => project.id && project.id.trim() !== "",
  );

  return (
    <section className="relative px-4 py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <h2
          className="mb-4 text-center text-3xl font-bold md:text-4xl"
          style={{ color: colors.projectsSectionTitleColor }}
        >
          {t.projects.titleStart}{" "}
          <span style={{ color: colors.projectsSectionAccentText }}>{t.projects.titleAccent}</span>
        </h2>
        <p
          className="mx-auto mb-12 max-w-3xl text-center"
          style={{ color: colors.projectsSectionSubtitleColor }}
        >
          {t.projects.intro}
        </p>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="card-hover overflow-hidden rounded-lg shadow-sm"
              style={{
                backgroundColor: colors.projectsSectionCardBackground,
                borderColor: colors.projectsSectionCardBorder,
                boxShadow: colors.projectsSectionCardShadow,
                borderWidth: "1px",
                borderStyle: "solid",
              }}
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
                <Link href={`/projects/${project.id}`}>
                  <div className="mb-1 flex items-baseline gap-2 flex-wrap">
                    <h3
                      className="text-xl font-semibold transition-colors"
                      style={{
                        color: colors.projectsSectionTitleColor,
                      }}
                    >
                      {project.title}
                    </h3>
                    {project.subtitle && project.subtitle.trim() && (
                      <span
                        className="text-l font-semibold"
                        style={{
                          color: colors.projectsSectionTitleColor,
                        }}
                      >
                        {project.subtitle}
                      </span>
                    )}
                  </div>
                </Link>
                <p className="mb-4 text-sm" style={{ color: colors.projectsSectionSubtitleColor }}>
                  {project.description}
                </p>

                <div className="mb-4 flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => {
                    if (!tag || tag.trim() === "") {
                      return null;
                    }

                    return (
                      <span
                        key={`${project.id}-${index}`}
                        className="rounded-full border px-2 py-1 text-sm font-medium"
                        style={{
                          borderColor: colors.projectsSectionTagBorder,
                          color: colors.projectsSectionTagText,
                          backgroundColor: colors.projectsSectionTagBackground,
                        }}
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>

                <div className="mb-4">
                  <Link
                    href={`/projects/${project.id}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold transition-colors"
                    style={{ color: colors.projectsSectionLinkColor }}
                  >
                    {t.projects.moreDetails}
                    <ArrowRight
                      className="h-4 w-4"
                      style={{ color: colors.projectsSectionLinkColor }}
                    />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Weitere Projekte / More Projects */}
        <h3
          className="mt-16 mb-4 text-center text-2xl font-semibold md:text-3xl pt-4"
          style={{ color: colors.projectsSectionTitleColor }}
        >
          {t.projects.moreTitle}
        </h3>
        <p
          className="mx-auto mb-12 max-w-3xl text-center"
          style={{ color: colors.projectsSectionSubtitleColor }}
        >
          {t.projects.moreIntro}
        </p>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {moreProjects.map((project) => (
            <div
              key={project.id}
              className="card-hover overflow-hidden rounded-lg shadow-sm"
              style={{
                backgroundColor: colors.projectsSectionCardBackground,
                borderColor: colors.projectsSectionCardBorder,
                boxShadow: colors.projectsSectionCardShadow,
                borderWidth: "1px",
                borderStyle: "solid",
              }}
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
                <Link href={`/projects/${project.id}`}>
                  <div className="mb-1 flex items-baseline gap-2 flex-wrap">
                    <h3
                      className="text-xl font-semibold transition-colors"
                      style={{
                        color: colors.projectsSectionTitleColor,
                      }}
                    >
                      {project.title}
                    </h3>
                    {project.subtitle && project.subtitle.trim() && (
                      <span
                        className="text-l font-semibold"
                        style={{
                          color: colors.projectsSectionTitleColor,
                        }}
                      >
                        {project.subtitle}
                      </span>
                    )}
                  </div>
                </Link>
                <p className="mb-4 text-sm" style={{ color: colors.projectsSectionSubtitleColor }}>
                  {project.description}
                </p>

                <div className="mb-4 flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => {
                    if (!tag || tag.trim() === "") {
                      return null;
                    }

                    return (
                      <span
                        key={`${project.id}-more-${index}`}
                        className="rounded-full border px-2 py-1 text-sm font-medium"
                        style={{
                          borderColor: colors.projectsSectionTagBorder,
                          color: colors.projectsSectionTagText,
                          backgroundColor: colors.projectsSectionTagBackground,
                        }}
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>

                <div className="mb-4">
                  <Link
                    href={`/projects/${project.id}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold transition-colors"
                    style={{ color: colors.projectsSectionLinkColor }}
                  >
                    {t.projects.moreDetails}
                    <ArrowRight
                      className="h-4 w-4"
                      style={{ color: colors.projectsSectionLinkColor }}
                    />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className=" mt-12 flex flex-col justify-center gap-4 pt-4 sm:flex-row">
          <button
            type="button"
            className="cosmic-button inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold uppercase tracking-wide"
            style={{
              backgroundImage: `linear-gradient(135deg, ${colors.projectsSection_GH_Start}, ${colors.projectsSection_GH_End})`,
              color: colors.projectsSection_GH_Text,
              boxShadow: colors.projectsSection_GH_Glow,
            }}
            onClick={() => {
              setPendingUrl("https://github.com/062Leo");
              setShowDialog(true);
            }}
          >
            {t.projects.githubCta}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {showDialog && pendingUrl && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
        >
          <div className="w-full max-w-2xl rounded-3xl bg-background/95 px-10 py-12 text-foreground shadow-2xl border border-border">
            <h2 className="mb-6 text-4xl font-semibold">{t.dialog.title}</h2>
            <p className="mb-4 text-2xl">{t.dialog.leaving("GitHub")}</p>
            <p className="mb-10 text-2xl">{t.dialog.responsibility}</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="rounded-md px-4 py-2 text-xl font-medium border border-border bg-background hover:bg-muted hover:shadow-lg hover:-translate-y-[2px] hover:border-foreground/60 transition-all duration-150"
                onClick={() => {
                  setShowDialog(false);
                  setPendingUrl(null);
                }}
              >
                {t.dialog.cancel}
              </button>
              <button
                type="button"
                className="rounded-md px-4 py-2 text-xl font-semibold bg-foreground text-background hover:brightness-110 hover:shadow-xl hover:-translate-y-[2px] hover:ring-2 hover:ring-foreground/70 transition-all duration-150"
                onClick={() => {
                  const url = pendingUrl;
                  setShowDialog(false);
                  setPendingUrl(null);
                  if (url) {
                    window.open(url, "_blank", "noopener,noreferrer");
                  }
                }}
              >
                {t.dialog.continue}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
