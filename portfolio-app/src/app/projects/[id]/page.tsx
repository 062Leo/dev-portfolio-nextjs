import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NetworkBackground } from "@/components/NetworkBackground";
import { portfolioData } from "@/data/portfolio-data";
import { portfolioData as portfolioDataEn } from "@/data/portfolio-data-en";
import { otherProjects } from "@/data/other_projects";
import { otherProjects as otherProjectsEn } from "@/data/other_projects_en";
import { DetailPage as DefaultDetailPage } from "@/components/projects/default";

export function generateStaticParams() {
  const ids = new Set<string>();

  for (const project of portfolioData.projects) {
    if (project.id && project.id.trim() !== "") {
      ids.add(project.id);
    }
  }

  for (const project of portfolioDataEn.projects) {
    if (project.id && project.id.trim() !== "") {
      ids.add(project.id);
    }
  }

  for (const project of otherProjects.projects) {
    if (project.id && project.id.trim() !== "") {
      ids.add(project.id);
    }
  }

  for (const project of otherProjectsEn.projects) {
    if (project.id && project.id.trim() !== "") {
      ids.add(project.id);
    }
  }

  return Array.from(ids).map((id) => ({ id }));
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
