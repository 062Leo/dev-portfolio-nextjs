import { categoryColorAlpha } from "./data";
import type { Point, PricetagPosition, RopeTarget, SimNode } from "./types";

// One pricetag per category group, docked at the top or bottom edge and tied to its
// group's hull by a rope (WobblyRopes). Clicking a tag toggles its group.

// ══════════════════════════════════════════════════════════════════════════════
//  CONFIG
// ══════════════════════════════════════════════════════════════════════════════

export const PRICETAG_ENABLED = true;
const PRICETAG_SCALE = 0.55;

const S = PRICETAG_SCALE;
export const PT_H = 38 * S;
const PT_T = 19 * S;
const R = 4 * S;
const PAD = 3 * S;
const FONT_SZ = 22 * S;

export const PT_EDGE_MARGIN = 10; // px between the tag and the container edge
const TAG_GAP = 15; // min px between two tags on the same edge
const TAG_OPACITY_OFF = "0.45"; // opacity of the tag of a toggled-off group

// ══════════════════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════════════════

export interface PricetagData {
  gi: number;
  g: SVGGElement;
  line: SVGLineElement;
  tri: SVGElement;
  rect: SVGRectElement;
  dot: SVGCircleElement;
  text: SVGTextElement;
}

type GroupNode = Pick<SimNode, "x" | "y" | "groupIndex">;

interface TagPos {
  pd: PricetagData;
  isTop: boolean;
  isLeft: boolean;
  tagLeft: number; // extent of the tag left of its anchor
  tagRight: number; // extent of the tag right of its anchor
  rx: number;
  ry: number;
  cx: number; // group centroid x, keeps the left-to-right order of the tags
  tw: number;
  name: string;
}

const NS = "http://www.w3.org/2000/svg";

function tagWidth(name: string): number {
  return name.length * FONT_SZ * 0.6 + PAD * 2;
}

function resetRope(rt: RopeTarget | undefined): void {
  if (!rt) return;
  rt.start.x = 0;
  rt.start.y = 0;
  rt.end.x = 0;
  rt.end.y = 0;
}

// The tag points left (towards its group on the right) or right.
function setSide(pd: PricetagData, isLeft: boolean, tw: number): void {
  if (isLeft) {
    pd.tri.setAttribute("points", `0,0 ${-PT_T},${-PT_H / 2} ${-PT_T},${PT_H / 2}`);
    pd.rect.setAttribute("x", String(-PT_T - tw));
    pd.rect.setAttribute("width", String(tw));
    pd.dot.setAttribute("cx", String(-PT_T + 9 * S));
    pd.text.setAttribute("x", String(-PT_T - tw / 2));
  } else {
    pd.tri.setAttribute("points", `0,0 ${PT_T},${-PT_H / 2} ${PT_T},${PT_H / 2}`);
    pd.rect.setAttribute("x", String(PT_T));
    pd.rect.setAttribute("width", String(tw));
    pd.dot.setAttribute("cx", String(PT_T - 9 * S));
    pd.text.setAttribute("x", String(PT_T + tw / 2));
  }
  pd.text.setAttribute("text-anchor", "middle");
}

function applyGeometry(pd: PricetagData, at: Point, isLeft: boolean, name: string): void {
  setSide(pd, isLeft, tagWidth(name));
  pd.g.setAttribute("transform", `translate(${at.x}, ${at.y})`);
}

// ══════════════════════════════════════════════════════════════════════════════
//  CREATE (called once on build)
// ══════════════════════════════════════════════════════════════════════════════

export interface PricetagCreateOptions {
  categories: string[];
  groupIndices: number[];
  ropeTargets: Map<number, RopeTarget>;
  ropeColors: Map<number, string>;
  hiddenGroups: Set<number>;
  positions: Map<number, PricetagPosition>;
  onToggle: (categoryName: string) => void;
}

