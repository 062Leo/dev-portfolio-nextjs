import { alpha, tokenAlpha } from "@/lib/theme";
import { categoryColorAlpha, labelFontSize, radiusScale, ratingColor } from "./data";
import { MOUSE_FORCE_RADIUS } from "./forces";
import {
  HULL_CURVE_TENSION,
  HULL_ENABLED,
  HULL_FILL_OPACITY,
  HULL_MIN_NODES,
  HULL_STROKE_OPACITY,
  HULL_STROKE_WIDTH,
  catmullRomClosedPath,
  computeGroupHull,
  groupCentroid,
  nearestHullPoint,
} from "./hull";
import { LABEL_FONT_FAMILY, LABEL_LINE_COLOR, LABEL_LINE_WIDTH, connectorStart } from "./labels";
import type { LabelPlacement } from "./labels";
import { PT_EDGE_MARGIN, PT_H } from "./pricetags";
import type { Point, SimLink, SimNode } from "./types";

// The SVG layer: creates the elements once per build and moves them on every tick.
// Token colours are CSS values (var / color-mix), which SVG only resolves in styles, not
// in presentation attributes, hence `style.fill` and `style.stroke`.

const NS = "http://www.w3.org/2000/svg";

// --  node sizing & styling  --------------------------------------------------
export const NODE_STROKE_COLOR = alpha("white", 20); // normal circle stroke
export const NODE_STROKE_WIDTH = 1; // normal stroke width (px)
export const NODE_HOVER_SCALE = 1.5; // radius multiplier on pointer enter
export const NODE_HOVER_STROKE_COLOR = alpha("white", 80); // stroke color on hover
export const NODE_HOVER_STROKE_WIDTH = 2.5; // stroke width on hover (px)
export const NODE_DRAG_HIT_PADDING = 4; // extra px around node for drag hit-test
const NODE_TRANSITION = "r 0.25s ease, stroke-width 0.25s ease, stroke 0.25s ease";

// --  link styles  ------------------------------------------------------------
const LINK_STROKE_COLOR = tokenAlpha("text", 57); // connection line color
const LINK_STROKE_WIDTH = 1; // connection line stroke width (px)

// --  mouse ripple (repulsion field visual)  ----------------------------------
const MOUSE_RIPPLE_COLOR = tokenAlpha("accent", 69); // glow colour at the ripple centre
const MOUSE_RIPPLE_COLOR_MID = tokenAlpha("accent", 15); // glow colour at 60 % radius
const MOUSE_RIPPLE_COLOR_EDGE = tokenAlpha("accent", 0); // glow colour at the edge
const MOUSE_RIPPLE_RING_COLOR = tokenAlpha("accent", 45); // stroke of the expanding rings
const RIPPLE_MAX_R = MOUSE_FORCE_RADIUS * 0.6;

// --  glow filter (per category)  ---------------------------------------------
const GLOW_BLUR_STDDEV = 3; // gaussian blur standard deviation
const GLOW_FLOOD_ALPHA = 0.8; // alpha of the flood colour (replaces category alpha)
const GLOW_FLOOD_OPACITY = 0.5; // flood-opacity filter attribute

export interface Layers {
  hull: SVGGElement;
  link: SVGGElement;
  node: SVGGElement;
  pricetag: SVGGElement;
  label: SVGGElement;
  rippleGlow: SVGCircleElement;
  rippleRings: SVGGElement;
}

export interface NodeElements {
  circle: SVGCircleElement;
  text: SVGTextElement; // the label
  line: SVGLineElement; // the connector from the node edge to the label
}

function create<K extends keyof SVGElementTagNameMap>(tag: K): SVGElementTagNameMap[K] {
  return document.createElementNS(NS, tag);
}

// ══════════════════════════════════════════════════════════════════════════════
//  SCAFFOLD (once per build)
// ══════════════════════════════════════════════════════════════════════════════

