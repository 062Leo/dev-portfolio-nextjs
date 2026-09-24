# dev-portfolio-nextjs

Persönliches Portfolio (Next.js) — enthält die `portfolio-app`, die lokal als Next.js-Anwendung läuft und auf Vercel deployed wird.

Live: https://leos-portfolio.de

## Kurzbeschreibung

Dieses Repository enthält die Next.js-basierte Portfolio-Webseite (`portfolio-app`). Die UI ist mit Next 16 / React 19 gebaut.

## How to run locally

Voraussetzungen: Node.js (empfohlen: 18.x oder 20.x) und `npm`.

1. Repository klonen (falls noch nicht geschehen):

```bash
git clone <repo-url>
cd dev-portfolio-nextjs/portfolio-app
```

2. Abhängigkeiten installieren und Dev-Server starten:

```bash
npm install
npm run dev
```

3. Öffne im Browser:

http://localhost:3000

Vor jedem Push `npm run check` ausführen (Lint, Typen, Format, Build, Audit); es muss ohne Fehler durchlaufen.

## Passwortschutz

Die Website ist per Middleware (`proxy.ts`) passwortgeschützt. Besucher ohne gültigen Cookie werden auf `/login` umgeleitet.

### Konfiguration

Das Passwort und der Cookie-Schlüssel werden über Umgebungsvariablen in `.env.local` gesetzt:

```
SITE_PASSWORD=dein-passwort
AUTH_SECRET=zufaelliger-string
AUTH_VERSION=1
```

- `SITE_PASSWORD`: das Passwort. Ohne diese Variable ist der Schutz deaktiviert.
- `AUTH_SECRET`: zufälliger String (z. B. `openssl rand -hex 32`), mit dem der Auth-Cookie signiert wird. In Produktion Pflicht; fehlt er, wird ersatzweise das Passwort als Schlüssel verwendet, dann lässt sich der Cookie aus dem Passwort allein ableiten.
- `AUTH_VERSION`: optional, Standard `1`. Wert erhöhen, um alle Besucher auf einmal auszuloggen.

Der Cookie gilt 7 Tage. Bilder und Videos liegen ebenfalls hinter dem Passwort; nur `/login`, die Schriften und Icons sind frei erreichbar.

### Login per URL-Parameter überspringen

Statt das Passwort im Login-Formular einzugeben, kann es direkt als URL-Parameter übergeben werden:

```
http://localhost:3000?key=dein-passwort
http://localhost:3000/projects?key=dein-passwort
```

Der Proxy erkennt den `key`-Parameter, setzt den Auth-Cookie und leitet auf die saubere URL (ohne `key`) weiter.

## Sprache

Die Sprache (`de`/`en`) steht im Cookie `lang`, einem rein funktionalen Cookie ohne personenbezogene Daten. Beim ersten Besuch wird sie aus der Browsersprache abgeleitet; der Server liefert die Seiten direkt in dieser Sprache aus, die URL bleibt gleich. Umschalten über die Flagge in der Navigationsleiste (auf Mobile im Menü).

## Security-Header prüfen

Die Security-Header (u. a. Content-Security-Policy) werden in `next.config.ts` gesetzt.
Nach jedem Deploy die Header mit `curl -sSI https://<deine-domain>/login` prüfen.
Außerdem in der Browser-Konsole der Seiten nach CSP-Fehlern schauen.

