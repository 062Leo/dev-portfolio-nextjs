import { describe, expect, it } from "vitest";
import {
  CATEGORIES,
  categoryColor,
  categoryColorAlpha,
  categoryRows,
  flattenSkillsData,
  labelFontSize,
  radiusScale,
  ratingColor,
  tooltipContentFor,
} from "@/components/skills/data";
import {
  applyBoundary,
  applyMouseRepulsion,
  createChainAngleForce,
  forceScaling,
} from "@/components/skills/forces";
import { buildGraph, parkHiddenGroups, toggleGroup } from "@/components/skills/graph";
import type { GroupState } from "@/components/skills/graph";
import {
  catmullRomClosedPath,
  computeGroupHull,
  groupCentroid,
  nearestHullPoint,
} from "@/components/skills/hull";
import { boxesOverlap, estimateTextSize, placeLabels, textBBox } from "@/components/skills/labels";
import type {
  Box,
  RopeTarget,
  SimLink,
  SimNode,
  SkillsDataNested,
} from "@/components/skills/types";
import skillsDe from "@/data/skills.json";
import skillsEn from "@/data/skills_en.json";

function node(partial: Partial<SimNode> & { x: number; y: number }): SimNode {
  return { id: "n", name: "Node", rating: 3, category: "Cat", groupIndex: 0, ...partial };
}

// Ray casting: is the point inside the closed polygon?
function insidePolygon(x: number, y: number, polygon: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const crosses = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (crosses) inside = !inside;
  }
  return inside;
}

// Distance from the point to the nearest edge of the closed polygon.
function distanceToPolygon(x: number, y: number, polygon: [number, number][]): number {
  let best = Infinity;
  for (let i = 0; i < polygon.length; i++) {
    const [ax, ay] = polygon[i];
    const [bx, by] = polygon[(i + 1) % polygon.length];
    const dx = bx - ax;
    const dy = by - ay;
    const len2 = dx * dx + dy * dy || 1;
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / len2));
    best = Math.min(best, Math.hypot(x - (ax + t * dx), y - (ay + t * dy)));
  }
  return best;
}

describe("flattenSkillsData", () => {
  it("keeps direct ratings as they are", () => {
    expect(flattenSkillsData({ Languages: { C: 2, Dart: 3 } })).toEqual({
      Languages: { C: 2, Dart: 3 },
    });
  });

  it("replaces a nested group by the rounded mean of its ratings", () => {
    expect(
      flattenSkillsData({
        Languages: { Scripting: { Python: 3, JavaScript: 3, TypeScript: 4 }, C: 2 },
      }),
    ).toEqual({ Languages: { Scripting: 3, C: 2 } });
    expect(flattenSkillsData({ Web: { React: { React: 4, "Next.js": 5 } } })).toEqual({
      Web: { React: 5 },
    });
  });

  it("drops an empty nested group but keeps the category", () => {
    expect(flattenSkillsData({ Tools: { Empty: {} } })).toEqual({ Tools: {} });
  });

  it("returns an empty object for empty input", () => {
    expect(flattenSkillsData({})).toEqual({});
  });

  it.each([
    ["skills.json", skillsDe],
    ["skills_en.json", skillsEn],
  ])("flattens %s to ratings between 1 and 5", (_name, data) => {
    const flat = flattenSkillsData(data);
    expect(Object.keys(flat)).toEqual(Object.keys(data));
    for (const skills of Object.values(flat)) {
      for (const rating of Object.values(skills)) {
        expect(Number.isInteger(rating)).toBe(true);
        expect(rating).toBeGreaterThanOrEqual(1);
        expect(rating).toBeLessThanOrEqual(5);
      }
    }
  });
});

describe("categoryRows", () => {
  it("labels a subgroup and merges consecutive direct skills into one row", () => {
    expect(
      categoryRows({ Scripting: { Python: 3, TypeScript: 4 }, "C++": 3, C: 2, Dart: 3 }),
    ).toEqual([
      {
        label: "Scripting",
        skills: [
          ["Python", 3],
          ["TypeScript", 4],
        ],
      },
      {
        label: null,
        skills: [
          ["C++", 3],
          ["C", 2],
          ["Dart", 3],
        ],
      },
    ]);
  });

  it("keeps the data order and starts a new unlabelled row after a subgroup", () => {
    expect(categoryRows({ A: 1, Group: { B: 2 }, C: 3 })).toEqual([
      { label: null, skills: [["A", 1]] },
      { label: "Group", skills: [["B", 2]] },
      { label: null, skills: [["C", 3]] },
    ]);
    expect(categoryRows({})).toEqual([]);
  });

  it.each([
    ["skills.json", skillsDe],
    ["skills_en.json", skillsEn],
  ])("lists every skill of %s exactly once", (_name, data) => {
    for (const entries of Object.values(data as SkillsDataNested)) {
      const expected = Object.values(entries).reduce<number>(
        (sum, value) => sum + (typeof value === "number" ? 1 : Object.keys(value).length),
        0,
      );
      const listed = categoryRows(entries).flatMap((row) => row.skills.map(([name]) => name));
      expect(listed).toHaveLength(expected);
      expect(new Set(listed).size).toBe(expected);
    }
  });
});

