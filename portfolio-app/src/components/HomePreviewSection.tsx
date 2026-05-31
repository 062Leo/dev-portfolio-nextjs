"use client";

import { usePortfolioData, useOtherProjects } from "@/data/index";
import { useThemeColors } from "@/components/colors";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HomePreviewSection() {
  const { language } = useLanguage();
  const colors = useThemeColors(true);
  const mainProjects = usePortfolioData().projects.filter(
    (p) => p.id !== "coming-soon"
  );
  const otherProjectsList = useOtherProjects().projects.filter(
    (p) => p.id && p.id.trim() !== "" && p.id !== "coming-soon"
  );
  const allProjects = [...mainProjects, ...otherProjectsList];
  const totalCount = allProjects.length;
  const displayed = mainProjects.slice(0, 3);

  return (
    <section className="relative px-4 py-24">
      <div className="container mx-auto max-w-6xl">
        <h2
          className="mb-4 text-center text-3xl font-bold md:text-4xl"
          style={{ color: colors.homePreviewSectionTitleColor }}
        >
          {language === "de" ? (
            <>
              Ausgewählte <span style={{ color: colors.homePreviewSectionAccentColor }}>Projekte</span>
            </>
          ) : (
            <>
              Featured <span style={{ color: colors.homePreviewSectionAccentColor }}>Projects</span>
            </>
          )}
        </h2>
        <p className="mx-auto mb-12 max-w-3xl text-center" style={{ color: colors.projectsSectionSubtitleColor }}>
          {language === "de"
            ? `3 von ${totalCount} Projekten — von AI über Mobile bis Game Development.`
            : `3 of ${totalCount} projects — from AI to mobile to game development.`}
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {displayed.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="card-hover group overflow-hidden rounded-lg shadow-sm"
              style={{
                backgroundColor: colors.projectsSectionCardBackground,
                borderColor: colors.projectsSectionCardBorder,
                boxShadow: colors.projectsSectionCardShadow,
                borderWidth: "1px",
                borderStyle: "solid",
              }}
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
                <h3
                  className="text-lg font-semibold transition-colors"
                  style={{ color: colors.projectsSectionTitleColor }}
                >
                  {project.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm" style={{ color: colors.projectsSectionSubtitleColor }}>
                  {project.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 3).map((tag, index) => {
                    if (!tag || tag.trim() === "") return null;
                    return (
                      <span
                        key={`${project.id}-${index}`}
                        className="rounded-full border px-2 py-0.5 text-xs font-medium"
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
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-3">
          <Link
            href="/projects"
            className="cosmic-button inline-flex items-center justify-center rounded-full px-10 py-4 text-base font-bold uppercase tracking-wide hover:scale-105 transition-transform"
            style={{
              backgroundImage: `linear-gradient(135deg, ${colors.projectsSection_GH_Start}, ${colors.projectsSection_GH_End})`,
              color: colors.projectsSection_GH_Text,
              boxShadow: colors.projectsSection_GH_Glow,
            }}
          >
            {language === "de"
              ? `Alle ${totalCount} Projekte ansehen`
              : `View All ${totalCount} Projects`}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
