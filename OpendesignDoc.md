# OpenDesign — Komplettes Designdokument für das Portfolio von Leo

> **Zweck:** Dieses Dokument enthält ALLE Informationen, die OpenDesign benötigt, um die bestehende Portfolio-Website komplett neu und sehr kreativ zu designen. Es beschreibt jede Page, jede Komponente, jede Datenquelle und jedes visuelle Verhalten im Detail.  
> **`C:\LEO\Projekte\GitHub\dev-portfolio-nextjs\OpendesignDoc.md`**

---

## 1. Architektur-Übersicht

### 1.1 Projektstruktur

```
C:\LEO\Projekte\GitHub\dev-portfolio-nextjs\
├── portfolio-app/                    # Die eigentliche Next.js App
│   ├── src/
│   │   ├── app/                      # App Router (Pages & Layout)
│   │   │   ├── globals.css           # Tailwind v4, @theme, Fonts, @utility, @keyframes
│   │   │   ├── layout.tsx            # Root Layout (Metadata, LanguageProvider)
│   │   │   ├── page.tsx              # Home Page "/"
│   │   │   └── projects/
│   │   │       ├── page.tsx          # "/projects" — Projektübersicht
│   │   │       └── [id]/
│   │   │           ├── page.tsx      # "/projects/[id]" — Projektdetail
│   │   │           └── demo/
│   │   │               └── page.tsx  # "/projects/[id]/demo" — Demo-Seite
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── HomeSection.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── NetworkBackground.tsx
│   │   │   ├── ProjectsSection.tsx
│   │   │   ├── colors.tsx            # Theme-System (~80 Properties)
│   │   │   ├── projects/
│   │   │   │   ├── default.tsx       # DetailPage (Standard-Projektdetail)
│   │   │   │   └── components/
│   │   │   │       ├── Demo.tsx      # DemoPage (Demo-Unterseite)
│   │   │   │       └── ProjectVideos.tsx
│   │   │   └── ui/
│   │   │       ├── toast.tsx
│   │   │       └── toaster.tsx
│   │   ├── context/
│   │   │   └── LanguageContext.tsx    # i18n (DE/EN)
│   │   ├── data/
│   │   │   ├── portfolio-data.ts     # Hauptprojekte (Deutsch)
│   │   │   ├── portfolio-data-en.ts  # Hauptprojekte (Englisch)
│   │   │   ├── other_projects.ts     # Weitere Projekte (Deutsch)
│   │   │   └── other_projects_en.ts  # Weitere Projekte (Englisch)
│   │   ├── hooks/
│   │   │   └── use-toast.ts
│   │   └── lib/
│   │       └── utils.ts              # cn() = clsx + tailwind-merge
│   ├── public/
│   │   ├── Bilder/                   # Projektbilder
│   │   ├── Videos/                   # Projektvideos (Big/ + Detail-Videos)
│   │   ├── Icons/                    # Flaggen (de_flag.png, en_flag.png)
│   │   └── fonts/                    # Press_Start_2P, Rubik_Mono_One
│   ├── next.config.ts                # output: "export", reactCompiler: true
│   ├── tsconfig.json                 # @/* → ./src/*
│   └── package.json
├── AGENTS.md
└── README.md
```

### 1.2 Routing-Tabelle

| Route | Page-Komponente | Typ | Funktion |
|-------|----------------|-----|----------|
| `/` | `src/app/page.tsx` | Server Component | Home — komponiert alle Sections |
| `/projects` | `src/app/projects/page.tsx` | Server Component | Projektübersicht |
| `/projects/[id]` | `src/app/projects/[id]/page.tsx` | Server Component + `generateStaticParams()` | Projektdetail |
| `/projects/[id]/demo` | `src/app/projects/[id]/demo/page.tsx` | Server Component + `generateStaticParams()` | Demo-Unterseite |

**Wichtig:** Die App wird statisch exportiert (`output: "export"`). Das bedeutet:
- Alle dynamischen Routen (`[id]`, `[id]/demo`) MÜSSEN `generateStaticParams()` implementieren
- Keine Server-seitigen Features (cookies, headers, redirects, middleware, ISR, API-Routen)
- `next/image` muss mit `unoptimized: true` betrieben werden

### 1.3 Server- vs. Client-Komponenten

- **Page-Komponenten** auf Route-Ebene (`page.tsx`) sind **Server Components** (kein `"use client"`). Sie komponieren nur Client-Komponenten.
- Alle interaktiven **Leaf-Komponenten** sind **Client Components** (`"use client"`): `Navbar`, `HomeSection`, `About`, `Footer`, `ProjectsShowcase`, `DetailPage`, `DemoPage`, `NetworkBackground`, `ProjectVideos`, `Toast`/`Toaster`.
- Der React Compiler ist aktiviert (`reactCompiler: true`) — manuelles `useMemo`/`useCallback` ist meist unnötig.

---

## 2. Globale Design-Grundlagen

### 2.1 Theme-Farbpalette (Dark Mode Only)

Die komplette Farbpalette ist in `src/components/colors.tsx` definiert. Es gibt **nur Dark Mode** (Light Mode ist ein Alias auf Dark). Alle Farben sind als `rgba()`-Werte definiert und werden über CSS Custom Properties auf `document.documentElement` gesetzt.

**Globale Basisfarben:**

```json
{
  "background":            "rgba(11, 13, 23, 1)",       // Tiefes Dunkelblau-Schwarz
  "foreground":            "rgba(213, 220, 232, 1)",     // Kühles Hellgrau für Text
  "primary":               "rgba(167, 139, 250, 1)",     // Lila/Violett (Accent)
  "primaryForeground":     "rgba(213, 220, 232, 1)",     // Text auf Primary
  "card":                  "rgba(11, 17, 30, 1)",        // Card-Hintergrund
  "border":                "rgba(38, 46, 66, 1)",        // Standard-Border
  "textPrimary":           "rgba(213, 220, 232, 1)",
  "textSecondary":         "rgba(213, 220, 232, 0.8)",
  "textMuted":             "rgba(213, 220, 232, 0.6)",
  "networkBackground":     "radial-gradient(circle at center, rgba(41,41,94,0.9), rgba(0,0,0,1))",
  "networkStroke":         "rgba(239, 68, 68, 1)",       // Rot — Linien im Netzwerk
  "networkCircle":         "rgba(156, 217, 249, 1)"      // Blau — Kreise im Netzwerk
}
```

**Die vollständige ThemeColorSet-Typdefinition** umfasst ~80 Properties, gruppiert nach Komponenten:
- `homeSection*` — Home-Section alle Farben (13 Properties)
- `projectsSection*` — Projektübersicht (15 Properties)
- `boomforce*` — Projektdetail-Seite (23 Properties, wird für ALLE Projekt-Details verwendet, trotz Name "boomforce")
- `demo*` — Demo-Unterseite (13 Properties)
- `navbar*` — Navigation (7 Properties)
- `aboutSection*` — About-Sektion (11 Properties)
- `contactSection*` — Kontakt-Sektion (9 Properties, derzeit ungenutzt)
- `skillsSection*` — Skills-Sektion (9 Properties, derzeit ungenutzt)
- `languageToggle*` — Sprachumschalter (1 Property)

