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
import skillsData from "@/../docs/skills_rated.json";

// ── data types & utilities (shared) ──────────────────────────────────────────

export type SkillNodeData = {
  name: string;
  rating: number;
  category: string;
};

export const CATEGORY_COLORS: Record<string, string> = {
  Programmiersprachen: "rgba(167,139,250,0.25)",
  Frameworks_Plattformen: "rgba(56,189,248,0.25)",
  Game_Development: "rgba(52,211,153,0.25)",
  AI_ML: "rgba(250,204,21,0.25)",
  Cloud_DevOps: "rgba(251,146,60,0.25)",
  Datenbanken: "rgba(129,140,248,0.25)",
  Tools_IDEs: "rgba(244,114,182,0.25)",
  Projektmanagement: "rgba(148,163,184,0.25)",
  Methoden_Konzepte: "rgba(94,234,212,0.25)",
  Sonstiges_Hardware: "rgba(253,224,71,0.25)",
  Soft_Skills_Methoden: "rgba(74,222,128,0.25)",
};

export const CATEGORY_DISPLAY: Record<string, string> = {
  Programmiersprachen: "Sprachen",
  Frameworks_Plattformen: "Frameworks",
  Game_Development: "Game Dev",
  AI_ML: "AI & ML",
  Cloud_DevOps: "Cloud / DevOps",
  Datenbanken: "Datenbanken",
  Tools_IDEs: "Tools & IDEs",
  Projektmanagement: "PM",
  Methoden_Konzepte: "Methoden",
  Sonstiges_Hardware: "Sonstiges",
  Soft_Skills_Methoden: "Soft Skills",
};

export function ratingColor(rating: number): string {
  const t = (rating - 1) / 4;
  const r = Math.round(239 - t * (239 - 34));
  const g = Math.round(68 + t * (197 - 68));
  const b = Math.round(68 + t * (94 - 68));
  return `rgb(${r},${g},${b})`;
}

export function ratingBright(rating: number): string {
  const t = (rating - 1) / 4;
  const r = 1.0 - t * 0.5;
  const g = 0.4 + t * 0.5;
  const b = 0.3 + t * 0.4;
  return `rgb(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)})`;
}

export function deepMergeSkills(): Map<string, Record<string, number>> {
  const merged = new Map<string, Record<string, number>>();
  interface SkillsFile {
    bestehendeKeywords?: Record<string, Record<string, number>>;
    neueKeywords?: Record<string, Record<string, number>>;
  }
  const src = skillsData as unknown as SkillsFile;

  for (const source of [src.bestehendeKeywords, src.neueKeywords]) {
    if (!source) continue;
    for (const [cat, skills] of Object.entries(source)) {
      if (!merged.has(cat)) merged.set(cat, {});
      const target = merged.get(cat)!;
      for (const [name, rating] of Object.entries(skills as Record<string, number>)) {
        target[name] = rating;
      }
    }
  }

  return merged;
}

// ── graph simulation types ──────────────────────────────────────────────────

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

// ── visual constants ────────────────────────────────────────────────────────

const RADIUS_MIN = 5;
const RADIUS_MAX = 15;
const LABEL_RATING_THRESHOLD = 3;
const LINK_DISTANCE = 28;
const CHARGE_STRENGTH = -35;
const COLLIDE_PADDING = 1.5;

function radiusScale(rating: number): number {
  return RADIUS_MIN + ((rating - 1) / 4) * (RADIUS_MAX - RADIUS_MIN);
}

