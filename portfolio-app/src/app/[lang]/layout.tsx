import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { LANGS, getDictionary, isLang } from "@/i18n";

type LayoutParams = Promise<{ lang: string }>;

// The [lang] segment never appears in the address bar: the proxy rewrites every page path
// to /<lang>/... from the lang cookie. Only the two known languages are prerendered; any
// other value ends in notFound() below. (dynamicParams = false is deliberately not set:
// it would apply to the whole route chain and answer an unknown project id with the bare
// framework 404 instead of the [lang] not-found page.)
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: LayoutParams }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDictionary(lang);
  return {
    title: t.meta.title,
    description: t.meta.description,
    referrer: "no-referrer",
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: LayoutParams;
}>) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  return (
    <html lang={lang}>
      <body className="antialiased">
        <LanguageProvider lang={lang}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
