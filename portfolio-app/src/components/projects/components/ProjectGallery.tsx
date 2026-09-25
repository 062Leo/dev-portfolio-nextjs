"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { imageSize } from "@/data/image-sizes";
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

// The width an image takes in the grid (one column, two from md, three from xl, inside the
// max-w-5xl column) and in the lightbox. Inert for now: with images.unoptimized in
// next.config.ts next/image renders neither srcset nor sizes; it takes effect once the
// optimizer is back.
const THUMBNAIL_SIZES = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 330px";
const LIGHTBOX_SIZES = "(max-width: 1152px) 100vw, 1152px";

// The lightbox box has the aspect ratio of the image and is as large as the image, the
// dialog width and 75 % of the viewport height allow, so the image is never scaled up.
function lightboxBox(src: string): CSSProperties {
  const { width, height } = imageSize(src);
  return {
    aspectRatio: `${width} / ${height}`,
    width: `min(100%, ${width}px, calc(75dvh * ${width} / ${height}))`,
  };
}

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
              <Image
                src={image.url}
                alt={image.caption || title}
                fill
                sizes={THUMBNAIL_SIZES}
                className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
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
            <div className="relative mx-auto" style={lightboxBox(selected.url)}>
              <Image
                src={selected.url}
                alt={selected.caption || t.projectDetail.screenshotAlt}
                fill
                sizes={LIGHTBOX_SIZES}
                className="rounded-lg object-contain"
              />
            </div>
            {selected.caption && (
              <p className="mt-4 text-center text-base text-text">{selected.caption}</p>
            )}
          </div>
        )}
      </dialog>
    </section>
  );
}
