"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { useThemeColors } from "@/components/colors";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/#about" },
  { name: "Skills", href: "/#skills" },
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/#contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const colors = useThemeColors(isDarkMode);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedTheme = window.localStorage.getItem("theme");
    if (storedTheme) {
      setIsDarkMode(storedTheme === "dark");
    }
  }, []);

  return (
    <nav
      className={cn(
        "fixed z-40 w-full transition-all duration-300",
        isScrolled ? "py-3 bg-background/80 backdrop-blur-md shadow-sm" : "py-5",
      )}
      style={{ backgroundColor: isScrolled ? `${colors.navbarBackground}cc` : "transparent" }}
    >
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex items-center text-xl font-bold">
          <span className="relative z-10">
            <span className="text-glow" style={{ color: colors.navbarTitleColor }}>
              Leo's
            </span>
            <span
              className="text-glow"
              style={{
                color: colors.navbarLinkHover,
                textShadow: colors.navbarTitleGlow,
              }}
            >
              {' Portfolio'}
            </span>
          </span>
        </Link>

        <div className="hidden space-x-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="transition-colors duration-300"
              style={{ color: colors.navbarLinkText }}
              onMouseEnter={(event) => (event.currentTarget.style.color = colors.navbarLinkHover)}
              onMouseLeave={(event) => (event.currentTarget.style.color = colors.navbarLinkText)}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="z-50 p-2 md:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          style={{ color: colors.navbarTitleColor }}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div
          className={cn(
            "fixed inset-0 z-40 flex flex-col items-center justify-center bg-background/95 backdrop-blur-md transition-all duration-300 md:hidden",
            isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
          )}
          style={{ backgroundColor: colors.navbarMenuBackdrop }}
        >
          <div className="flex flex-col space-y-8 text-xl">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="transition-colors duration-300"
                style={{ color: colors.navbarMenuText }}
                onMouseEnter={(event) => (event.currentTarget.style.color = colors.navbarLinkHover)}
                onMouseLeave={(event) => (event.currentTarget.style.color = colors.navbarMenuText)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
