import { About } from "@/components/About";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { HomeSection } from "@/components/HomeSection";
import { Navbar } from "@/components/Navbar";
import { ProjectsSection } from "@/components/ProjectsSection";
import { SkillsSection } from "@/components/SkillsSection";
import { NetworkBackground } from "@/components/NetworkBackground";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <ThemeToggle />
      <NetworkBackground />
      <Navbar />
      <main>
        <HomeSection />
        <About />
        <SkillsSection />
        <ContactSection />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
