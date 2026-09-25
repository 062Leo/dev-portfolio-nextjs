"use client";

import { useEffect, useRef } from "react";
import { readToken } from "@/lib/theme";

type ShiftState = {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  startTime: number;
  duration: number;
};

type Circle = {
  radius: number;
  active: number;
};

type Point = {
  x: number;
  y: number;
  originX: number;
  originY: number;
  active: number;
  closest: Point[];
  circle: Circle;
  shift?: ShiftState;
};

type Target = {
  x: number;
  y: number;
};

const CLOSEST_NEIGHBOURS = 5;
const GRID_DIVISOR = 20;
const MIN_SHIFT_DURATION = 1000;
const MAX_SHIFT_DURATION = 2000;

// Without a mouse (touch devices) the focus point wanders on its own: it eases from one
// random waypoint to the next so the network keeps moving instead of only reacting to
// taps. A tap pulls the point to the finger and the wandering continues from there.
const NO_HOVER_QUERY = "(hover: none)";
const MIN_WANDER_DURATION = 3000;
const MAX_WANDER_DURATION = 6000;
const WANDER_MARGIN = 0.15; // fraction of width/height kept free at the edges

export function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    let width = 0;
    let height = 0;
    const target: Target = { x: 0, y: 0 };
    let animationFrameId = 0;
    let points: Point[] = [];
    // Wandering is on while no mouse has been seen; the first real mouse move ends it.
    let wandering = window.matchMedia(NO_HOVER_QUERY).matches;
    let wander: ShiftState | null = null;
    // Canvas colours come from the tokens in globals.css; the per-point fade is drawn
    // with globalAlpha.
    const strokeColor = readToken("accent-2");
    const circleColor = readToken("sky");

    const getDistance = (p1: Target, p2: Target) => {
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      return dx * dx + dy * dy;
    };

    const easeInOutCirc = (t: number) => {
      if (t < 0.5) {
        return (1 - Math.sqrt(1 - 4 * t * t)) / 2;
      }
      return (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2;
    };

    const configureCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initialisePoints = () => {
      const generatedPoints: Point[] = [];
      const gridX = width / GRID_DIVISOR;
      const gridY = height / GRID_DIVISOR;

      for (let x = 0; x < width; x += gridX) {
        for (let y = 0; y < height; y += gridY) {
          const px = x + Math.random() * gridX;
          const py = y + Math.random() * gridY;
          generatedPoints.push({
            x: px,
            y: py,
            originX: px,
            originY: py,
            active: 0,
            closest: [],
            circle: {
              radius: 2 + Math.random() * 2,
              active: 0,
            },
          });
        }
      }

      generatedPoints.forEach((point) => {
        const neighbours = [...generatedPoints]
          .filter((candidate) => candidate !== point)
          .sort((a, b) => getDistance(point, a) - getDistance(point, b))
          .slice(0, CLOSEST_NEIGHBOURS);
        point.closest = neighbours;
      });

      const now = performance.now();
      generatedPoints.forEach((point) => startShift(point, now));

      points = generatedPoints;
    };

    const startShift = (point: Point, now: number) => {
      point.shift = {
        startX: point.x,
        startY: point.y,
        targetX: point.originX - 50 + Math.random() * 100,
        targetY: point.originY - 50 + Math.random() * 100,
        startTime: now,
        duration: MIN_SHIFT_DURATION + Math.random() * (MAX_SHIFT_DURATION - MIN_SHIFT_DURATION),
      };
    };

    const updatePointPosition = (point: Point, now: number) => {
      if (!point.shift) {
        startShift(point, now);
        return;
      }

      const { startX, startY, targetX, targetY, startTime, duration } = point.shift;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCirc(progress);

      point.x = startX + (targetX - startX) * eased;
      point.y = startY + (targetY - startY) * eased;

      if (progress >= 1) {
        startShift(point, now);
      }
    };

    const drawLines = (point: Point) => {
      if (!point.active) {
        return;
      }

      context.globalAlpha = point.active;
      context.strokeStyle = strokeColor;
      point.closest.forEach((closestPoint) => {
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.lineTo(closestPoint.x, closestPoint.y);
        context.stroke();
      });
    };

    const drawCircle = (point: Point) => {
      if (!point.circle.active) {
        return;
      }
      context.globalAlpha = point.circle.active;
      context.fillStyle = circleColor;
      context.beginPath();
      context.arc(point.x, point.y, point.circle.radius, 0, Math.PI * 2, false);
      context.fill();
    };

    const startWander = (now: number) => {
      wander = {
        startX: target.x,
        startY: target.y,
        targetX: width * (WANDER_MARGIN + Math.random() * (1 - 2 * WANDER_MARGIN)),
        targetY: height * (WANDER_MARGIN + Math.random() * (1 - 2 * WANDER_MARGIN)),
        startTime: now,
        duration: MIN_WANDER_DURATION + Math.random() * (MAX_WANDER_DURATION - MIN_WANDER_DURATION),
      };
    };

    const updateWanderingTarget = (now: number) => {
      if (!wandering) return;
      if (!wander) {
        startWander(now);
        return;
      }
      const { startX, startY, targetX, targetY, startTime, duration } = wander;
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = easeInOutCirc(progress);
      target.x = startX + (targetX - startX) * eased;
      target.y = startY + (targetY - startY) * eased;
      if (progress >= 1) startWander(now);
    };

    const animate = (now: number) => {
      context.globalAlpha = 1;
      context.clearRect(0, 0, width, height);
      updateWanderingTarget(now);

      points.forEach((point) => {
        updatePointPosition(point, now);

        const distance = Math.abs(getDistance(target, point));
        if (distance < 4000) {
          point.active = 0.3;
          point.circle.active = 0.6;
        } else if (distance < 20000) {
          point.active = 0.1;
          point.circle.active = 0.3;
        } else if (distance < 40000) {
          point.active = 0.02;
          point.circle.active = 0.1;
        } else {
          point.active = 0;
          point.circle.active = 0;
        }

        drawLines(point);
        drawCircle(point);
      });

      animationFrameId = window.requestAnimationFrame(animate);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "mouse") {
        wandering = false;
        wander = null;
      }
      target.x = event.clientX;
      target.y = event.clientY;
    };

    // A tap pulls the focus point to the finger; the next wander segment starts there.
    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse") return;
      target.x = event.clientX;
      target.y = event.clientY;
      wander = null;
    };

    const handleResize = () => {
      configureCanvasSize();
      target.x = width / 2;
      target.y = height / 2;
      wander = null;
      initialisePoints();
    };

    configureCanvasSize();
    initialisePoints();
    target.x = width / 2;
    target.y = height / 2;
    animationFrameId = window.requestAnimationFrame(animate);

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="network-backdrop pointer-events-none fixed inset-0 z-0">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
