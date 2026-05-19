# AGENTS.md

## Project layout

- Root repo contains a single Next.js project: `portfolio-app/`.
- All commands (`dev`, `build`, `lint`, `install`) must be run **inside `portfolio-app/`**.

## Commands

```bash
cd portfolio-app
npm run dev      # dev server on :3000
npm run build    # production build (static export)
npm run lint     # ESLint (next/core-web-vitals + next/typescript)
```

There are **no tests** configured (no Jest, Vitest, Playwright). The only verification is `npm run lint`.

## Critical constraints

### Static export (`next.config.ts` → `output: "export"`)

The entire site is built to static HTML/CSS/JS. This means:

- **No** server-side features: `cookies`, `headers`, `redirect()`, rewrites, middleware, ISR, server actions, API routes.
- **No** `next/image` optimization — `images.unoptimized: true` is set. Use `<img>` or the unoptimized `<Image>`.
- Dynamic routes (`[id]`, `[id]/demo`) **must** use `generateStaticParams()`. Adding a new project requires updating the data files so the static paths are generated.

### Tailwind CSS v4

Uses v4 syntax: `@import "tailwindcss"` in `globals.css`, `@theme` blocks, `@utility` directives. The legacy `tailwind.config.ts` is present but v4 uses the CSS-first config. Do not write v3 patterns.

### React Compiler enabled

`reactCompiler: true` in `next.config.ts`. Automemoizes components; be mindful that manual `useMemo`/`useCallback` may be unnecessary.

## Architecture patterns

### Server vs. client components

- Page components (`page.tsx`) at route level are **server components** (no `"use client"`). They compose client components.
- Interactive components using `useState`, `useEffect`, `useRef`, or browser APIs are marked `"use client"`.
- All leaf components in `components/` are client components.

### i18n

Bilingual (German `de` / English `en`) via custom `LanguageContext` in `context/LanguageContext.tsx`. Detects `navigator.language` on mount. No next-intl or middleware.

Project data is duplicated: `portfolio-data.ts` (DE) / `portfolio-data-en.ts` (EN) and `other_projects.ts` (DE) / `other_projects_en.ts` (EN). Components select the dataset based on `useLanguage()`.

### Theme

Dark-mode only. Light mode scaffolding exists (`themeColors.light` aliases to dark colors) but is not implemented. The `colors.tsx` module defines ~80 named theme properties per component section; `applyThemeColors()` writes them as CSS custom properties on `document.documentElement`.

### Path alias

`@/*` → `./src/*` (configured in `tsconfig.json`).

### External link consent dialogs

All external links (GitHub, itch.io, Unity Asset Store, downloads) show a GDPR-style confirmation modal before redirecting. This pattern is in `ProjectsSection.tsx`, `default.tsx`, and `Demo.tsx`. Preserve it when adding links.

### Custom bold-only markdown

`renderMarkdownText()` (defined inline in `default.tsx`, `Demo.tsx`, `ProjectVideos.tsx`) only handles `**bold**` and paragraph splitting. Not a full markdown parser.

## Key files to understand

| File | Role |
|------|------|
| `src/app/layout.tsx` | Root layout, metadata, LanguageProvider |
| `src/app/page.tsx` | Home page — only server component composing sections |
| `src/app/globals.css` | Tailwind v4 imports, `@theme`, custom fonts, animations |
| `src/context/LanguageContext.tsx` | i18n context + `useLanguage()` hook |
| `src/data/portfolio-data.ts` | Featured projects (German) |
| `src/data/other_projects.ts` | Additional projects (German) |
| `src/components/colors.tsx` | Theme color system (+ `applyThemeColors`) |
| `src/components/NetworkBackground.tsx` | Canvas particle animation background |
