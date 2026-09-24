import { useLanguage } from "@/context/LanguageContext";
import { de, type Dictionary } from "./de";
import { en } from "./en";
import type { Lang } from "./lang";

export type { Dictionary } from "./de";
export { LANGS, isLang, type Lang } from "./lang";

const dictionaries: Record<Lang, Dictionary> = { de, en };

export function getDictionary(lang: Lang): Dictionary {
  return dictionaries[lang];
}

// Client hook: the dictionary of the language the [lang] layout rendered with.
export function useT(): Dictionary {
  return getDictionary(useLanguage().language);
}
