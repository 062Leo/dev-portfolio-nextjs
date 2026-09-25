import { getSkillCategories } from "./data";
import type { Point, RopeTarget, SimLink, SimNode, Size, SkillsFlat } from "./types";

// ══════════════════════════════════════════════════════════════════════════════
//  GRAPH TOPOLOGY (intra-group connections)
// ══════════════════════════════════════════════════════════════════════════════

const GROUP_EXTRA_LINK_START_OFFSET = 1; // skip N neighbours before additional links start
const GROUP_EXTRA_LINK_MAX_LOOKAHEAD = 4; // how many nodes ahead are eligible as extra targets
const GROUP_EXTRA_LINK_MAX = 6; // absolute max extra connections per node (1‑4)
const MAX_DEGREE_HIGH = 5; // max total degree for the high-count node
const MAX_DEGREE_NORMAL = 5; // max total degree for all other nodes
const INITIAL_SPREAD = 200; // px — new nodes start scattered around the centre

// Off-screen position of the nodes of a toggled-off group.
const PARKED = -9999;

export interface Graph {
  nodes: SimNode[];
  links: SimLink[];
  categories: string[];
}

function groupNodesFor(
  category: { name: string; index: number },
  skills: Record<string, number>,
  allowedRatings: Set<number> | null,
  size: Size,
): SimNode[] {
  const entries = Object.entries(skills).sort(() => Math.random() - 0.5);
  const groupNodes: SimNode[] = [];
  for (const [name, rating] of entries) {
    if (allowedRatings && !allowedRatings.has(rating)) continue;
    groupNodes.push({
      id: `${category.name}:${name}`,
      name,
      rating,
      category: category.name,
      groupIndex: category.index,
      x: size.width / 2 + (Math.random() - 0.5) * INITIAL_SPREAD,
      y: size.height / 2 + (Math.random() - 0.5) * INITIAL_SPREAD,
    });
  }
  return groupNodes;
}

// The candidate targets of an extra link from node i: the next few chain neighbours
// forward, then the ones backward.
function extraLinkPool(i: number, count: number): number[] {
  const pool: number[] = [];
  const first = i + GROUP_EXTRA_LINK_START_OFFSET;
  for (let j = first; j < Math.min(first + GROUP_EXTRA_LINK_MAX_LOOKAHEAD, count); j++) {
    pool.push(j);
  }
  const last = i - GROUP_EXTRA_LINK_START_OFFSET;
  for (let j = last; j >= Math.max(last - GROUP_EXTRA_LINK_MAX_LOOKAHEAD + 1, 0); j--) {
    pool.push(j);
  }
  return pool;
}

function shuffle<T>(items: T[]): void {
  for (let k = items.length - 1; k > 0; k--) {
    const r = Math.floor(Math.random() * (k + 1));
    [items[k], items[r]] = [items[r], items[k]];
  }
}

// Middle nodes of the chain (degree 2) whose pool still has a target below the cap.
function eligibleMiddleNodes(degree: number[]): number[] {
  const eligible: number[] = [];
  for (let i = 0; i < degree.length; i++) {
    if (degree[i] !== 2) continue;
    const reachable = extraLinkPool(i, degree.length).some((j) => degree[j] < MAX_DEGREE_NORMAL);
    if (reachable) eligible.push(i);
  }
  return eligible;
}

// Exactly one middle node of the group gets extra links (3‑4 total, guaranteed), added
// one by one from its shuffled pool while the degree caps allow it.
function addExtraLinks(groupNodes: SimNode[], degree: number[], links: SimLink[]): void {
  const eligible = eligibleMiddleNodes(degree);
  if (eligible.length === 0) return;
  const i = eligible[Math.floor(Math.random() * eligible.length)];

  const pool = extraLinkPool(i, groupNodes.length);
  shuffle(pool);

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

// Chain links through the group in order, plus the extra links of one middle node.
function linkGroup(groupNodes: SimNode[], links: SimLink[]): void {
  const degree = new Array<number>(groupNodes.length).fill(0);
  for (let i = 0; i < groupNodes.length - 1; i++) {
    links.push({ source: groupNodes[i].id, target: groupNodes[i + 1].id, chain: true });
    degree[i]++;
    degree[i + 1]++;
  }
  addExtraLinks(groupNodes, degree, links);
}

// Nodes and links for the skills that pass the rating filter (null = every rating).
export function buildGraph(
  data: SkillsFlat,
  allowedRatings: Set<number> | null,
  size: Size,
): Graph {
  const merged = getSkillCategories(data);
  const categories = Array.from(merged.keys());
  const nodes: SimNode[] = [];
  const links: SimLink[] = [];

  categories.forEach((name, index) => {
    const groupNodes = groupNodesFor({ name, index }, merged.get(name)!, allowedRatings, size);
    nodes.push(...groupNodes);
    linkGroup(groupNodes, links);
  });

  return { nodes, links, categories };
}

// ══════════════════════════════════════════════════════════════════════════════
//  GROUP VISIBILITY (a pricetag toggles its group off and on)
// ══════════════════════════════════════════════════════════════════════════════

export interface GroupState {
  nodes: SimNode[];
  hidden: Set<number>;
  positions: Map<number, Point[]>; // where the nodes of a hidden group were
  ropeTargets: Map<number, RopeTarget>;
}

// Fix the nodes off screen and return where they were.
function park(groupNodes: SimNode[]): Point[] {
  const stored = groupNodes.map((n) => ({ x: n.x ?? 0, y: n.y ?? 0 }));
  groupNodes.forEach((n) => {
    n.fx = PARKED;
    n.fy = PARKED;
    n.x = PARKED;
    n.y = PARKED;
  });
  return stored;
}

export function toggleGroup(gi: number, state: GroupState): void {
  const groupNodes = state.nodes.filter((n) => n.groupIndex === gi);
  if (state.hidden.has(gi)) {
    state.hidden.delete(gi);
    const stored = state.positions.get(gi);
    if (stored) {
      groupNodes.forEach((n, i) => {
        if (i < stored.length) {
          n.x = stored[i].x;
          n.y = stored[i].y;
          n.fx = null;
          n.fy = null;
        }
      });
      state.positions.delete(gi);
    }
  } else {
    state.hidden.add(gi);
    state.positions.set(gi, park(groupNodes));
    const rt = state.ropeTargets.get(gi);
    if (rt) {
      rt.start.x = 0;
      rt.start.y = 0;
      rt.end.x = 0;
      rt.end.y = 0;
    }
  }
}

// After a rebuild the groups that were hidden before start parked.
export function parkHiddenGroups(state: GroupState): void {
  for (const gi of state.hidden) {
    const groupNodes = state.nodes.filter((n) => n.groupIndex === gi);
    if (groupNodes.length > 0) state.positions.set(gi, park(groupNodes));
  }
}
