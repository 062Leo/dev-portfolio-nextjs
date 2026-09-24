"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { usePortfolioData, useOtherProjects } from "@/data/index";
import Link from "next/link";
import { useThemeColors } from "@/components/colors";
import { useLanguage } from "@/context/LanguageContext";

export function ProjectsShowcase() {
  const [showDialog, setShowDialog] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const { language } = useLanguage();

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
          {language === "de" ? (
            <>
              Ausgewählte <span style={{ color: colors.projectsSectionAccentText }}>Projekte</span>
            </>
          ) : (
            <>
              Featured <span style={{ color: colors.projectsSectionAccentText }}>Projects</span>
            </>
          )}
        </h2>
        <p
          className="mx-auto mb-12 max-w-3xl text-center"
          style={{ color: colors.projectsSectionSubtitleColor }}
        >
          {language === "de"
            ? "Hier sind einige meiner aktuellen Projekte, die Design, Performance und sauberen Code verbinden."
            : "Here are some of my recent projects that combine design, performance, and clean code."}
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
                    {language === "de" ? "Mehr Details anzeigen" : "View more Details"}
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
          {language === "de" ? "Weitere Projekte" : "More Projects"}
        </h3>
        <p
          className="mx-auto mb-12 max-w-3xl text-center"
          style={{ color: colors.projectsSectionSubtitleColor }}
        >
          {language === "de"
            ? "Zusätzliche Projekte und Experimente, die mein Portfolio ergänzen."
            : "Additional projects and experiments that complement my portfolio."}
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
                    {language === "de" ? "Mehr Details anzeigen" : "View more Details"}
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
            {language === "de" ? "Mein GitHub-Profil ansehen" : "Check My Personal GitHub"}
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
            <h2 className="mb-6 text-4xl font-semibold">
              {language === "en" ? "External link" : "Externer Link"}
            </h2>
            <p className="mb-4 text-2xl">
              {language === "en"
                ? "You are about to leave this website and will be redirected to an external platform (GitHub)."
                : "Sie verlassen diese Website und werden auf eine externe Plattform (GitHub) weitergeleitet."}
            </p>
            <p className="mb-10 text-2xl">
              {language === "en"
                ? "The processing of personal data on the destination website is the sole responsibility of the respective operator."
                : "Für die Verarbeitung personenbezogener Daten auf der Zielseite ist ausschließlich der jeweilige Betreiber verantwortlich."}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="rounded-md px-4 py-2 text-xl font-medium border border-border bg-background hover:bg-muted hover:shadow-lg hover:-translate-y-[2px] hover:border-foreground/60 transition-all duration-150"
                onClick={() => {
                  setShowDialog(false);
                  setPendingUrl(null);
                }}
              >
                {language === "en" ? "Cancel" : "Abbrechen"}
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
                {language === "en" ? "Continue" : "Fortfahren"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
