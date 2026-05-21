"use client";

import { ArrowUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="currentColor"
    className={className}
  >
    <title>GitHub</title>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const UnityIcon = ({ className }: { className?: string }) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="currentColor"
    className={className}
  >
    <title>Unity Asset Store</title>
    <path d="M19.9 8.4l-7.1 4.1-7.1-4.1L12.8 0l7.1 8.4zM4.3 9.8v4.7l7.1 4.1v-4.9L4.3 9.8zm15.4 0l-7.1 3.9v4.9l7.1-4.1V9.8zM12 24l7.1-4.1v-4.7l-7.1 4.1V24zM4.9 19.9L12 24v-4.7l-7.1-4.1v4.7z" />
  </svg>
);

const ItchIcon = ({ className }: { className?: string }) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="currentColor"
    className={className}
  >
    <title>Itch.io</title>
    <path d="M6.44 7.24c-1.2 0-2.02.84-2.4 1.92l-.54 1.57c-.12.33-.16.64-.16.92 0 .86.53 1.37 1.31 1.37.59 0 1.08-.24 1.48-.75l.53-.67c.2-.25.48-.37.77-.37s.57.12.77.37l.53.67c.4.51.9.75 1.48.75s1.08-.24 1.48-.75l.53-.67c.2-.25.48-.37.77-.37s.57.12.77.37l.53.67c.4.51.9.75 1.48.75s1.08-.24 1.48-.75l.53-.67c.2-.25.48-.37.77-.37s.57.12.77.37l.53.67c.4.51.9.75 1.48.75.79 0 1.31-.51 1.31-1.37 0-.28-.04-.59-.16-.92l-.54-1.57c-.38-1.08-1.2-1.92-2.4-1.92H6.44zm.47 2.88c.23-.32.58-.44.94-.44s.7.12.94.44l.53.67c.47.6 1.02.89 1.68.89s1.21-.29 1.68-.89l.53-.67c.23-.32.58-.44.94-.44s.7.12.94.44l.53.67c.47.6 1.02.89 1.68.89s1.21-.29 1.68-.89l.53-.67c.23-.32.58-.44.94-.44s.7.12.94.44l.18.24c-.11 1.2-.53 2.4-1.04 3.5-.64 1.4-1.49 2.64-2.45 3.5-1.17 1.06-3.4 1.49-4.39 1.49s-3.22-.43-4.39-1.49c-.96-.86-1.81-2.1-2.45-3.5-.51-1.1-.93-2.3-1.04-3.5l.18-.24z" />
  </svg>
);

export function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="relative z-10 border-t border-[rgba(167,139,250,0.15)]">
      <div className="container mx-auto max-w-6xl px-4 pb-8 pt-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <span className="text-xl font-bold">
              <span className="text-foreground/90">leo</span>
              <span className="text-[rgba(248,113,113,1)]">.dev</span>
            </span>
            <p className="mt-3 text-sm text-foreground/60">
              {language === "de"
                ? "Softwareentwickler mit Fokus auf AI, Automatisierung und interaktive Anwendungen."
                : "Software developer focused on AI, automation and interactive applications."}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground/50">
              {language === "de" ? "Navigation" : "Navigation"}
            </h4>
            <nav className="flex flex-col gap-2 text-sm">
              <a href="/" className="text-foreground/70 hover:text-[rgba(248,113,113,1)] transition-colors">
                {language === "de" ? "Home" : "Home"}
              </a>
              <a href="/#about" className="text-foreground/70 hover:text-[rgba(248,113,113,1)] transition-colors">
                {language === "de" ? "Über mich" : "About"}
              </a>
              <a href="/projects" className="text-foreground/70 hover:text-[rgba(248,113,113,1)] transition-colors">
                {language === "de" ? "Projekte" : "Projects"}
              </a>
            </nav>
          </div>

          {/* Links & Legal */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground/50">
              {language === "de" ? "Links" : "Links"}
            </h4>
            <div className="flex gap-4 mb-4">
              <a
                href="https://github.com/062Leo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-[rgba(248,113,113,1)] transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon />
              </a>
              <a
                href="https://assetstore.unity.com/publishers/133842"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-[rgba(248,113,113,1)] transition-colors"
                aria-label="Unity Asset Store"
              >
                <UnityIcon />
              </a>
              <a
                href="https://062leo.itch.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-[rgba(248,113,113,1)] transition-colors"
                aria-label="Itch.io"
              >
                <ItchIcon />
              </a>
            </div>
            <p className="text-xs text-foreground/40 leading-relaxed">
              {language === "de"
                ? "Private Portfolio-Website. Externe Links öffnen externe Plattformen. Diese Website speichert keine personenbezogenen Daten."
                : "Private portfolio website. External links open external platforms. This website does not store any personal data."}
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[rgba(167,139,250,0.1)] pt-6 md:flex-row">
          <p className="text-xs text-foreground/50">
            © {new Date().getFullYear()} Leo.{" "}
            {language === "de" ? "Alle Rechte vorbehalten." : "All rights reserved."}
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1.5 rounded-full border border-[rgba(167,139,250,0.3)] px-3 py-1.5 text-xs text-foreground/50 hover:text-foreground/90 hover:border-[rgba(167,139,250,0.6)] transition-all duration-300"
          >
            <ArrowUp className="h-3 w-3" />
            {language === "de" ? "Nach oben" : "Back to top"}
          </button>
        </div>
      </div>
    </footer>
  );
}
