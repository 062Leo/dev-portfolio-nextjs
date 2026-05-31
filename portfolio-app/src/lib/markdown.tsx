import React from "react";

export function renderMarkdownText(text: string, color: string) {
    if (!text) return null;

    return text.split("\n\n").map((paragraph, pIndex) => {
        const lines = paragraph.split("\n");

        return (
            <p key={pIndex} className="mb-4 last:mb-0">
                {lines.map((line, lineIndex) => (
                    <span key={lineIndex}>
                        {line.split(/(\*\*.*?\*\*)/g).map((part, partIndex) => {
                            if (part.startsWith("**") && part.endsWith("**")) {
                                return (
                                    <strong key={partIndex} style={{ color }}>
                                        {part.slice(2, -2)}
                                    </strong>
                                );
                            }
                            return <span key={partIndex} style={{ color }}>{part}</span>;
                        })}
                        {lineIndex < lines.length - 1 && <br />}
                    </span>
                ))}
            </p>
        );
    });
}
