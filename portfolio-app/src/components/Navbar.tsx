"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useT, type Lang } from "@/i18n";

const OTHER_LANGUAGE: Record<Lang, Lang> = { de: "en", en: "de" };

// From md up the navbar shows its links inline and the mobile menu does not exist.
const DESKTOP_QUERY = "(min-width: 768px)";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const [menuPathname, setMenuPathname] = useState(pathname);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const { language, setLanguage } = useLanguage();
  const t = useT();

  // The menu closes on a navigation and when the viewport grows past md with the menu
  // open (a phone rotated to landscape), where its button and panel are hidden. Adjusted
  // during render instead of in an effect, so no frame shows the stale state.
  if (menuPathname !== pathname) {
    setMenuPathname(pathname);
    setIsMenuOpen(false);
  }
  if (isMenuOpen && isDesktop) setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // While the menu is open the page does not scroll and Escape closes the menu with focus
  // back on its button. The cleanup restores the scrolling whichever way the menu closes.
  useEffect(() => {
    if (!isMenuOpen) return;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMenuOpen]);

  const toggleLanguage = () => {
    setLanguage(OTHER_LANGUAGE[language]);
  };

  // alt: the flag names the language on the desktop button; in the mobile row the text
  // next to it does, so the image is decorative there. Only the desktop flag is preloaded;
  // the mobile row shows the same file once the menu opens.
  const flag = (alt: string, preload: boolean) => (
    <div className="relative">
      <div className="absolute top-1/2 left-1/2 size-[1.8rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-all duration-300" />
      <div className="relative h-6 w-6 overflow-hidden rounded-full z-10">
        <Image
          src={`/Icons/${language}_flag.png`}
          alt={alt}
          sizes="(max-width: 768px) 24px, 24px"
          fill
          className="transition-opacity duration-300 object-cover"
          preload={preload}
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
        isScrolled || isMenuOpen ? "py-3 bg-bg/80 backdrop-blur-md shadow-sm" : "py-5",
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
            className="z-50 -m-2.5 p-2.5"
            aria-label={t.nav.toggleLanguage}
          >
            {flag(t.nav.currentLanguage, true)}
          </button>
        </div>

        {/* The desktop columns are display:none below md, so the button is placed in the
            third column explicitly; otherwise the grid would centre it. */}
        <button
          ref={menuButtonRef}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="col-start-3 justify-self-end -m-0.5 p-2.5 text-text md:hidden"
          aria-label={isMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu: a panel directly below the bar (the bar itself stays visible). It is
          absolute, not fixed: the bar's backdrop-filter would turn a fixed child's
          containing block into the bar, clipping a full-screen overlay to the bar's height. */}
      <div
        id="mobile-menu"
        className={cn(
          "absolute inset-x-0 top-full border-b border-border bg-bg shadow-lg transition-all duration-200 md:hidden",
          // invisible, not only transparent: the closed menu's links must not take
          // keyboard focus. visibility is transitioned too, so the fade-out still shows.
          isMenuOpen
            ? "pointer-events-auto visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-2 opacity-0",
        )}
      >
        <div className="container flex flex-col py-2 text-lg">
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
            className="flex min-h-11 w-full items-center gap-3 border-t border-border py-3 text-text transition-colors duration-300"
          >
            {flag("", false)}
            <span>{t.nav.currentLanguage}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
