import { useLanguage } from "@/context/LanguageContext";
import { portfolioData as portfolioDataDe, type Project, type ProjectImage, type ProjectStat, type DemoControlsGroup } from "./portfolio-data";
import { otherProjects as otherProjectsDe } from "./other_projects";
import { portfolioData as portfolioDataEn } from "./portfolio-data-en";
import { otherProjects as otherProjectsEn } from "./other_projects_en";
import skillsDe from "./skills.json";
import skillsEn from "./skills_en.json";

export type { Project, ProjectImage, ProjectStat, DemoControlsGroup };

export function usePortfolioData() {
  const { language } = useLanguage();
  return language === "en" ? portfolioDataEn : portfolioDataDe;
}

export function useOtherProjects() {
  const { language } = useLanguage();
  return language === "en" ? otherProjectsEn : otherProjectsDe;
}

export function useSkillsData() {
  const { language } = useLanguage();
  return language === "de" ? skillsDe : skillsEn;
}
