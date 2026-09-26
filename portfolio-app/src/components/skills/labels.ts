import { tokenAlpha } from "@/lib/theme";
import { labelFontSize, radiusScale } from "./data";
import type { Box, Point, SimNode } from "./types";

// Label placement: every node gets one label and one connector line. Labels are placed
// in the first free direction around the node, high ratings first. Pure geometry, no DOM.

// --  positioning  ------------------------------------------------------------
const LABEL_GAP_NODE = 4; // px gap between node edge and label start
const LABEL_GAP_OTHER_LABEL = 2; // min px gap between two label bounding boxes
const LABEL_CONNECTOR_LENGTH = 8; // length of the connector from node edge to label (px)
const LABEL_TRY_DIRECTIONS = 8; // directions tried: 4 = N/S/W/E, 8 = + diagonals

// --  text  -------------------------------------------------------------------
export const LABEL_FONT_FAMILY = "monospace";
export const LABEL_COLOR_HOVER = "white"; // text colour while the node is hovered

// --  connector line label → node  --------------------------------------------
export const LABEL_LINE_COLOR = tokenAlpha("text", 74);
export const LABEL_LINE_WIDTH = 1; // px
export const LABEL_LINE_COLOR_HOVER = "white";
export const LABEL_LINE_WIDTH_HOVER = 1.5;

// --  direction priority (higher = tried first)  ------------------------------
//      0=below  1=above  2=right  3=left  4=below-right  5=above-right  6=below-left  7=above-left
const LABEL_DIR_PRIORITY: Record<number, number> = {
  0: 8, // below (preferred)
  1: 7, // above
  2: 6, // right
  3: 5, // left
  4: 4, // below-right
  5: 3, // above-right
  6: 2, // below-left
  7: 1, // above-left
};

type TextAnchor = "middle" | "start" | "end";
type Baseline = "hanging" | "text-bottom" | "middle";

interface Direction {
  angle: number;
  ta: TextAnchor;
  bl: Baseline;
  ox: number;
  oy: number;
}

const DIRECTIONS: Direction[] = [
  { angle: Math.PI / 2, ta: "middle", bl: "hanging", ox: 0, oy: 4 },
  { angle: -Math.PI / 2, ta: "middle", bl: "text-bottom", ox: 0, oy: -4 },
  { angle: 0, ta: "start", bl: "middle", ox: 4, oy: 0 },
  { angle: Math.PI, ta: "end", bl: "middle", ox: -4, oy: 0 },
  { angle: Math.PI / 4, ta: "start", bl: "hanging", ox: 4, oy: 4 },
  { angle: -Math.PI / 4, ta: "start", bl: "text-bottom", ox: 4, oy: -4 },
  { angle: (3 * Math.PI) / 4, ta: "end", bl: "hanging", ox: -4, oy: 4 },
  { angle: (-3 * Math.PI) / 4, ta: "end", bl: "text-bottom", ox: -4, oy: -4 },
];

export type LabelNode = Pick<SimNode, "name" | "rating" | "x" | "y">;

export interface LabelPlacement {
  ax: number; // anchor: the end of the connector line
  ay: number;
  dir: number;
  ta: TextAnchor;
  bl: Baseline;
  ox: number; // text offset from the anchor
  oy: number;
}

export function estimateTextSize(text: string, fontSize: number): { w: number; h: number } {
  return { w: text.length * fontSize * 0.6, h: fontSize * 1.2 };
}

// The bounding box of a label whose anchor lies at `anchor` and which is aligned by the
// text anchor and baseline of the direction.
export function textBBox(anchor: Point, dir: number, size: { w: number; h: number }): Box {
  const { ta, bl, ox, oy } = DIRECTIONS[dir];
  let x = anchor.x + ox;
  let y = anchor.y + oy;
  if (ta === "middle") x -= size.w / 2;
  else if (ta === "end") x -= size.w;
  if (bl === "middle") y -= size.h / 2;
  else if (bl === "text-bottom") y -= size.h;
  // "hanging" keeps y as-is
  return { x, y, w: size.w, h: size.h };
}