**Wichtig:** Die Properties `boomforce*` heißen so aus historischen Gründen (BoomForce war die erste Detail-Seite), werden aber von ALLEN Projektdetail-Seiten verwendet. Alle 23 `boomforce*`-Properties müssen bei einem Redesign angepasst werden, um die Detailseiten neu zu stylen.

### 2.2 Schriftarten

Zwei Custom-Fonts, lokal in `public/fonts/` gespeichert:

```
public/fonts/Press_Start_2P/PressStart2P-Regular.ttf  → font-family: "Press Start 2P"
public/fonts/Rubik_Mono_One/RubikMonoOne-Regular.ttf   → font-family: "Rubik Mono One"
```

- `Press Start 2P`: Pixel-Schrift, genutzt für KEY FEATURES, TECH STACK, STATS, SCREENSHOTS, VIDEO, DETAILS, CONTROLS/STEUERUNG Überschriften
- `Rubik Mono One`: Monospace-Display-Schrift, genutzt für Projekt-Titel und Subtitel auf Detail-Seiten

### 2.3 CSS-Animationen (`globals.css`)

```css
/* Definiert im @theme-Block von globals.css */

--animate-float:          float 6s ease-in-out infinite;           /* Y-Achse -10px bob */
--animate-pulse-subtle:   pulse-subtle 4s ease-in-out infinite;     /* Opacity 1 ↔ 0.8 */
--animate-fade-in:        fade-in 0.7s ease-out forwards;           /* opacity 0→1 + translateY 20px→0 */
--animate-fade-in-delay-1: fade-in 0.7s ease-out 0.2s forwards;    /* +200ms delay */
--animate-fade-in-delay-2: fade-in 0.7s ease-out 0.4s forwards;    /* +400ms delay */
--animate-fade-in-delay-3: fade-in 0.7s ease-out 0.6s forwards;    /* +600ms delay */
--animate-fade-in-delay-4: fade-in 0.7s ease-out 0.8s forwards;    /* +800ms delay */
```

### 2.4 CSS-Utility-Klassen (`globals.css`)

```css
.container       /* Responsive Container (max-widths für Breakpoints) */
.text-glow       /* text-shadow: 0 0 10px var(--primary); */
.card-hover      /* hover:scale-[1.02] + hover:shadow-lg */
.gradient-border /* Card mit umlaufendem transparenten Border */
.cosmic-button   /* Gerundeter Button, lila bg, hover:scale-105 + glow box-shadow */
```

### 2.5 Reusable Muster

#### `renderMarkdownText()` — Custom Bold-Only Markdown
Diese Funktion existiert in 3 Dateien (`default.tsx:31`, `Demo.tsx:24`, `ProjectVideos.tsx:16`). Sie ist KEIN voller Markdown-Parser. Sie unterstützt NUR:
- `**bold**` → `<strong>`
- Doppelte Zeilenumbrüche `\n\n` → neuer `<p>`-Absatz
- Einfache `\n` → `<br />`

#### External Link Consent Dialog (GDPR-Modal)
Bevor ein externer Link geöffnet wird, erscheint ein Modal mit:
- Überschrift "Externer Link" / "External link"
- Erklärung: Verlassen der Website, Weiterleitung zu externer Plattform
- Datenschutzhinweis: Verarbeitung durch Betreiber der Zielseite
- Anzeige der Ziel-URL
- Buttons: "Abbrechen/Cancel" + "Fortfahren/Continue"
- Dieses Muster existiert in `ProjectsSection.tsx`, `default.tsx` (2 Varianten: normal + custom), und `Demo.tsx`

#### `cn()` Utility (`src/lib/utils.ts`)
```typescript
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: Array<string | undefined | null | false>) {
  return twMerge(clsx(inputs));
}
```
Kombiniert Tailwind-Klassen und merged sie korrekt (shadcn/ui-Standardmuster).

#### Path Alias
`@/*` → `./src/*` (in `tsconfig.json` konfiguriert)

### 2.6 i18n / Zweisprachigkeit

- **Languages:** Deutsch (`de`) und Englisch (`en`)
- **Detection:** Browser-`navigator.language` beim Mount. Startet mit "de" → Deutsch, sonst Englisch.
- **Umschalter:** Flaggen-Button in der Navbar (Bilder: `/Icons/de_flag.png`, `/Icons/en_flag.png`)
- **Daten-Duplizierung:** Alle Projektdaten und UI-Texte sind in DE/EN-Dateien dupliziert:
  - `portfolio-data.ts` (DE) ↔ `portfolio-data-en.ts` (EN)
  - `other_projects.ts` (DE) ↔ `other_projects_en.ts` (EN)
- **Context:** `useLanguage()` Hook liefert `{ language, setLanguage }`
- **Kein** next-intl, keine Middleware — rein client-seitiger Context

---

## 3. Page: Home `/`

**Route:** `/`  
**Page-Komponente:** `src/app/page.tsx` (Server Component)  
**Datenquellen:** `portfolio-data.ts` / `portfolio-data-en.ts`  
**Verwendete Komponenten:** `NetworkBackground`, `Navbar`, `HomeSection`, `About`, `Footer`, `Toaster`

### 3.1 Layout-Struktur

```
<div class="relative min-h-screen overflow-x-hidden bg-background text-foreground">
  <NetworkBackground />            ← z-0, fixed, pointer-events-none, Canvas-Animation
  <Navbar />                       ← z-40, fixed, scroll-aware (transparent → blurred)
  <main class="relative z-10">
    <HomeSection />                ← Hero-Bereich, min-h-screen
    <About />                      ← Über mich
  </main>
  <Footer />                       ← z-10
  <Toaster />                      ← z-10 (Radix UI Toast System)
</div>
```

### 3.2 NetworkBackground — Canvas-Partikel-Animation

**Datei:** `src/components/NetworkBackground.tsx`

**Was es tut:**
- Rendert einen Fullscreen-Canvas als animierten Partikel-Netzwerk-Hintergrund.
- Generiert ein Raster von Punkten über den Bildschirm (grid-basiert mit `GRID_DIVISOR: 20`).
- Jeder Punkt hat 5 nächste Nachbarn (Linien werden zu diesen gezeichnet).
- Punkte bewegen sich langsam (randomized `easeInOutCirc`-Easing, 1-2s Dauer).
- Mausposition steuert die Aktivierungsstärke:
  - Distanz < 4000px: Linien-Alpha 0.3, Kreis-Alpha 0.6
  - Distanz < 20000px: Linien-Alpha 0.1, Kreis-Alpha 0.3
  - Distanz < 40000px: Linien-Alpha 0.02, Kreis-Alpha 0.1
  - Sonst: Alpha 0 (ausgeblendet)
