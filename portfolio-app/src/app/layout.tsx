import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import KeyCleaner from "@/components/KeyCleaner";

export const metadata: Metadata = {
   title: "leo.dev — Portfolio",
  description: "leo.dev — Softwareentwickler Portfolio mit Fokus auf AI, Automatisierung und interaktive Anwendungen",
  referrer: "no-referrer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LanguageProvider>
          <Suspense>
            <KeyCleaner />
          </Suspense>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
