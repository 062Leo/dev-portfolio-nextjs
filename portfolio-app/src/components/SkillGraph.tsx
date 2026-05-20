"use client";

import { useEffect, useRef, useCallback } from "react";
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

const CAT_COLOR_MAP: Record<CatKey, string> = {};
for (const c of CATEGORIES) CAT_COLOR_MAP[c.key] = c.color;

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
//  FORCE SIMULATION
// ══════════════════════════════════════════════════════════════════════════════

const LINK_DISTANCE = 28;         // target length of link edges
const CHARGE_STRENGTH = -85;      // repulsion between every node pair (negative = push apart)
const CENTER_FORCE_STRENGTH = 0.1; // strength of centering gravity
const ALPHA_DECAY = 0.01;        // cooling rate per tick (higher = faster settle)
const ALPHA_MIN = 0.001;          // simulation stops when alpha drops below this
const COLLIDE_PADDING = 2;        // extra px between node edges for forceCollide
const REHEAT_ALPHA = 0.2;         // alpha / alphaTarget when re-energizing (drag, resize, etc.)

// ══════════════════════════════════════════════════════════════════════════════
//  RATING COLORS (linear interpolation per node)
// ══════════════════════════════════════════════════════════════════════════════

const RATING_COLOR_MIN_R = 239;  // rating 1  red-ish
const RATING_COLOR_MIN_G = 68;
const RATING_COLOR_MIN_B = 68;
const RATING_COLOR_MAX_R = 34;   // rating 5  green-ish
const RATING_COLOR_MAX_G = 197;
const RATING_COLOR_MAX_B = 94;

// ══════════════════════════════════════════════════════════════════════════════
//  BOUNDARY (keeps nodes inside container)
// ══════════════════════════════════════════════════════════════════════════════

const BOUNDARY_MARGIN = 20;       // px margin from container edges
const BOUNDARY_PUSH_FACTOR = 0.3; // push strength when a node crosses the boundary

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
const LABEL_FONT_SIZE_MIN = 5;        // px für Rating 1
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
const CONTAINER_BG_COLOR = "rgba(11,13,23,0.6)";

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
  const t = (rating - RATING_MIN) / (RATING_MAX - RATING_MIN);
  const r = Math.round(RATING_COLOR_MIN_R - t * (RATING_COLOR_MIN_R - RATING_COLOR_MAX_R));
  const g = Math.round(RATING_COLOR_MIN_G + t * (RATING_COLOR_MAX_G - RATING_COLOR_MIN_G));
  const b = Math.round(RATING_COLOR_MIN_B + t * (RATING_COLOR_MAX_B - RATING_COLOR_MIN_B));
  return `rgb(${r},${g},${b})`;
}

