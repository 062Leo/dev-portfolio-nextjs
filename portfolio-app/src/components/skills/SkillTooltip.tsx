import type { Ref } from "react";
import { cn } from "@/lib/utils";
import { RATING_TEXT_CLASS } from "./data";
import type { TooltipContent } from "./types";

interface SkillTooltipProps {
  ref: Ref<HTMLDivElement>;
  content: TooltipContent | null;
}

// The sub-entries of the hovered or dragged node. React renders the content; the pointer
// handlers (tooltip.ts) position the element and toggle its display through the ref.
export function SkillTooltip({ ref, content }: SkillTooltipProps) {
  return (
    <div
      ref={ref}
      className="absolute z-50 min-w-[140px] whitespace-nowrap rounded-lg border border-accent/30 bg-bg/95 px-3 py-2 font-mono text-[11px] leading-[1.6] text-text/90 shadow-[0_4px_20px] shadow-black/50 pointer-events-none"
      style={{ display: content ? "block" : "none" }}
    >
      {content &&
        (content.direct ? (
          <div className="flex justify-between gap-4 text-white/95">
            <span className="font-bold">{content.name}</span>
            <span className={cn("font-bold", RATING_TEXT_CLASS[content.entries[0][1]])}>
              {content.entries[0][1]}
            </span>
          </div>
        ) : (
          <>
            <div className="mb-1 font-bold text-white/95">{content.name}</div>
            {content.entries.map(([entryName, entryRating]) => (
              <div key={entryName} className="flex justify-between gap-4">
                <span>{entryName}</span>
                <span className={cn("font-bold", RATING_TEXT_CLASS[entryRating])}>
                  {entryRating}
                </span>
              </div>
            ))}
          </>
        ))}
    </div>
  );
}
