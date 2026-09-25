"use client";

import { Download, ExternalLink, Play } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/data/index";
import { useT } from "@/i18n";

// The calls to action of a project in one fixed order: demo, download, code, custom link.
// One style for all of them (the gradient glow of the site); stacked at full width on a
// phone, in a row from md up, always at least 44 px high. External targets go through
// the confirmation dialog of the page via onExternalLink.
type ProjectActionsProps = {
  id: string;
  project: Project;
  onExternalLink: (url: string, label: string) => void;
};

const CTA_CLASS =
  "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-accent-deep to-accent/70 px-6 py-3 font-bold text-text shadow-glow transition-all motion-safe:hover:scale-105 md:w-auto";

export function ProjectActions({ id, project, onExternalLink }: ProjectActionsProps) {
  const t = useT();
  const custom = project.custom1Link && project.custom1BTNText;
  if (!project.demoLink && !project.demoDownload && !project.githubUrl && !custom) return null;

  return (
    <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:gap-4">
      {project.demoLink && (
        <Link href={`/projects/${id}/demo`} className={CTA_CLASS}>
          <Play className="h-5 w-5" aria-hidden="true" />
          {t.projectDetail.playDemo}
        </Link>
      )}
      {project.demoDownload && (
        <button
          type="button"
          className={CTA_CLASS}
          onClick={() => onExternalLink(project.demoDownload as string, "GitHub")}
        >
          <Download className="h-5 w-5" aria-hidden="true" />
          {t.projectDetail.downloadDemo}
        </button>
      )}
      {project.githubUrl && (
        <button
          type="button"
          className={CTA_CLASS}
          onClick={() => onExternalLink(project.githubUrl as string, "GitHub")}
        >
          <ExternalLink className="h-5 w-5" aria-hidden="true" />
          {t.projectDetail.viewCode}
        </button>
      )}
      {custom && (
        <button
          type="button"
          className={CTA_CLASS}
          onClick={() => onExternalLink(project.custom1Link as string, project.customLabel ?? "")}
        >
          <ExternalLink className="h-5 w-5" aria-hidden="true" />
          {project.custom1BTNText}
        </button>
      )}
    </div>
  );
}
