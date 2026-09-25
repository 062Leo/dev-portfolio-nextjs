import React from "react";
import { cn } from "@/lib/utils";

// Renders a small markdown subset: blank line = paragraph, newline = line break,
// **text** = bold. The optional class goes on every paragraph (e.g. a text colour).
export function renderMarkdownText(text: string, className?: string) {
  if (!text) return null;

  return text.split("\n\n").map((paragraph, pIndex) => (
    <p key={pIndex} className={cn("mb-4 last:mb-0", className)}>
      {renderInlineMarkdown(paragraph)}
    </p>
  ));
}

// The same subset without paragraphs, for text inside a heading or another inline
// context: newline = line break, **text** = bold.
export function renderInlineMarkdown(text: string) {
  if (!text) return null;

  const lines = text.split("\n");
  return lines.map((line, lineIndex) => (
    <span key={lineIndex}>
      {line.split(/(\*\*.*?\*\*)/g).map((part, partIndex) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
        }
        return <span key={partIndex}>{part}</span>;
      })}
      {lineIndex < lines.length - 1 && <br />}
    </span>
  ));
}