function getSkillCategories(): Map<CatKey, Record<string, number>> {
  const map = new Map<CatKey, Record<string, number>>();
  const src = skillsData as Record<string, Record<string, number>>;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const saveNodesRef = useRef<SimNode[]>([]);
  const targetsRef = useRef<Map<number, [number, number]>>(new Map());
  const simRef = useRef<Simulation<SimNode, SimLink> | null>(null);

  const handleSave = useCallback(() => {
    const nodes = saveNodesRef.current;
    if (!nodes.length) return;

    const groups = new Map<number, { xs: number[]; ys: number[]; cat: string }>();
    for (const n of nodes) {
      if (n.x == null || n.y == null) continue;
      let g = groups.get(n.groupIndex);
      if (!g) {
        g = { xs: [], ys: [], cat: n.category };
        groups.set(n.groupIndex, g);
      }
      g.xs.push(n.x);
      g.ys.push(n.y);
    }

    const lines: string[] = [];
    const sorted = Array.from(groups.entries()).sort((a, b) => a[0] - b[0]);
    for (const [idx, g] of sorted) {
      const avgX = Math.round(g.xs.reduce((s, v) => s + v, 0) / g.xs.length);
      const avgY = Math.round(g.ys.reduce((s, v) => s + v, 0) / g.ys.length);
      lines.push(`${idx}: ${avgX}  ${avgY}   // ${g.cat}`);
      targetsRef.current.set(idx, [avgX, avgY]);
    }

    // unfix all nodes so simulation re-settles around new targets
    for (const n of nodes) {
      n.fx = null;
      n.fy = null;
    }
    simRef.current?.alphaTarget(REHEAT_ALPHA).restart();

    const output = `TARGETS (saved):\n${lines.join("\n")}\n---\n[${sorted.map(([i, g]) => {
      const x = Math.round(g.xs.reduce((s, v) => s + v, 0) / g.xs.length);
      const y = Math.round(g.ys.reduce((s, v) => s + v, 0) / g.ys.length);
      return `[${x}, ${y}]`;
    }).join(", ")}]`;

    console.log(output);

    const ta = document.getElementById("sg-save-output") as HTMLTextAreaElement | null;
    if (ta) {
      ta.value = output;
      ta.style.display = "block";
    }
  }, []);

  const buildSimulation = useCallback(() => {
    const container = containerRef.current;
    const svgEl = svgRef.current;
    if (!container || !svgEl) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    svgEl.innerHTML = "";
    svgEl.setAttribute("viewBox", `0 0 ${width} ${height}`);

    const merged = getSkillCategories();
    const categories = Array.from(merged.keys());

    const nodes: SimNode[] = [];
    const links: SimLink[] = [];

    categories.forEach((category, ci) => {
      const skills = merged.get(category)!;
      const entries = Object.entries(skills).sort((a, b) => b[1] - a[1]);

      const groupNodes: SimNode[] = [];
      entries.forEach(([name, rating]) => {
        const node: SimNode = {
          id: `${category}:${name}`,
          name,
          rating,
          category,
          groupIndex: ci,
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

    saveNodesRef.current = nodes;

    const simulation = forceSimulation<SimNode>(nodes)
      .force(
        "link",
        forceLink<SimNode, SimLink>(links)
          .id((d) => d.id)
          .distance(LINK_DISTANCE)
      )
      .force("charge", forceManyBody().strength(CHARGE_STRENGTH))
      .force("collide", forceCollide<SimNode>().radius(d => radiusScale(d.rating) + COLLIDE_PADDING))
      .force("x", forceX<SimNode>(width / 2).strength(CENTER_FORCE_STRENGTH/2.5))
      .force("y", forceY<SimNode>(height / 2).strength(CENTER_FORCE_STRENGTH))
      .alphaDecay(ALPHA_DECAY)
      .alphaMin(ALPHA_MIN);

    simRef.current = simulation;

    const ns = "http://www.w3.org/2000/svg";

    // glow filters per category
    const defs = document.createElementNS(ns, "defs");
    categories.forEach((cat, i) => {
      const base = CAT_COLOR_MAP[cat] || "rgba(167,139,250,0.4)";
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
    svgEl.appendChild(defs);

    // layers
    const hullLayer = document.createElementNS(ns, "g");
    const linkLayer = document.createElementNS(ns, "g");
    const nodeLayer = document.createElementNS(ns, "g");
    const labelLayer = document.createElementNS(ns, "g");
    svgEl.appendChild(hullLayer);
    svgEl.appendChild(linkLayer);
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

        const cat = groupNodes[0].category;
        const baseColor = CAT_COLOR_MAP[cat] || "rgba(167,139,250,0.25)";
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
      const rect = svgRect();
      const scaleX = width / rect.width;
      const scaleY = height / rect.height;
      const px = (e.clientX - rect.left) * scaleX;
      const py = (e.clientY - rect.top) * scaleY;

      const hit = findNode(px, py);
      if (!hit) return;

      e.preventDefault();
      dragNode = hit;
      // fix the node at its current position
      hit.fx = hit.x;
      hit.fy = hit.y;
      if (svgRef.current) svgRef.current.style.cursor = "grabbing";
      simulation.alphaTarget(REHEAT_ALPHA).restart();
    }

    function onPointerMove(e: PointerEvent) {
      if (!dragNode) {
        const rect = svgRect();
        const scaleX = width / rect.width;
        const scaleY = height / rect.height;
        const px = (e.clientX - rect.left) * scaleX;
        const py = (e.clientY - rect.top) * scaleY;
        const hit = findNode(px, py);
        if (svgRef.current) svgRef.current.style.cursor = hit ? "grab" : "default";
        return;
      }

      const rect = svgRect();
      const scaleX = width / rect.width;
      const scaleY = height / rect.height;
      const px = (e.clientX - rect.left) * scaleX;
      const py = (e.clientY - rect.top) * scaleY;

      dragNode.fx = px;
      dragNode.fy = py;
    }

    function onPointerUp(_e: PointerEvent) {
      if (!dragNode) return;
      dragNode.fx = null;
      dragNode.fy = null;
      dragNode = null;
      if (svgRef.current) svgRef.current.style.cursor = "default";
      simulation.alphaTarget(0);
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

    // debug coordinate display
    const onDebugMove = (e: PointerEvent) => {
      const dbg = document.getElementById("sg-debug-coords");
      if (!dbg) return;
      const rect = svgEl.getBoundingClientRect();
      const scaleX = width / rect.width;
      const scaleY = height / rect.height;
      const px = Math.round((e.clientX - rect.left) * scaleX);
      const py = Math.round((e.clientY - rect.top) * scaleY);
      dbg.textContent = `x: ${px} \u00a0 y: ${py}`;
    };
    svgEl.addEventListener("pointermove", onDebugMove);

    // ── resize ──────────────────────────────────────────────────────────
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      width = w;
      height = h;
      svgEl.setAttribute("viewBox", `0 0 ${w} ${h}`);

      simulation
        .force("x", forceX<SimNode>(w / 2).strength(CENTER_FORCE_STRENGTH))
        .force("y", forceY<SimNode>(h / 2).strength(CENTER_FORCE_STRENGTH))
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
      svgEl.removeEventListener("pointermove", onDebugMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

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
          className="mb-2 text-center text-3xl font-bold md:text-4xl"
          style={{ color: "rgba(239,68,68,1)", textShadow: "0 0 20px rgba(239,68,68,0.35)" }}
        >
          Skills &amp; Expertise
        </h2>
        <p
          className="mb-10 text-center text-sm md:text-base"
          style={{ color: "rgba(213,220,232,0.6)" }}
        >
          Jede Blase ist eine Technologie &mdash; je gr&ouml;sser, desto mehr Erfahrung.
          Ziehe Knoten mit der Maus umher.
        </p>
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
        <div
          id="sg-debug-coords"
          className="pointer-events-none absolute right-2 top-2 rounded bg-black/70 px-2 py-1 font-mono text-xs text-lime-400"
          style={{ zIndex: 50 }}
        >
          x: — &nbsp; y: —
        </div>
        <button
          onClick={handleSave}
          className="absolute left-2 top-2 z-50 rounded bg-purple-700/80 px-3 py-1 font-mono text-xs text-white transition hover:bg-purple-600"
        >
          Save
        </button>
        <textarea
          id="sg-save-output"
          className="absolute bottom-2 left-2 z-50 hidden w-72 rounded bg-black/85 p-2 font-mono text-[10px] leading-tight text-lime-400"
          rows={12}
          readOnly
          onClick={(e) => (e.target as HTMLTextAreaElement).select()}
        />
      </div>
    </section>
  );
}
