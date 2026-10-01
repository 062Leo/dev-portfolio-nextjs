import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { IMAGE_SIZES } from "@/data/image-sizes";
import type { Project } from "@/data/types";
import { portfolioData as portfolioDataDe } from "@/data/portfolio-data";
import { portfolioData as portfolioDataEn } from "@/data/portfolio-data-en";
import { otherProjects as otherProjectsDe } from "@/data/other_projects";
import { otherProjects as otherProjectsEn } from "@/data/other_projects_en";

// Every image goes through next/image (issue #79): it reserves the space before the file
// has loaded and loads lazily unless told otherwise.

const APP_ROOT = join(__dirname, "..", "..");
const SRC = join(APP_ROOT, "src");
const PUBLIC_DIR = join(APP_ROOT, "public");

// Files that may use a raw <img>. Empty on purpose.
const ALLOWLIST: string[] = [];

function tsxFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return tsxFiles(path);
    return entry.name.endsWith(".tsx") ? [path] : [];
  });
}

// Width and height from the IHDR chunk, which directly follows the PNG signature.
function pngSize(urlPath: string) {
  const buffer = readFileSync(join(PUBLIC_DIR, urlPath));
  expect(buffer.subarray(1, 4).toString("latin1"), urlPath).toBe("PNG");
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

const projects: Project[] = [
  ...portfolioDataDe.projects,
  ...portfolioDataEn.projects,
  ...otherProjectsDe.projects,
  ...otherProjectsEn.projects,
];

// The images shown at their own aspect ratio: gallery (lightbox), demo and illustration.
const intrinsicImages = new Set(
  projects
    .flatMap((project) => [
      ...(project.images ?? []).map((image) => image.url),
      project.demoImage,
      project.miscimage,
    ])
    .filter((path): path is string => typeof path === "string" && path.startsWith("/")),
);

describe("images", () => {
  it("has no raw <img> element in the components", () => {
    const found = tsxFiles(SRC)
      .map((file) => relative(APP_ROOT, file).split("\\").join("/"))
      .filter((file) => !ALLOWLIST.includes(file))
      .filter((file) => /<img[\s>/]/.test(readFileSync(join(APP_ROOT, file), "utf8")));
    expect(found).toEqual([]);
  });

  it("knows the size of every image shown at its own aspect ratio", () => {
    expect(intrinsicImages.size).toBeGreaterThan(0);
    const missing = [...intrinsicImages].filter((path) => !(path in IMAGE_SIZES));
    expect(missing).toEqual([]);
  });

  it.each(Object.entries(IMAGE_SIZES))("has the real size of %s", (path, size) => {
    expect(intrinsicImages.has(path), `${path} is not used by the project data`).toBe(true);
    expect(size).toEqual(pngSize(path));
  });
});
