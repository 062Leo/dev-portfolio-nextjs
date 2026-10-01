import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Simulation } from "d3-force";
import { createPointerHandlers } from "@/components/skills/interaction";
import type { TooltipController } from "@/components/skills/tooltip";
import type { SimLink, SimNode } from "@/components/skills/types";

// The pointer handlers run against a stand-in for the SVG element and the window: plain
// event targets with the few members the handlers use.

const SIZE = { width: 400, height: 300 };

type FakeSvg = EventTarget & {
  style: Record<string, string>;
  getBoundingClientRect(): { left: number; top: number; width: number; height: number };
  setPointerCapture: ReturnType<typeof vi.fn>;
};

function fakeSvg(): FakeSvg {
  return Object.assign(new EventTarget(), {
    style: {},
    getBoundingClientRect: () => ({ left: 0, top: 0, ...SIZE }),
    setPointerCapture: vi.fn(),
  });
}

function pointerEvent(type: string, init: { x?: number; y?: number } = {}) {
  return Object.assign(new Event(type, { cancelable: true }), {
    button: 0,
    pointerId: 7,
    clientX: init.x ?? 0,
    clientY: init.y ?? 0,
  });
}

function fakeSimulation() {
  const simulation = {
    alphaTarget: vi.fn(() => simulation),
    restart: vi.fn(() => simulation),
  };
  return simulation;
}

function fakeTooltip(hasContent: boolean): TooltipController {
  return {
    clearTimer: vi.fn(),
    dismiss: vi.fn(),
    showFor: vi.fn(),
    linger: vi.fn(),
    isVisible: vi.fn(() => true),
    hasContent: () => hasContent,
    markVisible: vi.fn(),
    showElement: vi.fn(),
    hideElement: vi.fn(),
    followActiveNode: vi.fn(),
  };
}

function setup(hasTooltipContent = true) {
  const svg = fakeSvg();
  const node: SimNode = {
    id: "Cat:Node",
    name: "Node",
    rating: 3,
    category: "Cat",
    groupIndex: 0,
    x: 100,
    y: 100,
  };
  const simulation = fakeSimulation();
  const tooltip = fakeTooltip(hasTooltipContent);
  const handlers = createPointerHandlers({
    svg: svg as unknown as SVGSVGElement,
    nodes: [node],
    simulation: simulation as unknown as Simulation<SimNode, SimLink>,
    size: { ...SIZE },
    tooltip,
  });
  handlers.attach();
  return { svg, node, simulation, tooltip, handlers };
}

beforeEach(() => {
  vi.stubGlobal("window", new EventTarget());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("skill graph pointer handling", () => {
  it("fixes a node and captures the pointer when a drag starts", () => {
    const { svg, node, handlers } = setup();
    svg.dispatchEvent(pointerEvent("pointerdown", { x: 100, y: 100 }));
    expect(handlers.state.dragNode).toBe(node);
    expect(node.fx).toBe(100);
    expect(svg.setPointerCapture).toHaveBeenCalledWith(7);
    handlers.detach();
  });

  it.each([
    ["pointerup", "window"],
    ["pointercancel", "window"],
    ["lostpointercapture", "svg"],
  ] as const)("releases the dragged node on %s", (type, on) => {
    const { svg, node, simulation, handlers } = setup();
    svg.dispatchEvent(pointerEvent("pointerdown", { x: 100, y: 100 }));
    svg.dispatchEvent(pointerEvent("pointermove", { x: 180, y: 120 }));
    expect(node.fx).toBe(180);

    (on === "svg" ? svg : window).dispatchEvent(pointerEvent(type));
    expect(handlers.state.dragNode).toBeNull();
    expect(node.fx).toBeNull();
    expect(node.fy).toBeNull();
    expect(simulation.alphaTarget).toHaveBeenLastCalledWith(0);
    handlers.detach();
  });

  it.each(["pointerup", "pointercancel"])("ends the repulsion field on %s", (type) => {
    const { svg, simulation, handlers } = setup();
    svg.dispatchEvent(pointerEvent("pointerdown", { x: 300, y: 250 }));
    expect(handlers.state.mouseIsDown).toBe(true);

    window.dispatchEvent(pointerEvent(type));
    expect(handlers.state.mouseIsDown).toBe(false);
    expect(simulation.alphaTarget).toHaveBeenLastCalledWith(0);
    handlers.detach();
  });

  it("shows the tooltip again after a drag, once for pointerup and lostpointercapture", () => {
    const { svg, tooltip, handlers } = setup();
    svg.dispatchEvent(pointerEvent("pointerdown", { x: 100, y: 100 }));
    svg.dispatchEvent(pointerEvent("pointermove", { x: 200, y: 200 }));
    window.dispatchEvent(pointerEvent("pointerup"));
    svg.dispatchEvent(pointerEvent("lostpointercapture"));
    expect(tooltip.showElement).toHaveBeenCalledTimes(1);
    // Moved far: no linger, the tooltip stays while the pointer is on the node.
    expect(tooltip.linger).not.toHaveBeenCalled();
    handlers.detach();
  });

  it("lets the tooltip linger after a click on a node", () => {
    const { svg, tooltip, handlers } = setup();
    svg.dispatchEvent(pointerEvent("pointerdown", { x: 100, y: 100 }));
    window.dispatchEvent(pointerEvent("pointerup"));
    expect(tooltip.showElement).toHaveBeenCalledTimes(1);
    expect(tooltip.linger).toHaveBeenCalledTimes(1);
    handlers.detach();
  });

  it("leaves a tooltip without content hidden and ignores a release without a drag", () => {
    const { svg, tooltip, handlers } = setup(false);
    window.dispatchEvent(pointerEvent("pointerup"));
    svg.dispatchEvent(pointerEvent("pointerdown", { x: 100, y: 100 }));
    window.dispatchEvent(pointerEvent("pointerup"));
    expect(tooltip.showElement).not.toHaveBeenCalled();
    handlers.detach();
  });
});
