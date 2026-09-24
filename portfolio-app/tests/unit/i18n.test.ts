import { describe, expect, it } from "vitest";
import { de } from "@/i18n/de";
import { en } from "@/i18n/en";
import { getDictionary, isLang, LANGS } from "@/i18n";
import { langFromAcceptLanguage } from "@/i18n/lang";

type Leaf = string | ((argument: never) => string);
type Tree = { [key: string]: Tree | Leaf };

// Every leaf path of a dictionary, e.g. "about.cards.ai.title", with its kind.
function leaves(tree: Tree, prefix = ""): Map<string, "string" | "function"> {
  const found = new Map<string, "string" | "function">();
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") found.set(path, "string");
    else if (typeof value === "function") found.set(path, "function");
    else for (const [childPath, kind] of leaves(value, path)) found.set(childPath, kind);
  }
  return found;
}

const dictionaries = { de, en };

describe("dictionaries", () => {
  it("have the same keys with the same kind of value", () => {
    const deLeaves = leaves(de);
    const enLeaves = leaves(en);
    expect([...enLeaves.keys()].sort()).toEqual([...deLeaves.keys()].sort());
    for (const [path, kind] of deLeaves) {
      expect(enLeaves.get(path), path).toBe(kind);
    }
  });

  describe.each(Object.entries(dictionaries))("%s", (_lang, dictionary) => {
    it("has no empty string and no function that yields one", () => {
      const empty: string[] = [];
      for (const [path, kind] of leaves(dictionary)) {
        const value = path.split(".").reduce<unknown>((node, key) => {
          return (node as Record<string, unknown>)[key];
        }, dictionary);
        const text = kind === "string" ? value : (value as (argument: string) => string)("x");
        if (typeof text !== "string" || text.trim() === "") empty.push(path);
      }
      expect(empty).toEqual([]);
    });
  });
});

describe("language helpers", () => {
  it("know exactly de and en", () => {
    expect(LANGS).toEqual(["de", "en"]);
    expect(isLang("de")).toBe(true);
    expect(isLang("en")).toBe(true);
    expect(isLang("fr")).toBe(false);
    expect(isLang("")).toBe(false);
    expect(isLang(undefined)).toBe(false);
  });

  it("return the dictionary of a language", () => {
    expect(getDictionary("de")).toBe(de);
    expect(getDictionary("en")).toBe(en);
  });

  it("derive the language from the primary Accept-Language tag", () => {
    expect(langFromAcceptLanguage("de-DE,de;q=0.9,en;q=0.8")).toBe("de");
    expect(langFromAcceptLanguage("de")).toBe("de");
    expect(langFromAcceptLanguage("DE-AT")).toBe("de");
    expect(langFromAcceptLanguage("en-US,en;q=0.9,de;q=0.8")).toBe("en");
    expect(langFromAcceptLanguage("fr-FR,de;q=0.9")).toBe("en");
    expect(langFromAcceptLanguage("")).toBe("en");
    expect(langFromAcceptLanguage(null)).toBe("en");
  });
});
