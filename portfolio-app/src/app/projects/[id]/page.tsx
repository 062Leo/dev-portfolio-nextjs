import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NetworkBackground } from "@/components/NetworkBackground";
import { ThemeToggle } from "@/components/ThemeToggle";
import { portfolioData } from "@/data/portfolio-data";
import { DetailPage as BoomForceDetailPage } from "@/components/projects/BoomForce";
import { DetailPage as OldDetailPage } from "@/components/projects/Old";

export default async function ProjectsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = portfolioData.projects.find((p) => p.id === id);



  // Helper function to select the correct detail component
  const getDetailComponent = (type?: string) => {
    switch (type) {
      case "BoomForce":
        return BoomForceDetailPage;
      // Hier können später weitere Cases hinzugefügt werden
      // case "AnotherProject":
      //   return AnotherDetailPage;
      default:
        return OldDetailPage;
    }
  };

  const DetailComponent = getDetailComponent(project?.detailComponent);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <ThemeToggle />
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
