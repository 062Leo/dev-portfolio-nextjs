"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Simulation } from "d3-force";
import { useSkillsData } from "@/data/index";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";
import { RATING_FILL_CLASS, flattenSkillsData, radiusScale } from "./data";
import {
  REHEAT_ALPHA,
  applyBoundary,
  applyMouseRepulsion,
  createSimulation,
  forceScaling,
  recenterSimulation,
} from "./forces";
import { buildGraph, parkHiddenGroups, toggleGroup } from "./graph";
import type { GroupState } from "./graph";
import { HULL_MIN_NODES } from "./hull";
import { bindNodeHover, createPointerHandlers } from "./interaction";
import { placeLabels } from "./labels";
import { PRICETAG_ENABLED, createPricetags, updatePricetags } from "./pricetags";
import type { PricetagData } from "./pricetags";
import {
  applyGroupVisibility,
  applyLabelPlacements,
  createHullPaths,
  createLinkElements,
  createNodeElements,
  createSvgScaffold,
  updateHullPaths,
  updateLinkPositions,
  updateNodePositions,
  updateRipple,
} from "./render";
import { SkillList } from "./SkillList";
import { SkillTooltip } from "./SkillTooltip";
import { createTooltipController } from "./tooltip";
import type {
  Point,
  PricetagPosition,
  RopeTarget,
  SimLink,
  SimNode,
  SkillsFlat,
  TooltipContent,
} from "./types";
import { WobblyRopes } from "./WobblyRopes";

const CONTAINER_HEIGHT = "clamp(400px, 90vh, 540px)";
// Below md the graph is not mounted at all: 68 labels at 9 to 14 px do not fit a phone
// (issue #63). The list takes its place; the d3 simulation never starts there.
const GRAPH_QUERY = "(min-width: 768px)";

// The section: heading plus the graph from md up and the list below. Neither is in the
// server HTML, the viewport being unknown there; the placeholder keeps the graph's
// height on desktop so the page does not jump when the graph mounts. Next to the graph
// the list is rendered for screen readers only: the graph is one image to them.
export function SkillGraph() {
  const t = useT();
  const showGraph = useMediaQuery(GRAPH_QUERY);

  return (
    <section id="skills" className="relative w-full py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <h2 className="mb-6 text-center text-3xl font-bold text-accent-2 text-shadow-glow text-shadow-accent-2/35 md:text-4xl">
          {t.skills.title}
        </h2>
      </div>
      {showGraph === undefined && (
        <div className="hidden md:block" style={{ height: CONTAINER_HEIGHT }} />
      )}
      {showGraph === true && (
        <>
          <SkillGraphCanvas />
          <SkillList screenReaderOnly />
        </>
      )}
      {showGraph === false && <SkillList />}
    </section>
  );
}