export function boxesOverlap(a: Box, b: Box): boolean {
  const g = LABEL_GAP_OTHER_LABEL;
  return a.x < b.x + b.w + g && a.x + a.w + g > b.x && a.y < b.y + b.h + g && a.y + a.h + g > b.y;
}

function rectOverlapsCircle(box: Box, circle: Point & { r: number }): boolean {
  const crp = circle.r + LABEL_GAP_NODE;
  const closestX = Math.max(box.x, Math.min(circle.x, box.x + box.w));
  const closestY = Math.max(box.y, Math.min(circle.y, box.y + box.h));
  const dx = circle.x - closestX;
  const dy = circle.y - closestY;
  return dx * dx + dy * dy < crp * crp;
}

// The anchor of a label in a direction: beyond the node edge plus the connector length.
function labelAnchor(node: LabelNode, dir: number): Point {
  const angle = DIRECTIONS[dir].angle;
  const reach = radiusScale(node.rating) + LABEL_CONNECTOR_LENGTH;
  return { x: (node.x ?? 0) + Math.cos(angle) * reach, y: (node.y ?? 0) + Math.sin(angle) * reach };
}

// Where the connector line leaves the node: on the circle edge in the label direction.
export function connectorStart(node: LabelNode, dir: number): Point {
  const angle = DIRECTIONS[dir].angle;
  const r = radiusScale(node.rating);
  return { x: (node.x ?? 0) + Math.cos(angle) * r, y: (node.y ?? 0) + Math.sin(angle) * r };
}

function directionsByPriority(): number[] {
  const numDirs = LABEL_TRY_DIRECTIONS >= 8 ? 8 : 4;
  return Array.from({ length: numDirs }, (_, i) => i).sort(
    (a, b) => (LABEL_DIR_PRIORITY[b] ?? 0) - (LABEL_DIR_PRIORITY[a] ?? 0),
  );
}

function overlapsAnyNode(box: Box, nodes: LabelNode[], self: number): boolean {
  return nodes.some(
    (other, j) =>
      j !== self &&
      rectOverlapsCircle(box, { x: other.x ?? 0, y: other.y ?? 0, r: radiusScale(other.rating) }),
  );
}

interface PlacementContext {
  nodes: LabelNode[];
  placed: Box[];
  order: number[]; // directions by priority
}

// The first direction whose label box overlaps neither a node circle nor a placed label,
// or -1 when every direction is taken.
function freeDirection(ctx: PlacementContext, ni: number, size: { w: number; h: number }): number {
  const node = ctx.nodes[ni];
  for (const d of ctx.order) {
    const box = textBBox(labelAnchor(node, d), d, size);
    if (overlapsAnyNode(box, ctx.nodes, ni)) continue;
    if (ctx.placed.some((pb) => boxesOverlap(box, pb))) continue;
    return d;
  }
  return -1;
}

// One placement per node (same index as `nodes`). Nodes with a high rating are placed
// first so the important labels get the best spots; when every direction overlaps, the
// preferred direction is used anyway.
export function placeLabels(nodes: LabelNode[]): LabelPlacement[] {
  const ctx: PlacementContext = { nodes, placed: [], order: directionsByPriority() };
  const nodeOrder = nodes.map((_, i) => i).sort((a, b) => nodes[b].rating - nodes[a].rating);
  const placements: LabelPlacement[] = new Array(nodes.length);

  for (const ni of nodeOrder) {
    const node = nodes[ni];
    const size = estimateTextSize(node.name, labelFontSize(node.rating));
    const found = freeDirection(ctx, ni, size);
    const dir = found < 0 ? ctx.order[0] : found;
    const anchor = labelAnchor(node, dir);
    const { ta, bl, ox, oy } = DIRECTIONS[dir];
    placements[ni] = { ax: anchor.x, ay: anchor.y, dir, ta, bl, ox, oy };
    ctx.placed.push(textBBox(anchor, dir, size));
  }

  return placements;
}