function createDefs(categoryCount: number): SVGDefsElement {
  const defs = create("defs");
  for (let i = 0; i < categoryCount; i++) {
    const filter = create("filter");
    filter.setAttribute("id", `sg-glow-${i}`);
    filter.setAttribute("x", "-50%");
    filter.setAttribute("y", "-50%");
    filter.setAttribute("width", "200%");
    filter.setAttribute("height", "200%");
    filter.innerHTML = [
      `<feGaussianBlur stdDeviation="${GLOW_BLUR_STDDEV}" result="blur"/>`,
      `<feFlood flood-color="${categoryColorAlpha(i, GLOW_FLOOD_ALPHA)}" flood-opacity="${GLOW_FLOOD_OPACITY}" result="color"/>`,
      `<feComposite in="color" in2="blur" operator="in" result="glow"/>`,
      `<feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>`,
    ].join("");
    defs.appendChild(filter);
  }

  const rippleGrad = create("radialGradient");
  rippleGrad.setAttribute("id", "sg-mouse-ripple-grad");
  rippleGrad.setAttribute("cx", "50%");
  rippleGrad.setAttribute("cy", "50%");
  rippleGrad.setAttribute("r", "50%");
  rippleGrad.innerHTML = [
    `<stop offset="0%"   style="stop-color: ${MOUSE_RIPPLE_COLOR}"/>`,
    `<stop offset="60%"  style="stop-color: ${MOUSE_RIPPLE_COLOR_MID}"/>`,
    `<stop offset="100%" style="stop-color: ${MOUSE_RIPPLE_COLOR_EDGE}"/>`,
  ].join("");
  defs.appendChild(rippleGrad);
  return defs;
}

function createRippleStyle(): SVGStyleElement {
  const style = create("style");
  style.textContent = `
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
        stroke: ${MOUSE_RIPPLE_RING_COLOR};
        animation: sg-ripple-ring 1.5s cubic-bezier(0, 0.2, 0.8, 1) infinite;
      }
      .sg-ripple-ring:nth-child(1) { animation-delay: 0s; }
      .sg-ripple-ring:nth-child(2) { animation-delay: -0.5s; }
      .sg-ripple-ring:nth-child(3) { animation-delay: -1s; }
    `;
  return style;
}

// A subtle glow plus three expanding rings, hidden until the repulsion field is active.
function createRippleVisuals(): { glow: SVGCircleElement; rings: SVGGElement } {
  const glow = create("circle");
  glow.setAttribute("r", String(MOUSE_FORCE_RADIUS * 0.3));
  glow.setAttribute("fill", "url(#sg-mouse-ripple-grad)");
  glow.setAttribute("pointer-events", "none");
  glow.style.animation = "sg-ripple-glow 1.2s ease-in-out infinite";
  glow.style.display = "none";

  const rings = create("g");
  rings.setAttribute("pointer-events", "none");
  rings.style.display = "none";
  for (let i = 0; i < 3; i++) {
    const ring = create("circle");
    ring.setAttribute("cx", "0");
    ring.setAttribute("cy", "0");
    ring.classList.add("sg-ripple-ring");
    rings.appendChild(ring);
  }
  return { glow, rings };
}

// Defs, ripple keyframes and the layers in drawing order.
export function createSvgScaffold(svg: SVGSVGElement, categoryCount: number): Layers {
  svg.appendChild(createDefs(categoryCount));
  svg.appendChild(createRippleStyle());

  const ripple = createRippleVisuals();
  const layers: Layers = {
    hull: create("g"),
    link: create("g"),
    node: create("g"),
    pricetag: create("g"),
    label: create("g"),
    rippleGlow: ripple.glow,
    rippleRings: ripple.rings,
  };

  svg.appendChild(layers.hull);
  svg.appendChild(layers.link);
  svg.appendChild(layers.rippleGlow);
  svg.appendChild(layers.rippleRings);
  svg.appendChild(layers.node);
  svg.appendChild(layers.pricetag);
  svg.appendChild(layers.label);
  return layers;
}

