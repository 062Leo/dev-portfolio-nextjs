import { useLanguage } from "@/context/LanguageContext";
import type { Lang } from "@/i18n/lang";
import type { Project } from "./types";
import { portfolioData as portfolioDataDe } from "./portfolio-data";
import { otherProjects as otherProjectsDe } from "./other_projects";
import { portfolioData as portfolioDataEn } from "./portfolio-data-en";
import { otherProjects as otherProjectsEn } from "./other_projects_en";
import skillsDe from "./skills.json";
import skillsEn from "./skills_en.json";

export type { Project, DemoControlsGroup } from "./types";

const portfolioByLang = { de: portfolioDataDe, en: portfolioDataEn };
const otherByLang = { de: otherProjectsDe, en: otherProjectsEn };
const skillsByLang = { de: skillsDe, en: skillsEn };

// An empty id marks a placeholder entry that never gets a page.
function withId(projects: Project[]): Project[] {
  return projects.filter((project) => project.id.trim() !== "");
}

// Ids of every project that exists in the given language (main and other projects); used
// by generateStaticParams, so each language only gets pages for its own projects.
export function projectIds(lang: Lang): string[] {
  const ids = [...portfolioByLang[lang].projects, ...otherByLang[lang].projects].map(
    (project) => project.id,
  );
  return Array.from(new Set(ids.filter((id) => id.trim() !== "")));
}

export function hasProject(lang: Lang, id: string): boolean {
  return projectIds(lang).includes(id);
}

// Ids of the main projects that have a demo page in the given language.
export function demoProjectIds(lang: Lang): string[] {
  return withId(portfolioByLang[lang].projects)
    .filter((project) => !!project.demoLink)
    .map((project) => project.id);
}

// The project with the given id in the current language. The [lang] pages call
// notFound() for an id that is not in this language's data (same lists as here), so a
// component rendered after that guard can rely on the project being present.
export function useProject(id: string): Project {
  const { language } = useLanguage();
  const project = [...portfolioByLang[language].projects, ...otherByLang[language].projects].find(
    (candidate) => candidate.id === id,
  );
  if (!project) throw new Error(`Project "${id}" is not in the ${language} data`);
  return project;
}

export function usePortfolioData() {
  const { language } = useLanguage();
  return portfolioByLang[language];
}

export function useOtherProjects() {
  const { language } = useLanguage();
  return otherByLang[language];
}

export function useSkillsData() {
  const { language } = useLanguage();
  return skillsByLang[language];
}
