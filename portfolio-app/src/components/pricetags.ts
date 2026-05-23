import type { RopeTarget } from "./WobblyRopes";

// ══════════════════════════════════════════════════════════════════════════════
//  CONFIG
// ══════════════════════════════════════════════════════════════════════════════

export const PRICETAG_ENABLED = true;
export const PRICETAG_SCALE = 0.55;

const S = PRICETAG_SCALE;
export const PT_H = 38 * S;
export const PT_T = 19 * S;
const R = 4 * S;
const PAD = 3 * S;
const FONT_SZ = 22 * S;

// ══════════════════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════════════════

export interface PricetagData {
  gi: number;
  g: SVGGElement;
  line: SVGLineElement;
  tri: SVGElement;
  rect: SVGRectElement;
  dot: SVGCircleElement;
  text: SVGTextElement;
}

interface SimNode {
  x?: number;
  y?: number;
  groupIndex: number;
}

interface CatEntry {
  key: string;
  color: string;
}

interface TagPos {
  pd: PricetagData;
  isTop: boolean;
  isLeft: boolean;
  tagLeft: number;
  tagRight: number;
  rx: number;
  ry: number;
  cx: number;
  tw: number;
  name: string;
}

const NS = "http://www.w3.org/2000/svg";

// ══════════════════════════════════════════════════════════════════════════════
//  CREATE (called once on build)
// ══════════════════════════════════════════════════════════════════════════════

export function createPricetags(
  pricetagLayer: SVGGElement,
  categories: string[],
  groupIndices: number[],
  ropeTargetsRef: React.MutableRefObject<Map<number, RopeTarget>>,
  ropeColorMapRef: React.MutableRefObject<Map<number, string>>,
  CATEGORIES: CatEntry[],
): PricetagData[] {
  const pricetagData: PricetagData[] = [];

  for (const gi of groupIndices) {
    const name = categories[gi];
    const textW = name.length * FONT_SZ * 0.6 + PAD * 2;

    const line = document.createElementNS(NS, "line");
    line.setAttribute("stroke", "rgba(106,176,112,0.35)");
    line.setAttribute("stroke-width", "1.5");
    line.setAttribute("stroke-dasharray", "3,4");
    pricetagLayer.appendChild(line);

    const g = document.createElementNS(NS, "g");
    g.setAttribute("pointer-events", "none");

    const tri = document.createElementNS(NS, "polygon");
    tri.setAttribute("points", `0,0 ${PT_T},${-PT_H / 2} ${PT_T},${PT_H / 2}`);
    tri.setAttribute("fill", "#6ab070");

    const rect = document.createElementNS(NS, "rect");
    rect.setAttribute("x", String(PT_T));
    rect.setAttribute("y", String(-PT_H / 2));
    rect.setAttribute("width", String(textW));
    rect.setAttribute("height", String(PT_H));
    rect.setAttribute("rx", String(R));
    rect.setAttribute("fill", "#6ab070");

    const dot = document.createElementNS(NS, "circle");
    dot.setAttribute("cx", String(PT_T - 9 * S));
    dot.setAttribute("cy", "0");
    dot.setAttribute("r", String(2 * S));
    dot.setAttribute("fill", "white");

    const text = document.createElementNS(NS, "text");
    text.textContent = name;
    text.setAttribute("y", String(FONT_SZ * 0.35));
    text.setAttribute("fill", "white");
    text.setAttribute("font-family", "monospace");
    text.setAttribute("font-size", String(FONT_SZ));
    text.setAttribute("font-weight", "300");

    g.appendChild(tri);
    g.appendChild(rect);
    g.appendChild(dot);
    g.appendChild(text);
    pricetagLayer.appendChild(g);

    pricetagData.push({ gi, g, line, tri, rect, dot, text });

    if (!ropeTargetsRef.current.has(gi)) {
      ropeTargetsRef.current.set(gi, {
        start: { x: 0, y: 0 },
        end: { x: 0, y: 0 },
        outputX: 0,
        outputY: 0,
        outputAngle: 0,
      });
    }
    if (!ropeColorMapRef.current.has(gi)) {
      const catColor = CATEGORIES[gi]?.color || "rgba(106,176,112,0.25)";
      ropeColorMapRef.current.set(gi, catColor.replace(/[\d.]+\)$/, "0.55)"));
    }
  }

  return pricetagData;
}

// ══════════════════════════════════════════════════════════════════════════════
//  UPDATE (called every tick)
// ══════════════════════════════════════════════════════════════════════════════

const EDGE_MARGIN = 10;

