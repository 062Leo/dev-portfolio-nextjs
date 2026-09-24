import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { renderMarkdownText } from "@/lib/markdown";

const COLOR = "#123456";

function render(text: string): string {
  return renderToStaticMarkup(<>{renderMarkdownText(text, COLOR)}</>);
}

describe("renderMarkdownText", () => {
  it("renders nothing for empty input", () => {
    expect(renderMarkdownText("", COLOR)).toBeNull();
    expect(render("")).toBe("");
  });

  it("renders one paragraph for plain text", () => {
    const html = render("Hello world");
    expect(html.match(/<p /g)).toHaveLength(1);
    expect(html).toContain("Hello world");
    expect(html).not.toContain("<br/>");
  });

  it("splits paragraphs on blank lines", () => {
    const html = render("First\n\nSecond\n\nThird");
    expect(html.match(/<p /g)).toHaveLength(3);
    expect(html.indexOf("First")).toBeLessThan(html.indexOf("Second"));
    expect(html.indexOf("Second")).toBeLessThan(html.indexOf("Third"));
  });

  it("turns single newlines into line breaks within a paragraph", () => {
    const html = render("Line one\nLine two\nLine three");
    expect(html.match(/<p /g)).toHaveLength(1);
    expect(html.match(/<br\/>/g)).toHaveLength(2);
  });

  it("renders **text** as bold without the asterisks", () => {
    const html = render("Normal **strong** normal");
    expect(html).toContain(`<strong style="color:${COLOR}">strong</strong>`);
    expect(html).not.toContain("**");
  });

  it("renders several bold parts in one line", () => {
    const html = render("**a** and **b**");
    expect(html.match(/<strong /g)).toHaveLength(2);
  });

  it("applies the colour to plain text", () => {
    expect(render("plain")).toContain(`<span style="color:${COLOR}">plain</span>`);
  });

  it("escapes HTML in the input", () => {
    const html = render("<script>alert(1)</script>");
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });
});
