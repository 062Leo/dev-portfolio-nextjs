"use client";

import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import type { ProjectImage } from "@/data/types";
import { useT } from "@/i18n";

// The screenshots of a project: one column on a phone, two from md, three from xl. A
// thumbnail is a button that opens the image in a lightbox. The lightbox is the native
// dialog element opened with showModal(), like ExternalLinkDialog: the browser traps
// focus, closes it with Escape and returns focus to the thumbnail.
type ProjectGalleryProps = {
  images: ProjectImage[] | undefined;
  title: string;
};

export function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const t = useT();
  const headingId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<ProjectImage | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (selected && dialog && !dialog.open) dialog.showModal();
  }, [selected]);

  if (!images || images.length === 0) return null;

  const close = () => dialogRef.current?.close();

  return (
    <section aria-labelledby={headingId}>
      <h3
        id={headingId}
        className="mb-6 text-center font-press-start text-lg font-semibold text-accent-2-light md:text-2xl"
      >
        {t.projectDetail.screenshots}
      </h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {images.map((image, index) => (
          <figure key={index} className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setSelected(image)}
              className="group relative aspect-video w-full overflow-hidden rounded-lg border border-accent/60 bg-bg shadow-card"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- converted to next/image in a later step */}
              <img
                src={image.url}
                alt={image.caption || title}
                className="h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
              />
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-bg/60 text-lg font-semibold text-text opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {t.projectDetail.clickMe}
              </span>
            </button>
            {image.caption && (
              <figcaption className="text-center text-base text-text-muted">
                {image.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        aria-label={selected?.caption || t.projectDetail.screenshotAlt}
        onClose={() => setSelected(null)}
        // A click on the backdrop targets the dialog itself; the content box stops it.
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-6xl max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border border-accent/30 bg-surface p-0 text-text shadow-2xl backdrop:bg-black/60"
      >
        {selected && (
          <div className="p-4 md:p-6">
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                onClick={close}
                aria-label={t.projectDetail.closeScreenshot}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-text-muted transition-colors hover:text-text"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element -- converted to next/image in a later step */}
            <img
              src={selected.url}
              alt={selected.caption || t.projectDetail.screenshotAlt}
              className="mx-auto max-h-[75dvh] w-auto max-w-full rounded-lg object-contain"
            />
            {selected.caption && (
              <p className="mt-4 text-center text-base text-text">{selected.caption}</p>
            )}
          </div>
        )}
      </dialog>
    </section>
  );
}
