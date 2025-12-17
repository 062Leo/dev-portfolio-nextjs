"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, Download, ExternalLink } from "lucide-react";
import { portfolioData } from "@/data/portfolio-data";
import { portfolioData as portfolioDataEn } from "@/data/portfolio-data-en";
import { otherProjects } from "@/data/other_projects";
import Link from "next/link";
import { useThemeColors } from "@/components/colors";
import { useLanguage } from "@/context/LanguageContext";

export function ProjectsShowcase() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(prefersDark);
    setIsReady(true);
  }, []);

  const colors = useThemeColors(isDarkMode);

  if (!isReady) {
    return null;
  }

  const projects = (language === "en" ? portfolioDataEn : portfolioData).projects;
  const moreProjects = otherProjects.projects.filter((project) => project.id && project.id.trim() !== "");

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
        <p className="mx-auto mb-12 max-w-3xl text-center" style={{ color: colors.projectsSectionSubtitleColor }}>
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
                        className="text-xl font-semibold"
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
                    <ArrowRight className="h-4 w-4" style={{ color: colors.projectsSectionLinkColor }} />
                  </Link>
                </div>

                {/* <div className="flex justify-center space-x-3 text-primary">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-foreground/80 transition-colors duration-300"
                      style={{ color: colors.projectsSectionIconColor }}
                      aria-label="Live demo"
                    >
                      <ExternalLink size={25} />
                    </a>
                  )}
                  {project.demoDownload && (
                    <a
                      href={project.demoDownload}
                      target="_blank"
                      rel="noreferrer"
                      className="text-foreground/80 transition-colors duration-300"
                      style={{ color: colors.projectsSectionIconColor }}
                      aria-label="Download demo"
                    >
                      <Download size={25} />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-foreground/80 transition-colors duration-300"
                      style={{ color: colors.projectsSectionIconColor }}
                      aria-label="View source on GitHub"
                    >
                      <svg
                        role="img"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        fill="currentColor"
                      >
                        <title>GitHub</title>
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                      </svg>
                    </a>
                  )}
                </div> */}
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
                        className="text-xl font-semibold"
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
                    <ArrowRight className="h-4 w-4" style={{ color: colors.projectsSectionLinkColor }} />
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


            {/* hier hin */}
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
