"use client";

import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { portfolioData } from "@/data/portfolio-data";
import { useThemeColors } from "@/components/colors";

type SkillCategory = "all" | "languages" | "frameworks & libraries" | "devOps & tools" | "game engines";

type Skill = {
  name: string;
  level: number;
  category: SkillCategory;
};

const skills: Skill[] = portfolioData.skills as Skill[];

const categories: SkillCategory[] = [
  "all",
  "languages",
  "frameworks & libraries",
  "devOps & tools",
  "game engines",
];

export function SkillsSection() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeCategory, setActiveCategory] = useState<SkillCategory>("all");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedTheme = window.localStorage.getItem("theme");
    if (storedTheme) {
      setIsDarkMode(storedTheme === "dark");
    }
  }, []);

  const colors = useThemeColors(isDarkMode);

  const filteredSkills = useMemo(() => {
    if (activeCategory === "all") {
      return skills;
    }
    return skills.filter((skill) => skill.category === activeCategory);
  }, [activeCategory]);

  return (
    <section id="skills" className="relative px-4 py-24">
      <div className="container mx-auto max-w-5xl">
        <h2
          className="mb-12 text-center text-3xl font-bold md:text-4xl"
          style={{ color: colors.skillsSectionTitleColor }}
        >
          My <span style={{ color: colors.skillsSectionButtonActiveBackground }}>Skills</span>
        </h2>

        <div className="mb-12 flex flex-wrap justify-center gap-4">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className="rounded-full px-5 py-2 capitalize transition-colors duration-300"
                style={
                  isActive
                    ? {
                        backgroundColor: colors.skillsSectionButtonActiveBackground,
                        color: colors.skillsSectionButtonActiveText,
                        boxShadow: `0 0 20px ${colors.skillsSectionButtonActiveBackground}`,
                      }
                    : {
                        color: colors.skillsSectionButtonInactiveText,
                      }
                }
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSkills.map((skill) => (
            <div
              key={skill.name}
              className="card-hover rounded-lg p-6 shadow-sm"
              style={{
                backgroundColor: colors.skillsSectionCardBackground,
                borderColor: colors.skillsSectionCardBorder,
                boxShadow: colors.skillsSectionCardShadow,
              }}
            >
              <div className="mb-4 text-left">
                <h3 className="text-lg font-semibold" style={{ color: colors.skillsSectionTitleColor }}>
                  {skill.name}
                </h3>
              </div>

              <div
                className="h-2 w-full overflow-hidden rounded-full"
                style={{ backgroundColor: colors.skillsSectionProgressBarBg }}
              >
                <div
                  className="h-2 origin-left rounded-full transition-all duration-700"
                  style={{
                    width: `${skill.level}%`,
                    backgroundColor: colors.skillsSectionProgressBarFill,
                  }}
                />
              </div>

              <div className="mt-1 text-right">
                <span className="text-sm" style={{ color: colors.skillsSectionLevelText }}>
                  {skill.level}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
