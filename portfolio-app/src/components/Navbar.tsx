"use client";

import { useEffect, useState } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { useThemeColors, applyThemeColors } from "@/components/colors";
import { useLanguage } from "@/context/LanguageContext";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { language, setLanguage } = useLanguage();
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

    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(prefersDark);
    applyThemeColors(prefersDark);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      applyThemeColors(next);
      return next;
    });
  };

  const toggleLanguage = () => {
    setLanguage(language === "de" ? "en" : "de");
  };

  const navItems =
    language === "de"
      ? [
          { name: "Home", href: "/" },
          { name: "Über mich", href: "/#about" },
          // { name: "Skills", href: "/#skills" },
          { name: "Projekte", href: "/projects" },
          { name: "Kontakt", href: "/#contact" },
        ]
      : [
          { name: "Home", href: "/" },
          { name: "About", href: "/#about" },
          // { name: "Skills", href: "/#skills" },
          { name: "Projects", href: "/projects" },
          { name: "Contact", href: "/#contact" },
        ];

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

        <div className="hidden space-x-8 md:flex flex-1 ml-190">
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

        <div className="hidden md:flex items-center gap-4 ml-auto">
          {/* Language Toggle Button */}
          <button
            onClick={toggleLanguage}
            className="z-50 focus:outline-none"
            aria-label="Toggle language"
          >
            <div className="relative">
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300"
                style={{
                  width: '1.8rem',
                  height: '1.8rem',
                  backgroundColor: colors.languageToggleBgColor
                }}
              />
              <div className="relative h-6 w-6 overflow-hidden rounded-full z-10">
                <Image
                  src={language === 'de' ? "/Icons/de_flag.png" : "/Icons/en_flag.png"}
                  alt={language === 'de' ? "Deutsch" : "English"}
                  fill
                  className="transition-opacity duration-300 object-cover"
                  priority
                />
              </div>
            </div>
          </button>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="z-50 rounded-full transition-colors duration-300 focus:outline-none"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="h-6 w-6" style={{ color: colors.navbarLinkText }} />
            ) : (
              <Moon className="h-6 w-6" style={{ color: colors.navbarLinkText }} />
            )}
          </button>
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