function createTagShape(gi: number, name: string): PricetagData {
  const fillColor = categoryColorAlpha(gi, 0.7);
  const textW = tagWidth(name);

  // Guide line from the tag to its group. updatePricetags hides it in every branch,
  // so it carries no colour.
  const line = document.createElementNS(NS, "line");
  line.setAttribute("stroke-width", "1.5");
  line.setAttribute("stroke-dasharray", "3,4");

  const g = document.createElementNS(NS, "g");
  g.setAttribute("pointer-events", "auto");
  g.style.cursor = "pointer";

  const tri = document.createElementNS(NS, "polygon");
  tri.setAttribute("points", `0,0 ${PT_T},${-PT_H / 2} ${PT_T},${PT_H / 2}`);
  tri.setAttribute("fill", fillColor);

  const rect = document.createElementNS(NS, "rect");
  rect.setAttribute("x", String(PT_T));
  rect.setAttribute("y", String(-PT_H / 2));
  rect.setAttribute("width", String(textW));
  rect.setAttribute("height", String(PT_H));
  rect.setAttribute("rx", String(R));
  rect.setAttribute("fill", fillColor);

  const dot = document.createElementNS(NS, "circle");
  dot.setAttribute("cx", String(PT_T - 9 * S));
  dot.setAttribute("cy", "0");
  dot.setAttribute("r", String(2 * S));
  dot.setAttribute("fill", "white");

  const text = document.createElementNS(NS, "text");
  text.textContent = name;
  text.setAttribute("y", String(FONT_SZ * 0.35));
  text.setAttribute("fill", "white");
  text.setAttribute("font-family", "monospace");
  text.setAttribute("font-size", String(FONT_SZ));
  text.setAttribute("font-weight", "300");

  g.appendChild(tri);
  g.appendChild(rect);
  g.appendChild(dot);
  g.appendChild(text);

  return { gi, g, line, tri, rect, dot, text };
}

function createPricetag(layer: SVGGElement, gi: number, opts: PricetagCreateOptions): PricetagData {
  const name = opts.categories[gi];
  const pd = createTagShape(gi, name);
  layer.appendChild(pd.line);

  const toggledOff = opts.hiddenGroups.has(gi);
  pd.g.style.opacity = toggledOff ? TAG_OPACITY_OFF : "1";
  pd.g.addEventListener("click", (e) => {
    e.stopPropagation();
    opts.onToggle(name);
  });

  // A toggled-off group keeps its tag where it was before the rebuild.
  const stored = toggledOff ? opts.positions.get(gi) : undefined;
  if (stored) {
    pd.g.setAttribute("transform", `translate(${stored.x}, ${stored.y})`);
    if (stored.isLeft) setSide(pd, true, tagWidth(name));
  }

  layer.appendChild(pd.g);

  if (!opts.ropeTargets.has(gi)) {
    opts.ropeTargets.set(gi, {
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
      outputX: 0,
      outputY: 0,
      outputAngle: 0,
    });
  }
  if (!opts.ropeColors.has(gi)) {
    opts.ropeColors.set(gi, categoryColorAlpha(gi, 0.55));
  }
  return pd;
}

export function createPricetags(layer: SVGGElement, opts: PricetagCreateOptions): PricetagData[] {
  return opts.groupIndices.map((gi) => createPricetag(layer, gi, opts));
}

// ══════════════════════════════════════════════════════════════════════════════
//  UPDATE (called every tick)
// ══════════════════════════════════════════════════════════════════════════════

export interface PricetagUpdateOptions {
  pricetagData: PricetagData[];
  nodes: GroupNode[];
  width: number;
  height: number;
  hullMinNodes: number;
  ropeTargets: Map<number, RopeTarget>;
  ropeStartMap: Map<number, Point>; // where each group's hull wants the rope to start
  hiddenGroups: Set<number>;
  positions: Map<number, PricetagPosition>;
}

function clampX(x: number, tag: { tagLeft: number; tagRight: number }, width: number): number {
  return Math.max(PT_EDGE_MARGIN + tag.tagLeft, Math.min(width - PT_EDGE_MARGIN - tag.tagRight, x));
}

// A toggled-off group: no rope, the tag stays dimmed where it was (or disappears when
// it has never been drawn).
function hiddenTagPos(pd: PricetagData, opts: PricetagUpdateOptions): TagPos | null {
  pd.line.style.display = "none";
  resetRope(opts.ropeTargets.get(pd.gi));

  const stored = opts.positions.get(pd.gi);
  if (!stored) {
    pd.g.style.display = "none";
    return null;
  }
  pd.g.style.display = "";
  pd.g.style.opacity = TAG_OPACITY_OFF;
  const name = pd.text.textContent || "";
  const tw = tagWidth(name);
  return {
    pd,
    isTop: stored.isTop,
    isLeft: stored.isLeft,
    tagLeft: stored.isLeft ? PT_T + tw : 0,
    tagRight: stored.isLeft ? 0 : PT_T + tw,
    rx: stored.x,
    ry: stored.y,
    cx: stored.x,
    tw,
    name,
  };
}

