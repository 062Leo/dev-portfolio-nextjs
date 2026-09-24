import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NetworkBackground } from "@/components/NetworkBackground";
import { DetailPage as DemoDetailPage } from "@/components/projects/components/Demo";
import { demoProjectIds } from "@/data/index";
import { isLang } from "@/i18n";

export const dynamicParams = false;

export function generateStaticParams({ params }: { params: { lang: string } }) {
  if (!isLang(params.lang)) return [];
  return demoProjectIds(params.lang).map((id) => ({ id }));
}

export default async function ProjectDemoPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  if (!isLang(lang) || !demoProjectIds(lang).includes(id)) notFound();

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
