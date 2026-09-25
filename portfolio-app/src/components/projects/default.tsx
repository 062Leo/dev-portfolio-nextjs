"use client";

import { useState } from "react";
import { useProject } from "@/data/index";
import {
  ArrowLeft,
  Play,
  CheckCircle,
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
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useT } from "@/i18n";
import { renderMarkdownText } from "@/lib/markdown";
import ProjectVideos from "./components/ProjectVideos";

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

const CTA_BUTTON_CLASS =
  "flex items-center px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 bg-linear-to-r from-accent-deep to-accent/70 text-text shadow-glow";

export function DetailPage({ id }: { id: string }) {
  const [showDialog, setShowDialog] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [pendingCustomUrl, setPendingCustomUrl] = useState<string | null>(null);
  const [pendingCustomLabel, setPendingCustomLabel] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<{ url: string; caption?: string } | null>(
    null,
  );
  const t = useT();
  const project = useProject(id);

  // Dynamic stats from project data
  const showStats = project.stats && project.stats.length > 0;
  const hasImages = project.images && project.images.length > 0;

  return (
    <main className="relative z-10 container mx-auto max-w-5xl px-4 py-24">
      <div className="mb-8">
        <Link
          href="/projects"
          className="mb-8 inline-flex items-center gap-2 text-accent transition-colors"
        >
          <ArrowLeft size={20} />
          {t.projectDetail.back}
        </Link>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-4xl space-y-8">
          <div>
            <div className="mb-4 flex items-baseline gap-3 flex-wrap">
              <h1 className="text-[clamp(1.4rem,7vw,3rem)] font-bold font-rubik uppercase [overflow-wrap:anywhere] text-accent-2 text-shadow-glow">
                {renderMarkdownText(project.title) || project.title}
              </h1>
              {project.subtitle && project.subtitle.trim() && (
                <h2 className="text-xl font-semibold font-rubik md:text-2xl uppercase [overflow-wrap:anywhere] text-accent-2 text-shadow-glow">
                  {project.subtitle}
                </h2>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-sm font-medium text-accent"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Main Image */}
          <div className="aspect-video w-full max-w-4xl rounded-xl overflow-hidden border-2 border-accent bg-bg">
            {/* Use project.image if available, otherwise a placeholder or the first image from images array */}
            {/* eslint-disable-next-line @next/next/no-img-element -- converted to next/image in a later step */}
            <img
              src={
                project.image || (project.images && project.images[0]?.url) || "/Bilder/dummy.png"
              }
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-lg leading-relaxed">
            {renderMarkdownText(project.longDescription || project.description, "text-text")}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="mb-4 text-xl font-semibold font-press-start text-accent-2-light">
                {t.projectDetail.keyFeatures}
              </h3>
              <ul className="space-y-2 text-text">
                {project.features?.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="mr-2 w-4 h-4 mt-1 shrink-0 text-success" />
                    <div className="flex-1">
                      {renderMarkdownText(feature, "text-text") || feature}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-xl font-semibold font-press-start text-accent-2-light">
                {t.projectDetail.techStack}
              </h3>
              <div className="flex flex-wrap gap-3">
                {project.techStack?.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md bg-accent/33 px-3 py-1.5 text-sm font-mono uppercase text-text"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {showStats && (
                <>
                  <h3 className="mt-6 mb-4 text-xl font-semibold font-press-start text-accent-2-light">
                    {t.projectDetail.stats}
                  </h3>
                  <div className="space-y-2 text-text">
                    {project.stats?.map((stat, index) => {
                      const IconComponent = iconMap[stat.icon as keyof typeof iconMap];
                      return (
                        <div key={index} className="flex items-center">
                          {IconComponent && <IconComponent className="mr-2 w-4 h-4 text-gold" />}
                          <span>
                            {stat.label}: {stat.value}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-6">
            {project.demoLink && (
              <Link href={`/projects/${id}/demo`} className={CTA_BUTTON_CLASS}>
                <Play className="mr-2 w-5 h-5" />
                {t.projectDetail.playDemo}
              </Link>
            )}
            {project.demoDownload && (
              <button
                type="button"
                className={CTA_BUTTON_CLASS}
                onClick={() => {
                  setPendingUrl(project.demoDownload as string);
                  setShowDialog(true);
                }}
              >
                <Download className="mr-2 w-5 h-5" />
                {t.projectDetail.downloadDemo}
              </button>
            )}
            {project.githubUrl && (
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border border-accent px-6 py-3 text-accent transition-all transform hover:scale-105 shadow-glow"
                onClick={() => {
                  setPendingUrl(project.githubUrl as string);
                  setShowDialog(true);
                }}
              >
                <ExternalLink className="w-5 h-5" />
                {t.projectDetail.viewCode}
              </button>
            )}
            {project.custom1Link && project.custom1BTNText && (
              <button
                type="button"
                className={CTA_BUTTON_CLASS}
                onClick={() => {
                  setPendingCustomUrl(project.custom1Link as string);
                  setPendingCustomLabel(project.customLabel ? project.customLabel : "");
                  setShowCustomDialog(true);
                }}
              >
                <ExternalLink className="mr-2 w-5 h-5" />
                {project.custom1BTNText}
              </button>
            )}
          </div>

          {/* Details Section with Videos */}
          <ProjectVideos videoBig={project.videoBig} videos={project.videos} />

          {hasImages && (
            <div>
              <h3 className="mt-12 mb-6 text-2xl font-semibold font-press-start text-center text-accent-2-light">
                {t.projectDetail.screenshots}
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {project.images!.map((image, index) => (
                  <div key={index} className="flex flex-col items-center gap-3">
                    <div
                      className="relative w-full max-w-md overflow-hidden rounded-xl border-2 border-accent bg-bg aspect-video cursor-pointer group"
                      onClick={() => setSelectedImage(image)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- converted to next/image in a later step */}
                      <img
                        src={image.url}
                        alt={image.caption || project.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span className="text-lg font-semibold text-white">
                          {t.projectDetail.clickMe}
                        </span>
                      </div>
                    </div>
                    {image.caption && (
                      <p className="text-sm text-center max-w-md text-text">{image.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="w-full max-w-[95vw] rounded-3xl bg-bg/95 px-6 py-4 text-text shadow-2xl border border-border relative"
            style={{ maxHeight: "90vh", overflow: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute -top+0 right-6 text-5xl font-extrabold text-accent-2 drop-shadow-lg hover:scale-110 hover:opacity-90 transition-transform"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
            <div className="flex justify-center pb-4">
              <div className="w-full flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element -- converted to next/image in a later step */}
                <img
                  src={selectedImage.url}
                  alt={selectedImage.caption || t.projectDetail.screenshotAlt}
                  className="min-h-[50vh] min-w-[50vw] max-h-[75vh] max-w-[95vw] h-auto w-auto object-contain rounded-xl"
                />
              </div>
            </div>
            {selectedImage.caption && (
              <p className="text-center text-base text-text">{selectedImage.caption}</p>
            )}
          </div>
        </div>
      )}
      {showDialog && pendingUrl && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
        >
          <div className="w-full max-w-2xl rounded-3xl bg-bg/95 px-10 py-12 text-text shadow-2xl border border-border">
            <h2 className="mb-6 text-4xl font-semibold">{t.dialog.title}</h2>
            <p className="mb-4 text-2xl">{t.dialog.leaving("GitHub")}</p>
            <p className="mb-10 text-2xl">{t.dialog.responsibility}</p>
            <p className="mb-10 text-sm break-all opacity-80">
              {t.dialog.redirectingTo(pendingUrl)}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="rounded-md px-4 py-2 text-xl font-medium border border-border bg-bg hover:bg-surface-2 hover:shadow-lg hover:-translate-y-[2px] hover:border-text/60 transition-all duration-150"
                onClick={() => {
                  setShowDialog(false);
                  setPendingUrl(null);
                }}
              >
                {t.dialog.cancel}
              </button>
              <button
                type="button"
                className="rounded-md px-4 py-2 text-xl font-semibold bg-text text-bg hover:brightness-110 hover:shadow-xl hover:-translate-y-[2px] hover:ring-2 hover:ring-text/70 transition-all duration-150"
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
      {showCustomDialog && pendingCustomUrl && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
        >
          <div className="w-full max-w-2xl rounded-3xl bg-bg/95 px-10 py-12 text-text shadow-2xl border border-border">
            <h2 className="mb-6 text-4xl font-semibold">{t.dialog.title}</h2>
            <p className="mb-4 text-2xl">
              {t.dialog.leaving(pendingCustomLabel || t.dialog.defaultLabel)}
            </p>
            <p className="mb-10 text-2xl">{t.dialog.responsibility}</p>
            <p className="mb-10 text-sm break-all opacity-80">
              {t.dialog.redirectingTo(pendingCustomUrl)}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="rounded-md px-4 py-2 text-xl font-medium border border-border bg-bg hover:bg-surface-2 hover:shadow-lg hover:-translate-y-[2px] hover:border-text/60 transition-all duration-150"
                onClick={() => {
                  setShowCustomDialog(false);
                  setPendingCustomUrl(null);
                  setPendingCustomLabel("");
                }}
              >
                {t.dialog.cancel}
              </button>
              <button
                type="button"
                className="rounded-md px-4 py-2 text-xl font-semibold bg-text text-bg hover:brightness-110 hover:shadow-xl hover:-translate-y-[2px] hover:ring-2 hover:ring-text/70 transition-all duration-150"
                onClick={() => {
                  const url = pendingCustomUrl;
                  setShowCustomDialog(false);
                  setPendingCustomUrl(null);
                  setPendingCustomLabel("");
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
    </main>
  );
}
