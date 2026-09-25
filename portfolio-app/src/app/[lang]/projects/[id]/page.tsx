import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NetworkBackground } from "@/components/NetworkBackground";
import { hasProject, projectIds } from "@/data/index";
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

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  if (!isLang(lang) || !hasProject(lang, id)) notFound();

  // Aktuell wird immer die DefaultDetailPage verwendet
  const DetailComponent = DefaultDetailPage;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <NetworkBackground />
      <Navbar />

      <main className="relative z-10">
        <DetailComponent id={id} />
      </main>

      <div className="relative">
        <Footer />
      </div>
    </div>
  );
}
