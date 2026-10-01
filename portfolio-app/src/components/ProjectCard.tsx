"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/data/index";
import { useT } from "@/i18n";

// Card of one project in the project grids. The card fills its grid cell (h-full) and is a
// flex column: image with a fixed aspect ratio on top, content below, and the last row
// pushed to the bottom with mt-auto. Cards in one grid row therefore share their height
// and the position of their bottom row; the space a shorter text leaves sits above that
// row instead of as an empty block under it.
//
// "full" (projects page): title, subtitle, description, every tag and a details link.
// "compact" (home preview): the whole card is one link, description clamped to two lines,
// at most three tags.
type ProjectCardProps = {
  project: Project;
  variant?: "full" | "compact";
};

// The width the image takes in each grid layout. Inert for now: with images.unoptimized in
// next.config.ts next/image renders neither srcset nor sizes; it takes effect once the
// optimizer is back.
const SIZES = {
  // grid-cols-1, lg:grid-cols-2, xl:grid-cols-3
  full: "(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, 33vw",
  // grid-cols-1, md:grid-cols-3
  compact: "(max-width: 768px) 100vw, 33vw",
};

const CARD_CLASS =
  "card-hover group flex h-full flex-col overflow-hidden rounded-lg border border-accent/60 bg-bg/92 shadow-card";

function Tags({ tags, compact }: { tags: string[]; compact: boolean }) {
  const shown = (compact ? tags.slice(0, 3) : tags).filter((tag) => tag && tag.trim() !== "");
  return (
    <div className={compact ? "mt-auto flex flex-wrap gap-1.5 pt-3" : "mb-4 flex flex-wrap gap-2"}>
      {shown.map((tag, index) => (
        <span
          key={index}
          className={
            compact
              ? "rounded-full border border-accent/40 bg-accent/18 px-2 py-0.5 text-xs font-medium text-accent"
              : "rounded-full border border-accent/40 bg-accent/18 px-2 py-1 text-sm font-medium text-accent"
          }
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function CardImage({ project, variant }: Required<ProjectCardProps>) {
  return (
    <Image
      src={project.image}
      alt={project.title}
      width={600}
      height={400}
      sizes={SIZES[variant]}
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
  );
}

export function ProjectCard({ project, variant = "full" }: ProjectCardProps) {
  const t = useT();
  const href = `/projects/${project.id}`;

  if (variant === "compact") {
    return (
      <Link href={href} className={CARD_CLASS}>
        <div className="aspect-[3/2] overflow-hidden">
          <CardImage project={project} variant={variant} />
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-lg font-semibold text-accent-2 transition-colors">{project.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-text/90">{project.description}</p>
          <Tags tags={project.tags} compact />
        </div>
      </Link>
    );
  }

  return (
    <div className={CARD_CLASS}>
      <div className="aspect-[3/2] overflow-hidden">
        <Link href={href} className="block h-full">
          <CardImage project={project} variant={variant} />
        </Link>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <Link href={href} className="-my-2 block py-2">
          <div className="mb-1 flex items-baseline gap-2 flex-wrap">
            <h2 className="text-xl font-semibold text-accent-2 transition-colors">
              {project.title}
            </h2>
            {project.subtitle && project.subtitle.trim() && (
              <span className="text-l font-semibold text-accent-2">{project.subtitle}</span>
            )}
          </div>
        </Link>
        <p className="mb-4 text-sm text-text/90">{project.description}</p>

        <Tags tags={project.tags} compact={false} />

        <div className="mt-auto mb-4">
          <Link
            href={href}
            className="-my-3 inline-flex items-center gap-1 py-3 text-sm font-semibold text-accent-2 transition-colors"
          >
            {t.projects.moreDetails}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