// A visible group: the tag docks at the nearer edge above or below the group centroid;
// the rope runs from the hull to the tag.
function visibleTagPos(pd: PricetagData, gn: GroupNode[], opts: PricetagUpdateOptions): TagPos {
  pd.line.style.display = "none";
  pd.g.style.display = "";
  pd.g.style.opacity = "1";

  let cx = 0;
  let cy = 0;
  for (const n of gn) {
    cx += n.x ?? 0;
    cy += n.y ?? 0;
  }
  cx /= gn.length;
  cy /= gn.length;

  let avgDist = 0;
  for (const n of gn) {
    avgDist += Math.sqrt(((n.x ?? 0) - cx) ** 2 + ((n.y ?? 0) - cy) ** 2);
  }
  avgDist /= gn.length;

  const isTop = cy < opts.height / 2;
  const dirY = isTop ? -1 : 1;
  const isLeft = cx < opts.width / 2;

  const hullStart = opts.ropeStartMap.get(pd.gi);
  const anchorY = isTop ? PT_EDGE_MARGIN + PT_H / 2 : opts.height - PT_EDGE_MARGIN - PT_H / 2;

  const rt = opts.ropeTargets.get(pd.gi);
  if (rt) {
    rt.start.x = hullStart ? hullStart.x : cx;
    rt.start.y = hullStart ? hullStart.y : cy + dirY * avgDist;
    rt.end.x = cx;
    rt.end.y = anchorY;
  }

  const name = pd.text.textContent || "";
  const tw = tagWidth(name);
  const tag = { tagLeft: isLeft ? PT_T + tw : 0, tagRight: isLeft ? 0 : PT_T + tw };
  return { pd, isTop, isLeft, ...tag, rx: clampX(cx, tag, opts.width), ry: anchorY, cx, tw, name };
}

// First pass: raw positions, and the rope targets fed from them.
function collectPositions(opts: PricetagUpdateOptions): TagPos[] {
  const all: TagPos[] = [];
  for (const pd of opts.pricetagData) {
    if (opts.hiddenGroups.has(pd.gi)) {
      const pos = hiddenTagPos(pd, opts);
      if (pos) all.push(pos);
      continue;
    }
    const gn = opts.nodes.filter((n) => n.groupIndex === pd.gi);
    if (gn.length < opts.hullMinNodes) {
      pd.line.style.display = "none";
      pd.g.style.display = "none";
      resetRope(opts.ropeTargets.get(pd.gi));
      continue;
    }
    all.push(visibleTagPos(pd, gn, opts));
  }
  return all;
}

// Push two tags apart when they overlap; false when they are already far enough apart
// (and so is every tag further right).
function separatePair(a: TagPos, b: TagPos, width: number): boolean {
  const gap = b.rx - b.tagLeft - (a.rx + a.tagRight);
  if (gap >= TAG_GAP) return false;

  const aTop = a.ry - PT_H / 2;
  const aBot = a.ry + PT_H / 2;
  const bTop = b.ry - PT_H / 2;
  const bBot = b.ry + PT_H / 2;
  if (aBot <= bTop || bBot <= aTop) return true;

  const overlapHalf = (TAG_GAP - gap) / 2;
  a.rx = Math.max(PT_EDGE_MARGIN + a.tagLeft, a.rx - overlapHalf);
  b.rx = Math.min(width - PT_EDGE_MARGIN - b.tagRight, b.rx + overlapHalf);
  return true;
}

// Second pass: keep the left-to-right order of the groups and spread the tags of one
// edge so they do not overlap.
function spreadSide(sideTags: TagPos[], width: number): void {
  sideTags.sort((a, b) => a.cx - b.cx);
  for (let iter = 0; iter < 8; iter++) {
    for (let i = 0; i < sideTags.length; i++) {
      for (let j = i + 1; j < sideTags.length; j++) {
        if (!separatePair(sideTags[i], sideTags[j], width)) break;
      }
    }
  }
}

// Third pass: final positions into the rope targets, the position store and the DOM.
function applyPositions(all: TagPos[], opts: PricetagUpdateOptions): void {
  for (const tp of all) {
    const { pd, isLeft, isTop, rx, ry, name } = tp;

    if (!opts.hiddenGroups.has(pd.gi)) {
      const rt = opts.ropeTargets.get(pd.gi);
      if (rt) {
        rt.end.x = rx;
        rt.end.y = ry;
        rt.outputX = clampX(rx, tp, opts.width);
        rt.outputY = ry;
      }
    }

    opts.positions.set(pd.gi, { x: rx, y: ry, isLeft, isTop });
    applyGeometry(pd, { x: rx, y: ry }, isLeft, name);
  }
}

export function updatePricetags(opts: PricetagUpdateOptions): void {
  if (!PRICETAG_ENABLED || opts.pricetagData.length === 0) return;

  const all = collectPositions(opts);
  for (const side of [true, false]) {
    spreadSide(
      all.filter((t) => t.isTop === side),
      opts.width,
    );
  }
  applyPositions(all, opts);
}
