'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export function LanguageToggle() {
  const [language, setLanguage] = useState<'de' | 'en'>('de');
  const [isReady, setIsReady] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);

  useEffect(() => {
    // Hier könntest du später die gespeicherte Sprache aus dem localStorage laden
    // const savedLanguage = localStorage.getItem('language') as 'de' | 'en' | null;
    // setLanguage(savedLanguage || 'de');
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const updateThemeState = () => {
      setIsDarkTheme(document.documentElement.classList.contains('dark'));
    };

    updateThemeState();

    const observer = new MutationObserver(() => {
      updateThemeState();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'de' ? 'en' : 'de');
    // Hier könntest du später die Sprache im localStorage speichern
    // localStorage.setItem('language', language === 'de' ? 'en' : 'de');
  };

  if (!isReady) {
    return null;
  }

  return (
    <button
      onClick={toggleLanguage}
      className="fixed right-15 top-2 z-50 p-0.5 focus:outline-none max-sm:hidden group"
      aria-label="Toggle language"
    >
      <div className="relative">
        {/* Hintergrund-Dot als Outline */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300"
          style={{
            width: '1.8rem',
            height: '1.8rem',
            backgroundColor: isDarkTheme ? '#ffffff' : '#000000ff'
          }}
        />
        {/* Flagge */}
        <div className="relative h-6 w-6 overflow-hidden rounded-full z-10">
          <Image
            src={language === 'de' ? "/unity-demo/Icons/de_flag.png" : "/unity-demo/Icons/en_flag.png"}
            alt={language === 'de' ? "Deutsch" : "English"}
            fill
            className="transition-opacity duration-300 object-cover"
            priority
          />
        </div>
      </div>
    </button>
  );
}
