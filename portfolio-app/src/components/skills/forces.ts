import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY } from "d3-force";
import type { Simulation } from "d3-force";
import { radiusScale } from "./data";
import type { Point, SimLink, SimNode, Size } from "./types";

// ══════════════════════════════════════════════════════════════════════════════
//  FORCE SIMULATION — dynamic scaling based on visible node count
// ══════════════════════════════════════════════════════════════════════════════

const LINK_DISTANCE = 50; // target length of link edges

// —— anchor points for force interpolation (nodeCount → force values) ——
const MAX_NODES = 60;
const MIN_NODES = 6;

// values at max nodes (all ratings — known perfect)
const CHARGE_AT_MAX = -105;
const CENTER_Y_AT_MAX = 0.06;

// values at 6 nodes (rating 1 only — ADJUST THESE UNTIL LAYOUT LOOKS GOOD)
const CHARGE_AT_MIN = -250;
const CENTER_Y_AT_MIN = 0.045;

const ALPHA_DECAY = 0.01; // cooling rate per tick (higher = faster settle)
const ALPHA_MIN = 0.000000001; // simulation stops when alpha drops below this
const COLLIDE_PADDING = 10; // extra px between node edges for forceCollide
export const REHEAT_ALPHA = 0.2; // alpha / alphaTarget when re-energizing (drag, resize, etc.)

const CHAIN_MIN_ANGLE_DEG = 27; // minimum angle (degrees) between consecutive chain links
const CHAIN_ANGLE_FORCE = 30; // strength of the angle-enforcing force

// ——  boundary (keeps nodes inside the container)  ————————————————————————————
const BOUNDARY_MARGIN = 20; // px margin from container edges
const BOUNDARY_PUSH_FACTOR = 0.3; // push strength when a node crosses the boundary

// ——  mouse repulsion (left-click + drag on empty canvas pushes nodes away)  ——
export const MOUSE_FORCE_RADIUS = 160; // px range of the repulsion field
const MOUSE_FORCE_STRENGTH = 20; // max push strength at the cursor centre

export interface ForceScaling {
  charge: number;
  centerX: number;
  centerY: number;
}

// Linear interpolation of the force strengths between the min and max node count.
export function forceScaling(nodeCount: number): ForceScaling {
  const t = Math.max(0, Math.min(1, (nodeCount - MIN_NODES) / (MAX_NODES - MIN_NODES)));
  const charge = CHARGE_AT_MIN + (CHARGE_AT_MAX - CHARGE_AT_MIN) * t;
  const centerY = CENTER_Y_AT_MIN + (CENTER_Y_AT_MAX - CENTER_Y_AT_MIN) * t;
  return { charge, centerX: centerY / 2.5, centerY };
}

export function createSimulation(
  nodes: SimNode[],
  links: SimLink[],
  size: Size,
  scaling: ForceScaling,
): Simulation<SimNode, SimLink> {
  return forceSimulation<SimNode>(nodes)
    .force(
      "link",
      forceLink<SimNode, SimLink>(links)
        .id((d) => d.id)
        .distance(LINK_DISTANCE),
    )
    .force("charge", forceManyBody().strength(scaling.charge))
    .force(
      "collide",
      forceCollide<SimNode>().radius((d) => radiusScale(d.rating) + COLLIDE_PADDING),
    )
    .force("x", forceX<SimNode>(size.width / 2).strength(scaling.centerX))
    .force("y", forceY<SimNode>(size.height / 2).strength(scaling.centerY))
    .force("chainAngle", createChainAngleForce(links, CHAIN_MIN_ANGLE_DEG, CHAIN_ANGLE_FORCE))
    .alphaDecay(ALPHA_DECAY)
    .alphaMin(ALPHA_MIN);
}

// After a resize: centre the simulation on the new size and reheat it.
export function recenterSimulation(
  simulation: Simulation<SimNode, SimLink>,
  size: Size,
  scaling: ForceScaling,
): void {
  simulation
    .force("x", forceX<SimNode>(size.width / 2).strength(scaling.centerX))
    .force("y", forceY<SimNode>(size.height / 2).strength(scaling.centerY))
    .alpha(REHEAT_ALPHA)
    .restart();
}

// ══════════════════════════════════════════════════════════════════════════════
//  CHAIN ANGLE FORCE  (prevents collinear chain links)
// ══════════════════════════════════════════════════════════════════════════════

