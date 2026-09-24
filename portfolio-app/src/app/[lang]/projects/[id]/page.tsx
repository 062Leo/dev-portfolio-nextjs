import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NetworkBackground } from "@/components/NetworkBackground";
import { hasProject, projectIds } from "@/data/index";
import { isLang } from "@/i18n";
import { DetailPage as DefaultDetailPage } from "@/components/projects/default";

// Only the ids of the current language get a page here; a project that exists in one
// language only is a 404 in the other.
export const dynamicParams = false;

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