describe("tooltipContentFor", () => {
  const data = { Languages: { Scripting: { Python: 3, TypeScript: 4 }, C: 2 } };

  it("lists the sub-entries of a skill group", () => {
    expect(tooltipContentFor(data, "Languages", "Scripting")).toEqual({
      name: "Scripting",
      entries: [
        ["Python", 3],
        ["TypeScript", 4],
      ],
      direct: false,
    });
  });

  it("shows a direct skill as its own single entry", () => {
    expect(tooltipContentFor(data, "Languages", "C")).toEqual({
      name: "C",
      entries: [["C", 2]],
      direct: true,
    });
  });

  it("returns null for an unknown category or skill", () => {
    expect(tooltipContentFor(data, "Web", "React")).toBeNull();
    expect(tooltipContentFor(data, "Languages", "Rust")).toBeNull();
  });
});

describe("rating scale helpers", () => {
  const ratings = [1, 2, 3, 4, 5];

  it("grow the radius monotonically from 5 px to 15 px", () => {
    const radii = ratings.map(radiusScale);
    expect(radii[0]).toBe(5);
    expect(radii[4]).toBe(15);
    for (let i = 1; i < radii.length; i++) expect(radii[i]).toBeGreaterThan(radii[i - 1]);
  });

  it("grow the label font size monotonically from 9 px to 14 px in whole pixels", () => {
    const sizes = ratings.map(labelFontSize);
    expect(sizes[0]).toBe(9);
    expect(sizes[4]).toBe(14);
    for (let i = 1; i < sizes.length; i++) {
      expect(sizes[i]).toBeGreaterThanOrEqual(sizes[i - 1]);
      expect(Number.isInteger(sizes[i])).toBe(true);
    }
  });

  it("map a rating to its colour token and fall back to rating 1", () => {
    for (const r of ratings) expect(ratingColor(r)).toBe(`var(--color-rating-${r})`);
    expect(ratingColor(2.4)).toBe(ratingColor(2));
    expect(ratingColor(0)).toBe(ratingColor(1));
    expect(ratingColor(9)).toBe(ratingColor(1));
  });

  it("cycle the category palette and rewrite only its alpha", () => {
    expect(categoryColor(CATEGORIES.length)).toBe(categoryColor(0));
    expect(categoryColorAlpha(0, 0.7)).toBe(CATEGORIES[0].color.replace("0.25)", "0.7)"));
  });
});

describe("catmullRomClosedPath", () => {
  it("returns a closed path with one curve segment per point", () => {
    const d = catmullRomClosedPath(
      [
        [0, 0],
        [100, 0],
        [100, 100],
        [0, 100],
      ],
      0.1,
    );
    expect(d.startsWith("M0,0")).toBe(true);
    expect(d.endsWith(" Z")).toBe(true);
    expect(d.match(/ C/g)).toHaveLength(4);
  });

  it("connects fewer than three points with straight lines", () => {
    expect(
      catmullRomClosedPath(
        [
          [0, 0],
          [10, 5],
        ],
        0.1,
      ),
    ).toBe("M0,0 L10,5 Z");
  });
});

describe("computeGroupHull", () => {
  const triangle = [
    node({ x: 100, y: 0, rating: 5 }),
    node({ x: -80, y: 90, rating: 3 }),
    node({ x: -80, y: -90, rating: 1 }),
  ];

  function hullOf(nodes: SimNode[]) {
    const c = groupCentroid(nodes);
    return computeGroupHull(nodes, c.x, c.y);
  }

  it("wraps every node with a clearance of at least its radius", () => {
    const hull = hullOf(triangle);
    expect(hull.length).toBeGreaterThanOrEqual(3);
    for (const n of triangle) {
      expect(insidePolygon(n.x!, n.y!, hull), `node at ${n.x},${n.y}`).toBe(true);
      expect(distanceToPolygon(n.x!, n.y!, hull)).toBeGreaterThanOrEqual(radiusScale(n.rating));
    }
  });

  it("is deterministic for a fixed input", () => {
    expect(hullOf(triangle)).toEqual(hullOf(triangle));
  });

  it("wraps a single node all around and returns nothing for no nodes", () => {
    const single = [node({ x: 10, y: 10, rating: 2 })];
    const hull = hullOf(single);
    expect(hull.length).toBeGreaterThanOrEqual(3);
    expect(insidePolygon(10, 10, hull)).toBe(true);
    expect(computeGroupHull([], 0, 0)).toEqual([]);
  });

  it("nearestHullPoint picks the closest point and falls back for an empty hull", () => {
    const pts: [number, number][] = [
      [0, 0],
      [10, 0],
      [20, 0],
    ];
    expect(nearestHullPoint(pts, { x: 11, y: 5 }, { x: -1, y: -1 })).toEqual({ x: 10, y: 0 });
    expect(nearestHullPoint([], { x: 11, y: 5 }, { x: -1, y: -1 })).toEqual({ x: -1, y: -1 });
  });
});

