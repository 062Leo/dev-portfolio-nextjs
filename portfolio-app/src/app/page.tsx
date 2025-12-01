import { About } from "@/components/About";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { HomeSection } from "@/components/HomeSection";
import { Navbar } from "@/components/Navbar";
import { SkillsSection } from "@/components/SkillsSection";
import { NetworkBackground } from "@/components/NetworkBackground";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="fixed right-5 top-5 z-50 flex items-center gap-4 max-sm:hidden">
        <LanguageToggle />
        <ThemeToggle />
      </div>
      <NetworkBackground />
      <Navbar />
      <main className="relative z-10">
        <HomeSection />
        <About />
        <SkillsSection />
        <ContactSection />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
      <div className="relative z-10">
        <Toaster />
      </div>
    </div>
  );
}
