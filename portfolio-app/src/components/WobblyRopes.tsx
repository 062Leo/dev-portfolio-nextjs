"use client";

import React, { useEffect, useRef, useCallback } from "react";

interface RopePoint {
  x: number;
  y: number;
  oldX: number;
  oldY: number;
  pinned: boolean;
}

interface RopeLink {
  p1: RopePoint;
  p2: RopePoint;
  length: number;
}

interface RopeState {
  points: RopePoint[];
  links: RopeLink[];
}

export interface RopeTarget {
  start: { x: number; y: number };
  end: { x: number; y: number };
  outputX: number;
  outputY: number;
  outputAngle: number;
}

interface WobblyRopesProps {
  ropeTargetsRef: React.MutableRefObject<Map<number, RopeTarget>>;
  colors?: Map<number, string>;
  damping?: number;
  stiffness?: number;
  segments?: number;
  lineWidth?: number;
  defaultColor?: string;
}

export const WobblyRopes: React.FC<WobblyRopesProps> = ({
  ropeTargetsRef,
  colors = new Map(),
  damping = 0.88,
  stiffness = 0.25,
  segments = 10,
  lineWidth = 3,
  defaultColor = "rgba(106,176,112,0.45)",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ropeStatesRef = useRef<Map<number, RopeState>>(new Map());

  const syncRopeStates = useCallback(() => {
    const targets = ropeTargetsRef.current;
    const states = ropeStatesRef.current;

    for (const gi of states.keys()) {
      if (!targets.has(gi)) states.delete(gi);
    }

    for (const [gi, target] of targets.entries()) {
      if (target.start.x === 0 && target.start.y === 0 && target.end.x === 0 && target.end.y === 0) continue;
      if (states.has(gi)) continue;

      const dist = Math.sqrt((target.end.x - target.start.x) ** 2 + (target.end.y - target.start.y) ** 2);
      if (dist < 1) continue;

      const segLen = dist / segments;
      const points: RopePoint[] = [];
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const px = target.start.x + (target.end.x - target.start.x) * t;
        const py = target.start.y + (target.end.y - target.start.y) * t;
        points.push({ x: px, y: py, oldX: px, oldY: py, pinned: i === 0 });
      }
      const links: RopeLink[] = [];
      for (let i = 0; i < segments; i++) {
        links.push({ p1: points[i], p2: points[i + 1], length: segLen });
      }
      states.set(gi, { points, links });
    }
  }, [segments, ropeTargetsRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ro = new ResizeObserver(() => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    });
    ro.observe(canvas);

    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    syncRopeStates();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const updatePhysics = () => {
      const targets = ropeTargetsRef.current;
      const states = ropeStatesRef.current;

      for (const [gi, state] of states.entries()) {
        const target = targets.get(gi);
        if (!target) continue;

        const { points, links } = state;
        if (points.length === 0) continue;

        const lastIdx = points.length - 1;

        // Pin start point (hull boundary)
        points[0].x = target.start.x;
        points[0].y = target.start.y;

        const tx = target.end.x;
        const ty = target.end.y;

        // Verlet integration for all non-start points (last point is free → wobbles)
        for (let i = 1; i <= lastIdx; i++) {
          const p = points[i];
          const vx = (p.x - p.oldX) * damping;
          const vy = (p.y - p.oldY) * damping;
          p.oldX = p.x;
          p.oldY = p.y;
          p.x += vx;
          p.y += vy;

          // Soft spring toward anchor on last point (pricetag swings freely)
          if (i === lastIdx) {
            p.x += (tx - p.x) * 0.015;
            p.y += (ty - p.y) * 0.015;
          }
        }

        // Constraint resolution (only start point is pinned)
        const iterations = 5;
        for (let k = 0; k < iterations; k++) {
          for (const link of links) {
            const isP1Pinned = link.p1 === points[0];
            const isP2Pinned = link.p2 === points[0];

            const dx = link.p2.x - link.p1.x;
            const dy = link.p2.y - link.p1.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 1e-6) continue;
            const diff = link.length - dist;
            const percent = (diff / dist) * 0.5 * stiffness;
            const offX = dx * percent;
            const offY = dy * percent;

            if (!isP1Pinned) { link.p1.x -= offX; link.p1.y -= offY; }
            if (!isP2Pinned) { link.p2.x += offX; link.p2.y += offY; }
          }
        }

        target.outputX = points[lastIdx].x;
        target.outputY = points[lastIdx].y;

        const avgSegs = Math.min(3, lastIdx);
        let avgDx = 0;
        let avgDy = 0;
        for (let i = lastIdx - avgSegs; i < lastIdx; i++) {
          avgDx += points[i + 1].x - points[i].x;
          avgDy += points[i + 1].y - points[i].y;
        }
        target.outputAngle = Math.atan2(avgDy, avgDx);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const states = ropeStatesRef.current;

      for (const [gi, state] of states.entries()) {
        const { points } = state;
        if (points.length === 0) continue;

        const color = colors.get(gi) || defaultColor;

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        ctx.stroke();
      }
    };

    const loop = () => {
      syncRopeStates();
      updatePhysics();
      draw();
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [syncRopeStates, damping, stiffness, colors, defaultColor, lineWidth]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 10,
      }}
    />
  );
};