export function createLinkElements(layer: SVGGElement, count: number): SVGLineElement[] {
  const els: SVGLineElement[] = [];
  for (let i = 0; i < count; i++) {
    const line = create("line");
    line.style.stroke = LINK_STROKE_COLOR;
    line.setAttribute("stroke-width", String(LINK_STROKE_WIDTH));
    layer.appendChild(line);
    els.push(line);
  }
  return els;
}

// One circle, one label and one connector line per node.
export function createNodeElements(layers: Layers, n: SimNode): NodeElements {
  const r = radiusScale(n.rating);
  const fs = labelFontSize(n.rating);

  const circle = create("circle");
  circle.setAttribute("r", String(r));
  circle.style.fill = ratingColor(n.rating);
  circle.style.stroke = NODE_STROKE_COLOR;
  circle.setAttribute("stroke-width", String(NODE_STROKE_WIDTH));
  circle.setAttribute("filter", `url(#sg-glow-${n.groupIndex})`);
  circle.style.cursor = "grab";
  circle.style.transition = NODE_TRANSITION;

  const line = create("line");
  line.style.stroke = LABEL_LINE_COLOR;
  line.setAttribute("stroke-width", String(LABEL_LINE_WIDTH));
  line.setAttribute("pointer-events", "none");
  layers.label.appendChild(line);

  const text = create("text");
  text.textContent = n.name;
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("dominant-baseline", "middle");
  text.style.fill = ratingColor(n.rating);
  text.setAttribute("font-size", String(fs));
  text.setAttribute("font-family", LABEL_FONT_FAMILY);
  text.setAttribute("pointer-events", "none");
  text.style.transition = "fill 0.25s ease";
  layers.label.appendChild(text);

  layers.node.appendChild(circle);
  return { circle, text, line };
}

// One hull path per group that has enough nodes; sparse array indexed by group.
export function createHullPaths(
  layer: SVGGElement,
  groupIndices: number[],
  nodes: SimNode[],
): SVGPathElement[] {
  const hullPaths: SVGPathElement[] = [];
  if (!HULL_ENABLED) return hullPaths;

  for (const gi of groupIndices) {
    if (nodes.filter((n) => n.groupIndex === gi).length < HULL_MIN_NODES) continue;
    const path = create("path");
    path.setAttribute("fill", categoryColorAlpha(gi, HULL_FILL_OPACITY));
    path.setAttribute("stroke", categoryColorAlpha(gi, HULL_STROKE_OPACITY));
    path.setAttribute("stroke-width", String(HULL_STROKE_WIDTH));
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("pointer-events", "none");
    layer.appendChild(path);
    hullPaths[gi] = path;
  }
  return hullPaths;
}

// ══════════════════════════════════════════════════════════════════════════════
//  TICK UPDATES
// ══════════════════════════════════════════════════════════════════════════════

export function updateLinkPositions(links: SimLink[], els: SVGLineElement[]): void {
  for (let i = 0; i < links.length; i++) {
    const s = links[i].source as SimNode;
    const t = links[i].target as SimNode;
    els[i].setAttribute("x1", String(s.x ?? 0));
    els[i].setAttribute("y1", String(s.y ?? 0));
    els[i].setAttribute("x2", String(t.x ?? 0));
    els[i].setAttribute("y2", String(t.y ?? 0));
  }
}

export function updateNodePositions(nodes: SimNode[], els: NodeElements[]): void {
  for (let i = 0; i < nodes.length; i++) {
    els[i].circle.setAttribute("cx", String(nodes[i].x ?? 0));
    els[i].circle.setAttribute("cy", String(nodes[i].y ?? 0));
  }
}

export function applyLabelPlacements(
  nodes: SimNode[],
  placements: LabelPlacement[],
  els: NodeElements[],
): void {
  for (let i = 0; i < nodes.length; i++) {
    const p = placements[i];
    els[i].text.setAttribute("x", String(p.ax + p.ox));
    els[i].text.setAttribute("y", String(p.ay + p.oy));
    els[i].text.setAttribute("text-anchor", p.ta);
    els[i].text.setAttribute("dominant-baseline", p.bl);

    const start = connectorStart(nodes[i], p.dir);
    els[i].line.setAttribute("x1", String(start.x));
    els[i].line.setAttribute("y1", String(start.y));
    els[i].line.setAttribute("x2", String(p.ax));
    els[i].line.setAttribute("y2", String(p.ay));
  }
}

