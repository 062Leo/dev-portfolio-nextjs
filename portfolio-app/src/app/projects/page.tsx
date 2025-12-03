import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NetworkBackground } from "@/components/NetworkBackground";
import { ProjectsShowcase } from "@/components/ProjectsSection";

export default function ProjectsPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <NetworkBackground />
      <Navbar />

      <main className="relative z-10">
        <ProjectsShowcase />
      </main>

     <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
