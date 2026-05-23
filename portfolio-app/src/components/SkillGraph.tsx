"use client";

import { useEffect, useRef, useCallback, useMemo, useState } from "react";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCollide,
  forceX,
  forceY,
} from "d3-force";
import type { SimulationNodeDatum, SimulationLinkDatum, Simulation } from "d3-force";
import skillsData from "@/data/skills.json";
import skillsDataEn from "@/data/skills_en.json";
import { useLanguage } from "@/context/LanguageContext";
import { WobblyRopes } from "./WobblyRopes";
import type { RopeTarget } from "./WobblyRopes";
import {
  PRICETAG_ENABLED,
  PT_H,
  type PricetagData,
  createPricetags,
  updatePricetags,
} from "./pricetags";

// ══════════════════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════════════════

type CatKey = string;

type SkillsDataNested = Record<string, Record<string, Record<string, number> | number>>;

interface SimNode extends SimulationNodeDatum {
  id: string;
  name: string;
  rating: number;
  category: string;
  groupIndex: number;
}

interface SimLink extends SimulationLinkDatum<SimNode> {
  source: string | SimNode;
  target: string | SimNode;
  chain?: boolean;
}

// ══════════════════════════════════════════════════════════════════════════════
//  DATA FLATTENING  (skills.json has 3‑level structure; we flatten to 2 levels)
// ══════════════════════════════════════════════════════════════════════════════

