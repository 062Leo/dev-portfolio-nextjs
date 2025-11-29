"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { portfolioData } from "@/data/portfolio-data";

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
  const [activeCategory, setActiveCategory] = useState<SkillCategory>("all");

  const filteredSkills = useMemo(() => {
    if (activeCategory === "all") {
      return skills;
    }
    return skills.filter((skill) => skill.category === activeCategory);
  }, [activeCategory]);

  return (
    <section id="skills" className="relative px-4 py-24">
      <div className="container mx-auto max-w-5xl">
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
          My <span className="text-primary">Skills</span>
        </h2>

        <div className="mb-12 flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={cn(
                "rounded-full px-5 py-2 capitalize transition-colors duration-300",
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-primary/10",
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSkills.map((skill) => (
            <div key={skill.name} className="card-hover rounded-lg bg-card p-6 shadow-sm">
              <div className="mb-4 text-left">
                <h3 className="text-lg font-semibold">{skill.name}</h3>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-primary/20">
                <div
                  className="h-2 origin-left rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${skill.level}%` }}
                />
              </div>

              <div className="mt-1 text-right">
                <span className="text-sm text-foreground/70">{skill.level}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
