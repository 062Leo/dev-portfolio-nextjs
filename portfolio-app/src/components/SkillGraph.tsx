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
import skillsData from "@/data/skills_rated.json";
import skillsDataEn from "@/data/skills_rated_en.json";
import { useLanguage } from "@/context/LanguageContext";

// ══════════════════════════════════════════════════════════════════════════════
//  CATEGORY DEFINITIONS
// ══════════════════════════════════════════════════════════════════════════════

type CatKey = string;

const CATEGORIES: { key: CatKey; color: string }[] = [
  { key: ".NET",             color: "rgba(129,140,248,0.25)" },
  { key: "Architektur",      color: "rgba(99,102,241,0.25)" },
  { key: "Backend",          color: "rgba(74,222,128,0.25)" },
  { key: "Daten & SQL",      color: "rgba(14,165,233,0.25)" },
  { key: "DevOps",           color: "rgba(251,146,60,0.25)" },
  { key: "Game Design",      color: "rgba(168,85,247,0.25)" },
  { key: "Hardware",         color: "rgba(245,158,11,0.25)" },
  { key: "KI & ML",          color: "rgba(250,204,21,0.25)" },
  { key: "KI-Tools",         color: "rgba(236,72,153,0.25)" },
  { key: "ML Training",      color: "rgba(253,224,71,0.25)" },
  { key: "PM",               color: "rgba(148,163,184,0.25)" },
  { key: "Softw. Engineering",color: "rgba(94,234,212,0.25)" },
  { key: "Sonstiges",        color: "rgba(156,163,175,0.25)" },
  { key: "Sprachen",         color: "rgba(167,139,250,0.25)" },
  { key: "Testing",          color: "rgba(239,68,68,0.25)" },
  { key: "Tools",            color: "rgba(244,114,182,0.25)" },
  { key: "Unity",            color: "rgba(52,211,153,0.25)" },
  { key: "Unity Monet.",     color: "rgba(34,197,94,0.25)" },
  { key: "Unity Netcode",    color: "rgba(45,212,191,0.25)" },
  { key: "Web",              color: "rgba(56,189,248,0.25)" },
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

const GROUP_EXTRA_LINK_START_OFFSET = 3;  // skip N neighbours before additional links start
const GROUP_EXTRA_LINK_MAX_LOOKAHEAD = 4; // how many nodes ahead are eligible as extra targets
const GROUP_EXTRA_LINK_MAX = 4;           // absolute max extra connections per node (1‑4)
const MAX_DEGREE_HIGH = 4;                // max total degree for the high-count node
const MAX_DEGREE_NORMAL = 2;              // max total degree for all other nodes

// ══════════════════════════════════════════════════════════════════════════════
//  FORCE SIMULATION — dynamic scaling based on visible node count
// ══════════════════════════════════════════════════════════════════════════════

const LINK_DISTANCE = 28;           // target length of link edges

// —— anchor points for force interpolation (nodeCount → force values) ——
const MAX_NODES = 126;
const MIN_NODES = 6;

// values at 126 nodes (all ratings — known perfect)
const CHARGE_AT_MAX   = -85;
const CENTER_Y_AT_MAX = 0.1;

// values at 6 nodes (rating 1 only — ADJUST THESE UNTIL LAYOUT LOOKS GOOD)
const CHARGE_AT_MIN   = -200;
const CENTER_Y_AT_MIN = 0.045;

const ALPHA_DECAY = 0.01;          // cooling rate per tick (higher = faster settle)
const ALPHA_MIN = 0.001;          // simulation stops when alpha drops below this
const COLLIDE_PADDING = 2;        // extra px between node edges for forceCollide
const REHEAT_ALPHA = 0.2;         // alpha / alphaTarget when re-energizing (drag, resize, etc.)

// ══════════════════════════════════════════════════════════════════════════════
//  RATING COLORS — one constant per rating, set manually as rgba
// ══════════════════════════════════════════════════════════════════════════════

const RATING_1_COLOR = "rgb(255, 0, 0)";    // red
const RATING_2_COLOR = "rgb(255, 102, 0)";    // orange
const RATING_3_COLOR = "rgb(242, 255, 0)";    // yellow
const RATING_4_COLOR = "rgb(111, 255, 0)";    // yellow-green
const RATING_5_COLOR = "rgb(32, 184, 85)";      // bright green

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
const LABEL_COLOR_NORMAL = "rgba(213,220,232,0.55)";  // text-farbe normal
const LABEL_COLOR_HOVER = "rgba(255,255,255,1)";      // text-farbe wenn knoten gehovert

// ——  Verbindungslinie Label → Knoten —————————————————————————————————————————
const LABEL_LINE_COLOR = "rgba(192,184,213,0.28)";    // farbe der mini-linie
const LABEL_LINE_WIDTH = 0.5;                         // strichstärke (px)
const LABEL_LINE_COLOR_HOVER = "rgba(255,255,255,0.6)"; // linien-farbe bei hover
const LABEL_LINE_WIDTH_HOVER = 1.0;                   // strichstärke bei hover

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

const CONTAINER_HEIGHT = "clamp(500px, 70vh, 850px)";
const CONTAINER_BORDER_COLOR = "rgba(167,139,250,0.25)";
const CONTAINER_BG_COLOR = "rgb(11, 13, 23)";

// ══════════════════════════════════════════════════════════════════════════════
//  HULL  –  vacuum‑pack enclosure around category groups
//  Jeder Parameter ist hier einstellbar; Kommentar erklärt, was er tut.
// ══════════════════════════════════════════════════════════════════════════════

const HULL_ENABLED = true;              // Master‑Schalter  true | false
const HULL_MIN_NODES = 2;               // Gruppe braucht ≥ N Knoten, sonst keine Hülle

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
const HULL_INNER_THRESHOLD = 0.60;      // 0…1   Abstand zum Zentroid relativ zum
                                        //        Durchschnitt aller Hüllen-Punkte.
                                        //   Punkte mit Abstand < Schwellwert × Ø
                                        //   werden ausgeblendet.
                                        //   0.70  = empfohlen  (alles unter 70 % fliegt raus)
                                        //   1.0   = alles bleibt (kein Filter)
                                        //   0.0   = alles weg 😄

// ——  Vakuum‑Effekt (eingesaugte Stellen zwischen entfernten Knoten)  —————————
const HULL_VACUUM_THRESHOLD = 2.2;      // Lücken‑Schwelle  (Vielfaches des Eimer‑Bogens)
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
const HULL_STROKE_WIDTH = 1.5;          // px
const HULL_FILL_OPACITY = 0.1;          // 0 … 1
const HULL_STROKE_OPACITY = 0.45;       // 0 … 1

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
      const sampleAngle = toNodeAngle - HULL_ARC_SPAN / 2 + t * HULL_ARC_SPAN;
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
//  TYPES
// ══════════════════════════════════════════════════════════════════════════════

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
}

