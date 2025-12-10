import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NetworkBackground } from "@/components/NetworkBackground";
import { DetailPage as DemoDetailPage } from "@/components/projects/components/Demo";

export default function ProjectDemoPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <NetworkBackground />
      <Navbar />

      <main className="relative z-10">
        <DemoDetailPage />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
