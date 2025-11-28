"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const getInitialTheme = () => {
  if (typeof window === "undefined") {
    return true;
  }

  const storedTheme = window.localStorage.getItem("theme");
  if (storedTheme) {
    return storedTheme === "dark";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const prefersDark = getInitialTheme();
    setIsDarkMode(prefersDark);
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      window.localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      window.localStorage.setItem("theme", "light");
    }
  }, [isDarkMode, isReady]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  if (!isReady) {
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed right-5 top-5 z-50 rounded-full p-2 transition-colors duration-300 focus:outline-none max-sm:hidden"
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <Sun className="h-6 w-6 text-yellow-300" />
      ) : (
        <Moon className="h-6 w-6 text-blue-900" />
      )}
    </button>
  );
}
