import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NetworkBackground } from "@/components/NetworkBackground";
import { DetailPage as DemoDetailPage } from "@/components/projects/components/Demo";
import { portfolioData } from "@/data/portfolio-data";

export function generateStaticParams() {
  return portfolioData.projects
    .filter((project) => !!project.demoLink)
    .map((project) => ({
      id: project.id,
    }));
}

export default async function ProjectDemoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <NetworkBackground />
      <Navbar />

      <main className="relative z-10">
        <DemoDetailPage id={id} />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
