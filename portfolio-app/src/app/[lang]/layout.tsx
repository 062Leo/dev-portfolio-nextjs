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

const BRAND = "leo.dev";

// Absolute base for the Open Graph image URL. NEXT_PUBLIC_SITE_URL overrides the deployed
// domain from the README, e.g. for a preview deployment.
const SITE_URL = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://leos-portfolio.de");

const OG_IMAGE = "/Icons/og-image.png";

// Crawlers and link-preview bots only ever reach /login (every other page redirects there
// without the password), so the robots and Open Graph tags are set here for every page.
export async function generateMetadata({ params }: { params: LayoutParams }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDictionary(lang);
  return {
    metadataBase: SITE_URL,
    title: { default: t.meta.title, template: `%s · ${BRAND}` },
    description: t.meta.description,
    referrer: "no-referrer",
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: { index: false, follow: false },
    },
    // No hreflang alternates: both languages are served under the same URL.
    openGraph: {
      type: "website",
      siteName: BRAND,
      title: t.meta.title,
      description: t.meta.description,
      locale: lang === "de" ? "de_DE" : "en_US",
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: BRAND }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.title,
      description: t.meta.description,
      images: [OG_IMAGE],
    },
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