describe("placeLabels", () => {
  const bounds = { width: 800, height: 500 };
  const grid: SimNode[] = [];
  [1, 3, 5].forEach((rating, row) => {
    ["Alpha", "Beta", "Gamma", "Delta"].forEach((name, col) => {
      grid.push(node({ name, rating, x: 150 + col * 160, y: 100 + row * 150 }));
    });
  });

  function boxes(nodes: SimNode[]): Box[] {
    return placeLabels(nodes).map((p, i) =>
      textBBox(
        { x: p.ax, y: p.ay },
        p.dir,
        estimateTextSize(nodes[i].name, labelFontSize(nodes[i].rating)),
      ),
    );
  }

  it("places one label per node without overlaps", () => {
    const placed = boxes(grid);
    expect(placed).toHaveLength(grid.length);
    for (let i = 0; i < placed.length; i++) {
      for (let j = i + 1; j < placed.length; j++) {
        expect(boxesOverlap(placed[i], placed[j]), `labels ${i} and ${j}`).toBe(false);
      }
    }
  });

  it("keeps the labels of nodes inside the area inside the area", () => {
    for (const box of boxes(grid)) {
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.x + box.w).toBeLessThanOrEqual(bounds.width);
      expect(box.y + box.h).toBeLessThanOrEqual(bounds.height);
    }
  });

  it("prefers the direction below the node", () => {
    const [p] = placeLabels([node({ x: 100, y: 100 })]);
    expect(p.dir).toBe(0);
    expect(p.ax).toBe(100);
    expect(p.ay).toBeGreaterThan(100 + radiusScale(3));
  });

  it("moves to another direction when the preferred spot is taken by a node", () => {
    const [upper, lower] = placeLabels([node({ x: 100, y: 100 }), node({ x: 100, y: 118 })]);
    expect(lower.dir).toBe(0);
    expect(upper.dir).not.toBe(0);
  });
});

describe("createChainAngleForce", () => {
  type XY = [number, number];
  function chain(ap: XY, bp: XY, cp: XY) {
    const a = node({ id: "a", x: ap[0], y: ap[1] });
    const b = node({ id: "b", x: bp[0], y: bp[1] });
    const c = node({ id: "c", x: cp[0], y: cp[1] });
    const links: SimLink[] = [
      { source: a, target: b, chain: true },
      { source: b, target: c, chain: true },
    ];
    const force = createChainAngleForce(links, 27, 30);
    force.initialize([a, b, c]);
    return { a, b, c, force };
  }

  function cosAtB(a: SimNode, b: SimNode, c: SimNode) {
    const ux = a.x! - b.x!;
    const uy = a.y! - b.y!;
    const vx = c.x! - b.x!;
    const vy = c.y! - b.y!;
    return (ux * vx + uy * vy) / (Math.hypot(ux, uy) * Math.hypot(vx, vy));
  }

  it("returns a d3 force with an initialize hook", () => {
    const { force } = chain([0, 0], [50, 0], [100, 0]);
    expect(typeof force).toBe("function");
    expect(typeof force.initialize).toBe("function");
  });

  it("pushes the middle node of a nearly straight chain off the line", () => {
    const { a, b, c, force } = chain([0, 0], [50, 1], [100, 0]);
    const before = Math.abs(cosAtB(a, b, c));
    force(1);
    expect(b.vy).toBeGreaterThan(0);
    expect(a.vx ?? 0).toBe(0);
    expect(c.vx ?? 0).toBe(0);
    b.x! += b.vx ?? 0;
    b.y! += b.vy ?? 0;
    expect(Math.abs(cosAtB(a, b, c))).toBeLessThan(before);
  });

  it("leaves a chain with a wide enough angle alone", () => {
    const { b, force } = chain([0, 0], [50, 50], [100, 0]);
    force(1);
    expect(b.vx ?? 0).toBe(0);
    expect(b.vy ?? 0).toBe(0);
  });
});

