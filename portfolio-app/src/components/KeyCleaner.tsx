"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function KeyCleaner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const didClean = useRef(false);

  useEffect(() => {
    if (didClean.current) return;
    const key = searchParams.get("key");
    if (!key) return;
    didClean.current = true;

    const params = new URLSearchParams(searchParams.toString());
    params.delete("key");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [searchParams, router, pathname]);

  return null;
}
