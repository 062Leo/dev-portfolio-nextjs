import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NetworkBackground } from "@/components/NetworkBackground";
import { findProject, hasProject, projectIds } from "@/data/index";
import { isLang } from "@/i18n";
import { DetailPage as DefaultDetailPage } from "@/components/projects/default";

// Only the ids of the current language are prerendered; any other id (including a
// project that exists in the other language only) ends in notFound() below, which
// renders the [lang] not-found page inside the layout. (dynamicParams = false would
// answer with the bare framework 404 instead.)
export function generateStaticParams({ params }: { params: { lang: string } }) {
  if (!isLang(params.lang)) return [];
  return projectIds(params.lang).map((id) => ({ id }));
}

// An unknown id gets no title of its own; the page itself then renders not-found.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { lang, id } = await params;
  const project = isLang(lang) ? findProject(lang, id) : undefined;
  if (!project) return {};
  return {
    title: project.title,
    description: project.description || project.subtitle || undefined,
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  if (!isLang(lang) || !hasProject(lang, id)) notFound();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-bg text-text">
      <NetworkBackground />
      <Navbar />

      <main className="relative z-10">
        <DefaultDetailPage id={id} />
      </main>

      <div className="relative">
        <Footer />
      </div>
    </div>
  );
}
