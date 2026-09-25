import type { Simulation } from "d3-force";
import { labelFontSize, radiusScale, ratingColor } from "./data";
import { REHEAT_ALPHA } from "./forces";
import {
  LABEL_COLOR_HOVER,
  LABEL_LINE_COLOR,
  LABEL_LINE_COLOR_HOVER,
  LABEL_LINE_WIDTH,
  LABEL_LINE_WIDTH_HOVER,
} from "./labels";
import {
  NODE_DRAG_HIT_PADDING,
  NODE_HOVER_SCALE,
  NODE_HOVER_STROKE_COLOR,
  NODE_HOVER_STROKE_WIDTH,
  NODE_STROKE_COLOR,
  NODE_STROKE_WIDTH,
  type NodeElements,
} from "./render";
import type { TooltipController } from "./tooltip";
import type { Point, SimLink, SimNode, Size } from "./types";

// Pointer interaction with the graph: hover highlights, dragging a node (D3-style: fix
// the node, the link forces pull its group along), the repulsion field while the left
// button is held on empty canvas, and a double-click that releases a fixed node.
//
// A drag or a held button ends with pointerup, and also with pointercancel (a touch that
// turns into a page pan: the graph has no touch-action: none, so panning over it keeps
// working) and with lostpointercapture; all three release the node and cool the
// simulation down.

const DRAG_TOOLTIP_SPEED_THRESHOLD = 180; // px/s — hide tooltip when moving faster
const SLOW_DEBOUNCE_MS = 1000; // ms of slow movement before tooltip reappears
const CLICK_MOVE_THRESHOLD = 8; // px — max movement to still count as "click"

export interface PointerState {
  dragNode: SimNode | null;
  mouseIsDown: boolean; // left button on empty canvas: repulsion field active
  mouse: Point; // cursor in SVG coordinates
}

export interface PointerOptions {
  svg: SVGSVGElement;
  nodes: SimNode[];
  simulation: Simulation<SimNode, SimLink>;
  size: Size; // the current viewBox size, updated on resize
  tooltip: TooltipController;
}

export interface PointerHandlers {
  state: PointerState;
  attach(): void;
  detach(): void;
}

// Highlight the node, its label and its connector on hover; show the tooltip.
export function bindNodeHover(
  els: NodeElements,
  node: SimNode,
  tooltip: TooltipController,
  pointer: PointerState,
): void {
  const r = radiusScale(node.rating);
  const fs = labelFontSize(node.rating);

  els.circle.addEventListener("pointerenter", () => {
    els.circle.setAttribute("r", String(r * NODE_HOVER_SCALE));
    els.circle.style.stroke = NODE_HOVER_STROKE_COLOR;
    els.circle.setAttribute("stroke-width", String(NODE_HOVER_STROKE_WIDTH));
    els.circle.style.cursor = "grab";
    els.text.style.fill = LABEL_COLOR_HOVER;
    els.text.setAttribute("font-weight", "bold");
    els.text.setAttribute("font-size", String(fs * 1.2));
    els.line.style.stroke = LABEL_LINE_COLOR_HOVER;
    els.line.setAttribute("stroke-width", String(LABEL_LINE_WIDTH_HOVER));

    tooltip.showFor(node);
  });

  els.circle.addEventListener("pointerleave", () => {
    els.circle.setAttribute("r", String(r));
    els.circle.style.stroke = NODE_STROKE_COLOR;
    els.circle.setAttribute("stroke-width", String(NODE_STROKE_WIDTH));
    els.circle.style.cursor = "default";
    els.text.style.fill = ratingColor(node.rating);
    els.text.removeAttribute("font-weight");
    els.text.setAttribute("font-size", String(fs));
    els.line.style.stroke = LABEL_LINE_COLOR;
    els.line.setAttribute("stroke-width", String(LABEL_LINE_WIDTH));

    // The tooltip lingers after the pointer leaves — but not while dragging, where the
    // speed-based control is active.
    if (!pointer.dragNode) {
      tooltip.markVisible();
      tooltip.linger();
    }
  });
}

