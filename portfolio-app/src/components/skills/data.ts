import { token } from "@/lib/theme";
import type { CategoryEntry, SkillsDataNested, SkillsFlat, TooltipContent } from "./types";

// ══════════════════════════════════════════════════════════════════════════════
//  DATA FLATTENING  (skills.json has 3‑level structure; we flatten to 2 levels)
// ══════════════════════════════════════════════════════════════════════════════

export function flattenSkillsData(data: SkillsDataNested): SkillsFlat {
  const result: SkillsFlat = {};
  for (const [category, nodes] of Object.entries(data)) {
    const flattened: Record<string, number> = {};
    for (const [nodeName, value] of Object.entries(nodes)) {
      if (typeof value === "number") {
        flattened[nodeName] = value;
      } else {
        const ratings = Object.values(value);
        if (ratings.length > 0) {
          flattened[nodeName] = Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length);
        }
      }
    }
    result[category] = flattened;
  }
  return result;
}

export function getSkillCategories(src: SkillsFlat): Map<string, Record<string, number>> {
  const map = new Map<string, Record<string, number>>();
  for (const [cat, skills] of Object.entries(src)) {
    map.set(cat, skills);
  }
  return map;
}

// The sub-entries shown in the tooltip of a node: the ratings of a skill group, or the
// single rating of a direct skill. Null when the data has no entry for the node.
export function tooltipContentFor(
  data: SkillsDataNested,
  category: string,
  name: string,
): TooltipContent | null {
  const catData = data[category];
  if (!catData) return null;
  const value = catData[name];
  if (typeof value === "object" && value !== null) {
    return { name, entries: Object.entries(value) as [string, number][], direct: false };
  }
  if (typeof value === "number") {
    return { name, entries: [[name, value]], direct: true };
  }
  return null;
}

// ══════════════════════════════════════════════════════════════════════════════
//  CATEGORY DEFINITIONS
// ══════════════════════════════════════════════════════════════════════════════

// One hue per category: a categorical palette that belongs to the graph data, not to the
// site theme in globals.css. The alpha at the end is rewritten per use (hull, glow, tag).
export const CATEGORIES: CategoryEntry[] = [
  { key: "Programmierung", color: "hsla(280, 80%, 55%, 0.25)" }, // Purple
  { key: "Web & UI", color: "hsla(210, 80%, 55%, 0.25)" }, // Blue
  { key: "Backend & .NET ", color: "hsla(190, 80%, 50%, 0.25)" }, // Cyan
  { key: "Daten & DB", color: "hsla(160, 80%, 45%, 0.25)" }, // Teal
  { key: "SWE & Qualität", color: "hsla(130, 70%, 45%, 0.25)" }, // Green
  { key: "Methodik", color: "hsla(80, 75%, 45%, 0.25)" }, // Lime
  { key: "Tools & VCS", color: "hsla(340, 80%, 55%, 0.25)" }, // Pink
  { key: "DevOps & Cloud", color: "hsla(20, 85%, 55%, 0.25)" }, // Orange
  { key: "KI / ML", color: "hsla(45, 85%, 50%, 0.25)" }, // Gold
  { key: "KI-Tools & IDE's", color: "hsla(0, 80%, 55%, 0.25)" }, // Red
  { key: "Game Dev", color: "hsla(310, 70%, 50%, 0.25)" }, // Magenta
  { key: "Cross-Platform", color: "hsla(175, 75%, 40%, 0.25)" }, // Deep teal
  { key: "Hardware & IoT", color: "hsla(250, 75%, 60%, 0.25)" }, // Indigo
  { key: "PM & Agile", color: "hsla(100, 60%, 40%, 0.25)" }, // Forest
];

export function categoryColor(groupIndex: number): string {
  return CATEGORIES[groupIndex % CATEGORIES.length].color;
}

/** The category colour with its alpha replaced, for hull, glow and pricetag. */
export function categoryColorAlpha(groupIndex: number, alpha: number): string {
  return categoryColor(groupIndex).replace(/[\d.]+\)$/, `${alpha})`);
}

// ══════════════════════════════════════════════════════════════════════════════
//  RATING SCALE — node size, label size and colour all scale with the rating 1…5
// ══════════════════════════════════════════════════════════════════════════════

const RATING_MIN = 1; // lowest possible rating
const RATING_MAX = 5; // highest possible rating

const RADIUS_MIN = 5; // smallest circle radius (px) for rating 1
const RADIUS_MAX = 15; // largest circle radius (px) for rating 5

const LABEL_FONT_SIZE_MIN = 9; // px for rating 1
const LABEL_FONT_SIZE_MAX = 14; // px for rating 5

// Index = rating. The SVG gets the CSS variable of the --color-rating-1 … 5 tokens, the
// JSX the Tailwind classes; both need the full names spelled out so Tailwind can find
// the classes.
const RATING_COLORS = ["", ...[1, 2, 3, 4, 5].map((r) => token(`rating-${r}`))];
export const RATING_FILL_CLASS = [
  "",
  "bg-rating-1 border-rating-1",
  "bg-rating-2 border-rating-2",
  "bg-rating-3 border-rating-3",
  "bg-rating-4 border-rating-4",
  "bg-rating-5 border-rating-5",
];
export const RATING_TEXT_CLASS = [
  "",
  "text-rating-1",
  "text-rating-2",
  "text-rating-3",
  "text-rating-4",
  "text-rating-5",
];

function ratingT(rating: number): number {
  return (rating - RATING_MIN) / (RATING_MAX - RATING_MIN);
}

export function ratingColor(rating: number): string {
  const idx = Math.round(rating);
  return RATING_COLORS[idx] || RATING_COLORS[1];
}

export function radiusScale(rating: number): number {
  return RADIUS_MIN + ratingT(rating) * (RADIUS_MAX - RADIUS_MIN);
}

export function labelFontSize(rating: number): number {
  return Math.round(
    LABEL_FONT_SIZE_MIN + ratingT(rating) * (LABEL_FONT_SIZE_MAX - LABEL_FONT_SIZE_MIN),
  );
}