- Responsive: Resize-Listener, `devicePixelRatio` für HiDPI.
- Hintergrund: `radial-gradient(circle at center, rgba(41,41,94,0.9), rgba(0,0,0,1))`
- Linienfarbe: `rgba(239, 68, 68, 1)` (Rot), Farben über Properties: `networkStroke`
- Kreisfarbe: `rgba(156, 217, 249, 1)` (Blau), Farben über Properties: `networkCircle`

**Design-Relevanz:**
- Dies ist das zentrale interaktive Highlight der Seite.
- Die Farben müssen zum Gesamtdesign passen (Rot für Linien, Blau für Kreise, Violetter Radial-Gradient).
- Die Animation läuft permanent via `requestAnimationFrame` — Performance beachten.

### 3.3 Navbar

**Datei:** `src/components/Navbar.tsx`

**Verhalten:**
- Fixiert oben (`z-40`).
- Transparent, wenn oben (scrollY ≤ 10).
- Wenn gescrollt: `bg-background/80 backdrop-blur-md shadow-sm`, Hintergrundfarbe aus `colors.navbarBackground` mit `cc`-Alpha.
- Mobile: Hamburger-Icon (`Menu`/`X` von lucide-react), Fullscreen-Overlay-Menü mit `bg-background/95 backdrop-blur-md`.

**Inhalt:**
- Links: "Leos Portfolio" (Logo-Text, kein Bild-Logo), Zweifarbig: "Leos" in `navbarTitleColor`, "' Portfolio" in `navbarLinkHover` + `text-glow`
- Navigation (DE): Home, Über mich, Projekte
- Navigation (EN): Home, About, Projects
- Rechts: Sprachumschalter (Flaggen-Bild, kreisrunder weißer Hintergrund)

**Styling-Hinweise:**
- `navbarTitleColor`: `rgba(213, 220, 232, 1)` — Normaler Text
- `navbarTitleGlow`: `0 0 15px rgba(180,162,234,0.3), 0 0 25px rgba(104,80,172,0.3)` — Leichter lila Glow
- `navbarLinkText`: `rgba(213, 220, 232, 1)` — Normalzustand Links
- `navbarLinkHover`: `rgba(248, 113, 113, 1)` — Hover-Zustand (Rot-Orange)
- `navbarMenuText`: `rgba(213, 220, 232, 1)` — Mobile-Menü Text
- `navbarMenuBackdrop`: `rgba(11, 13, 23, 0.95)` — Mobile-Menü Hintergrund
- `navbarBackground`: `rgba(11, 13, 23, 0.95)` — Gescrollter Zustand
- `languageToggleBgColor`: `rgba(255, 255, 255, 1)` — Kreisförmiger Hintergrund hinter Flagge

### 3.4 HomeSection — Hero

**Datei:** `src/components/HomeSection.tsx`

**Aufbau (von außen nach innen):**

1. **Sektion** `<section id="home">`:
   - `min-h-screen`, flex, zentriert
   - Hintergrund: `homeSectionBackgroundGradient` = zweiseitiger Radial-Gradient:
     ```
     radial-gradient(circle at 20% 20%, rgba(239,68,68,0.35), transparent 45%),
     radial-gradient(circle at 80% 0%, rgba(167,139,250,0.4), transparent 50%)
     ```
     = Rot-Glow oben-links + Lila-Glow oben-rechts

2. **Content-Card** (innerhalb von `container`):
   - `rounded-[40px]`, großer Border-Radius
   - `border` mit Farbe `homeSectionAccentLine`
   - `boxShadow: homeSectionBorderGlow` = `0 0 25px rgba(239,68,68,0.5), 0 0 45px rgba(167,139,250,0.4)` — Rot+Lila-Glow
   - Hintergrund: `background` (dunkles Blau-Schwarz)
   - Padding: `px-6 py-12 md:px-10`
   - Vertikaler Abstand der Elemente: `gap-8`

3. **Überschrift `<h1>`:**
   - "Hallo, ich bin " / "Hi, I'm "
   - Format: `<Leo/>` — mit `<` und `/>` als Klammern
   - Animiert: `opacity-0 animate-fade-in` (fade-in nach 0s)
   - Farben:
     - Einleitender Text (`homeSectionTitleColor`): `rgba(239, 68, 68, 1)` (Rot)
     - Klammern `<` und `/>` (`homeSectionBracketText`): `rgba(213, 220, 232, 1)`
     - Separator `/` (`homeSectionSeparator`): `rgba(34, 211, 238, 1)` (Cyan)
     - **Hover-Easter-Egg auf "Leo":** Beim Hovern fährt der Text `" onClick={reload}"` von rechts ein. Die Buchstaben erscheinen nacheinander (staggered, 30ms pro Zeichen). Farbe: `homeSectionHoverText` = `rgba(74, 222, 128, 1)` (Grün). Klick auf den Namen lädt die Seite neu (`window.location.reload()`).
   - Text-Shadow: `homeSectionTitleGlow` = `0 0 15px rgba(180,162,234,0.3), 0 0 25px rgba(104,80,172,0.3)` (Lila-Glow auf dem Titel)

4. **Beschreibung `<p>`:**
   - Animiert: `opacity-0 animate-fade-in-delay-3` (mit 600ms Verzögerung)
   - Farbe: `homeSectionDescriptionText` = `rgba(213, 220, 232, 0.95)`
   - Inhalt: Der `role`-Text aus `portfolioData.personal.role` (z.B. "Softwareentwickler (B.Sc. ...)")

5. **Trennlinie + CTA-Button:**
   - Animiert: `opacity-0 animate-fade-in-delay-4` (mit 800ms Verzögerung)
   - Kleine horizontale Linie: `h-[2px] w-24` in `homeSectionAccentLine` = `rgba(167, 139, 250, 1)` (Lila)
   - Button: `<a href="/projects">` als `cosmic-button`
     - Hintergrund: `linear-gradient(135deg, rgba(105,30,155,1), rgba(131,40,40,1))` — Lila → Dunkelrot
     - Text: `homeSectionButtonText` = `rgba(213, 220, 232, 1)`
     - Box-Shadow: `homeSectionBorderGlow` (Rot+Lila)
     - Text: "Meine Projekte" / "View My Work"
     - Sehr große Padding: `px-15 py-5`
     - Text: `text-l font-semibold uppercase tracking-wide`

6. **Scroll-Indikator:**
   - Position: `absolute bottom-8`, zentriert
   - Text "Scrollen"/"Scroll" + `ArrowDown`-Icon
   - Animation: `animate-bounce` (Tailwind-Builtin)
   - Farbe: `homeSectionTitleColor`
   - Klick scrollt zu `#about` (smooth)

### 3.5 About — Über mich

**Datei:** `src/components/About.tsx`

**Aufbau:**

1. **Sektion** `<section id="about">`:
   - Padding: `py-24`

