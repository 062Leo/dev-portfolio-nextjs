import type { SimulationLinkDatum, SimulationNodeDatum } from "d3-force";

// skills.json has a three-level structure: category → skill → rating, or category →
// skill group → sub-skill → rating.
export type SkillsDataNested = Record<string, Record<string, Record<string, number> | number>>;

// The flattened two-level structure the graph is built from: category → skill → rating.
export type SkillsFlat = Record<string, Record<string, number>>;

export interface SimNode extends SimulationNodeDatum {
  id: string;
  name: string;
  rating: number;
  category: string;
  groupIndex: number;
}

export interface SimLink extends SimulationLinkDatum<SimNode> {
  source: string | SimNode;
  target: string | SimNode;
  chain?: boolean;
}

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface CategoryEntry {
  key: string;
  color: string;
}

// The rope of one category group: from the hull boundary (start) to the pricetag (end).
export interface RopeTarget {
  start: Point;
  end: Point;
  outputX: number;
  outputY: number;
  outputAngle: number;
}

// Where a pricetag was last drawn; a toggled-off group keeps its tag at this position.
export interface PricetagPosition extends Point {
  isLeft: boolean;
  isTop: boolean;
}

export interface TooltipContent {
  name: string;
  entries: [string, number][];
  direct: boolean;
}
