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

## Passwortschutz

Die Website ist per Middleware (`proxy.ts`) passwortgeschützt. Besucher ohne gültigen Cookie werden auf `/login` umgeleitet.

### Konfiguration

Das Passwort wird über die Umgebungsvariable `SITE_PASSWORD` in `.env.local` gesetzt:

```
SITE_PASSWORD=dein-passwort
```

Ohne diese Variable ist der Schutz deaktiviert.

### Login per URL-Parameter überspringen

Statt das Passwort im Login-Formular einzugeben, kann es direkt als URL-Parameter übergeben werden:

```
http://localhost:3000?key=dein-passwort
http://localhost:3000/projects?key=dein-passwort
```

Der Proxy erkennt den `key`-Parameter, setzt den Auth-Cookie und leitet auf die saubere URL (ohne `key`) weiter.