2. **Überschrift `<h2>`:**
   - "Über **mich**" / "About **Me**" — das letzte Wort ist farblich hervorgehoben
   - Grundfarbe: `aboutSectionTitleColor` = `rgba(239, 68, 68, 0.9)` (Rot, leicht transparent)
   - Accent-Farbe: `aboutSectionAccentColor` = `rgba(248, 113, 113, 1)` (Helles Rot-Orange)

3. **2-Spalten-Layout** (ab `md`):
   - Linke Spalte: Beschreibungstext-Karte
   - Rechte Spalte: 5 InfoCards (vertikal gestapelt)

4. **Beschreibungstext-Karte** (links):
   - Card-Styling: `rounded-xl`, `backdrop-blur`, `text-center md:text-left`
   - Hintergrund: `aboutSectionCardBackground` = `rgba(11, 13, 23, 0.95)`
   - Border: `aboutSectionCardBorder` = `rgba(167, 139, 250, 0.6)` (Lila, semi-transparent)
   - Box-Shadow: `aboutSectionCardShadow` = `0 25px 60px rgba(167, 139, 250, 0.35)` (Lila-Glow)
   - Inhalt: `<h3>` + mehrere `<p>`-Absätze aus `portfolioData.about.description[]` (je nach Sprache)

5. **InfoCards** (rechts, je 5 Stück):
   - Jede Karte: `gradient-border card-hover p-6 text-left`
   - Icon-Kreis links: `rounded-full p-3`, Hintergrund `aboutSectionIconBackground` = `rgba(139, 92, 246, 0.1)`, Icon-Farbe `aboutSectionIconColor` = `rgba(239, 68, 68, 1)`
   - Titel: `aboutSectionTitleColor`, Beschreibung: `aboutSectionDescriptionText`

**InfoCard-Inhalte (DE):**
1. **Software Development** (Code-Icon): Web, Desktop, Backend — saubere Architektur, wartbarer Code
2. **Interactive Systems** (Workflow-Icon): Unity/C# — Spiele, Simulationen, Echtzeit-Interaktion
3. **AI & Automation** (Bot-Icon): KI-Integration in Projekte, Python/TypeScript/Browser-Automation
4. **Collaboration & Communication** (ChartNoAxesCombined-Icon): Agile Projekte, klare Kommunikation
5. **Ownership & Mindset** (Briefcase-Icon): Eigeninitiative, selbstständiges Arbeiten, Entscheidungen treffen

### 3.6 Footer

**Datei:** `src/components/Footer.tsx`

**Inhalt:**
- Copyright: `© {Jahr} Leo. Alle Rechte vorbehalten. / All rights reserved.`
- Datenschutz-Hinweis: "Private Portfolio-Website. Spielbare Demos öffnen externe Plattformen (z.B. itch.io). Diese Website speichert keine personenbezogenen Daten."
- Zweisprachig, Textfarbe: `text-foreground/70`

### 3.7 Toaster

Toast-System basiert auf Radix UI `@radix-ui/react-toast`. Komponenten:
- `src/components/ui/toast.tsx` — Toast-Primitives (Provider, Viewport, Root, Title, Description, Close, Action)
- `src/components/ui/toaster.tsx` — Rendert aktive Toasts aus dem Hook
- `src/hooks/use-toast.ts` — State Management (Reducer mit ADD/UPDATE/DISMISS/REMOVE), globales `toast()`-API

**Hinweis:** Das Toast-System ist vorhanden, wird derzeit aber nicht aktiv genutzt (keine sichtbaren Toast-Ausgaben im normalen Flow). Es könnte für Benachrichtigungen oder Copied-to-Clipboard verwendet werden.

---

## 4. Page: `/projects` — Projektübersicht

**Route:** `/projects`  
**Page-Komponente:** `src/app/projects/page.tsx` (Server Component)  
**Verwendete Komponenten:** `NetworkBackground`, `Navbar`, `ProjectsShowcase`, `Footer`

### 4.1 Layout

Identisch zum Home-Layout: `NetworkBackground` (hinten), `Navbar` (fixiert), `ProjectsShowcase` (main), `Footer`.

### 4.2 ProjectsShowcase

**Datei:** `src/components/ProjectsSection.tsx`  
**Export-Name:** `ProjectsShowcase` (wird in `page.tsx` so importiert)

**Inhalt und Aufbau:**

1. **Sektion** mit `py-24`

2. **Überschrift `<h2>`:**
   - "Ausgewählte **Projekte**" / "Featured **Projects**"
   - Grundfarbe: `projectsSectionTitleColor` = `rgba(239, 68, 68, 1)` (Rot)
   - Accent (das hervorgehobene Wort): `projectsSectionAccentText` = `rgba(248, 113, 113, 1)` (Rot-Orange)

3. **Untertitel `<p>`:**
   - Zentriert, `max-w-3xl`
   - Farbe: `projectsSectionSubtitleColor` = `rgba(213, 220, 232, 0.9)`
   - Text: "Hier sind einige meiner aktuellen Projekte..." / "Here are some of my recent projects..."

4. **Projektkarten-Grid:**
   - `grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8`
   - Zeigt: `portfolioData.projects` (5 echte + 1 "coming-soon")
   - Jede Karte:
     - `card-hover overflow-hidden rounded-lg`
     - Hintergrund: `projectsSectionCardBackground` = `rgba(11, 13, 23, 0.92)`
     - Border: `projectsSectionCardBorder` = `rgba(167, 139, 250, 0.6)` (Lila)
     - Box-Shadow: `projectsSectionCardShadow` = `0 25px 60px rgba(167, 139, 250, 0.35)` (Lila-Glow)
     - **Bildbereich oben:** `h-48 overflow-hidden`. Bild als `<Image>` mit `object-cover`. Link zu `/projects/[id]`. Hover: `scale-110` Transition.
     - **Content-Bereich unten:** `p-6`
       - Titel + Subtitle (inline, `text-xl font-semibold`), Link zu Detailseite
       - Beschreibung (`text-sm`, `projectsSectionSubtitleColor`-Farbe)
       - Tags: `flex flex-wrap gap-2`, jedes Tag als Pill/Badge:
         - `rounded-full border px-2 py-1 text-sm`
         - Border: `projectsSectionTagBorder` = `rgba(167, 139, 250, 0.4)`
         - Background: `projectsSectionTagBackground` = `rgba(167, 139, 250, 0.18)`
         - Text: `projectsSectionTagText` = `rgba(167, 139, 250, 1)`
       - "Mehr Details anzeigen"/"View more Details"-Link: `ArrowRight`-Icon, Farbe `projectsSectionLinkColor` = `rgba(239, 68, 68, 1)` (Rot)

5. **"Weitere Projekte"-Sektion:**
   - Überschrift `<h3>`: "Weitere Projekte" / "More Projects"
   - Untertitel: "Zusätzliche Projekte und Experimente..."
   - Gleiches Karten-Grid mit `other_projects`-Daten (5 gültige + 2 leere/Dummy + 1 coming-soon)
   - Leere Einträge (`id === ""`) werden gefiltert

