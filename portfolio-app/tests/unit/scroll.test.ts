import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

// Scrolling belongs to the browser. No component may take the wheel away from the user
// (a wheel listener that calls preventDefault, or a non-passive wheel listener at all),
// and the page does not snap: the Skills section scrolls like every other section.

const APP_ROOT = join(__dirname, "..", "..");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return /\.(tsx?|css)$/.test(entry) ? [full] : [];
  });
}

const FILES = sourceFiles(join(APP_ROOT, "src")).map((file) => ({
  path: relative(APP_ROOT, file).replace(/\\/g, "/"),
  content: readFileSync(file, "utf8"),
}));

const WHEEL_LISTENER = /addEventListener\(\s*["'](wheel|mousewheel)["']|\bonWheel\s*=/;
const NON_PASSIVE = /passive\s*:\s*false/;

describe("wheel scrolling", () => {
  it("is never intercepted by a wheel listener that prevents the default", () => {
    const offenders = FILES.filter(
      ({ content }) => WHEEL_LISTENER.test(content) && /preventDefault\s*\(/.test(content),
    ).map(({ path }) => path);
    expect(offenders).toEqual([]);
  });

  it("has no non-passive wheel listener", () => {
    const offenders = FILES.filter(
      ({ content }) => WHEEL_LISTENER.test(content) && NON_PASSIVE.test(content),
    ).map(({ path }) => path);
    expect(offenders).toEqual([]);
  });

  it("does not use scroll snapping", () => {
    const offenders = FILES.filter(({ content }) =>
      /scroll-snap|snap-(x|y|start|center|end|mandatory|proximity)\b/.test(content),
    ).map(({ path }) => path);
    expect(offenders).toEqual([]);
  });
});
