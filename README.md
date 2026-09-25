# dev-portfolio-nextjs

## Überblick

Persönliche Portfolio-Website. Die Anwendung liegt in `portfolio-app/`, ist passwortgeschützt, zweisprachig (Deutsch/Englisch) und wird auf Vercel betrieben.

Stack: Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript; Tests mit Vitest und Playwright.

Live: https://leos-portfolio.de

## Voraussetzungen

- Node.js 24 (Version steht in `portfolio-app/.nvmrc`; `package.json` verlangt `>=24 <25`)
- npm (kommt mit Node.js)

## Setup

```bash
git clone <repo-url>
cd dev-portfolio-nextjs/portfolio-app
npm install
npm run dev
```

Danach im Browser http://localhost:3000 öffnen. Ohne `SITE_PASSWORD` ist der Passwortschutz lokal aus (siehe [Passwortschutz](#passwortschutz)).

## Befehle

Alle Befehle im Ordner `portfolio-app/` ausführen.

| Befehl                            | Was er tut                                                                                 | Wann                                              |
| --------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| `npm run dev`                     | Dev-Server auf http://localhost:3000                                                       | beim Entwickeln                                   |
| `npm run build` / `npm start`     | Produktions-Build erzeugen / den Build starten                                             | um das Verhalten wie auf Vercel zu prüfen         |
| `npm run check`                   | Prüftor: Lint, Typen, Unit-Tests, Formatierung, Build, `npm audit`                         | vor jedem Push; muss fehlerfrei durchlaufen       |
| `npm test`                        | Unit-Tests (Vitest, `tests/unit/`)                                                         | nach Änderungen an Daten oder Logik               |
| `npm run e2e`                     | End-to-End-Tests (Playwright, `tests/e2e/`); baut und startet die App selbst auf Port 3100 | vor jedem Push von UI-Änderungen                  |
| `npm run lint` / `npm run format` | ESLint prüfen / Prettier formatiert alle Dateien                                           | wenn `check` bei Lint oder Formatierung scheitert |
| `npm run knip`                    | Findet ungenutzte Dateien, Exporte und Abhängigkeiten                                      | nach Umbauten und vor dem Push                    |

Vor dem ersten `npm run e2e` einmal den Browser installieren: `npx playwright install chromium`.

## Passwortschutz

Die ganze Website liegt hinter einem Passwort; der Proxy (`src/proxy.ts`) leitet Besucher ohne gültigen Cookie auf `/login` um. Bilder und Videos sind ebenfalls geschützt. Frei erreichbar sind nur `/login`, die Schriften, die Icons (inklusive Open-Graph-Bild), `favicon.ico` und `robots.txt`.

### Konfiguration

Lokal in `portfolio-app/.env.local`, auf Vercel in den Projekteinstellungen:

```
SITE_PASSWORD=dein-passwort
AUTH_SECRET=zufaelliger-string
AUTH_VERSION=1
```

- `SITE_PASSWORD`: das Passwort. Ohne diese Variable ist der Schutz aus.
- `AUTH_SECRET`: zufälliger String (z. B. `openssl rand -hex 32`), mit dem der Auth-Cookie signiert wird. In Produktion Pflicht; fehlt er, dient das Passwort als Schlüssel, und der Cookie lässt sich dann aus dem Passwort allein ableiten.
- `AUTH_VERSION`: optional, Standard `1`. Erhöhen, um alle Besucher auf einmal auszuloggen.

Der Cookie gilt 7 Tage.

### Login per URL-Parameter

Das Passwort kann statt im Formular auch als Parameter `key` übergeben werden:

```
http://localhost:3000?key=dein-passwort
http://localhost:3000/projects?key=dein-passwort
```

Der Proxy prüft den Wert, setzt den Auth-Cookie und leitet auf dieselbe URL ohne `key` weiter.

## Sprache

Die Sprache (`de`/`en`) steht im Cookie `lang`, einem rein funktionalen Cookie ohne personenbezogene Daten. Beim ersten Besuch wird sie aus der Browsersprache abgeleitet; der Server liefert die Seiten direkt in dieser Sprache aus, die URL bleibt gleich. Umschalten über die Flagge in der Navigationsleiste (auf Mobile im Menü).