6. **GitHub-Button:**
   - Zentrierter `cosmic-button`
   - Hintergrund: `linear-gradient(135deg, rgba(87,8,139,1), rgba(39,5,141,0.7))` — Dunkel-Lila
   - Text: `projectsSection_GH_Text` = `rgba(213, 220, 232, 1)`
   - Glow: `projectsSection_GH_Glow` = `0 0 20px rgba(167, 139, 250, 0.5)`
   - Klick öffnet GDPR-Consent-Dialog → dann `window.open("https://github.com/062Leo", "_blank")`

7. **GDPR Consent Dialog** (identisches Muster wie an anderen Stellen):
   - `fixed inset-0 z-50`, `bg-black/60`
   - Dialog-Box: `rounded-3xl`, `bg-background/95`, `border border-border`
   - "Externer Link" / "External link" — GitHub-spezifischer Text
   - "Abbrechen/Cancel" + "Fortfahren/Continue"

---

## 5. Page: `/projects/[id]` — Projektdetailseite

**Route:** `/projects/[id]`  
**Page-Komponente:** `src/app/projects/[id]/page.tsx` (Server Component)  
**Detail-Komponente:** `src/components/projects/default.tsx` (Client Component, als `DetailPage` exportiert)  
**Datenquellen:** Alle 4 Dateien (portfolio-data DE/EN, other_projects DE/EN)  
**`generateStaticParams()`:** Sammelt alle Unique IDs aus allen 4 Quellen.

### 5.1 DetailPage — Vollständiger Aufbau

**Datei:** `src/components/projects/default.tsx`

Die `DetailPage` ist die komplexeste Komponente. Sie rendert ALLE Projektdetail-Informationen.

**1. Back-Link:**
- `<Link href="/projects">` mit `ArrowLeft`-Icon
- Farbe: `boomforceBackLinkText` = `rgba(167, 139, 250, 1)` (Lila)
- Hover: `boomforceBackLinkHover` = gleiche Farbe
- Text: "Zurück zur Projektübersicht" / "Back to Projects"

**2. Titel & Tags:**
- `<h1>`: `text-4xl md:text-5xl font-bold font-rubik uppercase`
- Farbe: `boomforceProjectTitleColor` = `rgba(239, 68, 68, 1)` (Rot)
- Text-Shadow/Glow: `boomforceProjectTitleGlow` = `0 0 15px rgba(180,162,234,0.3), 0 0 25px rgba(104,80,172,0.3)`
- Subtitle (falls vorhanden): `text-xl md:text-2xl font-semibold font-rubik uppercase`
- Tags: Pills/Badges, gleiches Styling wie auf der Übersichtsseite:
  - Border: `boomforceTagBorder` = `rgba(167, 139, 250, 0.3)`
  - Background: `boomforceTagBackground` = `rgba(167, 139, 250, 0.1)`
  - Text: `boomforceTagText` = `rgba(167, 139, 250, 1)`

**3. Hauptbild:**
- `aspect-video w-full max-w-4xl rounded-xl overflow-hidden border-2`
- Border: `boomforceMainImageBorder` = `rgba(167, 139, 250, 1)` (Lila)
- Hintergrund: `boomforceMainImageBackground` = `rgba(11, 13, 23, 1)`
- `<img>` mit `object-cover` (NICHT `<Image>`, HTML `<img>` wird verwendet)
- Fallback: `/Bilder/dummy.png`

**4. Long Description:**
- `text-lg leading-relaxed`
- Farbe: `boomforceProjectDescriptionText` = `rgba(213, 220, 232, 1)`
- Gerendert mit `renderMarkdownText()` → unterstützt `**bold**` und Absätze

**5. Features & Tech Stack (2-Spalten ab md):**

**Linke Spalte — KEY FEATURES:**
- Überschrift: `text-xl font-semibold font-press-start` (Pixel-Schrift!)
- Farbe: `boomforceFeatureTitleColor` = `rgba(248, 113, 113, 1)` (Rot-Orange)
- Liste: `<ul>` mit `CheckCircle`-Icons (grün: `rgba(74, 222, 128, 1)`)
- Textfarbe: `boomforceFeatureListText` = `rgba(213, 220, 232, 1)`
- Gerendert mit `renderMarkdownText()`

**Rechte Spalte — TECH STACK:**
- Überschrift: `font-press-start`
- Farbe: `boomforceTechStackTitleColor` = `rgba(248, 113, 113, 1)` (Rot-Orange)
- Tech-Tags: `rounded-md px-3 py-1.5 text-sm font-mono uppercase`
  - Background: `boomforceTechStackBgColor` = `rgba(167, 139, 250, 0.33)` (Lila, 33% Opacity)
  - Text: `boomforceTechStackTextColor` = `rgba(213, 220, 232, 1)`

**Rechte Spalte — STATS (optional, nur wenn `project.stats` vorhanden):**
- Überschrift: `font-press-start`
- Farbe: `boomforceStatsTitleColor` = `rgba(248, 113, 113, 1)` (Rot-Orange)
- Stats als Liste mit dynamischen Icons (`Clock`, `Star`, `Code`, `Zap`, `Users`, `Target`, `Award`, `Layers`, `Download`, `Eye`, `TrendingUp`, `DollarSign`)
- Icon-Farbe: `boomforceStatsIconColor` = `rgba(250, 204, 21, 1)` (Gold/Gelb)
- Text: `boomforceStatsTextColor` = `rgba(213, 220, 232, 1)`
- Format: `{label}: {value}`

**6. Action-Buttons:**
- **"DEMO SPIELEN" / "PLAY DEMO":** (nur wenn `demoLink` vorhanden)
  - Link zu `/projects/[id]/demo`
  - Hintergrund: `linear-gradient(to right, rgba(105,30,155,1), rgba(167,139,250,0.7))` — Lila-Gradient
  - Text: `boomforceDemoBtnTextColor` = `rgba(213, 220, 232, 1)`
  - Shadow: `0 0 20px rgba(167, 139, 250, 0.5)` (Lila-Glow)
  - Icon: `Play`

- **"DEMO HERUNTERLADEN" / "DOWNLOAD DEMO":** (nur wenn `demoDownload` vorhanden)
  - Gleicher Style wie Demo-Button
  - Klick öffnet GDPR-Consent-Dialog

- **"CODE ANSEHEN" / "VIEW CODE":** (nur wenn `githubUrl` vorhanden)
  - Border: `1px solid rgba(167, 139, 250, 1)` (Lila)
  - Text: `boomforceViewCodeBtnText` = `rgba(167, 139, 250, 1)`
  - Shadow: `0 0 20px rgba(167, 139, 250, 0.3)`
  - Kein Gradient-Hintergrund, nur outline-Stil
  - Icon: `ExternalLink`
  - Klick öffnet GDPR-Consent-Dialog

