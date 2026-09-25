import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NetworkBackground } from "@/components/NetworkBackground";
import { DetailPage as DemoDetailPage } from "@/components/projects/components/Demo";
import { demoProjectIds, findProject } from "@/data/index";
import { isLang } from "@/i18n";

// See projects/[id]/page.tsx: unknown ids end in notFound() inside the [lang] layout.
export function generateStaticParams({ params }: { params: { lang: string } }) {
  if (!isLang(params.lang)) return [];
  return demoProjectIds(params.lang).map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { lang, id } = await params;
  if (!isLang(lang) || !demoProjectIds(lang).includes(id)) return {};
  const project = findProject(lang, id);
  return project ? { title: `${project.title} · Demo` } : {};
}

export default async function ProjectDemoPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  if (!isLang(lang) || !demoProjectIds(lang).includes(id)) notFound();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-bg text-text">
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
