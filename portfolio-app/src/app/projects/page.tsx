import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NetworkBackground } from "@/components/NetworkBackground";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ProjectsShowcase } from "@/components/ProjectsSection";

export default function ProjectsPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <ThemeToggle />
      <NetworkBackground />
      <Navbar />

      <main className="relative z-10">
        <ProjectsShowcase />
      </main>

      <Footer />
    </div>
  );
}
