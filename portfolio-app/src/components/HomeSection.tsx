"use client";

import { ArrowDown } from "lucide-react";
import Link from "next/link";
import { usePortfolioData } from "@/data/index";
import { useT } from "@/i18n";

const hoverText = " onClick={reload}";

export function HomeSection() {
  const t = useT();

  const handleScrollClick = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const reload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const currentPortfolioData = usePortfolioData();

  return (
    <section id="home" className="relative flex flex-col items-center justify-center px-4 pt-24">
      {/* The backdrop stays one screen high, so its gradients fade out below the fold as
          before, however short the section is. */}
      <div
        aria-hidden="true"
        className="hero-backdrop pointer-events-none absolute inset-x-0 top-0 -z-10 h-svh"
      />
      <div className="container z-10 mx-auto max-w-7xl text-center">
        <div className="mx-auto flex w-full flex-col gap-8 rounded-[40px] border border-accent bg-bg px-6 py-12 shadow-hero md:px-10">
          <h1 className="text-4xl font-bold tracking-tight text-accent-2 text-shadow-glow opacity-0 animate-fade-in md:text-6xl">
            <span>{t.hero.greeting}</span>
            <span className="inline-flex items-baseline">
              <span className="text-text">&lt;</span>
              <span className="relative inline-flex items-baseline">
                <button
                  type="button"
                  onClick={reload}
                  className="relative inline-flex items-baseline cursor-pointer select-none bg-transparent border-0 px-0 py-0.5 -my-0.5 text-current group"
                >
                  <span>{currentPortfolioData.personal.firstName}</span>
                  <span className="inline-flex overflow-hidden max-w-0 transition-[max-width] duration-300 ease-out group-hover:max-w-[30rem]">
                    {hoverText.split("").map((char, index) => (
                      <span
                        key={`hover-char-${index}`}
                        className="text-success opacity-0 translate-x-2 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-x-0"
                        style={{ transitionDelay: `${index * 30}ms` }}
                      >
                        {char === " " ? " " : char}
                      </span>
                    ))}
                  </span>
                </button>
              </span>
              <span className="text-cyan">{" /"}</span>
              <span className="text-text">&gt;</span>
            </span>
          </h1>

          <p className="mx-auto text-lg text-text/95 opacity-0 animate-fade-in-delay-3 md:text-xl">
            {currentPortfolioData.personal.role}
          </p>

          <div className="flex flex-col items-center gap-3 pt-4 opacity-0 animate-fade-in-delay-4">
            <div className="h-[2px] w-24 rounded-full bg-accent" />
            <Link
              href="/projects"
              className="cosmic-button inline-flex items-center justify-center rounded-full bg-linear-135 from-accent-deep to-accent-2-deep px-15 py-5 text-l font-semibold uppercase tracking-wide text-text shadow-hero"
            >
              {t.hero.cta}
            </Link>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={handleScrollClick}
        className="mt-6 flex flex-col items-center text-accent-2 animate-bounce"
      >
        <span className="mb-1 select-none text-sm">{t.hero.scroll}</span>
        <ArrowDown className="h-5 w-5" />
      </button>
    </section>
  );
}