describe("per-tick forces", () => {
  const size = { width: 400, height: 300 };

  it("forceScaling interpolates between the anchors and clamps outside", () => {
    expect(forceScaling(6).charge).toBe(-250);
    expect(forceScaling(60).charge).toBe(-105);
    expect(forceScaling(1).charge).toBe(-250);
    expect(forceScaling(200).charge).toBe(-105);
    expect(forceScaling(30).charge).toBeGreaterThan(-250);
    expect(forceScaling(30).charge).toBeLessThan(-105);
  });

  it("applyBoundary pushes a node that crossed the margin back inside", () => {
    const left = node({ x: 0, y: 150 });
    const right = node({ x: 400, y: 150 });
    const inside = node({ x: 200, y: 150 });
    applyBoundary(left, 10, size);
    applyBoundary(right, 10, size);
    applyBoundary(inside, 10, size);
    expect(left.vx).toBeGreaterThan(0);
    expect(right.vx).toBeLessThan(0);
    expect(inside.vx).toBeUndefined();
  });

  it("applyMouseRepulsion pushes nearby nodes away from the cursor", () => {
    const near = node({ x: 250, y: 150 });
    const far = node({ x: 390, y: 290 });
    applyMouseRepulsion([near, far], { x: 200, y: 150 });
    expect(near.vx).toBeGreaterThan(0);
    expect(far.vx).toBeUndefined();
  });
});

describe("buildGraph", () => {
  const flat = flattenSkillsData(skillsDe);
  const size = { width: 1000, height: 600 };

  it("creates one node per skill with unique ids around the centre", () => {
    const { nodes, categories } = buildGraph(flat, null, size);
    const expected = Object.values(flat).reduce((sum, s) => sum + Object.keys(s).length, 0);
    expect(nodes).toHaveLength(expected);
    expect(new Set(nodes.map((n) => n.id)).size).toBe(expected);
    expect(categories).toEqual(Object.keys(flat));
    for (const n of nodes) {
      expect(Math.abs(n.x! - 500)).toBeLessThanOrEqual(100);
      expect(Math.abs(n.y! - 300)).toBeLessThanOrEqual(100);
    }
  });

  it("chains every group and caps the degree of every node at 5", () => {
    const { nodes, links } = buildGraph(flat, null, size);
    const degree = new Map<string, number>();
    for (const l of links) {
      degree.set(l.source as string, (degree.get(l.source as string) ?? 0) + 1);
      degree.set(l.target as string, (degree.get(l.target as string) ?? 0) + 1);
    }
    for (const d of degree.values()) expect(d).toBeLessThanOrEqual(5);
    const chainLinks = links.filter((l) => l.chain).length;
    const groups = new Set(nodes.map((n) => n.groupIndex)).size;
    expect(chainLinks).toBe(nodes.length - groups);
  });

  it("keeps only the allowed ratings", () => {
    const { nodes } = buildGraph(flat, new Set([5]), size);
    expect(nodes.length).toBeGreaterThan(0);
    for (const n of nodes) expect(n.rating).toBe(5);
  });
});

describe("toggleGroup", () => {
  function state(): GroupState {
    const rope: RopeTarget = {
      start: { x: 1, y: 2 },
      end: { x: 3, y: 4 },
      outputX: 0,
      outputY: 0,
      outputAngle: 0,
    };
    return {
      nodes: [
        node({ id: "a", x: 10, y: 20, groupIndex: 0 }),
        node({ id: "b", x: 30, y: 40, groupIndex: 0 }),
        node({ id: "c", x: 50, y: 60, groupIndex: 1 }),
      ],
      hidden: new Set(),
      positions: new Map(),
      ropeTargets: new Map([[0, rope]]),
    };
  }

  it("parks the nodes of a group off screen and restores them on the second toggle", () => {
    const s = state();
    toggleGroup(0, s);
    expect(s.hidden.has(0)).toBe(true);
    expect(s.positions.get(0)).toEqual([
      { x: 10, y: 20 },
      { x: 30, y: 40 },
    ]);
    expect(s.nodes[0].fx).toBe(-9999);
    expect(s.nodes[2].x).toBe(50);
    expect(s.ropeTargets.get(0)!.end).toEqual({ x: 0, y: 0 });

    toggleGroup(0, s);
    expect(s.hidden.size).toBe(0);
    expect(s.positions.size).toBe(0);
    expect(s.nodes[1]).toMatchObject({ x: 30, y: 40, fx: null, fy: null });
  });

  it("parkHiddenGroups parks the groups hidden before a rebuild", () => {
    const s = state();
    s.hidden.add(1);
    parkHiddenGroups(s);
    expect(s.nodes[2].x).toBe(-9999);
    expect(s.positions.get(1)).toEqual([{ x: 50, y: 60 }]);
    expect(s.nodes[0].x).toBe(10);
  });
});
