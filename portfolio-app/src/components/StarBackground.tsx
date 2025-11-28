"use client";

import { useCallback, useEffect, useState } from "react";

type Star = {
  id: number;
  size: number;
  x: number;
  y: number;
  opacity: number;
  animationDuration: number;
};

type Meteor = {
  id: number;
  size: number;
  x: number;
  y: number;
  animationDuration: number;
  delay: number;
};

export function StarBackground() {
  const createStars = useCallback((): Star[] => {
    if (typeof window === "undefined") {
      return [];
    }

    const numberOfStars = Math.floor((window.innerWidth * window.innerHeight) / 10000);
    return Array.from({ length: numberOfStars }, (_, index) => ({
      id: index,
      size: Math.random() * 3 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: Math.random() * 0.5 + 0.5,
      animationDuration: Math.random() * 4 + 2,
    }));
  }, []);

  const createMeteors = useCallback((): Meteor[] => {
    if (typeof window === "undefined") {
      return [];
    }

    const numberOfMeteors = 5;
    return Array.from({ length: numberOfMeteors }, (_, index) => ({
      id: index,
      size: Math.random() * 2 + 1,
      x: Math.random() * 100,
      y: Math.random() * 80,
      animationDuration: Math.random() * 3 + 3,
      delay: Math.random() * 5,
    }));
  }, []);

  const [stars, setStars] = useState<Star[]>([]);
  const [meteors, setMeteors] = useState<Meteor[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleResize = () => {
      setStars(createStars());
      setMeteors(createMeteors());
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [createStars, createMeteors]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {stars.map((star) => (
        <div
          key={`star-${star.id}`}
          className="star animate-pulse-subtle"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.x}%`,
            top: `${star.y}%`,
            opacity: star.opacity,
            animationDuration: `${star.animationDuration}s`,
          }}
        />
      ))}

      {meteors.map((meteor) => (
        <div
          key={`meteor-${meteor.id}`}
          className="meteor animate-meteor"
          style={{
            width: `${meteor.size * 30}px`,
            height: `${meteor.size}px`,
            left: `${meteor.x}%`,
            top: `${meteor.y}%`,
            animationDelay: `${meteor.delay}s`,
            animationDuration: `${meteor.animationDuration}s`,
          }}
        />
      ))}
    </div>
  );
}
