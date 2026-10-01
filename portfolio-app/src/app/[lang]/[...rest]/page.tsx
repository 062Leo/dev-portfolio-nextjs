import { notFound } from "next/navigation";

// Every path that matches no other page. The proxy rewrites unknown paths to /<lang>/...,
// so they land here and render the [lang] not-found page inside the layout: the site's own
// 404 in the visitor's language, with the lang attribute set.
export default function UnknownPage(): never {
  notFound();
}