function chainNeighbours(node: SimNode, links: SimLink[]): SimNode[] {
  const neighbours: SimNode[] = [];
  for (const link of links) {
    if (!link.chain) continue;
    const s = link.source as SimNode;
    const t = link.target as SimNode;
    if (s === node) neighbours.push(t);
    else if (t === node) neighbours.push(s);
  }
  return neighbours;
}

// The push on the middle node b of the chain a–b–c when the angle at b is too flat:
// perpendicular to a–c, away from the line, scaled by how far the angle is off. Null
// when the angle is fine or the points are too close to tell.
function flatAnglePush(a: Point, b: Point, c: Point, minCos: number): Point | null {
  const ux = a.x - b.x;
  const uy = a.y - b.y;
  const vx = c.x - b.x;
  const vy = c.y - b.y;
  const uLen = Math.sqrt(ux * ux + uy * uy);
  const vLen = Math.sqrt(vx * vx + vy * vy);
  if (uLen < 0.5 || vLen < 0.5) return null;

  const cosAngle = (ux * vx + uy * vy) / (uLen * vLen);
  if (Math.abs(cosAngle) <= minCos) return null;

  const acx = c.x - a.x;
  const acy = c.y - a.y;
  const acLen = Math.sqrt(acx * acx + acy * acy);
  if (acLen < 0.5) return null;

  const perpX = -acy / acLen;
  const perpY = acx / acLen;
  const cross = acx * (b.y - a.y) - acy * (b.x - a.x);
  const sign = cross > 0 ? 1 : -1;
  const severity = Math.abs(cosAngle) - minCos;

  return { x: perpX * sign * severity, y: perpY * sign * severity };
}

function position(node: SimNode): Point {
  return { x: node.x ?? 0, y: node.y ?? 0 };
}

export function createChainAngleForce(links: SimLink[], minAngleDeg: number, strength: number) {
  let nodes: SimNode[] = [];
  const minCos = Math.cos((minAngleDeg * Math.PI) / 180);

  function force(alpha: number) {
    for (const node of nodes) {
      const neighbours = chainNeighbours(node, links);
      if (neighbours.length !== 2) continue;

      const push = flatAnglePush(
        position(neighbours[0]),
        position(node),
        position(neighbours[1]),
        minCos,
      );
      if (!push) continue;

      const f = alpha * strength;
      node.vx = (node.vx ?? 0) + push.x * f;
      node.vy = (node.vy ?? 0) + push.y * f;
    }
  }

  force.initialize = function (n: SimNode[]) {
    nodes = n;
  };

  return force;
}

// ══════════════════════════════════════════════════════════════════════════════
//  PER-TICK FORCES applied outside the d3 force registry
// ══════════════════════════════════════════════════════════════════════════════

// Soft boundary: push a node back inside the margin.
export function applyBoundary(n: SimNode, r: number, size: Size): void {
  const margin = BOUNDARY_MARGIN;
  if (n.x !== undefined && n.x < margin + r)
    n.vx = (n.vx ?? 0) + (margin + r - n.x) * BOUNDARY_PUSH_FACTOR;
  if (n.x !== undefined && n.x > size.width - margin - r)
    n.vx = (n.vx ?? 0) - (n.x - (size.width - margin - r)) * BOUNDARY_PUSH_FACTOR;
  if (n.y !== undefined && n.y < margin + r)
    n.vy = (n.vy ?? 0) + (margin + r - n.y) * BOUNDARY_PUSH_FACTOR;
  if (n.y !== undefined && n.y > size.height - margin - r)
    n.vy = (n.vy ?? 0) - (n.y - (size.height - margin - r)) * BOUNDARY_PUSH_FACTOR;
}

// Push every node within the radius away from the cursor.
export function applyMouseRepulsion(nodes: SimNode[], origin: Point): void {
  const R2 = MOUSE_FORCE_RADIUS * MOUSE_FORCE_RADIUS;
  for (const n of nodes) {
    const dx = (n.x ?? 0) - origin.x;
    const dy = (n.y ?? 0) - origin.y;
    const dist2 = dx * dx + dy * dy;
    if (dist2 < 1e-6 || dist2 >= R2) continue;
    const dist = Math.sqrt(dist2);
    const force = MOUSE_FORCE_STRENGTH * (1 - dist / MOUSE_FORCE_RADIUS);
    n.vx = (n.vx ?? 0) + (dx / dist) * force;
    n.vy = (n.vy ?? 0) + (dy / dist) * force;
  }
}
