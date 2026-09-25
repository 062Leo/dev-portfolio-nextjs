import type { Metadata } from "next";
import { getDictionary, isLang } from "@/i18n";

// The login page is a client component and cannot export metadata itself.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return { title: getDictionary(lang).meta.loginTitle };
}

export default function LoginLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
