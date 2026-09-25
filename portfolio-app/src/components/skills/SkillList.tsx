"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useSkillsData } from "@/data/index";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";
import { RATING_FILL_CLASS, RATING_MAX, categoryColorAlpha, categoryRows } from "./data";
import type { SkillsDataNested } from "./types";

// The skills below the md breakpoint (issue #63): the data of the graph as a list. One
// block per category with a 44 px header row that folds the block, the subgroups of the
// data as muted labels, and every skill as a chip whose rating is a five-dot bar in the
// rating colour. A category keeps the hue of its pricetag in the graph.
//
// From md up the same list is rendered for screen readers only, next to the graph: every
// category open and named by a heading instead of a fold button, since invisible buttons
// would take keyboard focus.

// Five dots, the first `rating` in the rating colour. Decorative: the chip carries the
// rating as text for screen readers.
function RatingBar({ rating }: { rating: number }) {
  return (
    <span aria-hidden="true" className="flex items-center gap-0.5">
      {Array.from({ length: RATING_MAX }, (_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            i < rating ? RATING_FILL_CLASS[rating] : "bg-border",
          )}
        />
      ))}
    </span>
  );
}

type CategoryProps = {
  name: string;
  index: number;
  entries: SkillsDataNested[string];
  // null: not foldable, always open (the screen-reader list)
  fold: { open: boolean; onToggle: () => void } | null;
};

function Category({ name, index, entries, fold }: CategoryProps) {
  const t = useT();
  const panelId = useId();
  const rows = categoryRows(entries);
  const count = rows.reduce((sum, row) => sum + row.skills.length, 0);
  const open = fold?.open ?? true;

  return (
    <li className="border-b border-border last:border-b-0">
      {fold ? (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={fold.onToggle}
          className="flex min-h-11 w-full items-center gap-3 py-2 text-left font-mono text-base font-semibold text-text"
        >
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: categoryColorAlpha(index, 0.9) }}
          />
          <span className="flex-1">{name}</span>
          <span className="text-sm font-normal text-text-muted">{count}</span>
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "h-5 w-5 shrink-0 text-text-muted transition-transform",
              open && "rotate-180",
            )}
          />
        </button>
      ) : (
        <h3>{name}</h3>
      )}
      <div id={panelId} hidden={!open} className="space-y-4 pb-4">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex}>
            {row.label && (
              <p className="mb-2 text-sm font-medium tracking-wide uppercase text-text-muted">
                {row.label}
              </p>
            )}
            <ul className="flex flex-wrap gap-2">
              {row.skills.map(([skill, rating]) => (
                <li
                  key={skill}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 text-base text-text"
                >
                  {skill}
                  <RatingBar rating={rating} />
                  <span className="sr-only">{t.skills.ratingOf(rating)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </li>
  );
}

export function SkillList({ screenReaderOnly = false }: { screenReaderOnly?: boolean }) {
  const data = useSkillsData();
  const categories = Object.entries(data);
  // The first category starts open as a sample of what a block holds; the other headers
  // form a table of contents that fits two phone screens instead of one long chip wall.
  const [open, setOpen] = useState(() => new Set(categories.slice(0, 1).map(([name]) => name)));

  const toggle = (name: string) =>
    setOpen((previous) => {
      const next = new Set(previous);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });

  return (
    <div className={screenReaderOnly ? "sr-only" : "container mx-auto max-w-7xl px-4"}>
      <ul className="rounded-xl border border-accent/25 bg-bg px-4">
        {categories.map(([name, entries], index) => (
          <Category
            key={name}
            name={name}
            index={index}
            entries={entries}
            fold={screenReaderOnly ? null : { open: open.has(name), onToggle: () => toggle(name) }}
          />
        ))}
      </ul>
    </div>
  );
}