export function updatePricetags(
  pricetagData: PricetagData[],
  nodes: SimNode[],
  width: number,
  height: number,
  hullMinNodes: number,
  ropeTargetsRef: React.MutableRefObject<Map<number, RopeTarget>>,
) {
  if (!PRICETAG_ENABLED || pricetagData.length === 0) return;

  const halfW = width / 2;
  const allPositions: TagPos[] = [];

  // ---- first pass: compute raw positions & feed rope targets ----
  for (const pd of pricetagData) {
    const gn = nodes.filter((n) => n.groupIndex === pd.gi);
    if (gn.length < hullMinNodes) {
      pd.line.style.display = "none";
      pd.g.style.display = "none";
      continue;
    }
    pd.line.style.display = "none";
    pd.g.style.display = "";

    let cx = 0, cy = 0;
    for (const n of gn) { cx += n.x ?? 0; cy += n.y ?? 0; }
    cx /= gn.length;
    cy /= gn.length;

    let avgDist = 0;
    for (const n of gn) {
      avgDist += Math.sqrt(((n.x ?? 0) - cx) ** 2 + ((n.y ?? 0) - cy) ** 2);
    }
    avgDist /= gn.length;

    const isTop = cy < height / 2;
    const dirY = isTop ? -1 : 1;
    const isLeft = cx < halfW;

    const lineEndX = cx;
    const lineEndY = cy + dirY * avgDist;

    const anchorX = cx;
    const anchorY = isTop ? EDGE_MARGIN + PT_H / 2 : height - EDGE_MARGIN - PT_H / 2;

    const rt = ropeTargetsRef.current.get(pd.gi);
    if (rt) {
      rt.start.x = lineEndX;
      rt.start.y = lineEndY;
      rt.end.x = anchorX;
      rt.end.y = anchorY;
    }

    let rx = anchorX; // always restart from group centroid, never accumulate
    const ry = anchorY;

    const name = pd.text.textContent || "";
    const tw = name.length * FONT_SZ * 0.6 + PAD * 2;
    const tagLeft = isLeft ? PT_T + tw : 0;
    const tagRight = isLeft ? 0 : PT_T + tw;

    // hard edge blockade (X axis)
    rx = Math.max(EDGE_MARGIN + tagLeft, Math.min(width - EDGE_MARGIN - tagRight, rx));

    allPositions.push({ pd, isTop, isLeft, tagLeft, tagRight, rx, ry, cx, tw, name });
  }

  // ---- tag-tag layout: maintain group L→R order, distribute along edge ----
  for (const side of [true, false]) {
    const sideTags = allPositions.filter(t => t.isTop === side);
    sideTags.sort((a, b) => a.cx - b.cx);

    for (let iter = 0; iter < 5; iter++) {
      for (let i = 0; i < sideTags.length; i++) {
        const a = sideTags[i];
        const aR = a.rx + a.tagRight;
        for (let j = i + 1; j < sideTags.length; j++) {
          const b = sideTags[j];
          const bL = b.rx - b.tagLeft;
          const gap = bL - aR;
          if (gap >= 15) break;

          // skip if no vertical overlap (different balloon heights)
          const aTop = a.ry - PT_H / 2;
          const aBot = a.ry + PT_H / 2;
          const bTop = b.ry - PT_H / 2;
          const bBot = b.ry + PT_H / 2;
          if (aBot <= bTop || bBot <= aTop) continue;

          // push right tag to ensure 15px gap
          b.rx = Math.max(b.rx, aR + 15 + b.tagLeft);
          b.rx = Math.min(width - EDGE_MARGIN - b.tagRight, b.rx);
        }
      }
    }
  }

  // ---- apply final positions & geometry ----
  for (const tp of allPositions) {
    const { pd, isLeft, isTop, tagLeft, tagRight, rx, ry, tw, cx } = tp;

    const rt = ropeTargetsRef.current.get(pd.gi);
    if (rt) {
      rt.end.x = rx; // rope end fixed to pricetag hole
      rt.end.y = ry;
      rt.outputX = Math.max(EDGE_MARGIN + tagLeft, Math.min(width - EDGE_MARGIN - tagRight, rx));
      rt.outputY = ry;
    }

    pd.g.setAttribute("transform", `translate(${rx}, ${ry})`);

    if (isLeft) {
      pd.tri.setAttribute("points", `0,0 ${-PT_T},${-PT_H / 2} ${-PT_T},${PT_H / 2}`);
      pd.rect.setAttribute("x", String(-PT_T - tw));
      pd.rect.setAttribute("width", String(tw));
      pd.dot.setAttribute("cx", String(-PT_T + 9 * S));
      pd.text.setAttribute("x", String(-PT_T - tw / 2));
      pd.text.setAttribute("text-anchor", "middle");
    } else {
      pd.tri.setAttribute("points", `0,0 ${PT_T},${-PT_H / 2} ${PT_T},${PT_H / 2}`);
      pd.rect.setAttribute("x", String(PT_T));
      pd.rect.setAttribute("width", String(tw));
      pd.dot.setAttribute("cx", String(PT_T - 9 * S));
      pd.text.setAttribute("x", String(PT_T + tw / 2));
      pd.text.setAttribute("text-anchor", "middle");
    }
  }
}