function flattenSkillsData(data: SkillsDataNested): Record<string, Record<string, number>> {
  const result: Record<string, Record<string, number>> = {};
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

const skillsDataFlat = flattenSkillsData(skillsData as SkillsDataNested);
const skillsDataEnFlat = flattenSkillsData(skillsDataEn as SkillsDataNested);

// ══════════════════════════════════════════════════════════════════════════════
//  CATEGORY DEFINITIONS
// ══════════════════════════════════════════════════════════════════════════════

const CATEGORIES: { key: CatKey; color: string }[] = [
  { key: "Programmierung",           color: "hsla(280, 80%, 55%, 0.25)" }, // Purple
  { key: "Web & UI",                 color: "hsla(210, 80%, 55%, 0.25)" }, // Blue
  { key: "Backend & .NET ",          color: "hsla(190, 80%, 50%, 0.25)" }, // Cyan
  { key: "Daten & DB",               color: "hsla(160, 80%, 45%, 0.25)" }, // Teal
  { key: "SWE & Qualität",           color: "hsla(130, 70%, 45%, 0.25)" }, // Green
  { key: "Methodik",                 color: "hsla(80, 75%, 45%, 0.25)" },  // Lime
  { key: "Tools & VCS",              color: "hsla(340, 80%, 55%, 0.25)" }, // Pink
  { key: "DevOps & Cloud",           color: "hsla(20, 85%, 55%, 0.25)" },  // Orange
  { key: "KI / ML",                  color: "hsla(45, 85%, 50%, 0.25)" },  // Gold
  { key: "KI-Tools & IDE's",         color: "hsla(0, 80%, 55%, 0.25)" },   // Red
  { key: "Game Dev",                 color: "hsla(310, 70%, 50%, 0.25)" }, // Magenta
  { key: "Cross-Platform",           color: "hsla(175, 75%, 40%, 0.25)" }, // Deep teal
  { key: "Hardware & IoT",           color: "hsla(250, 75%, 60%, 0.25)" }, // Indigo
  { key: "PM & Agile",               color: "hsla(100, 60%, 40%, 0.25)" }, // Forest
];

// ══════════════════════════════════════════════════════════════════════════════
//  RATING SCALE
// ══════════════════════════════════════════════════════════════════════════════

const RATING_MIN = 1;  // lowest possible rating
const RATING_MAX = 5;  // highest possible rating

// ══════════════════════════════════════════════════════════════════════════════
//  NODE SIZING & STYLING
// ══════════════════════════════════════════════════════════════════════════════

const RADIUS_MIN = 5;                             // smallest circle radius (px) for rating 1
const RADIUS_MAX = 15;                            // largest circle radius (px) for rating 5
const NODE_STROKE_COLOR = "rgba(255,255,255,0.2)"; // normal circle stroke
const NODE_STROKE_WIDTH = 1;                       // normal stroke width (px)
const NODE_HOVER_SCALE = 1.5;                      // radius multiplier on pointer enter
const NODE_HOVER_STROKE_COLOR = "rgba(255,255,255,0.8)"; // stroke color on hover
const NODE_HOVER_STROKE_WIDTH = 2.5;               // stroke width on hover (px)
const NODE_DRAG_HIT_PADDING = 4;                   // extra px around node for drag hit-test
const NODE_TRANSITION = "r 0.25s ease, stroke-width 0.25s ease, stroke 0.25s ease"; // CSS transition on hover

// ══════════════════════════════════════════════════════════════════════════════
//  LINK STYLES
// ══════════════════════════════════════════════════════════════════════════════

const LINK_STROKE_COLOR = "rgba(192, 184, 213, 0.57)"; // connection line color
const LINK_STROKE_WIDTH = 1;                        // connection line stroke width (px)

// ══════════════════════════════════════════════════════════════════════════════
//  GRAPH TOPOLOGY (intra-group connections)
// ══════════════════════════════════════════════════════════════════════════════

const GROUP_EXTRA_LINK_START_OFFSET = 1;  // skip N neighbours before additional links start
const GROUP_EXTRA_LINK_MAX_LOOKAHEAD = 4; // how many nodes ahead are eligible as extra targets
const GROUP_EXTRA_LINK_MAX = 6;           // absolute max extra connections per node (1‑4)
const MAX_DEGREE_HIGH = 5;                // max total degree for the high-count node
const MAX_DEGREE_NORMAL = 5;              // max total degree for all other nodes
const CHAIN_MIN_ANGLE_DEG = 27;           // minimum angle (degrees) between consecutive chain links
const CHAIN_ANGLE_FORCE = 30;             // strength of the angle-enforcing force

// ══════════════════════════════════════════════════════════════════════════════
//  FORCE SIMULATION — dynamic scaling based on visible node count
// ══════════════════════════════════════════════════════════════════════════════

const LINK_DISTANCE = 50;           // target length of link edges

// —— anchor points for force interpolation (nodeCount → force values) ——
const MAX_NODES = 60;
const MIN_NODES = 6;

// values at max nodes (all ratings — known perfect)
const CHARGE_AT_MAX   = -105;
const CENTER_Y_AT_MAX = 0.06;

// values at 6 nodes (rating 1 only — ADJUST THESE UNTIL LAYOUT LOOKS GOOD)
const CHARGE_AT_MIN   = -250;
const CENTER_Y_AT_MIN = 0.045;

const ALPHA_DECAY = 0.01;          // cooling rate per tick (higher = faster settle)
const ALPHA_MIN = 0.000000001;          // simulation stops when alpha drops below this
const COLLIDE_PADDING = 10;        // extra px between node edges for forceCollide
const REHEAT_ALPHA = 0.2;         // alpha / alphaTarget when re-energizing (drag, resize, etc.)

// ══════════════════════════════════════════════════════════════════════════════
//  RATING COLORS — one constant per rating, set manually as rgba
// ══════════════════════════════════════════════════════════════════════════════

const RATING_1_COLOR = "rgba(255, 0, 0, 0.51)";    // red
const RATING_2_COLOR = "rgba(255, 102, 0, 0.54)";    // orange
const RATING_3_COLOR = "rgba(242, 255, 0, 0.61)";    // yellow
const RATING_4_COLOR = "rgba(77, 199, 28, 0.79)";    // yellow-green
const RATING_5_COLOR = "rgb(33, 211, 24)";      // bright green

const RATING_COLORS = [
  "",
  RATING_1_COLOR,
  RATING_2_COLOR,
  RATING_3_COLOR,
  RATING_4_COLOR,
  RATING_5_COLOR,
];

// ══════════════════════════════════════════════════════════════════════════════
//  BOUNDARY (keeps nodes inside container)
// ══════════════════════════════════════════════════════════════════════════════

const BOUNDARY_MARGIN = 20;       // px margin from container edges
const BOUNDARY_PUSH_FACTOR = 0.3; // push strength when a node crosses the boundary

// ══════════════════════════════════════════════════════════════════════════════
//  MOUSE REPULSION  (left‑click + drag on empty canvas pushes nodes away)
// ══════════════════════════════════════════════════════════════════════════════

const MOUSE_FORCE_RADIUS = 160;               // px range of the repulsion field
const MOUSE_FORCE_STRENGTH = 20;              // max push strength at the cursor centre
const MOUSE_RIPPLE_COLOR = "rgba(167, 139, 250, 0.69)"; // glow colour for the ripple rings

// ══════════════════════════════════════════════════════════════════════════════
//  GLOW FILTER (per category)
// ══════════════════════════════════════════════════════════════════════════════

const GLOW_BLUR_STDDEV = 3;    // gaussian blur standard deviation
const GLOW_FLOOD_ALPHA = 0.8;  // alpha of the flood colour (replaces category alpha)
const GLOW_FLOOD_OPACITY = 0.5; // flood-opacity filter attribute

// ══════════════════════════════════════════════════════════════════════════════
//  LABEL STYLES  —  Jeder Parameter hier einstellbar
// ══════════════════════════════════════════════════════════════════════════════

// ——  Positionierung ————————————————————————————————————————————————————————————
const LABEL_GAP_NODE = 4;             // px abstand zwischen knotenrand und label-start
const LABEL_GAP_OTHER_LABEL = 2;      // min px abstand zwischen zwei label-bounding-boxen
const LABEL_CONNECTOR_LENGTH = 8;     // länge der verbindungslinie vom knotenrand zum label (px)
const LABEL_TRY_DIRECTIONS = 8;       // wie viele richtungen probiert werden: 4 = N/S/W/O, 8 = +diagonalen

// ——  Text‑Grösse (skaliert linear mit Rating 1…5) ———————————————————————————
const LABEL_FONT_SIZE_MIN = 9;        // px für Rating 1
const LABEL_FONT_SIZE_MAX = 14;       // px für Rating 5
const LABEL_FONT_FAMILY = "monospace";

// ——  Farben ———————————————————————————————————————————————————————————————————
const LABEL_COLOR_HOVER = "rgba(255,255,255,1)";      // text-farbe wenn knoten gehovert

// ——  Verbindungslinie Label → Knoten —————————————————————————————————————————
const LABEL_LINE_COLOR = "rgba(192, 184, 213, 0.74)";    // farbe der mini-linie
const LABEL_LINE_WIDTH = 1;                         // strichstärke (px)
const LABEL_LINE_COLOR_HOVER = "rgb(255, 255, 255)"; // linien-farbe bei hover
const LABEL_LINE_WIDTH_HOVER = 1.5;                   // strichstärke bei hover

// ——  Richtungs‑Priorität (höher = wird zuerst probiert) ——————————————————————
//      0=unten  1=oben  2=rechts  3=links  4=u.rechts  5=o.rechts  6=u.links  7=o.links
const LABEL_DIR_PRIORITY: Record<number, number> = {
  0: 8,   // unten          (bevorzugt)
  1: 7,   // oben
  2: 6,   // rechts
  3: 5,   // links
  4: 4,   // unten-rechts
  5: 3,   // oben-rechts
  6: 2,   // unten-links
  7: 1,   // oben-links
};

// ══════════════════════════════════════════════════════════════════════════════
//  CONTAINER STYLES
// ══════════════════════════════════════════════════════════════════════════════

const CONTAINER_HEIGHT = "clamp(400px, 90vh, 540px)";
const CONTAINER_BORDER_COLOR = "rgba(167,139,250,0.25)";
const CONTAINER_BG_COLOR = "rgb(11, 13, 23)";

const HULL_ENABLED = true;              // Master‑Schalter  true | false
const HULL_MIN_NODES = 1;               // Gruppe braucht ≥ N Knoten, sonst keine Hülle

// ——  Umfang‑Sampling pro Knoten  ————————————————————————————————————————————
const HULL_CIRCLE_SAMPLES = 20;         // Abtastpunkte auf dem Knotenumfang (mehr = feiner)
const HULL_ARC_SPAN = Math.PI;          // Welcher Bogen des Knotens wird abgetastet?
                                        //   Math.PI       = äussere 180°  (Standard)
                                        //   Math.PI * 0.6 = äussere ~108° (lockerer, weniger Umschlingung)
                                        //   Math.PI * 1.3 = äussere ~234° (enger, mehr Umschlingung)
const HULL_OFFSET_FACTOR = 2 / 3;       // Zusatzabstand = radius + radius * Faktor
                                        //   0     = direkt auf Knotenrand
                                        //   1/3   = 33 % extra (empfohlen)
                                        //   0.5   = 50 % extra

// ——  Radiale Hüllkurve (Envelope)  ——————————————————————————————————————————
const HULL_RADIAL_BUCKETS = 90;         // Winkel‑Eimer (360° / BUCKETS = ° pro Eimer)
                                        //   72 = 5°‑Schritte
                                        //   90 = 4°‑Schritte  (empfohlen)
                                        //  120 = 3°‑Schritte  (feiner)

// ——  Innere Knoten ausblenden  ———————————————————————————————————————————————
//      Verhindert, dass die Hülle zu weit innen liegende Punkte mitnimmt
//      (z.B. Knoten die tief im Gruppen-Inneren sitzen).
const HULL_INNER_FILTER = true;         // true  = innere Punkte werden entfernt
const HULL_INNER_THRESHOLD = 0.50;      // 0…1   Abstand zum Zentroid relativ zum
                                        //        Durchschnitt aller Hüllen-Punkte.
                                        //   Punkte mit Abstand < Schwellwert × Ø
                                        //   werden ausgeblendet.
                                        //   0.70  = empfohlen  (alles unter 70 % fliegt raus)
                                        //   1.0   = alles bleibt (kein Filter)
                                        //   0.0   = alles weg 😄

// ——  Vakuum‑Effekt (eingesaugte Stellen zwischen entfernten Knoten)  —————————
const HULL_VACUUM_THRESHOLD = 5.2;      // Lücken‑Schwelle  (Vielfaches des Eimer‑Bogens)
                                        //   je kleiner → mehr / häufigere Vakuum‑Punkte
const HULL_VACUUM_STRENGTH = 0.15;      // Einsaug‑Stärke  (Bruchteil der Lückenweite)
                                        //   0     = kein Vakuum (hull überspannt Lücken gerade)
                                        //   0.15  = dezent
                                        //   0.3   = stark
const HULL_VACUUM_MAX_PX = 30;          // Maximaler Einsaug‑Abstand in px (Deckel)

// ——  Kurven‑Glättung  ————————————————————————————————————————————————————————
const HULL_CURVE_TENSION = 0.1;        // Catmull‑Rom Spannung  0 … 1
                                        //   0     = maximal weich / rund
                                        //   0.35  = weich mit leichter Spannung
                                        //   1     = straff / eckiger

// ——  Darstellung  ————————————————————————————————————————————————————————————
const HULL_STROKE_WIDTH = 2;          // px
const HULL_FILL_OPACITY = 0.07;          // 0 … 1
const HULL_STROKE_OPACITY = 0.35;       // 0 … 1

// ══════════════════════════════════════════════════════════════════════════════
//  HELPER FUNCTIONS
// ══════════════════════════════════════════════════════════════════════════════

export function ratingColor(rating: number): string {
  const idx = Math.round(rating);
  return RATING_COLORS[idx] || RATING_COLORS[1];
}

function getSkillCategories(src: Record<string, Record<string, number>>): Map<string, Record<string, number>> {
  const map = new Map<string, Record<string, number>>();
  for (const [cat, skills] of Object.entries(src)) {
    map.set(cat, skills);
  }
  return map;
}

function radiusScale(rating: number): number {
  const t = (rating - RATING_MIN) / (RATING_MAX - RATING_MIN);
  return RADIUS_MIN + t * (RADIUS_MAX - RADIUS_MIN);
}

function labelFontSize(rating: number): number {
  const t = (rating - RATING_MIN) / (RATING_MAX - RATING_MIN);
  return Math.round(LABEL_FONT_SIZE_MIN + t * (LABEL_FONT_SIZE_MAX - LABEL_FONT_SIZE_MIN));
}

// ══════════════════════════════════════════════════════════════════════════════
//  CATMULL‑ROM → CUBIC BÉZIER  (closed loop → SVG path d-string)
// ══════════════════════════════════════════════════════════════════════════════

function catmullRomClosedPath(points: [number, number][], tension: number): string {
  const n = points.length;
  if (n < 3) {
    // degenerate: just connect with lines
    return points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ") + " Z";
  }

  const t = tension;
  const inv6 = (1 - t) / 6; // influence of neighbours on control points

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
//  VACUUM‑PACK HULL COMPUTATION  (purely visual — no physics impact)
// ══════════════════════════════════════════════════════════════════════════════

function computeGroupHull(
  groupNodes: SimNode[],
  cx: number,
  cy: number,
): [number, number][] {
  const n = groupNodes.length;
  if (n < HULL_MIN_NODES) return [];

  // Each raw sample remembers which node it came from, so we can later
  // avoid inserting vacuum midpoints between points of the SAME node.
  interface RawPt { x: number; y: number; distC: number; bucket: number; nodeIdx: number }
  const raw: RawPt[] = [];

  for (let ni = 0; ni < groupNodes.length; ni++) {
    const node = groupNodes[ni];
    const nx = node.x ?? 0;
    const ny = node.y ?? 0;
    const r = radiusScale(node.rating);
    const hullR = r + r * HULL_OFFSET_FACTOR;

    const toNodeAngle = Math.atan2(ny - cy, nx - cx);

    for (let s = 0; s < HULL_CIRCLE_SAMPLES; s++) {
      const t = s / (HULL_CIRCLE_SAMPLES - 1);
      const arcSpan = groupNodes.length === 1 ? Math.PI * 2 : HULL_ARC_SPAN;
      const sampleAngle = toNodeAngle - arcSpan / 2 + t * arcSpan;
      const px = nx + Math.cos(sampleAngle) * hullR;
      const py = ny + Math.sin(sampleAngle) * hullR;

      const dx = px - cx;
      const dy = py - cy;
      const distC = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      const bucket = Math.floor(((angle + Math.PI) / (2 * Math.PI)) * HULL_RADIAL_BUCKETS);

      raw.push({ x: px, y: py, distC, bucket, nodeIdx: ni });
    }
  }

  // ── 2.  radial envelope — keep outermost point per bucket, track node ─
  interface EnvPt { x: number; y: number; nodeIdx: number }
  const envelope: (EnvPt | null)[] = new Array(HULL_RADIAL_BUCKETS).fill(null);

  for (const pt of raw) {
    const b = ((pt.bucket % HULL_RADIAL_BUCKETS) + HULL_RADIAL_BUCKETS) % HULL_RADIAL_BUCKETS;
    if (!envelope[b] || pt.distC > (envelope[b]!.x - cx) ** 2 + (envelope[b]!.y - cy) ** 2) {
      // need distC for comparison — store it implicitly via the raw pt or recalc
    }
    // Simpler: compare using the raw pt's distC directly
  }

  const distByBucket = new Float64Array(HULL_RADIAL_BUCKETS).fill(-1);

  for (const pt of raw) {
    const b = ((pt.bucket % HULL_RADIAL_BUCKETS) + HULL_RADIAL_BUCKETS) % HULL_RADIAL_BUCKETS;
    if (pt.distC > distByBucket[b]) {
      distByBucket[b] = pt.distC;
      envelope[b] = { x: pt.x, y: pt.y, nodeIdx: pt.nodeIdx };
    }
  }

  // ── 2b.  filter out interior points (too close to centroid) ──────────
  if (HULL_INNER_FILTER) {
    let sumDist = 0;
    let envCount = 0;
    for (const pt of envelope) {
      if (pt) {
        sumDist += Math.sqrt((pt.x - cx) ** 2 + (pt.y - cy) ** 2);
        envCount++;
      }
    }
    if (envCount > 0) {
      const minDist = (sumDist / envCount) * HULL_INNER_THRESHOLD;
      for (let b = 0; b < HULL_RADIAL_BUCKETS; b++) {
        const pt = envelope[b];
        if (pt) {
          const d = Math.sqrt((pt.x - cx) ** 2 + (pt.y - cy) ** 2);
          if (d < minDist) envelope[b] = null;
        }
      }
    }
  }

  // ── 3.  build sorted point list (skip empty buckets) ─────────────────
  const points: { x: number; y: number; nodeIdx: number }[] = [];
  for (let b = 0; b < HULL_RADIAL_BUCKETS; b++) {
    const pt = envelope[b];
    if (pt) points.push(pt);
  }

  if (points.length < 3) return [];

  // average distance of nodes from centroid (for gap threshold)
  let avgDist = 0;
  for (const nd of groupNodes) {
    avgDist += Math.sqrt(((nd.x ?? 0) - cx) ** 2 + ((nd.y ?? 0) - cy) ** 2);
  }
  avgDist /= n;
  const bucketArc = (2 * Math.PI * avgDist) / HULL_RADIAL_BUCKETS;

  // ── 4.  build hull: point → vacuum midpoint (only between DIFFERENT nodes) ─
  const result: [number, number][] = [];

  for (let i = 0; i < points.length; i++) {
    const curr = points[i];
    const next = points[(i + 1) % points.length];

    result.push([curr.x, curr.y]);

    // Only bridge gaps between DIFFERENT nodes — never within the same node.
    if (curr.nodeIdx === next.nodeIdx) continue;

    const gx = next.x - curr.x;
    const gy = next.y - curr.y;
    const gap = Math.sqrt(gx * gx + gy * gy);

    if (gap > bucketArc * HULL_VACUUM_THRESHOLD) {
      const midX = (curr.x + next.x) / 2;
      const midY = (curr.y + next.y) / 2;
      const toCx = cx - midX;
      const toCy = cy - midY;
      const toDist = Math.sqrt(toCx * toCx + toCy * toCy) || 1;
      const pull = Math.min(gap * HULL_VACUUM_STRENGTH, HULL_VACUUM_MAX_PX);
      result.push([midX + (toCx / toDist) * pull, midY + (toCy / toDist) * pull]);
    }
  }

  return result;
}

// ══════════════════════════════════════════════════════════════════════════════
//  CHAIN ANGLE FORCE  (prevents collinear chain links)
// ══════════════════════════════════════════════════════════════════════════════

function createChainAngleForce(links: SimLink[], minAngleDeg: number, strength: number) {
  let nodes: SimNode[];
  const minCos = Math.cos(minAngleDeg * Math.PI / 180);

  function force(alpha: number) {
    for (const node of nodes) {
      const chainNeighbors: SimNode[] = [];
      for (const link of links) {
        if (!link.chain) continue;
        const s = link.source as SimNode;
        const t = link.target as SimNode;
        if (s === node) chainNeighbors.push(t);
        else if (t === node) chainNeighbors.push(s);
      }
      if (chainNeighbors.length !== 2) continue;

      const [a, c] = chainNeighbors;
      const bx = node.x ?? 0, by = node.y ?? 0;
      const ax = a.x ?? 0, ay = a.y ?? 0;
      const cx = c.x ?? 0, cy = c.y ?? 0;

      const ux = ax - bx, uy = ay - by;
      const vx = cx - bx, vy = cy - by;
      const uLen = Math.sqrt(ux * ux + uy * uy);
      const vLen = Math.sqrt(vx * vx + vy * vy);
      if (uLen < 0.5 || vLen < 0.5) continue;

      const cosAngle = (ux * vx + uy * vy) / (uLen * vLen);
      if (Math.abs(cosAngle) <= minCos) continue;

      const acx = cx - ax, acy = cy - ay;
      const acLen = Math.sqrt(acx * acx + acy * acy);
      if (acLen < 0.5) continue;

      const perpX = -acy / acLen;
      const perpY = acx / acLen;
      const cross = acx * (by - ay) - acy * (bx - ax);
      const sign = cross > 0 ? 1 : -1;

      const severity = Math.abs(cosAngle) - minCos;
      const f = severity * alpha * strength;

      node.vx = (node.vx ?? 0) + perpX * sign * f;
      node.vy = (node.vy ?? 0) + perpY * sign * f;
    }
  }

  force.initialize = function (n: SimNode[]) {
    nodes = n;
  };

  return force;
}

// ══════════════════════════════════════════════════════════════════════════════
//  COMPONENT
// ══════════════════════════════════════════════════════════════════════════════

export function SkillGraph() {
  const { language } = useLanguage();
  const currentData: Record<string, Record<string, number>> =
    language === "en" ? skillsDataEnFlat : skillsDataFlat;

  // raw nested data for tooltip lookup
  const rawNestedData = useMemo<SkillsDataNested>(
    () => (language === "en" ? skillsDataEn : skillsData) as SkillsDataNested,
    [language]
  );

  // ── tooltip state ──────────────────────────────────────────────────────
  interface TooltipContent {
    name: string;
    entries: [string, number][];
    direct: boolean;
  }
  const [tooltipContent, setTooltipContent] = useState<TooltipContent | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipVisibleRef = useRef(false);
  const activeNodeRef = useRef<SimNode | null>(null);
  const tooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearTooltipTimer() {
    if (tooltipTimeoutRef.current !== null) {
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const simRef = useRef<Simulation<SimNode, SimLink> | null>(null);
  const ropeTargetsRef = useRef<Map<number, RopeTarget>>(new Map());
  const ropeColorMapRef = useRef<Map<number, string>>(new Map());

  // filter: null = all nodes, Set<number> = only these ratings
  const filterRatingsRef = useRef<Set<number> | null>(null);

  // filter state: index 1..5 → true = selected
  const [filterToggles, setFilterToggles] = useState<boolean[]>([false, true, true, true, true, true]);
  const [filterActive, setFilterActive] = useState(false);

  // pricetag toggle: hidden group indices
  const hiddenGroupsRef = useRef<Set<number>>(new Set());
  const nodePositionsRef = useRef<Map<number, { x: number; y: number }[]>>(new Map());
  const pricetagPositionsRef = useRef<Map<number, { x: number; y: number; isLeft: boolean; isTop: boolean }>>(new Map());

  const buildSimulation = useCallback(() => {
    const container = containerRef.current;
    const svgEl = svgRef.current;
    if (!container || !svgEl) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    svgEl.innerHTML = "";
    svgEl.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svgEl.style.userSelect = "none";

    // ── clear tooltip on rebuild ────────────────────────────────────
    tooltipVisibleRef.current = false;
    activeNodeRef.current = null;
    setTooltipContent(null);

    // ── clear wobbly rope state on rebuild ───────────────────────────
    ropeTargetsRef.current.clear();
    ropeColorMapRef.current.clear();

    const merged = getSkillCategories(currentData);
    const categories = Array.from(merged.keys());

    const nodes: SimNode[] = [];
    const links: SimLink[] = [];

    categories.forEach((category, ci) => {
      const skills = merged.get(category)!;
      const entries = Object.entries(skills).sort(() => Math.random() - 0.5);

      const groupNodes: SimNode[] = [];
      entries.forEach(([name, rating]) => {
        const allowedRating = filterRatingsRef.current;
        if (allowedRating && !allowedRating.has(rating)) return;
        const node: SimNode = {
          id: `${category}:${name}`,
          name,
          rating,
          category,
          groupIndex: ci,
          x: width / 2 + (Math.random() - 0.5) * 200,
          y: height / 2 + (Math.random() - 0.5) * 200,
        };
        nodes.push(node);
        groupNodes.push(node);
      });

      // degree tracking (both chain + extra) per node
      const degree = new Array<number>(groupNodes.length).fill(0);

      // chain connections
      for (let i = 0; i < groupNodes.length - 1; i++) {
        links.push({ source: groupNodes[i].id, target: groupNodes[i + 1].id, chain: true });
        degree[i]++;
        degree[i + 1]++;
      }

      // extra connections — exactly 1 middle node gets 3‑4 total (guaranteed)
      // pick among middle nodes whose bidirectional pool reaches an endpoint
      const eligible: number[] = [];
      for (let i = 0; i < groupNodes.length; i++) {
        if (degree[i] !== 2) continue; // must be middle node (chain degree 2)
        let reachable = false;
        for (let j = i + GROUP_EXTRA_LINK_START_OFFSET; j < Math.min(i + GROUP_EXTRA_LINK_START_OFFSET + GROUP_EXTRA_LINK_MAX_LOOKAHEAD, groupNodes.length); j++) {
          if (degree[j] < MAX_DEGREE_NORMAL) { reachable = true; break; }
        }
        if (!reachable) {
          for (let j = i - GROUP_EXTRA_LINK_START_OFFSET; j >= Math.max(i - GROUP_EXTRA_LINK_START_OFFSET - GROUP_EXTRA_LINK_MAX_LOOKAHEAD + 1, 0); j--) {
            if (degree[j] < MAX_DEGREE_NORMAL) { reachable = true; break; }
          }
        }
        if (reachable) eligible.push(i);
      }

      const highIdx = eligible.length > 0
        ? eligible[Math.floor(Math.random() * eligible.length)]
        : -1;

      if (highIdx >= 0) {
        const i = highIdx;
        // bidirectional pool
        const pool: number[] = [];
        for (let j = i + GROUP_EXTRA_LINK_START_OFFSET; j < Math.min(i + GROUP_EXTRA_LINK_START_OFFSET + GROUP_EXTRA_LINK_MAX_LOOKAHEAD, groupNodes.length); j++) {
          pool.push(j);
        }
        for (let j = i - GROUP_EXTRA_LINK_START_OFFSET; j >= Math.max(i - GROUP_EXTRA_LINK_START_OFFSET - GROUP_EXTRA_LINK_MAX_LOOKAHEAD + 1, 0); j--) {
          pool.push(j);
        }
        // shuffle
        for (let k = pool.length - 1; k > 0; k--) {
          const r = Math.floor(Math.random() * (k + 1));
          [pool[k], pool[r]] = [pool[r], pool[k]];
        }
        // add extra links one by one, respecting degree caps
        let extraAdded = 0;
        for (const target of pool) {
          if (degree[i] >= MAX_DEGREE_HIGH || extraAdded >= GROUP_EXTRA_LINK_MAX) break;
          if (degree[target] >= MAX_DEGREE_NORMAL) continue;
          links.push({ source: groupNodes[i].id, target: groupNodes[target].id });
          degree[i]++;
          degree[target]++;
          extraAdded++;
        }
      }
    });

    // ── dynamic force scaling — linear lerp between min & max node count ──
    const nodeCount = nodes.length;
    const t = Math.max(0, Math.min(1, (nodeCount - MIN_NODES) / (MAX_NODES - MIN_NODES)));
    const dynCharge = CHARGE_AT_MIN + (CHARGE_AT_MAX - CHARGE_AT_MIN) * t;
    const dynCenterY = CENTER_Y_AT_MIN + (CENTER_Y_AT_MAX - CENTER_Y_AT_MIN) * t;
    const dynCenterX = dynCenterY / 2.5;

    const simulation = forceSimulation<SimNode>(nodes)
      .force(
        "link",
        forceLink<SimNode, SimLink>(links)
          .id((d) => d.id)
          .distance(LINK_DISTANCE)
      )
      .force("charge", forceManyBody().strength(dynCharge))
      .force("collide", forceCollide<SimNode>().radius(d => radiusScale(d.rating) + COLLIDE_PADDING))
      .force("x", forceX<SimNode>(width / 2).strength(dynCenterX))
      .force("y", forceY<SimNode>(height / 2).strength(dynCenterY))
      .force("chainAngle", createChainAngleForce(links, CHAIN_MIN_ANGLE_DEG, CHAIN_ANGLE_FORCE))
      .alphaDecay(ALPHA_DECAY)
      .alphaMin(ALPHA_MIN);

    simRef.current = simulation;

    const ns = "http://www.w3.org/2000/svg";

    // glow filters per category
    const defs = document.createElementNS(ns, "defs");
    categories.forEach((_cat, i) => {
      const base = CATEGORIES[i]?.color || "rgba(167,139,250,0.4)";
      const glowColor = base.replace(/[\d.]+\)$/, `${GLOW_FLOOD_ALPHA})`);
      const filter = document.createElementNS(ns, "filter");
      filter.setAttribute("id", `sg-glow-${i}`);
      filter.setAttribute("x", "-50%");
      filter.setAttribute("y", "-50%");
      filter.setAttribute("width", "200%");
      filter.setAttribute("height", "200%");
      filter.innerHTML = [
        `<feGaussianBlur stdDeviation="${GLOW_BLUR_STDDEV}" result="blur"/>`,
        `<feFlood flood-color="${glowColor}" flood-opacity="${GLOW_FLOOD_OPACITY}" result="color"/>`,
        `<feComposite in="color" in2="blur" operator="in" result="glow"/>`,
        `<feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>`,
      ].join("");
      defs.appendChild(filter);
    });
    // ── mouse ripple radial gradient ─────────────────────────────────
    const rippleBase = MOUSE_RIPPLE_COLOR.replace(/[\d.]+\)$/, "");
    const rippleGrad = document.createElementNS(ns, "radialGradient");
    rippleGrad.setAttribute("id", "sg-mouse-ripple-grad");
    rippleGrad.setAttribute("cx", "50%");
    rippleGrad.setAttribute("cy", "50%");
    rippleGrad.setAttribute("r", "50%");
    rippleGrad.innerHTML = [
      `<stop offset="0%"   stop-color="${MOUSE_RIPPLE_COLOR}"/>`,
      `<stop offset="60%"  stop-color="${rippleBase}0.15)"/>`,
      `<stop offset="100%" stop-color="${rippleBase}0)"/>`,
    ].join("");
    defs.appendChild(rippleGrad);

    svgEl.appendChild(defs);

    const RIPPLE_MAX_R = MOUSE_FORCE_RADIUS * 0.6;

    // ── CSS keyframes for ripple ring animation ───────────────────────
    const rippleStyle = document.createElementNS(ns, "style");
    rippleStyle.textContent = `
      @keyframes sg-ripple-ring {
        0%   { r: 2;  opacity: 0.9; stroke-width: 3.5; }
        100% { r: ${RIPPLE_MAX_R}; opacity: 0.1;   stroke-width: 1; }
      }
      @keyframes sg-ripple-glow {
        0%, 100% { opacity: 0.22; }
        50%      { opacity: 0.05; }
      }
      .sg-ripple-ring {
        fill: none;
        stroke: rgba(167,139,250,0.45);
        animation: sg-ripple-ring 1.5s cubic-bezier(0, 0.2, 0.8, 1) infinite;
      }
      .sg-ripple-ring:nth-child(1) { animation-delay: 0s; }
      .sg-ripple-ring:nth-child(2) { animation-delay: -0.5s; }
      .sg-ripple-ring:nth-child(3) { animation-delay: -1s; }
    `;
    svgEl.appendChild(rippleStyle);

    // layers
    const hullLayer = document.createElementNS(ns, "g");
    const linkLayer = document.createElementNS(ns, "g");
    const nodeLayer = document.createElementNS(ns, "g");
    const pricetagLayer = document.createElementNS(ns, "g");
    const labelLayer = document.createElementNS(ns, "g");

    // ── mouse ripple visual — subtle glow + 3 expanding ripple rings ─
    const rippleGlow = document.createElementNS(ns, "circle");
    rippleGlow.setAttribute("r", String(MOUSE_FORCE_RADIUS * 0.3));
    rippleGlow.setAttribute("fill", "url(#sg-mouse-ripple-grad)");
    rippleGlow.setAttribute("pointer-events", "none");
    rippleGlow.style.animation = "sg-ripple-glow 1.2s ease-in-out infinite";
    rippleGlow.style.display = "none";

    const rippleRingGroup = document.createElementNS(ns, "g");
    rippleRingGroup.setAttribute("pointer-events", "none");
    rippleRingGroup.style.display = "none";
    for (let i = 0; i < 3; i++) {
      const ring = document.createElementNS(ns, "circle");
      ring.setAttribute("cx", "0");
      ring.setAttribute("cy", "0");
      ring.classList.add("sg-ripple-ring");
      rippleRingGroup.appendChild(ring);
    }

    svgEl.appendChild(hullLayer);
    svgEl.appendChild(linkLayer);
    svgEl.appendChild(rippleGlow);
    svgEl.appendChild(rippleRingGroup);
    svgEl.appendChild(nodeLayer);
    svgEl.appendChild(pricetagLayer);
    svgEl.appendChild(labelLayer);

    // link elements
    const linkEls: SVGLineElement[] = [];
    for (let i = 0; i < links.length; i++) {
      const line = document.createElementNS(ns, "line");
      line.setAttribute("stroke", LINK_STROKE_COLOR);
      line.setAttribute("stroke-width", String(LINK_STROKE_WIDTH));
      linkLayer.appendChild(line);
      linkEls.push(line);
    }

    // node + label + connector elements (one label + line per node, always)
    const nodeEls: SVGCircleElement[] = [];
    const labelEls: SVGTextElement[] = [];      // same length as nodes
    const labelLineEls: SVGLineElement[] = [];  // same length as nodes, connecting line

    nodes.forEach((n, ni) => {
      const r = radiusScale(n.rating);
      const fs = labelFontSize(n.rating);
      const circle = document.createElementNS(ns, "circle");
      circle.setAttribute("r", String(r));
      circle.setAttribute("fill", ratingColor(n.rating));
      circle.setAttribute("stroke", NODE_STROKE_COLOR);
      circle.setAttribute("stroke-width", String(NODE_STROKE_WIDTH));
      circle.setAttribute("filter", `url(#sg-glow-${n.groupIndex})`);
      circle.style.cursor = "grab";
      circle.style.transition = NODE_TRANSITION;

      // ── connecting line (node edge → label) ───────────────────────────
      const line = document.createElementNS(ns, "line");
      line.setAttribute("stroke", LABEL_LINE_COLOR);
      line.setAttribute("stroke-width", String(LABEL_LINE_WIDTH));
      line.setAttribute("pointer-events", "none");
      labelLayer.appendChild(line);
      labelLineEls.push(line);

      // ── label text ────────────────────────────────────────────────────
      const text = document.createElementNS(ns, "text");
      text.textContent = n.name;
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "middle");
      text.setAttribute("fill", ratingColor(n.rating));
      text.setAttribute("font-size", String(fs));
      text.setAttribute("font-family", LABEL_FONT_FAMILY);
      text.setAttribute("pointer-events", "none");
      text.style.transition = "fill 0.25s ease";
      labelLayer.appendChild(text);
      labelEls.push(text);

      // ── hover: highlight node + its label + its connector line ─────────
      circle.addEventListener("pointerenter", () => {
        circle.setAttribute("r", String(r * NODE_HOVER_SCALE));
        circle.setAttribute("stroke", NODE_HOVER_STROKE_COLOR);
        circle.setAttribute("stroke-width", String(NODE_HOVER_STROKE_WIDTH));
        circle.style.cursor = "grab";
        text.setAttribute("fill", LABEL_COLOR_HOVER);
        text.setAttribute("font-weight", "bold");
        text.setAttribute("font-size", String(fs * 1.2));
        labelLineEls[ni].setAttribute("stroke", LABEL_LINE_COLOR_HOVER);
        labelLineEls[ni].setAttribute("stroke-width", String(LABEL_LINE_WIDTH_HOVER));

        // ── cancel lingering timer, then show tooltip ──────────────────
        clearTooltipTimer();
        activeNodeRef.current = n;
        const catData = rawNestedData[n.category];
        if (catData) {
          const value = catData[n.name];
          if (typeof value === "object" && value !== null) {
            const entries = Object.entries(value) as [string, number][];
            setTooltipContent({ name: n.name, entries, direct: false });
            tooltipVisibleRef.current = true;
          } else if (typeof value === "number") {
            setTooltipContent({ name: n.name, entries: [[n.name, value]], direct: true });
            tooltipVisibleRef.current = true;
          } else {
            tooltipVisibleRef.current = false;
            setTooltipContent(null);
          }
        } else {
          tooltipVisibleRef.current = false;
          setTooltipContent(null);
        }
        if (tooltipVisibleRef.current && tooltipRef.current) {
          tooltipRef.current.style.display = "block";
          updateTooltipPos(n.x ?? 0, n.y ?? 0);
        }
      });
      circle.addEventListener("pointerleave", () => {
        circle.setAttribute("r", String(r));
        circle.setAttribute("stroke", NODE_STROKE_COLOR);
        circle.setAttribute("stroke-width", String(NODE_STROKE_WIDTH));
        circle.style.cursor = "default";
        text.setAttribute("fill", ratingColor(n.rating));
        text.removeAttribute("font-weight");
        text.setAttribute("font-size", String(fs));
        labelLineEls[ni].setAttribute("stroke", LABEL_LINE_COLOR);
        labelLineEls[ni].setAttribute("stroke-width", String(LABEL_LINE_WIDTH));

        // ── tooltip: 4‑second linger on leave ──────────────────────────
        // (but not while dragging – speed‑based control is active)
        if (!dragNode) {
          clearTooltipTimer();
          tooltipVisibleRef.current = true;
          tooltipTimeoutRef.current = setTimeout(() => {
            tooltipVisibleRef.current = false;
            activeNodeRef.current = null;
            setTooltipContent(null);
            tooltipTimeoutRef.current = null;
          }, 4000);
        }
      });

      nodeLayer.appendChild(circle);
      nodeEls.push(circle);
    });

    // ── hull paths (one per group, purely visual) ───────────────────────
    const groupIndices = [...new Set(nodes.map((n) => n.groupIndex))].sort((a, b) => a - b);
    const allGroupIndices = categories.map((_, i) => i);
    const hullPaths: SVGPathElement[] = [];

    if (HULL_ENABLED) {
      for (const gi of groupIndices) {
        const groupNodes = nodes.filter((n) => n.groupIndex === gi);
        if (groupNodes.length < HULL_MIN_NODES) continue;

        const baseColor = CATEGORIES[gi]?.color || "rgba(167,139,250,0.25)";
        const fillColor = baseColor.replace(/[\d.]+\)$/, `${HULL_FILL_OPACITY})`);
        const strokeColor = baseColor.replace(/[\d.]+\)$/, `${HULL_STROKE_OPACITY})`);

        const path = document.createElementNS(ns, "path");
        path.setAttribute("fill", fillColor);
        path.setAttribute("stroke", strokeColor);
        path.setAttribute("stroke-width", String(HULL_STROKE_WIDTH));
        path.setAttribute("stroke-linejoin", "round");
        path.setAttribute("pointer-events", "none");
        hullLayer.appendChild(path);
        hullPaths[gi] = path;
      }
    }

    // ── pricetags (one per category group) ────────────────────────────
    const pricetagData: PricetagData[] = PRICETAG_ENABLED
      ? createPricetags(pricetagLayer, categories, allGroupIndices, ropeTargetsRef, ropeColorMapRef, CATEGORIES, hiddenGroupsRef.current, (categoryName) => {
          const gi = categories.indexOf(categoryName);
          if (gi >= 0) toggleGroup(gi);
        }, pricetagPositionsRef)
      : [];

    function toggleGroup(gi: number) {
      const hidden = hiddenGroupsRef.current;
      const groupNodes = nodes.filter((n) => n.groupIndex === gi);
      if (hidden.has(gi)) {
        hidden.delete(gi);
        const stored = nodePositionsRef.current.get(gi);
        if (stored) {
          groupNodes.forEach((n, i) => {
            if (i < stored.length) {
              n.x = stored[i].x;
              n.y = stored[i].y;
              n.fx = null;
              n.fy = null;
            }
          });
          nodePositionsRef.current.delete(gi);
        }
      } else {
        hidden.add(gi);
        nodePositionsRef.current.set(gi, groupNodes.map(n => ({ x: n.x ?? 0, y: n.y ?? 0 })));
        groupNodes.forEach(n => { n.fx = -9999; n.fy = -9999; n.x = -9999; n.y = -9999; });
        const rt = ropeTargetsRef.current.get(gi);
        if (rt) { rt.start.x = 0; rt.start.y = 0; rt.end.x = 0; rt.end.y = 0; }
      }
      simulation.alphaTarget(REHEAT_ALPHA).restart();
    }

    // ── initial visibility state for already-hidden groups ──────────────
    for (const gi of hiddenGroupsRef.current) {
      const groupNodes = nodes.filter((n) => n.groupIndex === gi);
      if (groupNodes.length > 0) {
        nodePositionsRef.current.set(gi, groupNodes.map(n => ({ x: n.x ?? 0, y: n.y ?? 0 })));
        groupNodes.forEach(n => { n.fx = -9999; n.fy = -9999; n.x = -9999; n.y = -9999; });
      }
    }

    // ── bounding helper ──────────────────────────────────────────────────
    function clampNode(n: SimNode, r: number) {
      // soft boundary — push nodes back inside the margin
      const margin = BOUNDARY_MARGIN;
      if (n.x != null && n.x < margin + r) n.vx = (n.vx ?? 0) + (margin + r - n.x) * BOUNDARY_PUSH_FACTOR;
      if (n.x != null && n.x > width - margin - r) n.vx = (n.vx ?? 0) - (n.x - (width - margin - r)) * BOUNDARY_PUSH_FACTOR;
      if (n.y != null && n.y < margin + r) n.vy = (n.vy ?? 0) + (margin + r - n.y) * BOUNDARY_PUSH_FACTOR;
      if (n.y != null && n.y > height - margin - r) n.vy = (n.vy ?? 0) - (n.y - (height - margin - r)) * BOUNDARY_PUSH_FACTOR;
    }

    // ── tooltip positioning (flips left when near right edge) ─────────
    const TOOLTIP_MARGIN = 12;
    const TOOLTIP_ESTIMATE = 180;
    function updateTooltipPos(nx: number, ny: number) {
      const el = tooltipRef.current;
      if (!el) return;
      const tw = el.offsetWidth || TOOLTIP_ESTIMATE;
      if (nx + 20 + tw > width - TOOLTIP_MARGIN) {
        el.style.left = `${nx - tw - 8}px`;
      } else {
        el.style.left = `${nx + 20}px`;
      }
      el.style.top = `${ny - 8}px`;
    }

    // ── tick ────────────────────────────────────────────────────────────
    simulation.on("tick", () => {
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (hiddenGroupsRef.current.has(n.groupIndex)) continue;
        const r = radiusScale(n.rating);
        clampNode(n, r);
      }

      // ── mouse repulsion force (push nodes away from cursor) ────────
      if (mouseIsDown) {
        const R2 = MOUSE_FORCE_RADIUS * MOUSE_FORCE_RADIUS;
        const mcx = mouseSVGX;
        const mcy = mouseSVGY;
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          const dx = (n.x ?? 0) - mcx;
          const dy = (n.y ?? 0) - mcy;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < 1e-6) continue;
          if (dist2 < R2) {
            const dist = Math.sqrt(dist2);
            const force = MOUSE_FORCE_STRENGTH * (1 - dist / MOUSE_FORCE_RADIUS);
            n.vx = (n.vx ?? 0) + (dx / dist) * force;
            n.vy = (n.vy ?? 0) + (dy / dist) * force;
          }
        }
      }

      // ── update mouse ripple visual ─────────────────────────────────
      if (mouseIsDown) {
        const tx = String(mouseSVGX);
        const ty = String(mouseSVGY);
        rippleGlow.style.display = "";
        rippleGlow.setAttribute("cx", tx);
        rippleGlow.setAttribute("cy", ty);
        rippleRingGroup.setAttribute("transform", `translate(${tx},${ty})`);
        rippleRingGroup.style.display = "";
      } else {
        rippleGlow.style.display = "none";
        rippleRingGroup.style.display = "none";
      }

      // ── update vacuum‑pack hulls ────────────────────────────────────
      const ropeStartMap = new Map<number, { x: number; y: number }>();

      if (HULL_ENABLED) {
        for (const gi of groupIndices) {
          const path = hullPaths[gi];
          if (!path) continue;
          if (hiddenGroupsRef.current.has(gi)) { path.setAttribute("d", ""); continue; }

          const groupNodes = nodes.filter((n) => n.groupIndex === gi);
          if (groupNodes.length < HULL_MIN_NODES) {
            path.setAttribute("d", "");
            continue;
          }

          let cx = 0, cy = 0;
          for (const n of groupNodes) { cx += n.x ?? 0; cy += n.y ?? 0; }
          cx /= groupNodes.length;
          cy /= groupNodes.length;

          const hullPts = computeGroupHull(groupNodes, cx, cy);
          if (hullPts.length < 3) {
            path.setAttribute("d", "");
            continue;
          }

          path.setAttribute("d", catmullRomClosedPath(hullPts, HULL_CURVE_TENSION));

          const anchorY = cy < height / 2
            ? 10 + PT_H / 2
            : height - 10 - PT_H / 2;
          let bestDist = Infinity;
          let bestPt: { x: number; y: number } = { x: cx, y: cy };
          for (const [hx, hy] of hullPts) {
            const dx = hx - cx;
            const dy = hy - anchorY;
            const d = dx * dx + dy * dy;
            if (d < bestDist) {
              bestDist = d;
              bestPt = { x: hx, y: hy };
            }
          }
          ropeStartMap.set(gi, bestPt);
        }
      }

      for (let i = 0; i < links.length; i++) {
        const s = links[i].source as SimNode;
        const t = links[i].target as SimNode;
        linkEls[i].setAttribute("x1", String(s.x ?? 0));
        linkEls[i].setAttribute("y1", String(s.y ?? 0));
        linkEls[i].setAttribute("x2", String(t.x ?? 0));
        linkEls[i].setAttribute("y2", String(t.y ?? 0));
      }

      // ── update node circles ──────────────────────────────────────────
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        nodeEls[i].setAttribute("cx", String(n.x ?? 0));
        nodeEls[i].setAttribute("cy", String(n.y ?? 0));
      }

      // ── smart label placement ───────────────────────────────────────
      const dirAngles = [Math.PI / 2, -Math.PI / 2, 0, Math.PI, Math.PI / 4, -Math.PI / 4, 3 * Math.PI / 4, -3 * Math.PI / 4];
      const dirTA     = ["middle", "middle", "start", "end", "start", "start", "end", "end"] as const;
      const dirBL     = ["hanging", "text-bottom", "middle", "middle", "hanging", "text-bottom", "hanging", "text-bottom"] as const;
      const dirOX     = [0, 0, 4, -4, 4, 4, -4, -4];
      const dirOY     = [4, -4, 0, 0, 4, -4, 4, -4];
      const numDirs   = LABEL_TRY_DIRECTIONS >= 8 ? 8 : 4;

      // priority-sorted direction indices
      const dirByPriority = Array.from({ length: numDirs }, (_, i) => i)
        .sort((a, b) => (LABEL_DIR_PRIORITY[b] ?? 0) - (LABEL_DIR_PRIORITY[a] ?? 0));

      // build sorted node index list: high rating first (more important labels get best spots)
      const nodeOrder = nodes.map((_, i) => i).sort((a, b) => nodes[b].rating - nodes[a].rating);

      // helpers for overlap detection
      function boxesOverlap(a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) {
        const g = LABEL_GAP_OTHER_LABEL;
        return a.x < b.x + b.w + g && a.x + a.w + g > b.x && a.y < b.y + b.h + g && a.y + a.h + g > b.y;
      }
      function rectOverlapsCircle(rx: number, ry: number, rw: number, rh: number, cx: number, cy: number, cr: number) {
        const crp = cr + LABEL_GAP_NODE;
        const closestX = Math.max(rx, Math.min(cx, rx + rw));
        const closestY = Math.max(ry, Math.min(cy, ry + rh));
        const dx = cx - closestX;
        const dy = cy - closestY;
        return dx * dx + dy * dy < crp * crp;
      }
      function estimateTextSize(text: string, fontSize: number) {
        return { w: text.length * fontSize * 0.6, h: fontSize * 1.2 };
      }
      function textBBox(ax: number, ay: number, ta: string, bl: string, ox: number, oy: number, tw: number, th: number) {
        const tx = ax + ox;
        const ty = ay + oy;
        let x = tx, y = ty;
        if (ta === "middle") x -= tw / 2;
        else if (ta === "end") x -= tw;
        if (bl === "middle") y -= th / 2;
        else if (bl === "text-bottom") y -= th;
        // "hanging" keeps y as-is
        return { x, y, w: tw, h: th };
      }

      // result per node: { ax, ay, dir, ta, bl, ox, oy }
      const placements: { ax: number; ay: number; dir: number; ta: string; bl: string; ox: number; oy: number }[] = new Array(nodes.length);
      const placedBoxes: { x: number; y: number; w: number; h: number }[] = [];

      for (const ni of nodeOrder) {
        const n = nodes[ni];
        const cx = n.x ?? 0;
        const cy = n.y ?? 0;
        const r = radiusScale(n.rating);
        const fs = labelFontSize(n.rating);
        const ts = estimateTextSize(n.name, fs);
        let bestDir = -1;
        let bestAnchor = { ax: 0, ay: 0 };

        for (const d of dirByPriority) {
          const angle = dirAngles[d];
          const ax = cx + Math.cos(angle) * (r + LABEL_CONNECTOR_LENGTH);
          const ay = cy + Math.sin(angle) * (r + LABEL_CONNECTOR_LENGTH);
          const ta = dirTA[d];
          const bl = dirBL[d];
          const ox = dirOX[d];
          const oy = dirOY[d];
          const box = textBBox(ax, ay, ta, bl, ox, oy, ts.w, ts.h);

          // check overlap with other node circles
          let overlapsNode = false;
          for (let j = 0; j < nodes.length; j++) {
            if (j === ni) continue;
            if (rectOverlapsCircle(box.x, box.y, box.w, box.h, nodes[j].x ?? 0, nodes[j].y ?? 0, radiusScale(nodes[j].rating))) {
              overlapsNode = true;
              break;
            }
          }
          if (overlapsNode) continue;

          // check overlap with already placed labels
          let overlapsLabel = false;
          for (const pb of placedBoxes) {
            if (boxesOverlap(box, pb)) { overlapsLabel = true; break; }
          }
          if (overlapsLabel) continue;

          bestDir = d;
          bestAnchor = { ax, ay };
          break;
        }

        // fallback: use preferred direction if all overlap
        if (bestDir < 0) {
          bestDir = dirByPriority[0];
          const angle = dirAngles[bestDir];
          bestAnchor = {
            ax: cx + Math.cos(angle) * (r + LABEL_CONNECTOR_LENGTH),
            ay: cy + Math.sin(angle) * (r + LABEL_CONNECTOR_LENGTH),
          };
        }

        const d = bestDir;
        const ta = dirTA[d];
        const bl = dirBL[d];
        const ox = dirOX[d];
        const oy = dirOY[d];
        placements[ni] = { ax: bestAnchor.ax, ay: bestAnchor.ay, dir: d, ta, bl, ox, oy };

        // register this box for overlap avoidance
        const box = textBBox(bestAnchor.ax, bestAnchor.ay, ta, bl, ox, oy, ts.w, ts.h);
        placedBoxes.push(box);
      }

      // ── apply label & connector positions ───────────────────────────
      for (let i = 0; i < nodes.length; i++) {
        const p = placements[i];
        labelEls[i].setAttribute("x", String(p.ax + p.ox));
        labelEls[i].setAttribute("y", String(p.ay + p.oy));
        labelEls[i].setAttribute("text-anchor", p.ta);
        labelEls[i].setAttribute("dominant-baseline", p.bl);

        const n = nodes[i];
        const r = radiusScale(n.rating);
        const angle = dirAngles[p.dir];
        labelLineEls[i].setAttribute("x1", String((n.x ?? 0) + Math.cos(angle) * r));
        labelLineEls[i].setAttribute("y1", String((n.y ?? 0) + Math.sin(angle) * r));
        labelLineEls[i].setAttribute("x2", String(p.ax));
        labelLineEls[i].setAttribute("y2", String(p.ay));
      }

      // ── update tooltip position (follows node during drag) ─────────
      if (tooltipVisibleRef.current && tooltipRef.current && activeNodeRef.current) {
        const an = activeNodeRef.current;
        updateTooltipPos(an.x ?? 0, an.y ?? 0);
      }

      // ── update pricetag positions ─────────────────────────────────
      updatePricetags(pricetagData, nodes, width, height, HULL_MIN_NODES, ropeTargetsRef, ropeStartMap, hiddenGroupsRef.current, pricetagPositionsRef);

      // ── visibility for hidden groups ───────────────────────────────
      for (let i = 0; i < nodes.length; i++) {
        const isHidden = hiddenGroupsRef.current.has(nodes[i].groupIndex);
        const val = isHidden ? "0" : "";
        nodeEls[i].style.opacity = val;
        labelEls[i].style.opacity = val;
        labelLineEls[i].style.opacity = val;
      }
      for (const gi of allGroupIndices) {
        const path = hullPaths[gi];
        if (path) path.style.opacity = hiddenGroupsRef.current.has(gi) ? "0" : "";
      }
      for (let i = 0; i < links.length; i++) {
        const s = links[i].source as SimNode;
        linkEls[i].style.opacity = hiddenGroupsRef.current.has(s.groupIndex) ? "0" : "";
      }
    });

    // ── drag (D3-style: fix single node → link forces pull group) ──────
    let dragNode: SimNode | null = null;
    let dragStartX = 0;
    let dragStartY = 0;
    let lastMoveTime = 0;
    let lastMoveX = 0;
    let lastMoveY = 0;
    let slowShowTimer: ReturnType<typeof setTimeout> | null = null;
    const DRAG_TOOLTIP_SPEED_THRESHOLD = 180; // px/s — hide tooltip when moving faster
    const SLOW_DEBOUNCE_MS = 1000; // ms of slow movement before tooltip reappears
    const CLICK_MOVE_THRESHOLD = 8; // px — max movement to still count as "click"

    // ── mouse repulsion state (LMB on empty canvas) ─────────────────
    let mouseIsDown = false;
    let mouseSVGX = 0;
    let mouseSVGY = 0;

    function findNode(px: number, py: number): SimNode | null {
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i];
        const r = radiusScale(n.rating) + NODE_DRAG_HIT_PADDING;
        const dx = (n.x ?? 0) - px;
        const dy = (n.y ?? 0) - py;
        if (dx * dx + dy * dy < r * r) return n;
      }
      return null;
    }

    function svgRect() {
      const svg = svgRef.current;
      if (!svg) return { left: 0, top: 0, width: 1, height: 1 };
      return svg.getBoundingClientRect();
    }

    function onPointerDown(e: PointerEvent) {
      if (e.button !== 0) return; // left button only

      const rect = svgRect();
      const scaleX = width / rect.width;
      const scaleY = height / rect.height;
      const px = (e.clientX - rect.left) * scaleX;
      const py = (e.clientY - rect.top) * scaleY;

      const hit = findNode(px, py);
      if (!hit) {
        e.preventDefault();
        // ── clicking empty canvas cancels tooltip ──────────────────────
        clearTooltipTimer();
        tooltipVisibleRef.current = false;
        activeNodeRef.current = null;
        setTooltipContent(null);
        mouseIsDown = true;
        mouseSVGX = px;
        mouseSVGY = py;
        simulation.alphaTarget(REHEAT_ALPHA).restart();
        if (svgRef.current) svgRef.current.style.cursor = "none";
        return;
      }

      e.preventDefault();
      dragNode = hit;
      dragStartX = px;
      dragStartY = py;
      hit.fx = hit.x;
      hit.fy = hit.y;
      if (svgRef.current) svgRef.current.style.cursor = "grabbing";
      simulation.alphaTarget(REHEAT_ALPHA).restart();
    }

    function onPointerMove(e: PointerEvent) {
      const rect = svgRect();
      const scaleX = width / rect.width;
      const scaleY = height / rect.height;
      const px = (e.clientX - rect.left) * scaleX;
      const py = (e.clientY - rect.top) * scaleY;

      if (!dragNode) {
        if (mouseIsDown) {
          mouseSVGX = px;
          mouseSVGY = py;
          return;
        }
        const hit = findNode(px, py);
        if (svgRef.current) svgRef.current.style.cursor = hit ? "grab" : "default";
        return;
      }

      dragNode.fx = px;
      dragNode.fy = py;

      // ── speed-based tooltip visibility during drag ────────────────
      const now = performance.now();
      if (lastMoveTime > 0) {
        const dt = (now - lastMoveTime) / 1000;
        if (dt > 0.008) {
          const dist = Math.sqrt((px - lastMoveX) ** 2 + (py - lastMoveY) ** 2);
          const speed = dist / dt;
          if (speed > DRAG_TOOLTIP_SPEED_THRESHOLD) {
            // fast → hide tooltip immediately
            if (tooltipVisibleRef.current) {
              tooltipVisibleRef.current = false;
              if (tooltipRef.current) tooltipRef.current.style.display = "none";
            }
            // reset timer: show tooltip after 1s of no fast movement
            if (slowShowTimer !== null) clearTimeout(slowShowTimer);
            slowShowTimer = setTimeout(() => {
              tooltipVisibleRef.current = true;
              if (tooltipRef.current) tooltipRef.current.style.display = "block";
              slowShowTimer = null;
            }, SLOW_DEBOUNCE_MS);
          } else if (!tooltipVisibleRef.current && slowShowTimer === null) {
            // slow and hidden → set timer once
            slowShowTimer = setTimeout(() => {
              tooltipVisibleRef.current = true;
              if (tooltipRef.current) tooltipRef.current.style.display = "block";
              slowShowTimer = null;
            }, SLOW_DEBOUNCE_MS);
          }
        }
      }
      lastMoveTime = now;
      lastMoveX = px;
      lastMoveY = py;
    }

    function onPointerUp(_e: PointerEvent) {
      if (dragNode) {
        dragNode.fx = null;
        dragNode.fy = null;
        dragNode = null;
        simulation.alphaTarget(0);
      }

      if (mouseIsDown) {
        mouseIsDown = false;
        simulation.alphaTarget(0);
      }

      // ── clean up drag-speed timer ──────────────────────────────────
      if (slowShowTimer !== null) {
        clearTimeout(slowShowTimer);
        slowShowTimer = null;
      }

      // ── tooltip: after pointerup, always restore visibility ────────
      //     (the speed-based logic only hides during active dragging)
      if (tooltipContent) {
        tooltipVisibleRef.current = true;
        if (tooltipRef.current) tooltipRef.current.style.display = "block";
      }

      // ── click (minimal movement) → 4‑second linger ────────────────
      if (tooltipContent) {
        const dx = lastMoveX - dragStartX;
        const dy = lastMoveY - dragStartY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CLICK_MOVE_THRESHOLD) {
          clearTooltipTimer();
          tooltipTimeoutRef.current = setTimeout(() => {
            tooltipVisibleRef.current = false;
            activeNodeRef.current = null;
            setTooltipContent(null);
            tooltipTimeoutRef.current = null;
          }, 4000);
        }
      }

      if (svgRef.current) svgRef.current.style.cursor = "default";
    }

    // double-click to release a fixed node
    function onDblClick(e: MouseEvent) {
      const rect = svgRect();
      const scaleX = width / rect.width;
      const scaleY = height / rect.height;
      const px = (e.clientX - rect.left) * scaleX;
      const py = (e.clientY - rect.top) * scaleY;

      const hit = findNode(px, py);
      if (hit && (hit.fx != null || hit.fy != null)) {
        hit.fx = null;
        hit.fy = null;
        simulation.alphaTarget(REHEAT_ALPHA).restart();
      }
    }

    svgEl.addEventListener("pointerdown", onPointerDown);
    svgEl.addEventListener("pointermove", onPointerMove);
    svgEl.addEventListener("dblclick", onDblClick);
    window.addEventListener("pointerup", onPointerUp);

    // ── resize ──────────────────────────────────────────────────────────
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      width = w;
      height = h;
      svgEl.setAttribute("viewBox", `0 0 ${w} ${h}`);

      simulation
        .force("x", forceX<SimNode>(w / 2).strength(dynCenterX))
        .force("y", forceY<SimNode>(h / 2).strength(dynCenterY))
        .alpha(REHEAT_ALPHA)
        .restart();
    };

    window.addEventListener("resize", onResize);

    return () => {
      simulation.stop();
      simRef.current = null;
      if (slowShowTimer !== null) clearTimeout(slowShowTimer);
      clearTooltipTimer();
      tooltipVisibleRef.current = false;
      activeNodeRef.current = null;
      setTooltipContent(null);
      window.removeEventListener("resize", onResize);
      svgEl.removeEventListener("pointerdown", onPointerDown);
      svgEl.removeEventListener("pointermove", onPointerMove);
      svgEl.removeEventListener("dblclick", onDblClick);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [currentData, rawNestedData]);

  const applyFilter = useCallback(() => {
    const selectedRatings = new Set<number>();
    for (let r = 1; r <= 5; r++) {
      if (filterToggles[r]) selectedRatings.add(r);
    }

    if (selectedRatings.size >= 5) {
      filterRatingsRef.current = null;
    } else {
      filterRatingsRef.current = selectedRatings;
    }

    setFilterActive(filterRatingsRef.current !== null);

    if (cleanupRef.current) cleanupRef.current();
    const cleanup = buildSimulation();
    cleanupRef.current = cleanup ?? null;
  }, [filterToggles, buildSimulation]);

  const resetFilter = useCallback(() => {
    filterRatingsRef.current = null;
    hiddenGroupsRef.current.clear();
    nodePositionsRef.current.clear();
    pricetagPositionsRef.current.clear();
    setFilterActive(false);
    setFilterToggles([false, true, true, true, true, true]);

    if (cleanupRef.current) cleanupRef.current();
    const cleanup = buildSimulation();
    cleanupRef.current = cleanup ?? null;
  }, [buildSimulation]);

  useEffect(() => {
    if (cleanupRef.current) cleanupRef.current();
    const cleanup = buildSimulation();
    cleanupRef.current = cleanup ?? null;
    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, [buildSimulation]);

  useEffect(() => {
    let lockTicks = 0;
    const LOCK_MAX = 3;
    let inside = false;
    let consumed = false;

    const handleWheel = (e: WheelEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const nowInside = rect.top >= -700 && rect.top <= 700;

      if (!nowInside) {
        inside = false;
        consumed = false;
        lockTicks = 0;
        return;
      }

      if (consumed) return;

      if (!inside) {
        inside = true;
        lockTicks = 0;
        document.documentElement.scrollTop = rect.top + window.scrollY - 52;
      }

      if (lockTicks < LOCK_MAX) {
        e.preventDefault();
        lockTicks++;
      } else {
        consumed = true;
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });
    return () => document.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="relative w-full py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <h2
          className="mb-6 text-center text-3xl font-bold md:text-4xl"
          style={{ color: "rgba(239,68,68,1)", textShadow: "0 0 20px rgba(239,68,68,0.35)" }}
        >
          Skills &amp; Expertise
        </h2>
      </div>
      <div
        ref={containerRef}
        className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-xl border"
        style={{
          height: CONTAINER_HEIGHT,
          borderColor: CONTAINER_BORDER_COLOR,
          backgroundColor: CONTAINER_BG_COLOR,
        }}
      >
        <svg ref={svgRef} className="h-full w-full" />
        <WobblyRopes ropeTargetsRef={ropeTargetsRef} colors={ropeColorMapRef.current} segments={12} springStrength={0.06} stiffness={0.5} />

        {/* ── Tooltip (sub‑entries of hovered / dragged node) ──────── */}
        <div
          ref={tooltipRef}
          className="absolute z-50 pointer-events-none"
          style={{
            display: tooltipContent ? "block" : "none",
            color: "rgba(213,220,232,0.9)",
            backgroundColor: "rgba(11,13,23,0.95)",
            border: "1px solid rgba(167,139,250,0.3)",
            borderRadius: "8px",
            padding: "8px 12px",
            fontFamily: "monospace",
            fontSize: "11px",
            lineHeight: "1.6",
            minWidth: "140px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            whiteSpace: "nowrap",
          }}
        >
          {tooltipContent && (
            <>
              {tooltipContent.direct ? (
                <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", color: "rgba(255,255,255,0.95)" }}>
                  <span style={{ fontWeight: "bold" }}>{tooltipContent.name}</span>
                  <span style={{ color: ratingColor(tooltipContent.entries[0][1]), fontWeight: "bold" }}>{tooltipContent.entries[0][1]}</span>
                </div>
              ) : (
                <>
                  <div style={{ fontWeight: "bold", marginBottom: "4px", color: "rgba(255,255,255,0.95)" }}>
                    {tooltipContent.name}
                  </div>
                  {tooltipContent.entries.map(([entryName, entryRating]) => (
                    <div key={entryName} style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
                      <span>{entryName}</span>
                      <span style={{ color: ratingColor(entryRating), fontWeight: "bold" }}>{entryRating}</span>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Filter‑Controls ──────────────────────────────────────────── */}
      <div className="container mx-auto max-w-7xl px-4 mt-6">
        {/* Rating row */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-xs" style={{ color: "rgba(213,220,232,0.6)" }}>
            {language === "de" ? "Bewertung:" : "Rating:"}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
          {[1, 2, 3, 4, 5].map((r) => {
            const color = ratingColor(r);
            return (
              <button
                key={r}
                onClick={() => {
                  setFilterToggles(prev => {
                    const next = [...prev];
                    next[r] = !next[r];
                    return next;
                  });
                }}
                className="rounded px-3 py-1 font-mono text-sm font-bold transition-all duration-150"
                style={{
                  backgroundColor: filterToggles[r] ? color : "rgba(30,30,40,0.6)",
                  color: filterToggles[r] ? "#111" : "rgba(150,150,160,0.5)",
                  border: `1px solid ${filterToggles[r] ? color : "rgba(60,60,70,0.4)"}`,
                  opacity: filterToggles[r] ? 1 : 0.55,
                }}
              >
                {r}
              </button>
            );
          })}
          </div>
        </div>

        {/* Action row */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
          <button
            onClick={applyFilter}
            className="rounded px-4 py-1 font-mono text-xs font-semibold transition-all duration-150"
            style={{
              backgroundColor: "rgba(99,102,241,0.6)",
              color: "#fff",
              border: "1px solid rgba(99,102,241,0.7)",
              cursor: "pointer",
            }}
          >
            {language === "de" ? "Filter anwenden" : "Apply Filter"}
          </button>
          {filterActive && (
            <button
              onClick={resetFilter}
              className="rounded px-3 py-1 font-mono text-xs transition-all duration-150"
              style={{
                backgroundColor: "rgba(30,30,40,0.6)",
                color: "rgba(213,220,232,0.6)",
                border: "1px solid rgba(99,102,241,0.3)",
              }}
            >
              {language === "de" ? "Zurücksetzen" : "Reset"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
