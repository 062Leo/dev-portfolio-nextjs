import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { Project } from "@/data/types";
import { portfolioData as portfolioDataDe } from "@/data/portfolio-data";
import { portfolioData as portfolioDataEn } from "@/data/portfolio-data-en";
import { otherProjects as otherProjectsDe } from "@/data/other_projects";
import { otherProjects as otherProjectsEn } from "@/data/other_projects_en";

const PUBLIC_DIR = fileURLToPath(new URL("../../public", import.meta.url));

const files: Record<string, Project[]> = {
  "portfolio-data": portfolioDataDe.projects,
  "portfolio-data-en": portfolioDataEn.projects,
  other_projects: otherProjectsDe.projects,
  other_projects_en: otherProjectsEn.projects,
};

const languagePairs: [string, string][] = [
  ["portfolio-data", "portfolio-data-en"],
  ["other_projects", "other_projects_en"],
];

// An empty id marks a placeholder entry that the UI filters out.
function nonEmptyIds(projects: Project[]): string[] {
  return projects.map((project) => project.id).filter((id) => id.trim() !== "");
}

// Case-sensitive on every platform: Vercel serves from a case-sensitive file system, while
// existsSync on Windows would accept a path that differs only in letter case.
function existsInPublic(urlPath: string): boolean {
  let dir = PUBLIC_DIR;
  for (const segment of decodeURIComponent(urlPath).split("/").filter(Boolean)) {
    if (!existsSync(dir) || !readdirSync(dir).includes(segment)) return false;
    dir = join(dir, segment);
  }
  return true;
}

function mediaPaths(project: Project): string[] {
  return [
    project.image,
    ...(project.images ?? []).map((image) => image.url),
    ...(project.videos ?? []).map((video) => video.url),
    project.videoBig,
    project.demoImage,
    project.miscimage,
  ].filter((path): path is string => typeof path === "string" && path.startsWith("/"));
}

describe.each(Object.entries(files))("%s", (_name, projects) => {
  it("has at least one project", () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it("has unique non-empty ids", () => {
    const ids = nonEmptyIds(projects);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    expect(duplicates).toEqual([]);
  });

  it("references only media files that exist under public/", () => {
    const missing = projects.flatMap((project) =>
      mediaPaths(project)
        .filter((path) => !existsInPublic(path))
        .map((path) => `${project.id || "(empty id)"}: ${path}`),
    );
    expect(missing).toEqual([]);
  });
});

describe.each(languagePairs)("%s and %s", (de, en) => {
  it("contain the same non-empty ids", () => {
    const deIds = new Set(nonEmptyIds(files[de]));
    const enIds = new Set(nonEmptyIds(files[en]));
    expect([...deIds].filter((id) => !enIds.has(id))).toEqual([]);
    expect([...enIds].filter((id) => !deIds.has(id))).toEqual([]);
  });
});
