"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { useT, type Lang } from "@/i18n";

const OTHER_LANGUAGE: Record<Lang, Lang> = { de: "en", en: "de" };

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const t = useT();

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

  const toggleLanguage = () => {
    setLanguage(OTHER_LANGUAGE[language]);
  };

  // alt: the flag names the language on the desktop button; in the mobile row the text
  // next to it does, so the image is decorative there.
  const flag = (alt: string) => (
    <div className="relative">
      <div className="absolute top-1/2 left-1/2 size-[1.8rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-all duration-300" />
      <div className="relative h-6 w-6 overflow-hidden rounded-full z-10">
        <Image
          src={`/Icons/${language}_flag.png`}
          alt={alt}
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
        isScrolled ? "py-3 bg-bg/80 backdrop-blur-md shadow-sm" : "py-5",
      )}
    >
      <div className="container grid grid-cols-[1fr_auto_1fr] items-center">
        <Link href="/" className="-my-2 flex items-center py-2 text-xl font-bold group">
          <span className="relative z-10 flex items-baseline">
            <span className="text-text text-shadow-glow transition-colors duration-300">leo</span>
            <span className="text-accent-2-light text-shadow-glow transition-all duration-300">
              {".dev"}
            </span>
          </span>
        </Link>

        <div className="hidden space-x-8 md:flex justify-center">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-text transition-colors duration-300 hover:text-accent-2-light"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center justify-end gap-4">
          {/* Language Toggle Button */}
          <button
            onClick={toggleLanguage}
            className="z-50 -m-2.5 p-2.5 focus:outline-none"
            aria-label={t.nav.toggleLanguage}
          >
            {flag(t.nav.currentLanguage)}
          </button>
        </div>

        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="z-50 -m-0.5 p-2.5 text-text md:hidden"
          aria-label={isMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div
          className={cn(
            "fixed inset-0 z-40 flex flex-col items-center justify-center bg-bg/95 backdrop-blur-md transition-all duration-300 md:hidden",
            isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <div className="flex flex-col space-y-2 text-xl">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block py-3 text-text transition-colors duration-300 hover:text-accent-2-light"
              >
                {item.name}
              </Link>
            ))}
            {/* Language toggle: a full-width row, at least 44 px high; its visible text
                is its accessible name. */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex min-h-11 w-full items-center justify-center gap-3 text-text transition-colors duration-300"
            >
              {flag("")}
              <span>{t.nav.currentLanguage}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
