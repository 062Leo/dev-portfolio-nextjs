// The colour tokens live in src/app/globals.css (@theme). Components use the Tailwind
// utilities generated from them; these helpers are for SVG and canvas code that has to
// set colours from JavaScript.

/** A colour token as a CSS value for inline SVG styles: token("accent") -> var(--color-accent). */
export function token(name: string): string {
  return `var(--color-${name})`;
}

/** Any CSS colour at an opacity between 0 and 100, as a CSS value. */
export function alpha(color: string, percent: number): string {
  return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
}

/** A colour token at an opacity between 0 and 100, as a CSS value. */
export function tokenAlpha(name: string, percent: number): string {
  return alpha(token(name), percent);
}

/**
 * The resolved value of a colour token, for canvas drawing (a canvas cannot resolve
 * var()). Empty on the server, where there is no stylesheet.
 */
export function readToken(name: string): string {
  if (typeof document === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(`--color-${name}`).trim();
}