- **Custom Button:** (nur wenn `custom1Link` und `custom1BTNText` vorhanden)
  - Gleicher Style wie Demo-Button (Gradient)
  - Klick öffnet Custom-Consent-Dialog (mit angepasstem Text, z.B. "Unity Asset Store")

**7. Video-Bereich:**
- Siehe Abschnitt 5.2 (ProjectVideos-Komponente)

**8. Screenshots-Galerie:**
- Nur wenn `project.images` Array nicht leer ist
- Überschrift: "SCREENSHOTS", `font-press-start`, `text-2xl`
- Farbe: `boomforceScreenshotsTitleColor` = `rgba(248, 113, 113, 1)` (Rot-Orange)
- Grid: `grid grid-cols-1 md:grid-cols-2 gap-6`
- Jedes Bild: Thumbnail in `aspect-video rounded-xl border-2`, Border `boomforceScreenshotsBorder`
- Hover: Overlay "Click me" + `scale-105`
- Klick: Öffnet Lightbox (Modal mit großem Bild + Caption + Close-Button "×")

**9. GDPR Consent Dialogs:**
- Standard-Dialog für githubUrl / demoDownload (gleiches Muster wie ProjectsShowcase)
- Custom-Dialog für custom1Link (angepasster Plattform-Name aus customLabel)

### 5.2 ProjectVideos-Komponente

**Datei:** `src/components/projects/components/ProjectVideos.tsx`

**Struktur:**

1. **Big Video** (wenn `videoBig` vorhanden):
   - Überschrift "VIDEO" in `font-press-start`
   - Video-Player: `aspect-video`, `controls`, `muted`, `preload="auto"`
   - Container: `rounded-xl overflow-hidden border-2`, gleicher Style wie Screenshots

2. **Detail Videos** (wenn `videos` Array nicht leer):
   - Überschrift "DETAILS" in `font-press-start`
   - Alternierende Zeilen (`md:flex-row` / `md:flex-row-reverse`)
   - Jede Zeile:
     - Hintergrund: `rgba(72, 51, 95, 0.25)` (Dunkles Lila, 25% Opacity)
     - Verbindungslinie (Desktop): Horizontale Linie in der Mitte
     - **Video-Container** (linke oder rechte Hälfte): `aspect-ratio: 4/3`, `rounded-lg`, `border`, `controls`, `muted`, `loop`, `playsInline`
     - **Text-Container** (gegenüber): `p-6 rounded-lg`, gleicher Card-Style, Caption-Text via `renderMarkdownText()`
   - **IntersectionObserver:** Videos spielen nur, wenn sichtbar (>50%), pausieren sonst

---

## 6. Page: `/projects/[id]/demo` — Demo-Unterseite

**Route:** `/projects/[id]/demo`  
**Page-Komponente:** `src/app/projects/[id]/demo/page.tsx` (Server Component)  
**Detail-Komponente:** `src/components/projects/components/Demo.tsx` (Client Component, als `DetailPage` exportiert)  
**Datenquelle:** Nur `portfolio-data.ts` / `portfolio-data-en.ts` (keine other_projects!)  
**`generateStaticParams()`:** Filtert NUR Projekte mit vorhandenem `demoLink`.

### 6.1 DemoPage — Aufbau

**Datei:** `src/components/projects/components/Demo.tsx`

**1. Back-Link:**
- `<Link href="/projects/[id]">` (zurück zum Projektdetail, nicht zur Übersicht!)
- Text: "Zurück zum Projekt" / "Back to Project"
- Andere Link-Farbe als auf Default-Detailseite: `demoBackLinkText`/`demoBackLinkHover`

**2. Titel:**
- `<h1>`: `text-3xl md:text-4xl font-bold font-rubik uppercase`
- Format: "{Projekttitel} - Demo"
- Farbe: `demoTitleColor` = `rgba(239, 68, 68, 1)` (Rot)
- Glow: `demoTitleGlow` (wie boomforceProjectTitleGlow)

**3. Demo-Text (`demotext`):**
- `text-base md:text-lg leading-relaxed`
- Farbe: `demoTextColor` = `rgba(213, 220, 232, 1)`
- Gerendert mit `renderMarkdownText()`

**4. Demo-Bild (itch.io-Widget-Ersatz):**
- Wenn `demoImage` vorhanden: Bild als klickbarer Button
- `rounded-xl overflow-hidden border-2`
- Border: `demoFrameBorderColor` = `rgba(167, 139, 250, 1)` (Lila)
- Background: `demoFrameBackgroundColor` = `rgba(11, 13, 23, 1)`
- Klick auf das Bild öffnet GDPR-Consent-Dialog → dann Link zu `demoLink` (itch.io)
- `<img>` mit `w-full h-auto`

**5. Steuerungstabelle (Controls):**
- Überschrift "STEUERUNG" / "CONTROLS" in `font-press-start`
- Farbe: `demoControlsTitleColor` = `rgba(248, 113, 113, 1)` (Rot-Orange)
- **Zwei Modi:**
  - **Flat Controls:** Einfache Liste von `"Aktion: Taste"` Strings → 2-spaltige Tabelle
  - **Grouped Controls:** Array von `DemoControlsGroup`-Objekten (z.B. Survivor/Killer) → Mehrere Tabellen nebeneinander (`md:flex-row`)
- **Tabellen-Styling:**
  - Header: `border-bottom: 1px solid demoControlsHeaderSeparatorColor` (`rgba(167, 139, 250, 1)`)
  - Header-Zellen: `font-press-start`
  - "Keys"/"Tasten"-Spalte (rechtsbündig): Farbe `demoControlsHeaderKeysColor` = `rgba(248, 149, 113, 1)` (Orange)
  - "Action"/"Aktion"-Spalte (linksbündig): Farbe `demoControlsHeaderActionColor` = `rgba(248, 149, 113, 1)` (Orange)
  - Datenzellen: Keys `demoControlsKeysTextColor`, Actions `demoControlsActionTextColor`
  - Jede Zeile: `border-bottom: 1px solid demoControlsRowSeparatorColor`
  - Vertikaler Separator zwischen Spalten: `borderLeft`

**6. Misc-Bereich (optional):**
- `miscTitle`: Überschrift in `font-press-start`, Farbe `demoControlsTitleColor`
- `miscimage`: Breites gerahmtes Bild (gleicher Frame-Style wie Demo-Bild)
- `misctext`: Text unter dem Bild, `renderMarkdownText()`

**7. GDPR-Consent-Dialog:**
- Spezifisch für itch.io: "Sie verlassen diese Website und werden auf eine externe Plattform (itch.io) weitergeleitet."
- Link-Ziel im `<a>`-Tag statt `window.open` (direkter `href` zu itch.io)

---

## 7. Datenmodell & Content-Struktur

### 7.1 Projekt-Typdefinition (`Project`)

**Dateien:** `portfolio-data.ts`, `portfolio-data-en.ts`, `other_projects.ts`, `other_projects_en.ts`

