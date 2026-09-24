// Security headers for every response. Imported by next.config.ts through a relative path,
// so this module must not use the "@/" alias or anything that needs the Next.js runtime.

// Sources that only the development server needs: Turbopack and React evaluate code at
// runtime in development, and hot module replacement talks over a websocket.
const DEV_SCRIPT_SOURCES = ["'unsafe-eval'"];
const DEV_CONNECT_SOURCES = ["ws:", "wss:"];

// Builds the Content-Security-Policy value. Everything is same-origin: scripts, styles,
// fonts, images and videos are served by the app itself. 'unsafe-inline' for scripts is
// needed for the inline hydration scripts Next.js writes into statically rendered pages
// (a nonce would make every page dynamic); for styles it is needed for inline style
// attributes.
export function buildContentSecurityPolicy(isDev: boolean): string {
  const directives: [string, string[]][] = [
    ["default-src", ["'self'"]],
    ["script-src", ["'self'", "'unsafe-inline'", ...(isDev ? DEV_SCRIPT_SOURCES : [])]],
    ["style-src", ["'self'", "'unsafe-inline'"]],
    ["img-src", ["'self'", "data:", "blob:"]],
    ["media-src", ["'self'"]],
    ["font-src", ["'self'"]],
    ["connect-src", ["'self'", ...(isDev ? DEV_CONNECT_SOURCES : [])]],
    ["object-src", ["'none'"]],
    ["base-uri", ["'none'"]],
    ["frame-ancestors", ["'none'"]],
    ["form-action", ["'self'"]],
    ["upgrade-insecure-requests", []],
  ];
  return directives.map(([name, sources]) => [name, ...sources].join(" ")).join("; ");
}