// ── component ───────────────────────────────────────────────────────────────

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
        g = { xs: [], ys: [], cat: CATEGORY_DISPLAY[n.category] || n.category };
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
    simRef.current?.alphaTarget(0.3).restart();

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

    const merged = deepMergeSkills();
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

      // connect within group — chain + a few cross-links
      for (let i = 0; i < groupNodes.length - 1; i++) {
        links.push({ source: groupNodes[i].id, target: groupNodes[i + 1].id });
      }
      // extra connections for cohesion
      for (let i = 0; i < groupNodes.length; i++) {
        for (let j = i + 2; j < Math.min(i + 5, groupNodes.length); j++) {
          links.push({ source: groupNodes[i].id, target: groupNodes[j].id });
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
      .force(
        "collide",
        forceCollide<SimNode>().radius((d) => radiusScale(d.rating) + COLLIDE_PADDING)
      )
      .force("x", forceX<SimNode>(width / 2).strength(0.01))
      .force("y", forceY<SimNode>(height / 2).strength(0.01))
      .alphaDecay(0.015)
      .alphaMin(0.001);

    simRef.current = simulation;

    const ns = "http://www.w3.org/2000/svg";

    // glow filters per category
    const defs = document.createElementNS(ns, "defs");
    categories.forEach((cat, i) => {
      const base = CATEGORY_COLORS[cat] || "rgba(167,139,250,0.4)";
      const glowColor = base.replace(/[\d.]+\)$/, "0.8)");
      const filter = document.createElementNS(ns, "filter");
      filter.setAttribute("id", `sg-glow-${i}`);
      filter.setAttribute("x", "-50%");
      filter.setAttribute("y", "-50%");
      filter.setAttribute("width", "200%");
      filter.setAttribute("height", "200%");
      filter.innerHTML = [
        `<feGaussianBlur stdDeviation="3" result="blur"/>`,
        `<feFlood flood-color="${glowColor}" flood-opacity="0.5" result="color"/>`,
        `<feComposite in="color" in2="blur" operator="in" result="glow"/>`,
        `<feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>`,
      ].join("");
      defs.appendChild(filter);
    });
    svgEl.appendChild(defs);

    // layers
    const linkLayer = document.createElementNS(ns, "g");
    const nodeLayer = document.createElementNS(ns, "g");
    const labelLayer = document.createElementNS(ns, "g");
    svgEl.appendChild(linkLayer);
    svgEl.appendChild(nodeLayer);
    svgEl.appendChild(labelLayer);

    // link elements
    const linkEls: SVGLineElement[] = [];
    for (let i = 0; i < links.length; i++) {
      const line = document.createElementNS(ns, "line");
      line.setAttribute("stroke", "rgba(167,139,250,0.1)");
      line.setAttribute("stroke-width", "1");
      linkLayer.appendChild(line);
      linkEls.push(line);
    }

    // node + label elements
    const nodeEls: SVGCircleElement[] = [];
    const labelEls: SVGTextElement[] = [];

    nodes.forEach((n) => {
      const r = radiusScale(n.rating);
      const circle = document.createElementNS(ns, "circle");
      circle.setAttribute("r", String(r));
      circle.setAttribute("fill", ratingColor(n.rating));
      circle.setAttribute("stroke", "rgba(255,255,255,0.2)");
      circle.setAttribute("stroke-width", "1");
      circle.setAttribute("filter", `url(#sg-glow-${n.groupIndex})`);
      circle.style.cursor = "grab";
      circle.style.transition = "r 0.25s ease, stroke-width 0.25s ease, stroke 0.25s ease";

      const title = document.createElementNS(ns, "title");
      title.textContent = `${n.name}  (${n.rating}/5)  —  ${CATEGORY_DISPLAY[n.category] || n.category}`;
      circle.appendChild(title);

      circle.addEventListener("pointerenter", () => {
        circle.setAttribute("r", String(r * 1.5));
        circle.setAttribute("stroke", "rgba(255,255,255,0.8)");
        circle.setAttribute("stroke-width", "2.5");
        circle.style.cursor = "grab";
      });
      circle.addEventListener("pointerleave", () => {
        circle.setAttribute("r", String(r));
        circle.setAttribute("stroke", "rgba(255,255,255,0.2)");
        circle.setAttribute("stroke-width", "1");
        circle.style.cursor = "default";
      });

      nodeLayer.appendChild(circle);
      nodeEls.push(circle);

      if (n.rating >= LABEL_RATING_THRESHOLD) {
        const text = document.createElementNS(ns, "text");
        text.textContent = n.name;
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dy", String(r + 11));
        text.setAttribute("fill", "rgba(213,220,232,0.65)");
        text.setAttribute("font-size", String(Math.max(8, r * 0.6)));
        text.setAttribute("font-family", "monospace");
        text.setAttribute("pointer-events", "none");
        labelLayer.appendChild(text);
        labelEls.push(text);
      }
    });

    // ── bounding helper ──────────────────────────────────────────────────
    function clampNode(n: SimNode, r: number) {
      if (n.x != null) n.x = Math.max(r, Math.min(width - r, n.x));
      if (n.y != null) n.y = Math.max(r, Math.min(height - r, n.y));
    }

    // ── tick ────────────────────────────────────────────────────────────
    simulation.on("tick", () => {
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const r = radiusScale(n.rating);
        clampNode(n, r);
      }

      for (let i = 0; i < links.length; i++) {
        const s = links[i].source as SimNode;
        const t = links[i].target as SimNode;
        linkEls[i].setAttribute("x1", String(s.x ?? 0));
        linkEls[i].setAttribute("y1", String(s.y ?? 0));
        linkEls[i].setAttribute("x2", String(t.x ?? 0));
        linkEls[i].setAttribute("y2", String(t.y ?? 0));
      }

      let li = 0;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const cx = n.x ?? 0;
        const cy = n.y ?? 0;
        nodeEls[i].setAttribute("cx", String(cx));
        nodeEls[i].setAttribute("cy", String(cy));

        if (n.rating >= LABEL_RATING_THRESHOLD && li < labelEls.length) {
          const r = radiusScale(n.rating);
          labelEls[li].setAttribute("x", String(cx));
          labelEls[li].setAttribute("y", String(cy));
          labelEls[li].setAttribute("dy", String(r + 11));
          li++;
        }
      }
    });

    // ── drag (D3-style: fix single node → link forces pull group) ──────
    let dragNode: SimNode | null = null;

    function findNode(px: number, py: number): SimNode | null {
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i];
        const r = radiusScale(n.rating) + 4;
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
      simulation.alphaTarget(0.3).restart();
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

      const r = radiusScale(dragNode.rating);
      dragNode.fx = Math.max(r, Math.min(width - r, px));
      dragNode.fy = Math.max(r, Math.min(height - r, py));
    }

    function onPointerUp(_e: PointerEvent) {
      if (!dragNode) return;
      // keep node fixed where dropped — group stays anchored
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
        simulation.alphaTarget(0.3).restart();
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
        .force("x", forceX<SimNode>(w / 2).strength(0.01))
        .force("y", forceY<SimNode>(h / 2).strength(0.01))
        .alpha(0.3)
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
          height: "clamp(500px, 70vh, 850px)",
          borderColor: "rgba(167,139,250,0.25)",
          backgroundColor: "rgba(11,13,23,0.6)",
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
