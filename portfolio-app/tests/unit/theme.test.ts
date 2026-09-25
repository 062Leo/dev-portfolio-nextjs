import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

// The colour system lives in one place: the @theme block of globals.css. Components use
// the Tailwind utilities generated from it and must not carry colour literals of their own.

const APP_ROOT = join(__dirname, "..", "..");
const GLOBALS = readFileSync(join(APP_ROOT, "src", "app", "globals.css"), "utf8");

const REQUIRED_TOKENS = [
  "--color-bg",
  "--color-surface",
  "--color-surface-2",
  "--color-border",
  "--color-text",
  "--color-text-muted",
  "--color-accent",
  "--color-accent-2",
  "--color-success",
  "--color-rating-1",
  "--color-rating-2",
  "--color-rating-3",
  "--color-rating-4",
  "--color-rating-5",
  "--shadow-glow",
  "--shadow-card",
  "--text-shadow-glow",
];

// Colour literals that may stay in source files, each with the reason.
const ALLOWED_LITERALS: { file: string; line: RegExp; reason: string }[] = [
  {
    file: "src/components/SkillGraph.tsx",
    line: /^\s*\{ key: ".+", color: "hsla\(/,
    reason: "the 14-hue category palette of the skills graph is graph data, not theme",
  },
];

function tokenValue(name: string): string | undefined {
  const match = GLOBALS.match(new RegExp(`${name}:\\s*([^;]+);`));
  return match?.[1].replace(/\s+/g, " ").trim();
}

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.slice(1);
  return [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16)) as [number, number, number];
}

// WCAG 2.x relative luminance and contrast ratio.
function relativeLuminance([r, g, b]: [number, number, number]): number {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(hexToRgb(a));
  const lb = relativeLuminance(hexToRgb(b));
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return /\.tsx?$/.test(entry) ? [full] : [];
  });
}

describe("colour tokens in globals.css", () => {
  it("defines every token of the colour system", () => {
    for (const token of REQUIRED_TOKENS) {
      expect(tokenValue(token), token).toBeDefined();
    }
  });

  it("keeps the muted text opaque and readable on the background", () => {
    const bg = tokenValue("--color-bg");
    const muted = tokenValue("--color-text-muted");
    expect(bg).toMatch(/^#[0-9a-f]{6}$/);
    expect(muted).toMatch(/^#[0-9a-f]{6}$/);
    expect(contrastRatio(muted!, bg!)).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps the primary text readable on the background", () => {
    expect(contrastRatio(tokenValue("--color-text")!, tokenValue("--color-bg")!)).toBeGreaterThan(
      7,
    );
  });
});

describe("colour literals in source files", () => {
  it("appear only in the allowed places", () => {
    const literal = /#[0-9a-f]{3,8}\b|\brgba?\(|\bhsla?\(/;
    const offenders: string[] = [];
    for (const file of sourceFiles(join(APP_ROOT, "src"))) {
      const rel = relative(APP_ROOT, file).replace(/\\/g, "/");
      readFileSync(file, "utf8")
        .split("\n")
        .forEach((line, index) => {
          if (!literal.test(line)) return;
          const allowed = ALLOWED_LITERALS.some((a) => a.file === rel && a.line.test(line));
          if (!allowed) offenders.push(`${rel}:${index + 1}: ${line.trim()}`);
        });
    }
    expect(offenders).toEqual([]);
  });

  it("has a reason for every allowed literal and uses each entry", () => {
    for (const entry of ALLOWED_LITERALS) {
      expect(entry.reason.length).toBeGreaterThan(10);
      const content = readFileSync(join(APP_ROOT, entry.file), "utf8");
      expect(
        content.split("\n").some((line) => entry.line.test(line)),
        entry.file,
      ).toBe(true);
    }
  });
});