// ══════════════════════════════════════════════════════════════════════════════
//  COMPONENT
// ══════════════════════════════════════════════════════════════════════════════

export function SkillGraph() {
  const { language } = useLanguage();
  const currentData: Record<string, Record<string, number>> =
    language === "en" ? (skillsDataEn as Record<string, Record<string, number>>) : (skillsData as Record<string, Record<string, number>>);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const simRef = useRef<Simulation<SimNode, SimLink> | null>(null);

  // filter: null = all nodes, Set<number> = only these ratings
  const filterRatingsRef = useRef<Set<number> | null>(null);

  // filter state: index 1..5 → true = selected
  const [filterToggles, setFilterToggles] = useState<boolean[]>([false, true, true, true, true, true]);
  const [filterActive, setFilterActive] = useState(false);

  // category filter
  const allCategoryKeys = useMemo(() => Array.from(getSkillCategories(currentData).keys()), [currentData]);
  const filterCategoriesRef = useRef<Set<string> | null>(null);
  const [categoryToggles, setCategoryToggles] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const key of Array.from(getSkillCategories(currentData).keys())) init[key] = true;
    return init;
  });

  const buildSimulation = useCallback(() => {
    const container = containerRef.current;
    const svgEl = svgRef.current;
    if (!container || !svgEl) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    svgEl.innerHTML = "";
    svgEl.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svgEl.style.userSelect = "none";

    const merged = getSkillCategories(currentData);
    const categories = Array.from(merged.keys());

    const nodes: SimNode[] = [];
    const links: SimLink[] = [];

    categories.forEach((category, ci) => {
      const skills = merged.get(category)!;
      const entries = Object.entries(skills).sort((a, b) => b[1] - a[1]);

      const groupNodes: SimNode[] = [];
      entries.forEach(([name, rating]) => {
        const allowedRating = filterRatingsRef.current;
        const allowedCat = filterCategoriesRef.current;
        if (allowedRating && !allowedRating.has(rating)) return;
        if (allowedCat && !allowedCat.has(category)) return;
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
        links.push({ source: groupNodes[i].id, target: groupNodes[i + 1].id });
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

      const title = document.createElementNS(ns, "title");
      title.textContent = `${n.name}  (${n.rating}/${RATING_MAX})  —  ${n.category}`;
      circle.appendChild(title);

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
      });

      nodeLayer.appendChild(circle);
      nodeEls.push(circle);
    });

    // ── hull paths (one per group, purely visual) ───────────────────────
    const groupIndices = [...new Set(nodes.map((n) => n.groupIndex))].sort((a, b) => a - b);
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

    // ── bounding helper ──────────────────────────────────────────────────
    function clampNode(n: SimNode, r: number) {
      // soft boundary — push nodes back inside the margin
      const margin = BOUNDARY_MARGIN;
      if (n.x != null && n.x < margin + r) n.vx = (n.vx ?? 0) + (margin + r - n.x) * BOUNDARY_PUSH_FACTOR;
      if (n.x != null && n.x > width - margin - r) n.vx = (n.vx ?? 0) - (n.x - (width - margin - r)) * BOUNDARY_PUSH_FACTOR;
      if (n.y != null && n.y < margin + r) n.vy = (n.vy ?? 0) + (margin + r - n.y) * BOUNDARY_PUSH_FACTOR;
      if (n.y != null && n.y > height - margin - r) n.vy = (n.vy ?? 0) - (n.y - (height - margin - r)) * BOUNDARY_PUSH_FACTOR;
    }

    // ── tick ────────────────────────────────────────────────────────────
    simulation.on("tick", () => {
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
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
      if (HULL_ENABLED) {
        for (const gi of groupIndices) {
          const path = hullPaths[gi];
          if (!path) continue;

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
    });

    // ── drag (D3-style: fix single node → link forces pull group) ──────
    let dragNode: SimNode | null = null;

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
        mouseIsDown = true;
        mouseSVGX = px;
        mouseSVGY = py;
        simulation.alphaTarget(REHEAT_ALPHA).restart();
        if (svgRef.current) svgRef.current.style.cursor = "none";
        return;
      }

      e.preventDefault();
      dragNode = hit;
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
      window.removeEventListener("resize", onResize);
      svgEl.removeEventListener("pointerdown", onPointerDown);
      svgEl.removeEventListener("pointermove", onPointerMove);
      svgEl.removeEventListener("dblclick", onDblClick);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [currentData]);

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

    const selectedCategories = new Set<string>();
    for (const [key, enabled] of Object.entries(categoryToggles)) {
      if (enabled) selectedCategories.add(key);
    }

    if (selectedCategories.size >= allCategoryKeys.length) {
      filterCategoriesRef.current = null;
    } else {
      filterCategoriesRef.current = selectedCategories;
    }

    const anyFilterActive = filterRatingsRef.current !== null || filterCategoriesRef.current !== null;
    setFilterActive(anyFilterActive);

    if (cleanupRef.current) cleanupRef.current();
    const cleanup = buildSimulation();
    cleanupRef.current = cleanup ?? null;
  }, [filterToggles, categoryToggles, allCategoryKeys.length, buildSimulation]);

  const resetFilter = useCallback(() => {
    filterRatingsRef.current = null;
    filterCategoriesRef.current = null;
    setFilterActive(false);
    setFilterToggles([false, true, true, true, true, true]);

    const resetCatToggles: Record<string, boolean> = {};
    for (const key of allCategoryKeys) resetCatToggles[key] = true;
    setCategoryToggles(resetCatToggles);

    if (cleanupRef.current) cleanupRef.current();
    const cleanup = buildSimulation();
    cleanupRef.current = cleanup ?? null;
  }, [allCategoryKeys, buildSimulation]);

  useEffect(() => {
    if (cleanupRef.current) cleanupRef.current();
    const cleanup = buildSimulation();
    cleanupRef.current = cleanup ?? null;
    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, [buildSimulation]);

  return (
    <section id="skills" className="relative w-full py-16 md:py-24">
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

        {/* Category row — responsive grid, balanced columns */}
        <div className="text-center mt-2">
          <span className="text-xs mb-1 inline-block" style={{ color: "rgba(213,220,232,0.6)" }}>
            {language === "de" ? "Kategorie:" : "Category:"}
          </span>
        </div>
        <div className="grid grid-cols-[repeat(4,auto)] sm:grid-cols-[repeat(5,auto)] lg:grid-cols-[repeat(7,auto)] justify-center gap-x-2 gap-y-1">
          {allCategoryKeys.map((cat) => {
            const idx = allCategoryKeys.indexOf(cat);
            const baseColor = CATEGORIES[idx]?.color || "rgba(167,139,250,0.25)";
            const activeBg = baseColor.replace(/[\d.]+\)$/, "0.55)");
            const active = categoryToggles[cat] !== false;
            return (
              <button
                key={cat}
                onClick={() => {
                  setCategoryToggles(prev => ({ ...prev, [cat]: !active }));
                }}
                className="rounded px-2 py-0.5 font-mono text-xs font-bold transition-all duration-150"
                style={{
                  backgroundColor: active ? activeBg : "rgba(30,30,40,0.6)",
                  color: active ? "#111" : "rgba(150,150,160,0.5)",
                  border: `1px solid ${active ? baseColor : "rgba(60,60,70,0.4)"}`,
                  opacity: active ? 1 : 0.5,
                }}
              >
                {cat}
              </button>
            );
          })}
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
              {language === "de" ? "Zur&uuml;cksetzen" : "Reset"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
