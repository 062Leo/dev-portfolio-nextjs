import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NetworkBackground } from "@/components/NetworkBackground";
import { ProjectsShowcase } from "@/components/ProjectsSection";
import type { Metadata } from "next";
import { getDictionary, isLang } from "@/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return { title: getDictionary(lang).meta.projectsTitle };
}

export default function ProjectsPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <NetworkBackground />
      <Navbar />

      <main className="relative z-10">
        <ProjectsShowcase />
      </main>

      <div className="relative">
        <Footer />
      </div>
    </div>
  );
}