```typescript
type Project = {
  id: string;                          // URL-Slug (z.B. "broforce-clone")
  title: string;                       // Projektname
  subtitle?: string;                   // Untertitel (z.B. "(Broforce Klon)")
  description: string;                 // Kurzbeschreibung (für Karten)
  longDescription?: string;            // Ausführliche Beschreibung (für Detailseite)
  image: string;                       // Hauptbild (z.B. "/Bilder/BoomForce/BoomForce.png")
  images?: ProjectImage[];             // Screenshot-Galerie
  tags: string[];                      // Tag-Pills (z.B. ["Unity 2D", "C#"])
  demoLink?: string;                   // Link zur spielbaren Demo (itch.io)
  demoImage?: string;                  // Demo-Bild (für Demo-Seite)
  demoDownload?: string;               // Download-Link für Demo
  githubUrl?: string;                  // GitHub-Repository-Link
  videoBig?: string;                   // Pfad zum großen Showcase-Video
  custom1Link?: string;                // Zusätzlicher externer Link (z.B. Asset Store)
  custom1BTNText?: string;             // Button-Text für custom1Link
  customLabel?: string;                // Plattform-Label für Consent-Dialog
  demotext: string;                    // Text auf der Demo-Seite
  demoControls: string[] | DemoControlsGroup[];  // Steuerungsdaten
  misctext: string;                    // Zusätzlicher Text (Demo-Seite)
  miscimage: string;                   // Zusätzliches Bild (Demo-Seite)
  miscTitle: string;                   // Überschrift für Misc-Bereich
  features?: string[];                 // Feature-Liste (für Detailseite)
  techStack?: string[];                // Tech-Stack-Tags
  detailComponent?: "BoomForce" | "Old";  // Historisch, wird ignoriert
  stats?: ProjectStat[];               // Statistik-Daten
};

type ProjectImage = {
  url: string;
  caption?: string;
};

type ProjectStat = {
  icon: "Clock" | "Star" | "Code" | "Zap" | "Users" | "Target" | "Award" | "Layers" | "Download" | "Eye" | "TrendingUp" | "DollarSign";
  label: string;
  value: string;
};

type DemoControlsGroup = {
  title: string;                       // z.B. "Survivor", "Killer"
  items: string[];                     // z.B. ["Bewegen: WASD", "Springen: Space"]
};
```

### 7.2 Alle Projekte (Features + Additional)

#### Hauptprojekte (`portfolio-data.ts`):

| ID | Titel | Key Facts |
|----|-------|-----------|
| `ml-agent-bachelor` | Bachelorarbeit: ML-Agent in Unity | RL Agent, 31 Parkours, 711h Training, Note 1.0, 13 Level, PPO+LSTM, Demo-Download, GitHub |
| `play-mode-saver` | Play Mode Changes Saver | Unity Asset Store (>750 Sales, 5/5★, Free), Editor-Tool, GUID+Pfad-Identifikation, Asset Store Link |
| `food-check-scanner-app` | FoodCheck Scanner App | React Native/Expo, Barcode-Scanner, 683 Regeln, 19 Kategorien, Open Food Facts, GitHub, APK Download |
| `broforce-clone` | BoomForce (Broforce Klon) | Unity 2D Shooter, Kettenreaktionen, Zerstörbare Umgebung, itch.io Demo, GitHub, 4 Detail-Videos |
| `prop-hunt` | Hide'n Hunt | 4v1 Multiplayer, Prop-Mechanik, Unity Netcode, itch.io Demo, 2 Steuerungsgruppen (Survivor/Killer), Map-Legende |
| `coming-soon` | Bald verfügbar | Platzhalter |

#### Weitere Projekte (`other_projects.ts`):

| ID | Titel | Key Facts |
|----|-------|-----------|
| `kryptodash` | KryptoDash | Angular+Django Fullstack, TradingView, Fake Wallet, Quizzes, 4 Screenshots, 2er-Team |
| `game-of-life` | Conway's Game of Life | C# WPF Desktop, Dark/Light Theme, Demo-Download, GitHub |
| `doom-mobility-prototype` | DOOM Movement Prototype | Unity First-Person, Dashes, Wall-Climbing, Trampoline, Keine Externen Links |
| `arcanoid-3d` | Arcanoid 3D | Unity 3D Brick-Breaker, Powerups, Score-System, Prototyp |
| `smart-color-following-car` | Smart Color Following Car | Arduino + Pixy2, Autonomes Farbverfolgungsfahrzeug, Elegoo Robot Car |
| *(leer)* | *(leer)* | Dummy/Leerer Eintrag (wird gefiltert) |
| *(leer)* | 2D Online Multiplayer Mobile Kartenspiel | Unity + Photon PUN 2, Android, `githubUrl: "#"` |
| `coming-soon` | Bald verfügbar | Platzhalter |

### 7.3 Personal & About Daten

In `portfolio-data`:
```typescript
personal: {
  firstName: "Leo",
  role: "Softwareentwickler (B.Sc. Softwareentwicklung, ...)",  // DE
  // role in EN: "Software Developer (B.Sc. Software Engineering, ...)"
}
about: {
  title: "About Me",
  description: ["Absatz 1", "Absatz 2", "Absatz 3", "Absatz 4"]  // 4 Absätze
}
```

EN-Version (`portfolio-data-en.ts`) enthält zusätzlich:
```typescript
about: {
  softSkills: ["Teamwork / Collaboration", "Self-directed...", ...]  // 9 Soft Skills
  // (werden derzeit nicht im UI gerendert!)
}
```

### 7.4 Asset-Pfade (Bilder & Videos)

Alle Assets liegen in `public/`:
```
public/Bilder/
  ├── BachelorArbeit/BachelorArbeit.png
  ├── RuntimeSaver/TitleImage.jpg
  ├── FoodCheck/AppIcon.png
  ├── BoomForce/BoomForce.png, demo.png
  ├── HideAndHunt/menu.png, demo.png, Map.png
  ├── KryptoDash/landingpage.png, fakeWallet.png, wallet.png, fakeWalletSettings.png, quiz.png
  ├── GameOfLife/GameOfLife.png
  ├── Doom/Doom.png
  ├── Arcanoid/arcanoid.png
  ├── SmartCar/smartCar.png
  └── dummy.png

public/Videos/Big/
  ├── FragenTrainingShowcase.mp4      (ML Agent)
  ├── PlayModeChangesSaver.mp4        (Play Mode Saver)
  ├── FoodCheck_Video.mp4             (FoodCheck)
  ├── BroforceShowcase.mp4            (BoomForce)
  ├── HideAndHuntShowcaseFinal.mp4    (Hide'n Hunt)
  ├── GameOfLife.mp4                  (Game of Life)
  ├── Doom_Showcase.mp4               (DOOM Movement)
  ├── Arcanoid.mp4                    (Arcanoid 3D)
  └── Smart-Colorfollowing-Car.mp4    (Smart Car)

public/Videos/BoomForce/              (Detail-Videos für BoomForce)
  ├── KettenReaktionen.mp4
  ├── Steine.mp4
  ├── Radius2.mp4
  └── radius.mp4

public/Icons/
  ├── de_flag.png
  └── en_flag.png
```

