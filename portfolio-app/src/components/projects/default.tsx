"use client";

import Image from "next/image";
import { useProject } from "@/data/index";
import { renderMarkdownText } from "@/lib/markdown";
import { ExternalLinkDialog, useExternalLink } from "@/components/ui/ExternalLinkDialog";
import { ProjectActions } from "./components/ProjectActions";
import { ProjectFacts } from "./components/ProjectFacts";
import { ProjectGallery } from "./components/ProjectGallery";
import { ProjectHeader } from "./components/ProjectHeader";
import ProjectVideos from "./components/ProjectVideos";

// Full width of the max-w-5xl column (less its px-4 padding). Inert for now: with
// images.unoptimized in next.config.ts next/image renders neither srcset nor sizes; it
// takes effect once the optimizer is back.
const MAIN_IMAGE_SIZES = "(max-width: 1024px) 100vw, 992px";

// The project detail page composed from its sections, top to bottom. One vertical rhythm
// between them; every section is built for a phone first and widens from md up.
export function DetailPage({ id }: { id: string }) {
  const { open: openExternalLink, dialogProps } = useExternalLink();
  const project = useProject(id);
  const mainImage = project.image || project.images?.[0]?.url || "/Bilder/dummy.png";

  return (
    <main className="relative z-10 container mx-auto max-w-5xl px-4 py-24">
      <div className="space-y-10 md:space-y-16">
        <ProjectHeader project={project} />

        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-accent/60 bg-bg shadow-card">
          {/* The first image of the page, so it is preloaded instead of lazy. */}
          <Image
            src={mainImage}
            alt={project.title}
            fill
            preload
            sizes={MAIN_IMAGE_SIZES}
            className="object-cover"
          />
        </div>

        <div className="text-base leading-relaxed md:text-lg">
          {renderMarkdownText(project.longDescription || project.description, "text-text")}
        </div>

        <ProjectFacts project={project} />
        <ProjectActions id={id} project={project} onExternalLink={openExternalLink} />
        <ProjectVideos videoBig={project.videoBig} videos={project.videos} />
        <ProjectGallery images={project.images} title={project.title} />
      </div>
      <ExternalLinkDialog {...dialogProps} />
    </main>
  );
}
