import { radiusScale } from "./data";
import type { Point, SimNode } from "./types";

// The "vacuum-pack" hull around a category group: purely visual, no physics impact.

export const HULL_ENABLED = true; // master switch
export const HULL_MIN_NODES = 1; // a group needs ≥ N nodes, otherwise no hull

// ——  perimeter sampling per node  ————————————————————————————————————————————
const HULL_CIRCLE_SAMPLES = 20; // sample points on the node perimeter (more = finer)
const HULL_ARC_SPAN = Math.PI; // which arc of the node is sampled: the outer 180°
//   Math.PI * 0.6 = outer ~108° (looser, less wrapping)
//   Math.PI * 1.3 = outer ~234° (tighter, more wrapping)
const HULL_OFFSET_FACTOR = 2 / 3; // extra distance = radius + radius * factor
//   0 = directly on the node edge, 1/3 = 33 % extra, 0.5 = 50 % extra

// ——  radial envelope  ————————————————————————————————————————————————————————
const HULL_RADIAL_BUCKETS = 90; // angle buckets (360° / BUCKETS = ° per bucket)
//   72 = 5° steps, 90 = 4° steps, 120 = 3° steps

// ——  hide interior points  ———————————————————————————————————————————————————
// Keeps the hull from picking up points that sit deep inside the group.
const HULL_INNER_FILTER = true;
const HULL_INNER_THRESHOLD = 0.5; // 0…1: distance to the centroid relative to the mean of
//   all hull points; points below threshold × mean are dropped. 1.0 = keep everything.

// ——  vacuum effect (sucked-in spots between distant nodes)  ——————————————————
const HULL_VACUUM_THRESHOLD = 5.2; // gap threshold (multiple of the bucket arc); smaller =
//   more frequent vacuum points
const HULL_VACUUM_STRENGTH = 0.15; // suction (fraction of the gap width): 0 = none, 0.3 = strong
const HULL_VACUUM_MAX_PX = 30; // maximum suction distance in px (cap)

// ——  curve smoothing  ————————————————————————————————————————————————————————
export const HULL_CURVE_TENSION = 0.1; // Catmull-Rom tension 0 … 1: 0 = round, 1 = tight

// ——  appearance  —————————————————————————————————————————————————————————————
export const HULL_STROKE_WIDTH = 2; // px
export const HULL_FILL_OPACITY = 0.07; // 0 … 1
export const HULL_STROKE_OPACITY = 0.35; // 0 … 1

export type HullNode = Pick<SimNode, "x" | "y" | "rating">;

// Each raw sample remembers which node it came from, so vacuum midpoints are never
// inserted between points of the SAME node.
interface RawPt extends Point {
  distC: number;
  bucket: number;
  nodeIdx: number;
}

interface EnvPt extends Point {
  nodeIdx: number;
}

export function groupCentroid(nodes: HullNode[]): Point {
  let cx = 0;
  let cy = 0;
  for (const n of nodes) {
    cx += n.x ?? 0;
    cy += n.y ?? 0;
  }
  return { x: cx / nodes.length, y: cy / nodes.length };
}

function distance(a: Point, b: Point): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

// ══════════════════════════════════════════════════════════════════════════════
//  CATMULL‑ROM → CUBIC BÉZIER  (closed loop → SVG path d-string)
// ══════════════════════════════════════════════════════════════════════════════

