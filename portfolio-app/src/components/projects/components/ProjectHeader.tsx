"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/data/index";
import { useT } from "@/i18n";
import { renderInlineMarkdown } from "@/lib/markdown";

// Top of the project detail page: the way back, the title in the viewport-scaled display
// font (issue #62), the subtitle and the tags.
export function ProjectHeader({ project }: { project: Project }) {
  const t = useT();
  const subtitle = project.subtitle?.trim();

  return (
    <header className="space-y-8">
      <Link
        href="/projects"
        className="-my-2.5 inline-flex min-h-11 items-center gap-2 py-2.5 text-accent transition-colors"
      >
        <ArrowLeft size={20} aria-hidden="true" />
        {t.projectDetail.back}
      </Link>

      <div>
        <div className="mb-4 flex flex-wrap items-baseline gap-3">
          <h1 className="text-[clamp(1.4rem,7vw,3rem)] font-bold font-rubik uppercase [overflow-wrap:anywhere] text-accent-2 text-shadow-glow">
            {renderInlineMarkdown(project.title)}
          </h1>
          {subtitle && (
            <h2 className="text-xl font-semibold font-rubik md:text-2xl uppercase [overflow-wrap:anywhere] text-accent-2 text-shadow-glow">
              {subtitle}
            </h2>
          )}
        </div>
        {project.tags.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-base font-medium text-accent md:text-sm"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
}
