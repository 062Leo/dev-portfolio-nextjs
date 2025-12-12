"use client";

import { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";
import { portfolioData } from "@/data/portfolio-data";
import { useThemeColors } from "@/components/colors";

const hoverText = " onClick={reload}";

export function HomeSection() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const colors = useThemeColors(isDarkMode);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme");
    const isDark = storedTheme ? storedTheme === "dark" : true;
    setIsDarkMode(isDark);
    setIsReady(true);
  }, []);

  const handleScrollClick = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const reload = () => {
    window.location.reload();
  };

  if (!isReady) {
    return null;
  }

  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col items-center justify-center px-4"
      style={{ backgroundImage: colors.homeSectionBackgroundGradient }}
    >
      <div className="container z-10 mx-auto max-w-7xl text-center">
        <div
          className="mx-auto flex w-full flex-col gap-8 rounded-[40px] border px-6 py-12 md:px-10"
          style={{
            borderColor: colors.homeSectionAccentLine,
            boxShadow: colors.homeSectionBorderGlow,
            backgroundColor: colors.background,
          }}
        >
          <h1
            className="text-4xl font-bold tracking-tight opacity-0 animate-fade-in md:text-6xl"
            style={{
              color: colors.homeSectionTitleColor,
              textShadow: colors.homeSectionTitleGlow,
            }}
          >
            <span>Hi, I&apos;m </span>
            <span className="inline-flex items-baseline">
              <span style={{ color: colors.homeSectionBracketText }}>&lt;</span>
              <span className="relative inline-flex items-baseline">
                <button
                  type="button"
                  onClick={reload}
                  className="relative inline-flex items-baseline cursor-pointer select-none bg-transparent border-0 p-0 text-current group"
                >
                  <span>{portfolioData.personal.firstName}</span>
                  <span className="inline-flex overflow-hidden max-w-0 transition-[max-width] duration-300 ease-out group-hover:max-w-[30rem]">
                    {hoverText.split("").map((char, index) => (
                      <span
                        key={`hover-char-${index}`}
                        className="opacity-0 translate-x-2 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-x-0"
                        style={{ color: colors.homeSectionHoverText, transitionDelay: `${index * 30}ms` }}
                      >
                        {char === " " ? "\u00A0" : char}
                      </span>
                    ))}
                  </span>
                </button>
              </span>
              <span style={{ color: colors.homeSectionSeparator }}>{' /'}</span>
              <span style={{ color: colors.homeSectionBracketText }}>&gt;</span>
            </span>
            <span className="opacity-0 animate-fade-in-delay-2"> {portfolioData.personal.lastName}</span>
          </h1>

          <p
            className="mx-auto text-lg opacity-0 animate-fade-in-delay-3 md:text-xl"
            style={{ color: colors.homeSectionDescriptionText }}
          >
            {portfolioData.personal.role}
          </p>

          <div className="flex flex-col items-center gap-3 pt-4 opacity-0 animate-fade-in-delay-4">
            <div
              className="h-[2px] w-24 rounded-full"
              style={{ backgroundColor: colors.homeSectionAccentLine }}
            />
            <a
              href="/projects"
              className="cosmic-button inline-flex items-center justify-center rounded-full px-15 py-5 text-l font-semibold uppercase tracking-wide"
              style={{
                backgroundImage: `linear-gradient(135deg, ${colors.homeSectionButtonGradientStart}, ${colors.homeSectionButtonGradientEnd})`,
                color: colors.homeSectionButtonText,
                boxShadow: colors.homeSectionBorderGlow,
              }}
            >
              View My Work
            </a>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={handleScrollClick}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center animate-bounce"
        style={{ color: colors.homeSectionTitleColor }}
      >
        <span className="mb-1 select-none text-sm">Scroll</span>
        <ArrowDown className="h-5 w-5" />
      </button>
    </section>
  );
}