## Metadaten

Die Website ist `noindex`: jede Seite sendet `<meta name="robots" content="noindex, nofollow">`, zusätzlich sperrt `public/robots.txt` alle Crawler. Das Open-Graph-Bild ist `public/Icons/og-image.png`; es liegt bewusst außerhalb des Passwortschutzes, damit Link-Vorschauen es laden können.

## Security-Header prüfen

Die Security-Header (u. a. Content-Security-Policy) setzt `next.config.ts` über `src/lib/security-headers.ts`. Nach jedem Deploy prüfen:

```bash
curl -sSI https://<deine-domain>/login
```

Außerdem in der Browser-Konsole der Seiten nach CSP-Fehlern schauen.

## Struktur

```
portfolio-app/
├── src/
│   ├── app/[lang]/        Seiten je Sprache: Start, Projekte, Projektdetail, Demo, Login
│   ├── components/        UI-Komponenten
│   │   ├── projects/      Bausteine der Projektdetailseite
│   │   └── skills/        Skill-Graph (Daten, Kräfte, Rendering)
│   ├── data/              Projektdaten DE/EN, Skills, Bildgrößen
│   ├── i18n/              UI-Texte (de.ts, en.ts) und Sprachlogik
│   ├── lib/               Auth, Security-Header, Hilfsfunktionen
│   └── proxy.ts           Passwortschutz und Sprach-Rewrite
├── tests/
│   ├── unit/              Vitest
│   └── e2e/               Playwright
└── public/                Bilder, Videos, Icons, Schriften
```

## Daten pflegen

### Projekt hinzufügen

1. Eintrag in `src/data/portfolio-data.ts` **und** in `src/data/portfolio-data-en.ts` anlegen, beide mit derselben `id` (für weitere Projekte entsprechend `other_projects.ts` und `other_projects_en.ts`). Die Felder beschreibt `src/data/types.ts`.
2. Bilder unter `public/Bilder/<Projekt>/` ablegen. Bilder, die im eigenen Seitenverhältnis erscheinen (Galerie, Demo-Bild, Illustration), brauchen einen Eintrag mit Breite und Höhe in `src/data/image-sizes.ts`.
3. Videos als `.mp4` unter `public/Videos/Big/` ablegen, daneben ein Vorschaubild mit gleichem Namen als `.jpg`.
4. `npm test` ausführen: Die Tests prüfen, dass die IDs in beiden Sprachen übereinstimmen, alle Medienpfade existieren (mit exakter Groß-/Kleinschreibung), jedes Video ein Vorschaubild hat und die Bildgrößen stimmen.

### Skill hinzufügen

Den Skill in `src/data/skills.json` **und** in `src/data/skills_en.json` in der jeweils entsprechenden Gruppe eintragen; der Wert ist eine ganze Zahl von 1 bis 5. `npm test` prüft den Wertebereich.

## Deployment

Vercel baut und deployt `main` automatisch bei jedem Push (Node 24.x). Umgebungsvariablen auf Vercel:

- `SITE_PASSWORD`, `AUTH_SECRET`, optional `AUTH_VERSION` (siehe [Passwortschutz](#passwortschutz))
- `NEXT_PUBLIC_SITE_URL`: öffentliche URL, aus der die absolute Adresse des Open-Graph-Bilds gebildet wird; ohne Wert gilt https://leos-portfolio.de. Wird beim Build eingesetzt, eine Änderung braucht also einen neuen Deploy.

Nach dem Deploy die Header prüfen (siehe [Security-Header prüfen](#security-header-prüfen)).

GitHub Actions (`.github/workflows/check.yml`) führt `npm run check`, `npx knip` und `npm run e2e` bei jedem Push auf `main` und `working*` sowie bei Pull Requests auf `main` aus. `check` als Pflicht-Check für `main` (Branch Protection) ist eine Repository-Einstellung, die der Inhaber des Repositorys setzt.

## Architektur

Wie eine Anfrage verarbeitet wird und wo Texte, Daten und Design-Tokens liegen: [portfolio-app/docs/architecture.md](portfolio-app/docs/architecture.md).
