"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import skillsData from "@/../docs/skills_rated.json";

type SkillNode = {
  name: string;
  rating: number;
  category: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
};

export type SkillGraphParams = {
  velocityDecay: number;
  categoryStrength: number;
  collisionRadius: number;
  collisionIterations: number;
  centeringStrength: number;
  maxRadiusMultiplier: number;
  innerRingFactor: number;
  outerRingFactor: number;
  clusterRadiusMax: number;
  clusterRadiusBase: number;
  clusterRadiusScale: number;
  bubblePadding: number;
  bubbleMaxExpansionFactor: number;
  bubbleMinRadius: number;
  bubbleFillAlpha: number;
  bubbleStrokeAlpha: number;
  bubbleStrokeWidth: number;
  nodeBaseSize: number;
  nodeRatingScale: number;
  nodeGlowRadius: number;
  nodeLabelFontSize: number;
  nodeLabelTruncate: number;
  nodeLabelTextAlpha: number;
  connectionMaxDist: number;
  connectionBaseAlpha: number;
  connectionWidth: number;
  leoSize: number;
  leoSizeHovered: number;
  leoGlowLayers: number;
  catLabelFontSize: number;
  catLabelLineLength: number;
  catLabelDotRadius: number;
  mouseRepulsionRadius: number;
  explosiveRepulsionStrength: number;
  linkStrength: number;
  linkDistance: number;
};

export const defaultParams: SkillGraphParams = {
  velocityDecay: 0.69,
  categoryStrength: 0.012,
  collisionRadius: 15.5,
  collisionIterations: 2,
  centeringStrength: 0.0014,
  maxRadiusMultiplier: 0.85,
  innerRingFactor: 0.29,
  outerRingFactor: 0.95,
  clusterRadiusMax: 210,
  clusterRadiusBase: 46,
  clusterRadiusScale: 3.4,
  bubblePadding: 15,
  bubbleMaxExpansionFactor: 4,
  bubbleMinRadius: 60,
  bubbleFillAlpha: 0.04,
  bubbleStrokeAlpha: 0.46,
  bubbleStrokeWidth: 3.5,
  nodeBaseSize: 4,
  nodeRatingScale: 0.7,
  nodeGlowRadius: 3,
  nodeLabelFontSize: 8.5,
  nodeLabelTruncate: 14,
  nodeLabelTextAlpha: 0.79,
  connectionMaxDist: 70,
  connectionBaseAlpha: 0.21,
  connectionWidth: 0.8,
  leoSize: 11,
  leoSizeHovered: 16,
  leoGlowLayers: 6,
  catLabelFontSize: 8.5,
  catLabelLineLength: 17,
  catLabelDotRadius: 0,
  mouseRepulsionRadius: 80,
  explosiveRepulsionStrength: 107,
  linkStrength: 0.3,
  linkDistance: 150,
};

