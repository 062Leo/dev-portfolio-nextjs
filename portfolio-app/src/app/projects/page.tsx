import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StarBackground } from "@/components/StarBackground";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ProjectsShowcase } from "@/components/ProjectsSection";

export default function ProjectsPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <ThemeToggle />
      <StarBackground />
      <Navbar />

      <main>
        <ProjectsShowcase />
      </main>

      <Footer />
    </div>
  );
}
