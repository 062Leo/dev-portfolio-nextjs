"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useT } from "@/i18n";

// Leaving the site is made explicit: every external link opens this confirmation first.
// It is the native dialog element opened with showModal(), so the browser provides the
// focus trap, Escape to close, the inert page behind it and focus return to the trigger.

type ExternalLink = { url: string; label: string };

type ExternalLinkDialogProps = {
  // The last requested link. It stays set after closing so the content does not vanish
  // while the continue link is still being followed.
  link: ExternalLink | null;
  isOpen: boolean;
  onClose: () => void;
};

// State for one ExternalLinkDialog: open(url, label) shows it, dialogProps wire it up.
// label names the platform ("GitHub", "itch.io") in the dialog text.
export function useExternalLink() {
  const [link, setLink] = useState<ExternalLink | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((url: string, label: string) => {
    setLink({ url, label });
    setIsOpen(true);
  }, []);
  const onClose = useCallback(() => setIsOpen(false), []);

  const dialogProps: ExternalLinkDialogProps = { link, isOpen, onClose };
  return { open, dialogProps };
}

export function ExternalLinkDialog({ link, isOpen, onClose }: ExternalLinkDialogProps) {
  const t = useT();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  const close = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      // A click on the backdrop targets the dialog itself; the content box stops it.
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border border-accent/30 bg-surface p-0 text-text shadow-2xl backdrop:bg-black/60"
    >
      {link && (
        <div className="p-6 md:p-8">
          <h2 id={titleId} className="mb-4 text-xl font-semibold md:text-2xl">
            {t.dialog.title}
          </h2>
          <p className="mb-3 text-base text-text/85">
            {t.dialog.leaving(link.label || t.dialog.defaultLabel)}
          </p>
          <p className="mb-3 text-base text-text/85">{t.dialog.responsibility}</p>
          <p className="mb-6 text-sm break-all text-text-muted">
            {t.dialog.redirectingTo(link.url)}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={close}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-border px-4 py-2 text-base font-medium text-text transition-all duration-150 motion-safe:hover:-translate-y-[2px] hover:border-text/60 hover:bg-surface-2"
            >
              {t.dialog.cancel}
            </button>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-text px-4 py-2 text-base font-semibold text-bg transition-all duration-150 motion-safe:hover:-translate-y-[2px] hover:ring-2 hover:ring-text/70"
            >
              {t.dialog.continue}
            </a>
          </div>
        </div>
      )}
    </dialog>
  );
}
