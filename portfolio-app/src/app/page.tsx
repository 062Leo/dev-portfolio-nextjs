import { About } from "@/components/About";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { HomeSection } from "@/components/HomeSection";
import { Navbar } from "@/components/Navbar";
import { NetworkBackground } from "@/components/NetworkBackground";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <NetworkBackground />
      <Navbar />
      <main className="relative z-10">
        <HomeSection />
        <About />
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