// The graph composes the pieces: the data (data.ts, graph.ts), the physics (forces.ts),
// the drawing (render.ts, hull.ts, labels.ts, pricetags.ts, WobblyRopes.tsx) and the
// pointer handling (interaction.ts, tooltip.ts). It owns the React state, the refs the
// simulation writes into, and the filter UI.
function SkillGraphCanvas() {
  const t = useT();
  const skillsData = useSkillsData();

  const currentData = useMemo<SkillsFlat>(() => flattenSkillsData(skillsData), [skillsData]);

  // ── tooltip state ──────────────────────────────────────────────────────
  const [tooltipContent, setTooltipContent] = useState<TooltipContent | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipVisibleRef = useRef(false);
  const activeNodeRef = useRef<SimNode | null>(null);
  const tooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const simRef = useRef<Simulation<SimNode, SimLink> | null>(null);
  const ropeTargetsRef = useRef<Map<number, RopeTarget>>(new Map());
  // One Map for the whole lifetime: pricetags fill it through the ref, WobblyRopes reads it.
  const [ropeColorMap] = useState(() => new Map<number, string>());
  const ropeColorMapRef = useRef(ropeColorMap);

  // filter: null = all nodes, Set<number> = only these ratings
  const filterRatingsRef = useRef<Set<number> | null>(null);

  // filter state: index 1..5 → true = selected
  const [filterToggles, setFilterToggles] = useState<boolean[]>([
    false,
    true,
    true,
    true,
    true,
    true,
  ]);
  const [filterActive, setFilterActive] = useState(false);

  // pricetag toggle: hidden group indices, and where their nodes and tags were
  const hiddenGroupsRef = useRef<Set<number>>(new Set());
  const nodePositionsRef = useRef<Map<number, Point[]>>(new Map());
  const pricetagPositionsRef = useRef<Map<number, PricetagPosition>>(new Map());

  const buildSimulation = useCallback(() => {
    const container = containerRef.current;
    const svgEl = svgRef.current;
    if (!container || !svgEl) return;

    // Mutable: the resize handler updates it, every closure below reads it.
    const size = { width: container.clientWidth, height: container.clientHeight };

    svgEl.innerHTML = "";
    svgEl.setAttribute("viewBox", `0 0 ${size.width} ${size.height}`);
    svgEl.style.userSelect = "none";

    // ── clear tooltip and rope state on rebuild ─────────────────────
    const tooltip = createTooltipController(
      {
        element: tooltipRef,
        visible: tooltipVisibleRef,
        activeNode: activeNodeRef,
        timer: tooltipTimeoutRef,
      },
      setTooltipContent,
      skillsData,
      () => size.width,
    );
    tooltip.dismiss();
    ropeTargetsRef.current.clear();
    ropeColorMapRef.current.clear();

    // ── graph and physics ───────────────────────────────────────────
    const { nodes, links, categories } = buildGraph(currentData, filterRatingsRef.current, size);
    const scaling = forceScaling(nodes.length);
    const simulation = createSimulation(nodes, links, size, scaling);
    simRef.current = simulation;

    // ── SVG elements ────────────────────────────────────────────────
    const layers = createSvgScaffold(svgEl, categories.length);
    const linkEls = createLinkElements(layers.link, links.length);
    const pointer = createPointerHandlers({
      svg: svgEl,
      nodes,
      simulation,
      size,
      tooltip,
    });
    const nodeEls = nodes.map((n) => {
      const els = createNodeElements(layers, n);
      bindNodeHover(els, n, tooltip, pointer.state);
      return els;
    });

    const groupIndices = [...new Set(nodes.map((n) => n.groupIndex))].sort((a, b) => a - b);
    const allGroupIndices = categories.map((_, i) => i);
    const hullPaths = createHullPaths(layers.hull, groupIndices, nodes);

    // ── pricetags (one per category group) ──────────────────────────
    const groups: GroupState = {
      nodes,
      hidden: hiddenGroupsRef.current,
      positions: nodePositionsRef.current,
      ropeTargets: ropeTargetsRef.current,
    };
    const pricetagData: PricetagData[] = PRICETAG_ENABLED
      ? createPricetags(layers.pricetag, {
          categories,
          groupIndices: allGroupIndices,
          ropeTargets: ropeTargetsRef.current,
          ropeColors: ropeColorMapRef.current,
          hiddenGroups: hiddenGroupsRef.current,
          positions: pricetagPositionsRef.current,
          onToggle: (categoryName) => {
            const gi = categories.indexOf(categoryName);
            if (gi < 0) return;
            toggleGroup(gi, groups);
            simulation.alphaTarget(REHEAT_ALPHA).restart();
          },
        })
      : [];
    parkHiddenGroups(groups);

    // ── tick ────────────────────────────────────────────────────────
    simulation.on("tick", () => {
      const hidden = hiddenGroupsRef.current;
      for (const n of nodes) {
        if (!hidden.has(n.groupIndex)) applyBoundary(n, radiusScale(n.rating), size);
      }
      if (pointer.state.mouseIsDown) applyMouseRepulsion(nodes, pointer.state.mouse);
      updateRipple(layers, pointer.state);

      const ropeStartMap = updateHullPaths({
        hullPaths,
        groupIndices,
        nodes,
        hidden,
        height: size.height,
      });
      updateLinkPositions(links, linkEls);
      updateNodePositions(nodes, nodeEls);
      applyLabelPlacements(nodes, placeLabels(nodes), nodeEls);
      tooltip.followActiveNode();
      updatePricetags({
        pricetagData,
        nodes,
        width: size.width,
        height: size.height,
        hullMinNodes: HULL_MIN_NODES,
        ropeTargets: ropeTargetsRef.current,
        ropeStartMap,
        hiddenGroups: hidden,
        positions: pricetagPositionsRef.current,
      });
      applyGroupVisibility({ nodes, links, nodeEls, linkEls, hullPaths, allGroupIndices, hidden });
    });

    pointer.attach();

    // ── resize ──────────────────────────────────────────────────────
    const onResize = () => {
      size.width = container.clientWidth;
      size.height = container.clientHeight;
      svgEl.setAttribute("viewBox", `0 0 ${size.width} ${size.height}`);
      recenterSimulation(simulation, size, scaling);
    };
    window.addEventListener("resize", onResize);

    return () => {
      simulation.stop();
      simRef.current = null;
      pointer.detach();
      tooltip.clearTimer();
      tooltip.dismiss();
      window.removeEventListener("resize", onResize);
    };
  }, [currentData, skillsData]);

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

  return (
    <>
      <div
        ref={containerRef}
        className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-xl border border-accent/25 bg-bg"
        style={{ height: CONTAINER_HEIGHT }}
      >
        <svg ref={svgRef} role="img" aria-label={t.skills.graphLabel} className="h-full w-full" />
        <WobblyRopes
          ropeTargetsRef={ropeTargetsRef}
          colors={ropeColorMap}
          segments={12}
          stiffness={0.5}
        />

        <SkillTooltip ref={tooltipRef} content={tooltipContent} />
      </div>

      {/* ── Filter‑Controls ──────────────────────────────────────────── */}
      <div className="container mx-auto max-w-7xl px-4 mt-6">
        {/* Rating row */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-xs text-text-muted">{t.skills.rating}</span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((r) => (
              <button
                key={r}
                aria-pressed={filterToggles[r]}
                onClick={() => {
                  setFilterToggles((prev) => {
                    const next = [...prev];
                    next[r] = !next[r];
                    return next;
                  });
                }}
                className={cn(
                  "rounded border px-3 py-1 font-mono text-sm font-bold transition-all duration-150",
                  filterToggles[r]
                    ? `${RATING_FILL_CLASS[r]} text-bg`
                    : "border-border bg-surface-2 text-text-muted opacity-55",
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Action row */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
          <button
            onClick={applyFilter}
            className="cursor-pointer rounded border border-accent/70 bg-accent/60 px-4 py-1 font-mono text-xs font-semibold text-white transition-all duration-150"
          >
            {t.skills.applyFilter}
          </button>
          {filterActive && (
            <button
              onClick={resetFilter}
              className="rounded border border-accent/30 bg-surface-2 px-3 py-1 font-mono text-xs text-text-muted transition-all duration-150"
            >
              {t.skills.reset}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
