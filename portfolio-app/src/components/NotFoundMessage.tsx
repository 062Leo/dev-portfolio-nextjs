"use client";

import Link from "next/link";
import { useT } from "@/i18n";

export function NotFoundMessage() {
  const t = useT();

  return (
    <div className="container mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-4xl font-bold">{t.notFound.heading}</h1>
      <Link href="/projects" className="mt-4 text-accent hover:underline">
        {t.notFound.toProjects}
      </Link>
    </div>
  );
}
