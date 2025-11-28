"use client";

import type { ReactNode } from "react";
import { Briefcase, ChartNoAxesCombined, Code, Gamepad2 } from "lucide-react";

export function About() {
  return (
    <section id="about" className="relative px-4 py-24">
      <div className="container mx-auto max-w-5xl">
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
          About <span className="text-primary">Me</span>
        </h2>

        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="space-y-6 text-center md:text-left">
            <h3 className="text-2xl font-semibold">Aspiring Developer</h3>

            <p>
              I enjoy building smooth digital experiences, whether it is interactive user
              interfaces or backend services that power them.
            </p>

            <p>
              My focus is on web and game development, combining creativity with engineering
              best practices that I learn throughout my Software Engineering studies.
            </p>

            <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
              <a href="#contact" className="cosmic-button">
                Get In Touch
              </a>
              <a
                href="#"
                className="rounded-full border border-primary px-6 py-2 text-primary transition-colors duration-300 hover:bg-primary/10"
              >
                Download CV
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <InfoCard
              icon={<Code className="h-6 w-6 text-primary" />}
              title="Web Development"
              description="Creating responsive websites and applications with modern frameworks."
            />
            <InfoCard
              icon={<Gamepad2 className="h-6 w-6 text-primary" />}
              title="Game Engines"
              description="Developing interactive games and simulations with engines like Unity."
            />
            <InfoCard
              icon={<ChartNoAxesCombined className="h-6 w-6 text-primary" />}
              title="Agile Methodologies"
              description="Applying Scrum and agile practices in collaborative software projects."
            />
            <InfoCard
              icon={<Briefcase className="h-6 w-6 text-primary" />}
              title="Professional Mindset"
              description="Constantly learning and striving to deliver high-quality, maintainable code."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

type InfoCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

function InfoCard({ icon, title, description }: InfoCardProps) {
  return (
    <div className="gradient-border card-hover p-6 text-left">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-primary/10 p-3">{icon}</div>
        <div>
          <h4 className="text-lg font-semibold">{title}</h4>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}
