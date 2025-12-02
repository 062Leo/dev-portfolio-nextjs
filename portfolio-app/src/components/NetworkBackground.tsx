"use client";

import { useEffect, useRef, useState } from "react";
import { getColor } from "@/components/colors";

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

export function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const handleThemeChange = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    handleThemeChange();

    return () => observer.disconnect();
  }, []);

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
    const colors = getColor(isDarkMode);
    const strokeBase = colors.networkStroke;
    const circleBase = colors.networkCircle;

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
        duration:
          MIN_SHIFT_DURATION + Math.random() * (MAX_SHIFT_DURATION - MIN_SHIFT_DURATION),
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

      point.closest.forEach((closestPoint) => {
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.lineTo(closestPoint.x, closestPoint.y);
        // Replace the alpha value in the rgba string
        context.strokeStyle = strokeBase.replace(/[\d.]+\)$/, `${point.active})`);
        context.stroke();
      });
    };

    const drawCircle = (point: Point) => {
      if (!point.circle.active) {
        return;
      }
      context.beginPath();
      context.arc(point.x, point.y, point.circle.radius, 0, Math.PI * 2, false);
      // Replace the alpha value in the rgba string
      context.fillStyle = circleBase.replace(/[\d.]+\)$/, `${point.circle.active})`);
      context.fill();
    };

    const animate = (now: number) => {
      context.clearRect(0, 0, width, height);

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

    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      target.x = clientX;
      target.y = clientY;
    };

    const handleResize = () => {
      configureCanvasSize();
      target.x = width / 2;
      target.y = height / 2;
      initialisePoints();
    };

    configureCanvasSize();
    initialisePoints();
    target.x = width / 2;
    target.y = height / 2;
    animationFrameId = window.requestAnimationFrame(animate);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [isDarkMode]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background: getColor(isDarkMode).networkBackground,
      }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
