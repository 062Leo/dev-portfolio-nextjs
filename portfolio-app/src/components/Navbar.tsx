"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { useThemeColors, applyThemeColors } from "@/components/colors";
import { useLanguage } from "@/context/LanguageContext";
import { useT, type Lang } from "@/i18n";

const OTHER_LANGUAGE: Record<Lang, Lang> = { de: "en", en: "de" };

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // theme is always dark
  const { language, setLanguage } = useLanguage();
  const t = useT();
  const colors = useThemeColors(true);

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
    // ensure CSS variables / classes for dark theme are applied
    if (typeof document !== "undefined") {
      document.documentElement.classList.add("dark");
    }
    applyThemeColors(true);
  }, []);

  const toggleLanguage = () => {
    setLanguage(OTHER_LANGUAGE[language]);
  };

  const flag = (
    <div className="relative">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300"
        style={{
          width: "1.8rem",
          height: "1.8rem",
          backgroundColor: colors.languageToggleBgColor,
        }}
      />
      <div className="relative h-6 w-6 overflow-hidden rounded-full z-10">
        <Image
          src={`/Icons/${language}_flag.png`}
          alt={t.nav.currentLanguage}
          sizes="(max-width: 768px) 24px, 24px"
          fill
          className="transition-opacity duration-300 object-cover"
          priority
        />
      </div>
    </div>
  );

  const navItems = [
    { name: t.nav.home, href: "/" },
    { name: t.nav.about, href: "/#about" },
    { name: t.nav.skills, href: "/#skills" },
    { name: t.nav.projects, href: "/projects" },
  ];

  return (
    <nav
      className={cn(
        "fixed z-40 w-full transition-all duration-300",
        isScrolled ? "py-3 bg-background/80 backdrop-blur-md shadow-sm" : "py-5",
      )}
      style={{ backgroundColor: isScrolled ? `${colors.navbarBackground}cc` : "transparent" }}
    >
      <div className="container grid grid-cols-[1fr_auto_1fr] items-center">
        <Link href="/" className="flex items-center text-xl font-bold group">
          <span className="relative z-10 flex items-baseline">
            <span
              className="text-glow transition-colors duration-300"
              style={{ color: colors.navbarTitleColor, textShadow: colors.navbarTitleGlow }}
            >
              leo
            </span>
            <span
              className="text-glow transition-all duration-300"
              style={{
                color: colors.navbarLinkHover,
                textShadow: colors.navbarTitleGlow,
              }}
            >
              {".dev"}
            </span>
          </span>
        </Link>

        <div className="hidden space-x-8 md:flex justify-center">
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

        <div className="hidden md:flex items-center justify-end gap-4">
          {/* Language Toggle Button */}
          <button
            onClick={toggleLanguage}
            className="z-50 focus:outline-none"
            aria-label={t.nav.toggleLanguage}
          >
            {flag}
          </button>
        </div>

        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="z-50 p-2 md:hidden"
          aria-label={isMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
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
            {/* Language toggle: a full-width row, at least 44 px high. */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex min-h-11 w-full items-center justify-center gap-3 transition-colors duration-300"
              style={{ color: colors.navbarMenuText }}
              aria-label={t.nav.toggleLanguage}
            >
              {flag}
              <span>{t.nav.currentLanguage}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
