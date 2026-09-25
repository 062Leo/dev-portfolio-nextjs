import type { MutableRefObject, RefObject } from "react";
import { tooltipContentFor } from "./data";
import type { SimNode, SkillsDataNested, TooltipContent } from "./types";

// The tooltip shows the sub-entries of the hovered or dragged node. Its content is React
// state; visibility, the active node and the linger timer live in refs because the
// pointer handlers read and write them outside of React.

const TOOLTIP_MARGIN = 12; // px — flips to the left of the node this close to the right edge
const TOOLTIP_ESTIMATE = 180; // px — assumed width before the first layout
const TOOLTIP_LINGER_MS = 4000; // the tooltip stays this long after the pointer leaves

export interface TooltipRefs {
  element: RefObject<HTMLDivElement | null>;
  visible: MutableRefObject<boolean>;
  activeNode: MutableRefObject<SimNode | null>;
  timer: MutableRefObject<ReturnType<typeof setTimeout> | null>;
}

export interface TooltipController {
  clearTimer(): void;
  /** Hide the tooltip and forget its node. */
  dismiss(): void;
  /** Show the entries of a node next to it. */
  showFor(node: SimNode): void;
  /** Start the linger timer that dismisses the tooltip. */
  linger(): void;
  isVisible(): boolean;
  markVisible(): void;
  showElement(): void;
  hideElement(): void;
  /** Keep the tooltip next to the active node (it moves during a drag). */
  followActiveNode(): void;
}

export function createTooltipController(
  refs: TooltipRefs,
  setContent: (content: TooltipContent | null) => void,
  data: SkillsDataNested,
  getWidth: () => number,
): TooltipController {
  function clearTimer() {
    if (refs.timer.current !== null) {
      clearTimeout(refs.timer.current);
      refs.timer.current = null;
    }
  }

  function dismiss() {
    refs.visible.current = false;
    refs.activeNode.current = null;
    setContent(null);
  }

  // Positioned right of the node; flips to the left when near the right edge.
  function updatePos(nx: number, ny: number) {
    const el = refs.element.current;
    if (!el) return;
    const tw = el.offsetWidth || TOOLTIP_ESTIMATE;
    if (nx + 20 + tw > getWidth() - TOOLTIP_MARGIN) {
      el.style.left = `${nx - tw - 8}px`;
    } else {
      el.style.left = `${nx + 20}px`;
    }
    el.style.top = `${ny - 8}px`;
  }

  function showFor(node: SimNode) {
    clearTimer();
    refs.activeNode.current = node;
    const content = tooltipContentFor(data, node.category, node.name);
    if (content) {
      setContent(content);
      refs.visible.current = true;
    } else {
      refs.visible.current = false;
      setContent(null);
    }
    if (refs.visible.current && refs.element.current) {
      refs.element.current.style.display = "block";
      updatePos(node.x ?? 0, node.y ?? 0);
    }
  }

  function linger() {
    clearTimer();
    refs.timer.current = setTimeout(() => {
      dismiss();
      refs.timer.current = null;
    }, TOOLTIP_LINGER_MS);
  }

  function showElement() {
    refs.visible.current = true;
    if (refs.element.current) refs.element.current.style.display = "block";
  }

  function hideElement() {
    refs.visible.current = false;
    if (refs.element.current) refs.element.current.style.display = "none";
  }

  function followActiveNode() {
    const node = refs.activeNode.current;
    if (refs.visible.current && refs.element.current && node) {
      updatePos(node.x ?? 0, node.y ?? 0);
    }
  }

  return {
    clearTimer,
    dismiss,
    showFor,
    linger,
    isVisible: () => refs.visible.current,
    markVisible: () => {
      refs.visible.current = true;
    },
    showElement,
    hideElement,
    followActiveNode,
  };
}