export function createPointerHandlers(opts: PointerOptions): PointerHandlers {
  const { svg, nodes, simulation, size, tooltip } = opts;
  const state: PointerState = { dragNode: null, mouseIsDown: false, mouse: { x: 0, y: 0 } };
  let dragStart: Point = { x: 0, y: 0 };
  let lastMoveTime = 0;
  let lastMove: Point = { x: 0, y: 0 };
  let slowShowTimer: ReturnType<typeof setTimeout> | null = null;

  function findNode(p: Point): SimNode | null {
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      const r = radiusScale(n.rating) + NODE_DRAG_HIT_PADDING;
      const dx = (n.x ?? 0) - p.x;
      const dy = (n.y ?? 0) - p.y;
      if (dx * dx + dy * dy < r * r) return n;
    }
    return null;
  }

  // Client coordinates → viewBox coordinates.
  function toSvg(e: MouseEvent): Point {
    const rect = svg.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (size.width / rect.width),
      y: (e.clientY - rect.top) * (size.height / rect.height),
    };
  }

  function showTooltipAfterPause() {
    slowShowTimer = setTimeout(() => {
      tooltip.showElement();
      slowShowTimer = null;
    }, SLOW_DEBOUNCE_MS);
  }

  // Speed-based tooltip visibility during a drag: fast → hide immediately and show again
  // after a second without fast movement; slow and hidden → set the timer once.
  function updateDragTooltip(speed: number) {
    if (speed > DRAG_TOOLTIP_SPEED_THRESHOLD) {
      if (tooltip.isVisible()) tooltip.hideElement();
      if (slowShowTimer !== null) clearTimeout(slowShowTimer);
      showTooltipAfterPause();
    } else if (!tooltip.isVisible() && slowShowTimer === null) {
      showTooltipAfterPause();
    }
  }

  function onPointerDown(e: PointerEvent) {
    if (e.button !== 0) return; // left button only
    const p = toSvg(e);
    const hit = findNode(p);
    e.preventDefault();

    if (!hit) {
      // clicking empty canvas cancels the tooltip and starts the repulsion field
      tooltip.clearTimer();
      tooltip.dismiss();
      state.mouseIsDown = true;
      state.mouse.x = p.x;
      state.mouse.y = p.y;
      simulation.alphaTarget(REHEAT_ALPHA).restart();
      svg.style.cursor = "none";
      return;
    }

    state.dragNode = hit;
    dragStart = p;
    lastMove = p;
    lastMoveTime = 0;
    // Moves and the release reach the graph even when the pointer leaves it. Captured by
    // the element under the pointer (the node's circle, or the graph itself for a hit in
    // the padding around it), so the node keeps its hover state while it is dragged.
    const captureTarget = (e.target as Element | null) ?? svg;
    captureTarget.setPointerCapture(e.pointerId);
    hit.fx = hit.x;
    hit.fy = hit.y;
    svg.style.cursor = "grabbing";
    simulation.alphaTarget(REHEAT_ALPHA).restart();
  }

  function onPointerMove(e: PointerEvent) {
    const p = toSvg(e);

    if (!state.dragNode) {
      if (state.mouseIsDown) {
        state.mouse.x = p.x;
        state.mouse.y = p.y;
        return;
      }
      svg.style.cursor = findNode(p) ? "grab" : "default";
      return;
    }

    state.dragNode.fx = p.x;
    state.dragNode.fy = p.y;

    const now = performance.now();
    if (lastMoveTime > 0) {
      const dt = (now - lastMoveTime) / 1000;
      if (dt > 0.008) updateDragTooltip(Math.hypot(p.x - lastMove.x, p.y - lastMove.y) / dt);
    }
    lastMoveTime = now;
    lastMove = p;
  }

  // pointerup, pointercancel and lostpointercapture. Only the first of them acts: a
  // release fires pointerup and then lostpointercapture.
  function onPointerEnd() {
    const dragged = state.dragNode;
    if (!dragged && !state.mouseIsDown) return;

    if (dragged) {
      dragged.fx = null;
      dragged.fy = null;
      state.dragNode = null;
    }
    state.mouseIsDown = false;
    simulation.alphaTarget(0);

    if (slowShowTimer !== null) {
      clearTimeout(slowShowTimer);
      slowShowTimer = null;
    }

    // After a drag the tooltip is always visible again (the speed-based logic only hides
    // it while dragging); a click with minimal movement lets it linger.
    if (dragged && tooltip.hasContent()) {
      tooltip.showElement();
      const moved = Math.hypot(lastMove.x - dragStart.x, lastMove.y - dragStart.y);
      if (moved < CLICK_MOVE_THRESHOLD) tooltip.linger();
    }

    svg.style.cursor = "default";
  }

  // Double-click releases a fixed node.
  function onDblClick(e: MouseEvent) {
    const hit = findNode(toSvg(e));
    if (hit && (typeof hit.fx === "number" || typeof hit.fy === "number")) {
      hit.fx = null;
      hit.fy = null;
      simulation.alphaTarget(REHEAT_ALPHA).restart();
    }
  }

  return {
    state,
    attach() {
      svg.addEventListener("pointerdown", onPointerDown);
      svg.addEventListener("pointermove", onPointerMove);
      svg.addEventListener("dblclick", onDblClick);
      svg.addEventListener("lostpointercapture", onPointerEnd);
      window.addEventListener("pointerup", onPointerEnd);
      window.addEventListener("pointercancel", onPointerEnd);
    },
    detach() {
      if (slowShowTimer !== null) clearTimeout(slowShowTimer);
      svg.removeEventListener("pointerdown", onPointerDown);
      svg.removeEventListener("pointermove", onPointerMove);
      svg.removeEventListener("dblclick", onDblClick);
      svg.removeEventListener("lostpointercapture", onPointerEnd);
      window.removeEventListener("pointerup", onPointerEnd);
      window.removeEventListener("pointercancel", onPointerEnd);
    },
  };
}