---

## 8. Technische Besonderheiten & Constraints

### 8.1 Build & Deployment

- **Static Export** (`output: "export"`): Die gesamte Site wird als statisches HTML/CSS/JS gebaut. Deployment auf jeden Static Host (Vercel, Netlify, GitHub Pages etc.).
- **Keine API-Routen, keine Middleware, kein ISR, keine Server Actions.**
- **`next/image` unoptimized:** Alle Bilder müssen mit `unoptimized: true` oder als natives `<img>` verwendet werden.
- **`reactCompiler: true`:** Auto-Memoization aktiv. `useMemo`/`useCallback` sind meist redundant.

### 8.2 Technologie-Stack

| Technologie | Version | Verwendung |
|-------------|---------|-----------|
| Next.js | 16.0.10 | Framework (App Router) |
| React | 19.2.0 | UI Library |
| TypeScript | 5.9.3 | Typsystem |
| Tailwind CSS | 4.1.17 | CSS-Framework (v4 Syntax!) |
| Radix UI | @radix-ui/react-toast 1.2.14 | Toast-System |
| lucide-react | 1.8.0 | Icons |
| class-variance-authority | 0.7.1 | Variant-API für Komponenten |
| clsx | 2.1.1 | Klassen-Utilities |
| tailwind-merge | 3.3.1 | Tailwind-Klassen-Merging |
| autoprefixer | 10.4.22 | CSS-Vendor-Präfixe |
| babel-plugin-react-compiler | 1.0.0 | React Compiler |

### 8.3 Tailwind CSS v4 Besonderheiten

- **Kein** `tailwind.config.ts` wird aktiv genutzt (die Datei existiert, ist aber ein Legacy-Relic).
- Stattdessen: `@import "tailwindcss"` in `globals.css`, `@theme`-Block für Custom Properties, `@utility` für Custom Utilities.
- Keine v3-Syntax (`@layer`, `@apply` in Components) verwenden.

### 8.4 Wichtige Design-Constraints

1. **Keine Server-Komponenten für Interaktivität:** Alles mit `useState`, `useEffect`, `useRef`, Browser-APIs MUSS `"use client"` haben.

2. **GDPR External Link Consent:** JEDER externe Link (GitHub, itch.io, Unity Asset Store, Downloads) MUSS den Consent-Dialog zeigen. Dieses Muster muss bei einem Redesign erhalten bleiben.

3. **i18n ist Daten-Duplizierung:** Neue Projekte müssen in **beiden** Sprachen angelegt werden (DE + EN). Es gibt keinen Translation-Layer.

4. **Neue Projekte brauchen `generateStaticParams()`:** Wenn ein neues Projekt hinzugefügt wird, muss `generateStaticParams()` in `[id]/page.tsx` und ggf. `[id]/demo/page.tsx` die neue ID einschließen (derzeit sammelt die Funktion alle IDs aus allen 4 Datenquellen, ein neues Projekt in einer Datenquelle wird also automatisch erfasst).

5. **Leere/Dummy-Projekte:** Werden zur Laufzeit gefiltert (`project.id && project.id.trim() !== ""`).

6. **Press Start 2P Font:** Wird für Überschriften in Detail- und Demo-Seiten verwendet. Ist eine sehr breite Pixel-Schrift — Zeilenlängen beachten.

7. **Dark-Mode Only:** Es gibt keinen Light-Mode-Umschalter. Das Theme-System hat zwar `light`-Aliase, aber diese sind identisch zu `dark`.

### 8.5 Ungenutzte Bereiche

Diese Theme-Properties und Komponenten existieren, werden aber derzeit nirgends verwendet:
- `contactSection*` (9 Properties) — keine Kontakt-Sektion
- `skillsSection*` (9 Properties) — keine Skills-Sektion
- `oldSlider*` (6 Properties) — alter Slider, nicht mehr genutzt
- `aboutMe_GetInTouch*` (4 Properties) — Get-In-Touch-Button, nicht genutzt
- `softSkills` in `portfolio-data-en.ts` — wird nicht gerendert
- `detailComponent`-Feld auf Projekten — historisch, wird ignoriert (es gibt nur noch `default.tsx`)

---

## 9. Zusammenfassung: Was OpenDesign ändern/neugestalten kann

### 9.1 Farbpalette (zentral in `colors.tsx`)

Alle ~80 Farb-Properties sind in `src/components/colors.tsx` definiert. Eine komplett neue Farbpalette kann durch Austausch aller Werte in `darkColors` erreicht werden. Die Properties sind nach Komponenten gruppiert und gut dokumentiert (Kommentar über jeder Property beschreibt den Verwendungszweck).

**Empfohlener Ansatz:** Die Properties beibehalten (das System funktioniert), aber alle Farbwerte durch neue ersetzen. Die `ThemeColorSet`-Typ-Struktur MUSS erhalten bleiben, da alle Komponenten darauf zugreifen.

### 9.2 Globale Styles & Animationen (in `globals.css`)

- Neue Schriftarten (andere Google Fonts oder Custom Fonts) in `public/fonts/` ablegen und `@font-face`-Regeln anpassen.
- Neue Keyframe-Animationen zum `@theme`-Block hinzufügen.
- Neue `@utility`-Klassen definieren.
- `cosmic-button` und `card-hover` Utilities können umgestaltet werden.

### 9.3 Komponenten-Layouts

Jede Client-Komponente kann einzeln umgestaltet werden:
- `Navbar.tsx` — Navigation, mobiles Menü
- `HomeSection.tsx` — Hero mit Easter-Egg
- `About.tsx` — Über-mich + InfoCards
- `Footer.tsx` — Einfach, Copyright + Datenschutz
- `ProjectsSection.tsx` — Projektkarten-Grid + Consent-Dialog
- `default.tsx` — Projektdetail-Seite (komplex!)
- `Demo.tsx` — Demo-Unterseite
- `ProjectVideos.tsx` — Video-Galerie
- `NetworkBackground.tsx` — Canvas-Partikel-Animation
- `toast.tsx` / `toaster.tsx` — Toast-System

### 9.4 Nicht ändern (Constraints)

- `output: "export"` — Static Export muss funktionieren
- `generateStaticParams()` — muss für `[id]` und `[id]/demo` erhalten bleiben
- `LanguageContext` — i18n-System (Daten-Duplizierung in DE/EN)
- GDPR Consent Dialogs — DSGVO-konforme externe Links
- Datenstruktur der `Project`-Typen — kann erweitert, aber nicht grundlegend geändert werden
- `cn()` Utility — wird in allen Komponenten verwendet

---

**Ende des Designdokuments. Stand: 19.05.2026**