export function updateRipple(
  layers: Layers,
  pointer: { mouseIsDown: boolean; mouse: Point },
): void {
  if (!pointer.mouseIsDown) {
    layers.rippleGlow.style.display = "none";
    layers.rippleRings.style.display = "none";
    return;
  }
  const tx = String(pointer.mouse.x);
  const ty = String(pointer.mouse.y);
  layers.rippleGlow.style.display = "";
  layers.rippleGlow.setAttribute("cx", tx);
  layers.rippleGlow.setAttribute("cy", ty);
  layers.rippleRings.setAttribute("transform", `translate(${tx},${ty})`);
  layers.rippleRings.style.display = "";
}

export interface HullUpdate {
  hullPaths: SVGPathElement[];
  groupIndices: number[];
  nodes: SimNode[];
  hidden: Set<number>;
  height: number;
}

// Redraw the hull of one group; returns the hull point where its rope docks, or null
// when the group has no hull right now.
function updateHullPath(path: SVGPathElement, groupNodes: SimNode[], height: number): Point | null {
  if (groupNodes.length < HULL_MIN_NODES) {
    path.setAttribute("d", "");
    return null;
  }
  const c = groupCentroid(groupNodes);
  const hullPts = computeGroupHull(groupNodes, c.x, c.y);
  if (hullPts.length < 3) {
    path.setAttribute("d", "");
    return null;
  }
  path.setAttribute("d", catmullRomClosedPath(hullPts, HULL_CURVE_TENSION));

  // The rope docks at the hull point closest to the pricetag anchor on the near edge.
  const anchorY = c.y < height / 2 ? PT_EDGE_MARGIN + PT_H / 2 : height - PT_EDGE_MARGIN - PT_H / 2;
  return nearestHullPoint(hullPts, { x: c.x, y: anchorY }, c);
}

// Redraw every hull; the result maps a group to the start point of its rope.
export function updateHullPaths(u: HullUpdate): Map<number, Point> {
  const ropeStartMap = new Map<number, Point>();
  if (!HULL_ENABLED) return ropeStartMap;

  for (const gi of u.groupIndices) {
    const path = u.hullPaths[gi];
    if (!path) continue;
    if (u.hidden.has(gi)) {
      path.setAttribute("d", "");
      continue;
    }
    const groupNodes = u.nodes.filter((n) => n.groupIndex === gi);
    const start = updateHullPath(path, groupNodes, u.height);
    if (start) ropeStartMap.set(gi, start);
  }
  return ropeStartMap;
}

export interface VisibilityUpdate {
  nodes: SimNode[];
  links: SimLink[];
  nodeEls: NodeElements[];
  linkEls: SVGLineElement[];
  hullPaths: SVGPathElement[];
  allGroupIndices: number[];
  hidden: Set<number>;
}

// Hidden groups keep their elements but at opacity 0.
export function applyGroupVisibility(v: VisibilityUpdate): void {
  for (let i = 0; i < v.nodes.length; i++) {
    const val = v.hidden.has(v.nodes[i].groupIndex) ? "0" : "";
    v.nodeEls[i].circle.style.opacity = val;
    v.nodeEls[i].text.style.opacity = val;
    v.nodeEls[i].line.style.opacity = val;
  }
  for (const gi of v.allGroupIndices) {
    const path = v.hullPaths[gi];
    if (path) path.style.opacity = v.hidden.has(gi) ? "0" : "";
  }
  for (let i = 0; i < v.links.length; i++) {
    const s = v.links[i].source as SimNode;
    v.linkEls[i].style.opacity = v.hidden.has(s.groupIndex) ? "0" : "";
  }
}
