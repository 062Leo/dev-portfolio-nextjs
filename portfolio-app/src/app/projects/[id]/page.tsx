import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NetworkBackground } from "@/components/NetworkBackground";
import { portfolioData } from "@/data/portfolio-data";
import { DetailPage as DefaultDetailPage } from "@/components/projects/default";

export default async function ProjectsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = portfolioData.projects.find((p) => p.id === id);

  // Aktuell wird immer die DefaultDetailPage verwendet
  const DetailComponent = DefaultDetailPage;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <NetworkBackground />
      <Navbar />

      <main className="relative z-10">
        <DetailComponent />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