export function catmullRomClosedPath(points: [number, number][], tension: number): string {
  const n = points.length;
  if (n < 3) {
    // degenerate: just connect with lines
    return points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ") + " Z";
  }

  const inv6 = (1 - tension) / 6; // influence of neighbours on control points

  let d = `M${points[0][0]},${points[0][1]}`;

  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];

    const cp1x = p1[0] + (p2[0] - p0[0]) * inv6;
    const cp1y = p1[1] + (p2[1] - p0[1]) * inv6;
    const cp2x = p2[0] - (p3[0] - p1[0]) * inv6;
    const cp2y = p2[1] - (p3[1] - p1[1]) * inv6;

    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`;
  }

  return d + " Z";
}

// ══════════════════════════════════════════════════════════════════════════════
//  VACUUM‑PACK HULL COMPUTATION
// ══════════════════════════════════════════════════════════════════════════════

// 1. Sample the outer arc of every node perimeter (the arc facing away from the centroid).
function samplePerimeters(groupNodes: HullNode[], c: Point): RawPt[] {
  const raw: RawPt[] = [];
  const arcSpan = groupNodes.length === 1 ? Math.PI * 2 : HULL_ARC_SPAN;

  groupNodes.forEach((node, nodeIdx) => {
    const nx = node.x ?? 0;
    const ny = node.y ?? 0;
    const r = radiusScale(node.rating);
    const hullR = r + r * HULL_OFFSET_FACTOR;
    const toNodeAngle = Math.atan2(ny - c.y, nx - c.x);

    for (let s = 0; s < HULL_CIRCLE_SAMPLES; s++) {
      const t = s / (HULL_CIRCLE_SAMPLES - 1);
      const sampleAngle = toNodeAngle - arcSpan / 2 + t * arcSpan;
      const px = nx + Math.cos(sampleAngle) * hullR;
      const py = ny + Math.sin(sampleAngle) * hullR;

      const dx = px - c.x;
      const dy = py - c.y;
      const angle = Math.atan2(dy, dx);
      const bucket = Math.floor(((angle + Math.PI) / (2 * Math.PI)) * HULL_RADIAL_BUCKETS);

      raw.push({ x: px, y: py, distC: Math.sqrt(dx * dx + dy * dy), bucket, nodeIdx });
    }
  });

  return raw;
}

// 2. Radial envelope: keep the outermost point per angle bucket.
function radialEnvelope(raw: RawPt[]): (EnvPt | null)[] {
  const envelope: (EnvPt | null)[] = new Array(HULL_RADIAL_BUCKETS).fill(null);
  const distByBucket = new Float64Array(HULL_RADIAL_BUCKETS).fill(-1);

  for (const pt of raw) {
    const b = ((pt.bucket % HULL_RADIAL_BUCKETS) + HULL_RADIAL_BUCKETS) % HULL_RADIAL_BUCKETS;
    if (pt.distC > distByBucket[b]) {
      distByBucket[b] = pt.distC;
      envelope[b] = { x: pt.x, y: pt.y, nodeIdx: pt.nodeIdx };
    }
  }
  return envelope;
}

// 2b. Drop interior points (too close to the centroid).
function dropInteriorPoints(envelope: (EnvPt | null)[], c: Point): void {
  const present = envelope.filter((pt): pt is EnvPt => pt !== null);
  if (present.length === 0) return;

  const sumDist = present.reduce((sum, pt) => sum + distance(pt, c), 0);
  const minDist = (sumDist / present.length) * HULL_INNER_THRESHOLD;
  for (let b = 0; b < HULL_RADIAL_BUCKETS; b++) {
    const pt = envelope[b];
    if (pt && distance(pt, c) < minDist) envelope[b] = null;
  }
}

// 4. Hull polygon: point → vacuum midpoint (only between DIFFERENT nodes).
function bridgeGaps(points: EnvPt[], gapThreshold: number, c: Point): [number, number][] {
  const result: [number, number][] = [];

  for (let i = 0; i < points.length; i++) {
    const curr = points[i];
    const next = points[(i + 1) % points.length];

    result.push([curr.x, curr.y]);

    // Only bridge gaps between DIFFERENT nodes — never within the same node.
    if (curr.nodeIdx === next.nodeIdx) continue;

    const gap = distance(curr, next);
    if (gap <= gapThreshold) continue;

    const midX = (curr.x + next.x) / 2;
    const midY = (curr.y + next.y) / 2;
    const toCx = c.x - midX;
    const toCy = c.y - midY;
    const toDist = Math.sqrt(toCx * toCx + toCy * toCy) || 1;
    const pull = Math.min(gap * HULL_VACUUM_STRENGTH, HULL_VACUUM_MAX_PX);
    result.push([midX + (toCx / toDist) * pull, midY + (toCy / toDist) * pull]);
  }

  return result;
}

export function computeGroupHull(
  groupNodes: HullNode[],
  cx: number,
  cy: number,
): [number, number][] {
  const n = groupNodes.length;
  if (n < HULL_MIN_NODES) return [];
  const c = { x: cx, y: cy };

  const envelope = radialEnvelope(samplePerimeters(groupNodes, c));
  if (HULL_INNER_FILTER) dropInteriorPoints(envelope, c);

  // 3. Sorted point list (skip empty buckets).
  const points = envelope.filter((pt): pt is EnvPt => pt !== null);
  if (points.length < 3) return [];

  // Average distance of the nodes from the centroid gives the gap threshold.
  const avgDist =
    groupNodes.reduce((sum, nd) => sum + distance({ x: nd.x ?? 0, y: nd.y ?? 0 }, c), 0) / n;
  const bucketArc = (2 * Math.PI * avgDist) / HULL_RADIAL_BUCKETS;

  return bridgeGaps(points, bucketArc * HULL_VACUUM_THRESHOLD, c);
}

// The hull point closest to a target (where the rope of the pricetag docks). The first
// of several equally close points wins; the fallback is returned for an empty hull.
export function nearestHullPoint(
  hullPts: [number, number][],
  target: Point,
  fallback: Point,
): Point {
  let bestDist = Infinity;
  let best = fallback;
  for (const [hx, hy] of hullPts) {
    const dx = hx - target.x;
    const dy = hy - target.y;
    const d = dx * dx + dy * dy;
    if (d < bestDist) {
      bestDist = d;
      best = { x: hx, y: hy };
    }
  }
  return best;
}
