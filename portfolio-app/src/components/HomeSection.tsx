"use client";

import { ArrowDown } from "lucide-react";

export function HomeSection() {
  return (
    <section id="home" className="relative flex min-h-screen flex-col items-center justify-center px-4">
      <div className="container z-10 mx-auto max-w-4xl text-center">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            <span className="opacity-0 animate-fade-in">Hi, I&apos;m</span>
            <span className="opacity-0 animate-fade-in-delay-1 text-primary"> Peter</span>
            <span className="opacity-0 animate-fade-in-delay-2"> Pan</span>
          </h1>

          <p className="mx-auto text-lg opacity-0 animate-fade-in-delay-3 md:text-xl">
            I&apos;m a Software Developer specialized in Unity and Web Development. 
          </p>

          <div className="pt-4 opacity-0 animate-fade-in-delay-4">
            <a href="#projects" className="cosmic-button">
              View My Work
            </a>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center animate-bounce">
        <span className="mb-1 select-none text-sm">Scroll</span>
        <ArrowDown className="h-5 w-5 text-primary" />
      </div>
    </section>
  );
}
