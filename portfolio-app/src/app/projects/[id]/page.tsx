import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NetworkBackground } from "@/components/NetworkBackground";
import { portfolioData } from "@/data/portfolio-data";
import { otherProjects } from "@/data/other_projects";
import { DetailPage as DefaultDetailPage } from "@/components/projects/default";

export function generateStaticParams() {
  const mainProjects = portfolioData.projects.map((project) => ({
    id: project.id,
  }));

  const additionalProjects = otherProjects.projects
    .filter((project) => project.id && project.id.trim() !== "")
    .map((project) => ({
      id: project.id,
    }));

  return [...mainProjects, ...additionalProjects];
}

export default async function ProjectsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Aktuell wird immer die DefaultDetailPage verwendet
  const DetailComponent = DefaultDetailPage;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <NetworkBackground />
      <Navbar />

      <main className="relative z-10">
        <DetailComponent id={id} />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