const CATEGORY_COLORS: Record<string, string> = {
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

const CATEGORY_DISPLAY: Record<string, string> = {
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

function ratingColor(rating: number): string {
  const t = (rating - 1) / 4;
  const r = Math.round(239 - t * (239 - 34));
  const g = Math.round(68 + t * (197 - 68));
  const b = Math.round(68 + t * (94 - 68));
  return `rgb(${r},${g},${b})`;
}

function ratingBright(rating: number): string {
  const t = (rating - 1) / 4;
  const r = Math.round(255 - t * (239 - 120));
  const g = Math.round(100 + t * (200 - 100));
  const b = Math.round(80 + t * (140 - 80));
  return `rgb(${r},${g},${b})`;
}

// Deep merge: combines bestehendeKeywords + neueKeywords per category
function deepMergeSkills(): Map<string, Record<string, number>> {
  const merged = new Map<string, Record<string, number>>();
  const src = skillsData as any;

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

function computeRingLayout(
  totalCats: number,
  cx: number,
  cy: number,
  radiusX: number,
  radiusY: number,
  params: SkillGraphParams
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];

  const innerCount = Math.max(2, Math.round(totalCats * 0.3));
  const outerCount = totalCats - innerCount;

  for (let i = 0; i < innerCount; i++) {
    const angle = (i / innerCount) * Math.PI * 2 - Math.PI / 2;
    positions.push({
      x: cx + Math.cos(angle) * radiusX * params.innerRingFactor,
      y: cy + Math.sin(angle) * radiusY * params.innerRingFactor,
    });
  }

  const outerAngleOffset = Math.PI / outerCount;
  for (let i = 0; i < outerCount; i++) {
    const angle = (i / outerCount) * Math.PI * 2 + outerAngleOffset - Math.PI / 2;
    positions.push({
      x: cx + Math.cos(angle) * radiusX * params.outerRingFactor,
      y: cy + Math.sin(angle) * radiusY * params.outerRingFactor,
    });
  }

  return positions;
}

function buildNodes(
  width: number,
  height: number,
  params: SkillGraphParams
): { nodes: SkillNode[]; categoryOrigins: Map<string, { x: number; y: number }> } {
  const allCats = deepMergeSkills();
  const cx = width / 2;
  const cy = height / 2;
  const catOrigins = new Map<string, { x: number; y: number }>();

  const catEntries = Array.from(allCats.entries()).map(([name, skills]) => ({
    name,
    skills,
    count: Object.keys(skills).length,
  }));
  catEntries.sort((a, b) => a.count - b.count);

  const catOriginsLocal = new Map<string, { x: number; y: number }>();
  const radiusX = (width / 2) * params.maxRadiusMultiplier;
  const radiusY = (height / 2) * params.maxRadiusMultiplier;
  const ringConfigs = computeRingLayout(catEntries.length, cx, cy, radiusX, radiusY, params);

  catEntries.forEach((cat, i) => {
    catOriginsLocal.set(cat.name, ringConfigs[i]);
    catOrigins.set(cat.name, ringConfigs[i]);
  });

  const nodes: SkillNode[] = [];

  for (const cat of catEntries) {
    const origin = catOriginsLocal.get(cat.name)!;
    const skillNames = Object.keys(cat.skills);
    const clusterRadius = Math.min(params.clusterRadiusMax, params.clusterRadiusBase + skillNames.length * params.clusterRadiusScale);

    skillNames.forEach((name, si) => {
      const frac = si / Math.max(1, skillNames.length - 1);
      const localGolden = Math.PI * (3 - Math.sqrt(5));
      const a = si * localGolden;
      const d = clusterRadius * (0.18 + frac * 0.82);

      const ox = origin.x + Math.cos(a) * d;
      const oy = origin.y + Math.sin(a) * d;

      nodes.push({
        name,
        rating: cat.skills[name],
        category: cat.name,
        x: ox,
        y: oy,
        vx: 0,
        vy: 0,
      });
    });
  }

  return { nodes, categoryOrigins: catOrigins };
}

export function SkillGraph({
  paramsRef,
  rebuildSignalRef,
}: {
  paramsRef?: MutableRefObject<SkillGraphParams>;
  rebuildSignalRef?: MutableRefObject<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<SkillNode[]>([]);
  const catOriginsRef = useRef<Map<string, { x: number; y: number }>>(
    new Map()
  );
  const animRef = useRef<number>(0);
  const hoverRef = useRef<SkillNode | null>(null);
  const dragRef = useRef<SkillNode | null>(null);
  const selectedRef = useRef<SkillNode | null>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const mouseDownRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const leoPosRef = useRef({ x: 0, y: 0 });
  const prevRebuildRef = useRef(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const dprRef = useRef<number>(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function fullResize() {
      if (!canvas || !ctx) return;
      const dpr = window.devicePixelRatio || 1;
      dprRef.current = dpr;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function rebuild() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const result = buildNodes(rect.width, rect.height, paramsRef?.current ?? defaultParams);
      nodesRef.current = result.nodes;
      catOriginsRef.current = result.categoryOrigins;
    }

    fullResize();
    leoPosRef.current = {
      x: canvas.getBoundingClientRect().width / 2,
      y: canvas.getBoundingClientRect().height / 2,
    };

    if (nodesRef.current.length === 0) {
      rebuild();
    }

    function getNodes() { return nodesRef.current; }

    // ── Physics + Draw loop ────────────────────────────────────────

    function animate() {
      if (!ctx || !canvas) return;

      // Check for rebuild signal (checked every frame)
      if (rebuildSignalRef && prevRebuildRef.current !== rebuildSignalRef.current) {
        rebuild();
        prevRebuildRef.current = rebuildSignalRef.current;
        selectedRef.current = null;
        dragRef.current = null;
        hoverRef.current = null;
      }

      const p = paramsRef?.current ?? defaultParams;
      const cw = canvas.width / dprRef.current;
      const ch = canvas.height / dprRef.current;
      const cxCenter = cw / 2;
      const cyCenter = ch / 2;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mouseDown = mouseDownRef.current;
      const dragged = dragRef.current;
      const hovered = hoverRef.current;
      const selected = selectedRef.current;

      const leoX = leoPosRef.current.x;
      const leoY = leoPosRef.current.y;

      const explosive = mouseDown && !selected && !dragged;

      const ns = getNodes();

      // ── 1. Apply forces to nodes ─────────────────────────────────

      for (const n of ns) {
        if (n === dragged) {
          n.x = mx - dragOffsetRef.current.x;
          n.y = my - dragOffsetRef.current.y;
          n.vx = 0;
          n.vy = 0;
          continue;
        }

        const catOrigin = catOriginsRef.current.get(n.category);
        if (catOrigin) {
          n.vx += (catOrigin.x - n.x) * p.categoryStrength;
          n.vy += (catOrigin.y - n.y) * p.categoryStrength;
        }

        n.vx += (cxCenter - n.x) * p.centeringStrength;
        n.vy += (cyCenter - n.y) * p.centeringStrength;

        if (n === hovered && !dragged && !selected) {
          n.vx += (mx - n.x) * 0.04;
          n.vy += (my - n.y) * 0.04;
        }

        // Leo repulsion — push nodes away from center
        const ldx = n.x - leoX;
        const ldy = n.y - leoY;
        const ld = Math.sqrt(ldx * ldx + ldy * ldy);
        const leoRepelDist = 40;
        if (ld < leoRepelDist && ld > 0) {
          const force = ((leoRepelDist - ld) / ld) * 0.18;
          n.vx += ldx * force;
          n.vy += ldy * force;
        }

        // Mouse interaction
        const mdx = n.x - mx;
        const mdy = n.y - my;
        const md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md > 0) {
          if (explosive) {
            if (md < p.mouseRepulsionRadius) {
              const force = ((p.mouseRepulsionRadius - md) / p.mouseRepulsionRadius) * p.explosiveRepulsionStrength;
              n.vx += (mdx / md) * force;
              n.vy += (mdy / md) * force;
              n.vx += (Math.random() - 0.5) * 10;
              n.vy += (Math.random() - 0.5) * 10;
            }
          } else {
            // Docking: attract nodes toward mouse so they're clickable
            const dockingRadius = 60;
            if (md < dockingRadius && md > 1) {
              const force = ((dockingRadius - md) / dockingRadius) * 3;
              n.vx -= (mdx / md) * force;
              n.vy -= (mdy / md) * force;
            }
          }
        }
      }

      // ── 2. Iterative collision detection (position-based, D3-style) ─

      for (let iter = 0; iter < p.collisionIterations; iter++) {
        for (let i = 0; i < ns.length; i++) {
          for (let j = i + 1; j < ns.length; j++) {
            const a = ns[i];
            const b = ns[j];
            if (a === dragged || b === dragged) continue;
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = p.collisionRadius * 2;
            if (dist < minDist && dist > 0.01) {
              const strength = 0.5;
              const shift = ((minDist - dist) / dist) * strength;
              const fx = dx * shift;
              const fy = dy * shift;
              a.x -= fx;
              a.y -= fy;
              b.x += fx;
              b.y += fy;
            }
          }
        }
      }

      // ── 2.5. Link forces — D3 forceLink: spring between nearby same-category nodes ─

      const linkRange = p.linkDistance * 1.5;
      for (let i = 0; i < ns.length; i++) {
        for (let j = i + 1; j < ns.length; j++) {
          const a = ns[i];
          const b = ns[j];
          if (a.category !== b.category) continue;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < linkRange && dist > 0.01) {
            const ux = dx / dist;
            const uy = dy / dist;
            const f = ((dist - p.linkDistance) / dist) * p.linkStrength;
            a.vx += ux * f;
            a.vy += uy * f;
            b.vx -= ux * f;
            b.vy -= uy * f;
          }
        }
      }

      // ── 3. Apply velocities with damping ─────────────────────────

      for (const n of ns) {
        if (n === dragged) continue;
        n.vx *= p.velocityDecay;
        n.vy *= p.velocityDecay;
        n.x += n.vx;
        n.y += n.vy;
        n.x = Math.max(16, Math.min(cw - 16, n.x));
        n.y = Math.max(16, Math.min(ch - 16, n.y));
      }

      // ── DRAW ─────────────────────────────────────────────────────

      ctx.clearRect(0, 0, cw, ch);

      // Compute live category centroids for drawing
      const catMeta = new Map<
        string,
        {
          sx: number;
          sy: number;
          count: number;
          avgDist: number;
          nodes: SkillNode[];
        }
      >();

      for (const n of ns) {
        let m = catMeta.get(n.category);
        if (!m) {
          m = { sx: 0, sy: 0, count: 0, avgDist: 0, nodes: [] };
          catMeta.set(n.category, m);
        }
        m.sx += n.x;
        m.sy += n.y;
        m.count += 1;
        m.nodes.push(n);
      }

      for (const [, m] of catMeta) {
        m.sx /= m.count;
        m.sy /= m.count;
        let sumDist = 0;
        for (const n of m.nodes) {
          const dx = n.x - m.sx;
          const dy = n.y - m.sy;
          sumDist += Math.sqrt(dx * dx + dy * dy);
        }
        m.avgDist = sumDist / m.count;
      }

      let leoHovered = false;
      const ldx = leoX - mx;
      const ldy = leoY - my;
      if (Math.sqrt(ldx * ldx + ldy * ldy) < 30) leoHovered = true;

      const activeNode = dragged || hovered;
      const highlightedNode = dragged || selected || hovered;

      // 1. Category bubbles — each group independently
      for (const [cat, meta] of catMeta) {
        if (meta.count < 3) continue;

        const cx = meta.sx;
        const cy = meta.sy;
        const maxBubbleDist = Math.max(meta.avgDist * p.bubbleMaxExpansionFactor, p.bubbleMinRadius);

        const nearby = meta.nodes.filter((n) => {
          const dx = n.x - cx;
          const dy = n.y - cy;
          return Math.sqrt(dx * dx + dy * dy) <= maxBubbleDist;
        });

        if (nearby.length < 3) continue;

        const outerPts = nearby.map((n) => {
          const dx = n.x - cx;
          const dy = n.y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          return {
            x: n.x + (dx / dist) * p.bubblePadding,
            y: n.y + (dy / dist) * p.bubblePadding,
          };
        });

        outerPts.sort(
          (a, b) =>
            Math.atan2(a.y - cy, a.x - cx) -
            Math.atan2(b.y - cy, b.x - cx)
        );

        ctx.beginPath();
        if (outerPts.length > 0) {
          ctx.moveTo(outerPts[0].x, outerPts[0].y);
          for (let i = 1; i < outerPts.length; i++) {
            const prev = outerPts[i - 1];
            const curr = outerPts[i];
            ctx.quadraticCurveTo(
              prev.x,
              prev.y,
              (prev.x + curr.x) / 2,
              (prev.y + curr.y) / 2
            );
          }
          const last = outerPts[outerPts.length - 1];
          const first = outerPts[0];
          ctx.quadraticCurveTo(
            last.x,
            last.y,
            (last.x + first.x) / 2,
            (last.y + first.y) / 2
          );
        }
        ctx.closePath();

        ctx.fillStyle = (
          CATEGORY_COLORS[cat] || "rgba(148,163,184,0.25)"
        ).replace("0.25", p.bubbleFillAlpha.toFixed(2));
        ctx.fill();

        ctx.strokeStyle = (
          CATEGORY_COLORS[cat] || "rgba(148,163,184,0.25)"
        ).replace("0.25", p.bubbleStrokeAlpha.toFixed(2));
        ctx.lineWidth = p.bubbleStrokeWidth;
        ctx.setLineDash([5, 9]);
        ctx.stroke();
        ctx.setLineDash([]);

        const displayName = CATEGORY_DISPLAY[cat] || cat;

        let bestIdx = 0;
        let bestDist = -Infinity;
        for (let i = 0; i < outerPts.length; i++) {
          const dx = outerPts[i].x - leoX;
          const dy = outerPts[i].y - leoY;
          const d = dx * dx + dy * dy;
          if (d > bestDist) {
            bestDist = d;
            bestIdx = i;
          }
        }

        const anchorPt = outerPts[bestIdx];
        const labelDirX = anchorPt.x - cx;
        const labelDirY = anchorPt.y - cy;
        const labelDirLen =
          Math.sqrt(labelDirX * labelDirX + labelDirY * labelDirY) || 1;

        const labelX = anchorPt.x + (labelDirX / labelDirLen) * p.catLabelLineLength;
        const labelY = anchorPt.y + (labelDirY / labelDirLen) * p.catLabelLineLength;
        const lineStartX = anchorPt.x;
        const lineStartY = anchorPt.y;

        ctx.beginPath();
        ctx.moveTo(lineStartX, lineStartY);
        ctx.lineTo(labelX, labelY);
        ctx.strokeStyle = (
          CATEGORY_COLORS[cat] || "rgba(148,163,184,0.4)"
        ).replace("0.25", "0.40");
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.arc(lineStartX, lineStartY, p.catLabelDotRadius, 0, Math.PI * 2);
        ctx.fillStyle = (
          CATEGORY_COLORS[cat] || "rgba(148,163,184,0.5)"
        ).replace("0.25", "0.50");
        ctx.fill();

        ctx.font =
          `600 ${p.catLabelFontSize}px -apple-system, BlinkMacSystemFont, 'JetBrains Mono', sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = (
          CATEGORY_COLORS[cat] || "rgba(148,163,184,0.7)"
        ).replace("0.25", "0.70");
        ctx.fillText(displayName, labelX, labelY);
      }

      // 2. Leo → category connections
      for (const [, meta] of catMeta) {
        ctx.beginPath();
        ctx.moveTo(leoX, leoY);
        ctx.lineTo(meta.sx, meta.sy);
        ctx.strokeStyle = "rgba(167,139,250,0.12)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // 3. Inter-node connections (proximity-based, same category)
      for (let i = 0; i < ns.length; i++) {
        for (let j = i + 1; j < ns.length; j++) {
          const a = ns[i];
          const b = ns[j];
          if (a.category !== b.category) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist >= p.connectionMaxDist) continue;

          const isHighlighted =
            highlightedNode &&
            (a === highlightedNode || b === highlightedNode);
          const baseAlpha = p.connectionBaseAlpha;
          const alpha = baseAlpha * (1 - dist / p.connectionMaxDist);
          if (alpha <= 0.01) continue;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          if (isHighlighted) {
            const hi = highlightedNode!;
            ctx.strokeStyle = ratingBright(hi.rating)
              .replace("rgb", "rgba")
              .replace(")", `,${alpha})`);
          } else {
            ctx.strokeStyle = `rgba(167,139,250,${alpha})`;
          }
          ctx.lineWidth = p.connectionWidth;
          ctx.stroke();
        }
      }

      // 4. Draw nodes with text labels
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const n of ns) {
        const isActive = n === activeNode;
        const isHighlighted = n === highlightedNode;
        const scale = isActive ? 1.35 : 1;
        const baseSize = p.nodeBaseSize + n.rating * p.nodeRatingScale;

        ctx.beginPath();
        ctx.arc(n.x, n.y, (baseSize + p.nodeGlowRadius) * scale, 0, Math.PI * 2);
        if (isHighlighted) {
          ctx.fillStyle = ratingBright(n.rating)
            .replace("rgb", "rgba")
            .replace(")", ",0.50)");
        } else {
          ctx.fillStyle = "rgba(167,139,250,0.18)";
        }
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, baseSize * scale, 0, Math.PI * 2);
        ctx.fillStyle = isHighlighted
          ? ratingBright(n.rating)
          : ratingColor(n.rating);
        ctx.fill();

        if (isHighlighted) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, baseSize * scale + 2.5, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255,255,255,0.85)";
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        const fontSize = p.nodeLabelFontSize;
        const fontWeight = isHighlighted ? 600 : 400;
        ctx.font = `${fontWeight} ${fontSize}px -apple-system, BlinkMacSystemFont, 'JetBrains Mono', monospace`;
        const textAlpha = isHighlighted ? 1 : p.nodeLabelTextAlpha;
        const textColor = ratingBright(n.rating)
          .replace("rgb", "rgba")
          .replace(")", `,${textAlpha})`);
        ctx.fillStyle = textColor;

        let label = n.name;
        if (label.length > p.nodeLabelTruncate && !isHighlighted) {
          label = label.slice(0, p.nodeLabelTruncate - 2) + "\u2026";
        }
        ctx.fillText(label, n.x, n.y + baseSize * scale + 8);
      }

      // 5. Central Leo node
      {
        const leoSize = leoHovered ? p.leoSizeHovered : p.leoSize;
        for (let g = p.leoGlowLayers; g >= 1; g--) {
          ctx.beginPath();
          ctx.arc(leoX, leoY, leoSize + g * 7, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(167,139,250,${0.07 / g})`;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(leoX, leoY, leoSize, 0, Math.PI * 2);
        ctx.fillStyle = leoHovered
          ? "rgba(200,180,255,0.95)"
          : "rgba(167,139,250,0.78)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(leoX, leoY, leoSize + 2, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.55)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.font = "600 12px -apple-system, BlinkMacSystemFont, sans-serif";
        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Leo", leoX, leoY + leoSize + 12);
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animate();

    const resizeObserver = new ResizeObserver(() => {
      fullResize();
      leoPosRef.current = {
        x: canvas.getBoundingClientRect().width / 2,
        y: canvas.getBoundingClientRect().height / 2,
      };
      rebuild();
      selectedRef.current = null;
      dragRef.current = null;
      hoverRef.current = null;
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animRef.current);
      resizeObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Hit-test ───────────────────────────────────────────────────

  const getNodeAtMouse = (mx: number, my: number): SkillNode | null => {
    const nodes = nodesRef.current;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      const dx = n.x - mx;
      const dy = n.y - my;
      if (Math.sqrt(dx * dx + dy * dy) < 14) return n;
    }
    return null;
  };

  const deselectNode = (node: SkillNode) => {
    const catOrigin = catOriginsRef.current.get(node.category);
    if (catOrigin) {
      node.vx = (catOrigin.x - node.x) * 0.3;
      node.vy = (catOrigin.y - node.y) * 0.3;
    }
    selectedRef.current = null;
    hoverRef.current = null;
    dragRef.current = null;
  };

  const resetAll = () => {
    const nodes = nodesRef.current;
    for (const n of nodes) {
      const catOrigin = catOriginsRef.current.get(n.category);
      if (catOrigin) {
        n.vx = (catOrigin.x - n.x) * 0.12;
        n.vy = (catOrigin.y - n.y) * 0.12;
      }
    }
    selectedRef.current = null;
    hoverRef.current = null;
    dragRef.current = null;
  };

  // ── Mouse handlers ────────────────────────────────────────────

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    mouseDownRef.current = true;
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    mouseRef.current = { x: mx, y: my };

    // Leo click → reset all
    const leoX = leoPosRef.current.x;
    const leoY = leoPosRef.current.y;
    const distToLeo = Math.sqrt((mx - leoX) ** 2 + (my - leoY) ** 2);
    if (distToLeo < 34) {
      resetAll();
      mouseDownRef.current = true;
      return;
    }

    const node = getNodeAtMouse(mx, my);
    if (node) {
      if (node === selectedRef.current) {
        deselectNode(node);
      } else {
        if (selectedRef.current) {
          deselectNode(selectedRef.current);
        }
        selectedRef.current = node;
        dragRef.current = node;
        hoverRef.current = node;
        dragOffsetRef.current = { x: mx - node.x, y: my - node.y };
      }
    } else {
      if (selectedRef.current) {
        deselectNode(selectedRef.current);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    mouseRef.current = { x: mx, y: my };

    if (dragRef.current) {
      hoverRef.current = dragRef.current;
    } else {
      hoverRef.current = getNodeAtMouse(mx, my);
    }
  };

  const handleMouseUp = () => {
    mouseDownRef.current = false;
    if (dragRef.current) {
      const n = dragRef.current;
      const catOrigin = catOriginsRef.current.get(n.category);
      if (catOrigin) {
        n.vx = (catOrigin.x - n.x) * 0.15;
        n.vy = (catOrigin.y - n.y) * 0.15;
      }
    }
    dragRef.current = null;
    hoverRef.current = getNodeAtMouse(mouseRef.current.x, mouseRef.current.y);
  };

  const handleMouseLeave = () => {
    mouseDownRef.current = false;
    dragRef.current = null;
    hoverRef.current = null;
    mouseRef.current = { x: -200, y: -200 };
  };

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: "calc(100vh - 5rem)" }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full cursor-crosshair rounded-xl"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          background: "rgb(8,10,18)",
          touchAction: "none",
        }}
      />
    </div>
  );
}
