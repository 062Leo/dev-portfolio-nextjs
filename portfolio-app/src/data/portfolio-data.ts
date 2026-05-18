
export type ProjectImage = {
  url: string;
  caption?: string;
};

export type ProjectStat = {
  icon: "Clock" | "Star" | "Code" | "Zap" | "Users" | "Target" | "Award" | "Layers";
  label: string;
  value: string;
};

export type DemoControlsGroup = {
  title: string;
  items: string[];
};

export type Project = {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  longDescription?: string;
  image: string; // Kept for backward compatibility as the main image
  images?: ProjectImage[]; // New field for multiple images with captions
  tags: string[];
  demoLink?: string;
  demoImage?: string;
  demoDownload?: string;
  githubUrl?: string;
  videoBig?: string;
  custom1Link?: string;
  custom1BTNText?: string;
  customLabel?: string;
  demotext: string;
  demoControls: string[] | DemoControlsGroup[];
  misctext: string;
  miscimage: string;
  miscTitle: string;
  features?: string[];
  techStack?: string[];
  detailComponent?: "BoomForce" | "Old";
  stats?: ProjectStat[];
};

export const portfolioData = {
  personal: {
    firstName: "Leo",
    role: "Softwareentwickler (B.Sc. Softwareentwicklung, Schwerpunkt Games Engineering) mit Fokus auf AI, Automatisierung und sauberen Code",
  },
  about: {
    title: "About Me",
    description: [
      "Ich bin Softwareentwickler mit einem erfolgreich abgeschlossenen Bachelor of Science in Softwareentwicklung an der Hochschule Heilbronn. Meine Bachelorarbeit habe ich mit 1,0 abgeschlossen; der Gesamtdurchschnitt meines Studiums lag bei 2,1.",
      "Im Studium sowie in praxisnahen privaten Projekten habe ich einige Erfahrung in Unity und C#, aber auch in Web-, Desktop- und Tooling-Projekten gesammelt. Für mich ist Unity kein reines Games-Thema, sondern ein vielseitiges Werkzeug, das in vielen Branchen sinnvoll eingesetzt werden kann.",
      "Besonders interessieren mich Künstliche Intelligenz, insbesondere ihrem produktiver Einsatz im Arbeitsalltag sowie die Integration von KI in Projekte und Apps. Ebenso wichtig ist mir Automatisierung - etwa mit Python-Skripten, TypeScript-Tools für den Browser oder anderen Workflows, die wiederkehrende Aufgaben reduzieren.",
      "Ich ergreife gerne Eigeninitiative, denke aktiv mit, treffe Entscheidungen und arbeite selbstständig. Einen Großteil meiner Freizeit nutze ich für Projekte; dazu gehören Planung, Umsetzung und Recherche. Durch diese Arbeit bilde ich mich fortlaufend eigenständig weiter."
    ]
    
  },
  projects: [
    {
      id: "ml-agent-bachelor",
      title: "Bachelorarbeit: ML-Agent in Unity",
      subtitle: "",
      description: "Reinforcement-Learning-Agent, der mehrere dynamische 3D-Parkours in Unity meistert.",
      longDescription:"Im Rahmen meiner Bachelorarbeit habe ich einen ML-Agenten mit dem Unity ML-Agents Toolkit in Unity trainiert, der verschiedene dreidimensionale Parkour-Level mit dynamischen Hindernissen bewältigt.\n\nDer Fokus der Arbeit liegt auf der Frage, wie Trainingsstrategien, Curriculum-Design und Domain Randomization gestaltet werden müssen, damit der Agent nicht nur einzelne Trainingsszenarien löst, sondern robuste und generalisierungsfähige Strategien lernt. Das finale Modell erreicht hohe Erfolgsraten in den Trainingsleveln und zeigt zugleich übertragbares Verhalten in einem separaten Generalisierungs-Level.\n\nTechnisch kombiniert das Projekt umfangreiche Raycast- und Vektorbeobachtungen, einen hybriden Aktionsraum (kontinuierliche Bewegung + diskrete Aktionen) sowie einen PPO-Algorithmus mit LSTM-Netzwerk. Ein eigenes Python-Automatisierungsskript steuert Langzeittrainings, passt Hyperparameter dynamisch an und ermöglicht eine detaillierte Auswertung der Ergebnisse mit TensorBoard.",
      image: "/Bilder/BachelorArbeit/BachelorArbeit.png",
      images: [] as ProjectImage[],
      detailComponent: "",
      videos: [],
      tags: ["Reinforcement Learning", "Unity 3D", "ML-Agents", "PPO", "LSTM"],
      features: [
        "Training eines ML-Agenten in 13 Parkour-Leveln mit progressiver Komplexität",
        "Mehere unterschiedliche Varianten für ausgewählte Level",
        "Umfangreiche Sensorik mit RayPerceptionSensor3D und Vektorbeobachtungen (insgesamt 538 Beobachtungen pro Schritt)",
        "Hybrider Aktionsraum aus kontinuierlicher Bewegung und diskreten Aktionen (Springen, Rennen)",
        "Ausgefeilte Reward-Struktur mit Checkpoints, Zeitbonus und Bewegungsoptimierung",
        "Variantenbasiertes Level-Design zur Förderung von Generalisierung",
        "Python-Automatisierungsskript zur Steuerung langer Trainingsläufe und dynamischer Hyperparameter",
        "Auswertung der Trainingsläufe mit TensorBoard (Rewards, Losses, Erfolgsquoten)"
      ],
      techStack: ["Unity", "ML-Agents Toolkit", "C#", "Python", "PPO", "TensorBoard"],
      demoLink: "",
      demoImage: "",
      demoDownload: "https://github.com/062Leo/Bachelorarbeit-Demo/releases",
      githubUrl: "https://github.com/062Leo/Bachelorarbeit-Demo",
      videoBig: "/Videos/Big/FragenTrainingShowcase.mp4",
      custom1Link: "",
      custom1BTNText: "",
      customLabel: "",
      demotext: "",
      demoControls: [],
      misctext: "",
      miscimage: "",
      miscTitle: "",
      stats: [
        { icon: "Layers", label: "Trainingslevel", value: "13 Level + 1 Generalisierungslevel" },
        { icon: "Layers", label: "Parkour-Varianten", value: "31 unterschiedliche Parkours" },
        { icon: "Target", label: "Erfolgsrate Trainingslevel", value: "ca. 92 %" },
        { icon: "Star", label: "Erfolgsrate Generalisierungslevel", value: "43-53 %" },
        { icon: "Clock", label: "Trainingsdauer aller Modelle insgesamt", value: "711,17 Stunden" },
        { icon: "Zap", label: "Trainierte Modelle", value: "ca. 88" },
        { icon: "Star",   label: "Entwicklung",      value: "Solo-Projekt" },
        { icon: "Award", label: "Note", value: "1.0" },
      ]
    },
    {
      id: "play-mode-saver",
      title: "Play Mode Changes Saver",
      subtitle: "Kostenloses Tool · Veröffentlicht im Unity Asset Store",
      description:
        "Unity-Editor-Tool, das Änderungen aus dem Play Mode erfasst und auf den Edit Mode überträgt, damit der Iterationsfortschritt nach dem Testen nicht verloren geht.",
      longDescription:
        "**Problem:** In professionellen **Unity**-Produktionsabläufen werden wichtige Szenenanpassungen häufig im **Play Mode** vorgenommen, doch Unity verwirft diese beim Beenden des Modus. Dies erzwingt wiederholte manuelle Nacharbeit, verlangsamt die Iteration und erhöht das Risiko für fehlende oder inkonsistente Änderungen.\n\n**Lösung:** Play Mode Changes Saver wurde als produktionsorientiertes **Editor-Tool** entwickelt, das automatisch Szenen-Snapshots erstellt und Änderungen an **Transforms**, allen Unity-Components, eigenen Components und Scripts an GameObjects, Materials sowie Namen nachverfolgt. Es bietet eine geführte Side-by-Side-Prüfung, sodass nur validierte Änderungen in den Edit Mode übernommen werden. Die Lösung umfasst Inspector-Integration, Multi-Scene-Unterstützung, Undo/Redo-Support und eine robuste Objekterkennung via **hybrider GUID+Pfad-Identifikation**, die auch bei Umbenennungen stabil bleibt.\n\n**Ergebnis:** Dies ist kein reiner Prototyp, sondern ein **production-ready Produkt**, das im **Unity Asset Store** veröffentlicht wurde. Es demonstriert die vollständige Umsetzung von der Problemanalyse bis hin zu einer ausgelieferten Lösung, die den täglichen Workflow von Entwicklern und Level-Designern optimiert.\n\nWeitere Informationen zum Tool sind auf der Unity-Asset-Store-Seite verfügbar.",
      image: "/Bilder/RuntimeSaver/TitleImage.jpg",
      images: [],
      detailComponent: "",
      videos: [],
      tags: ["Unity", "Veröffentlicht", "Editor-Tool", "Spieleentwicklung", "Play Mode", "C#", "Workflow"],
      features: [
        "Automatische Baseline-Snapshots beim Start des Play Modes",
        "Inspector-Integration mit dediziertem Overrides-Button",
        "Eigenschaftsvergleich nebeneinander für selektive Übernahme",
        "Szenenweiter Overrides-Browser für zentrale Prüfung",
        "Nachverfolgung von Transforms, allen Unity-Components, Custom-Components, Scripts, Materials und Namen",
        "Hybride GUID+Pfad-Objektidentifikation (resistent gegen Umbenennungen)",
        "Persistente Speicherung via ScriptableObjects",
        "Multi-Scene-Unterstützung mit automatischem Wechsel",
        "Vollständige Undo/Redo-Integration",
        "Granulare Steuerung auf Eigenschaftsebene",
        "Erhalt der Originalwerte für vollständiges Zurücksetzen",
        "Kein Laufzeit-Overhead (nur im Editor)"
      ],
      techStack: ["C#", "Unity Editor", "GlobalObjectId", "SerializedObject / SerializedProperty", "ScriptableObject", "EditorGUI"],
      demoLink: "",
      demoImage: "",
      demoDownload: "",
      githubUrl: "",
      videoBig: "/Videos/Big/PlayModeChangesSaver.mp4",
      custom1Link: "https://assetstore.unity.com/packages/slug/354984",
      custom1BTNText: "Im Asset Store ansehen",
      customLabel: "Unity Asset Store",
      demotext: "",
      demoControls: [],
      misctext: "",
      miscimage: "",
      miscTitle: "",
      stats: [
        { icon: "Download",     label: "Verkäufe",            value: "> 750" },
        { icon: "Eye",          label: "Seitenaufrufe",       value: "> 1.000" },
        { icon: "TrendingUp",   label: "Konversionsrate",     value: "~71,33%" },
        { icon: "Star",         label: "Durchschnittliche Bewertung",   value: "5/5 Sterne" },
        { icon: "DollarSign",   label: "Preis",               value: "Kostenlos" },
        { icon: "Zap",          label: "Laufzeit-Overhead",   value: "Keiner" },
        { icon: "Target",       label: "Objektidentifikation", value: "Hybrid GUID + Pfad" }
      ]
    },
    {
      id: "food-check-scanner-app",
      title: "FoodCheck Scanner App",
      subtitle: "Barcode-Scanner zur Analyse von Zutaten, NOVA-Klassifizierung und Ernährungsrisiko-Bewertung",
      description: "Datenschutzorientierte mobile App (Expo/React Native), die Lebensmittel-Barcodes scannt, Zutaten und Zusatzstoffe gegen 683 Gesundheitsregeln bewertet und Verarbeitungsstufen klassifiziert – ohne proprietären Backend, ohne Tracking, ohne Werbung.",
      longDescription:
        "FoodCheck ist eine React Native (Expo) App, die EAN-8/EAN-13 Barcodes via Kamera erkennt, Produktdaten lokal in SQLite zwischenspeichert und Zutaten auf gesundheitliche Risikofaktoren überprüft.\n\n" +
        "Die App kombiniert lokale SQLite-Persistierung, on-device ML Kit OCR für Zutatenlisten und Abfragen gegen die Open Food Facts API v2. Sie enthält ein umfassendes Risiko-Bewertungssystem mit 683 Kern-Regeln in 19 Kategorien (E-Nummern, Süßstoffe, Konservierungsstoffe, Emulgatoren, gehärtete Fette, Phosphate etc.), mehrsprachige Zutatendarstellungen in 8 Sprachen (de/en/fr/it/es/nl/pt/pl) und NOVA-/Nutri-Score-Klassifizierung mit farblich gekennzeichneten Ampel-Bewertungen. KI-gestützte Insights von Robotoff ergänzen die Analyse mit Confidence-Scores für Kategorien, Labels und Zutaten.\n\n" +
        "Benutzer können Produkte mit OCR-gestützter Erfassung von Zutaten und Nährwerten bearbeiten (on-device ML Kit oder Cloud Vision über OFF), Zutaten automatisch übersetzen (DeepL oder MyMemory) und direkt zu Open Food Facts beitragen. Ein vollständiges Backup-System (JSON Export/Import) und Favoritenverwaltung runden die Funktionen ab.\n\n" +
        "Datenschutz ist Kernprinzip: kein eigener Server, keine Benutzerkonten, keine Cloud-Synchronisation, kein Tracking, keine Werbung. Persönliche Daten (Favoriten, Filterregeln, Einstellungen, API-Schlüssel) bleiben ausschließlich auf dem Gerät. Produktdaten werden aus der öffentlichen Open Food Facts Datenbank abgerufen und lokal zwischengespeichert für schnellen Zugriff. Uploads zu OFF sind vollständig optional und benutzergesteuert.\n\n" +
        "Die Architektur ist streng geschichtet (Screens → Store → Domain → Infrastructure), folgt SOLID-Prinzipien und ist vollständig in TypeScript (Strict Mode) typisiert. Die App ist derzeit nicht im App Store veröffentlicht; eine spätere Veröffentlichung ist möglich. Jeder kann sie aus dem Quellcode bauen oder ein vorkompiliertes Build von den GitHub Releases herunterladen.",
      image: "/Bilder/FoodCheck/AppIcon.png",
      images: [] as ProjectImage[], 
      detailComponent: "",
      videos: [],
      tags: ["React Native", "Expo", "TypeScript", "Mobile App", "Food Tech", "Gesundheit", "Datenschutz", "OCR", "Open Food Facts"],
      features: [
        "Echtzeitscanning von EAN-8/EAN-13 Barcodes mit haptischem Feedback",
        "Cache-First-Architektur: lokale SQLite mit intelligenter 7-Tage-Ablauf-Erkennung",
        "Ampel-Produktbewertung (Grün/Gelb/Rot) basierend auf Warnsignalen + NOVA-Score",
        "Risiko-Bewertung: 683 Kern-Regeln in 19 Kategorien (Zusatzstoffe, Zucker, gehärtete Fette, E-Nummern, etc.)",
        "Benutzerdefinierte Filter: Zutaten-Stichwörter und Nährstoff-Schwellenwerte mit mehrsprachiger Auto-Übersetzung",
        "NOVA-Klassifizierung (1-4, unverarbeitet bis ultra-verarbeitet) und Nutri-Score (A-E), beide farblich gekennzeichnet",
        "Lokales ML Kit OCR für Zutatenlisten und Nährwertangaben mit automatischer Spracherkennung",
        "Cloud Vision OCR Fallback mit Crop-Tool und Bearbeitungsfunktion",
        "Produktkatalog mit Textsuche (SQLite LIKE), Risiko-Filter (OK/Warnung/Kritisch), Sortierung und Wisch-zum-Löschen",
        "Favoritenverwaltung mit schnellem Toggle aus Produktdetail und Katalog",
        "Produktbearbeitung in 8 Sprachen: OCR-Erfassung, manuelle Eingabe, Auto-Übersetzung (DeepL/MyMemory), Batch-Übersetzung",
        "Optionaler Beitrag zu Open Food Facts (erfordert OFF-Konto, gespeichert in SecureStore)",
        "Robotoff AI Insights mit Confidence-Bar-Visualisierung",
        "Mehrsprachige Benutzeroberfläche: Deutsch/Englisch, Sprachwechsel jederzeit möglich",
        "Swipeable Bildergalerie mit lokalem File Caching (expo-file-system)",
        "Backup & Restore: kompletter SQLite Export/Import als JSON über Native Share Sheet",
        "Dark Mode First Design",
        "Privacy-by-Design: kein Backend, keine Cloud-Sync, kein Tracking, keine Ads – Daten bleiben auf dem Gerät"
      ],
      techStack: [
        "TypeScript 5.9 (strict)",
        "Expo SDK 54 (managed workflow)",
        "React Native 0.81 + React 19.1",
        "Expo Router (file-based navigation)",
        "Zustand 5 (4 stores: filter, catalog, language, settings)",
        "expo-sqlite 16 (SQLite)",
        "expo-camera 17 (barcode scanning)",
        "ML Kit Text Recognition (on-device OCR)",
        "expo-secure-store (credentials + API keys)",
        "expo-file-system (image caching)",
        "Open Food Facts API v2 (read + write)",
        "Robotoff (AI insights)",
        "DeepL Free API + MyMemory (translation)",
        "SymSpell (spell correction for ingredient matching)",
        "ESLint 10 (flat config) + Prettier 3",
        "Jest + jest-expo (23 suites, 265 tests)"
      ],demoLink: "",
      demoImage: "",
      demoDownload: "https://github.com/062Leo/FoodCheck-Scanner/releases",
      githubUrl: "https://github.com/062Leo/FoodCheck-Scanner",
      videoBig: "/Videos/Big/FoodCheck_Video.mp4",
      custom1Link: "",
      custom1BTNText: "",
      customLabel: "",
      demotext: "",
      demoControls: [],
      misctext: "",
      miscimage: "",
      miscTitle: "",
      stats: [
        { icon: "Layers", label: "Risiko-Regeln", value: "683 Kern-Regeln in 19 Kategorien" },
        { icon: "Zap", label: "OCR", value: "On-Device ML Kit + OFF Cloud Vision" },
        { icon: "Code", label: "Tests", value: "265 Tests über 23 Suites" },
        { icon: "Eye", label: "Datenschutz", value: "Dezentral · Ohne Tracking · Werbefrei" }
      ]
    },
    {
      id: "broforce-clone",
      title: "BoomForce",
      subtitle:"(Broforce Klon)",
      description: "2D-Side-Scrolling-Shooter mit zerstörbarer Umgebung, Kettenreaktions-Engine und physikbasiertem Explosionssystem.",
      longDescription: "**BoomForce** entstand als Projekt für den Game Engines-Kurs meines Studiums. Ich habe den Prototyp eines physikbasiertes 2D-Side-Scrolling-Shooters entwickelt, das sich auf **zerstörbare Umgebungen** und **komplexe Kettenreaktionen** konzentriert.\n\nDas Spiel demonstriert fortgeschrittene Spielmechaniken: Ein **ausgefeiltes Explosionssystem** berechnet Schäden basierend auf Nähe und Objekttyp. Ein **robustes State-Management** verwaltet mehrere gleichzeitige Kettenreaktionen ohne Performance-Probleme.\n\nSpieler interagieren mit einer dynamischen Welt aus **zerstörbaren Blöcken**, **fallenden Steinen** und **verschiedenen Fasstypen** - jedes mit eigenen Explosionsradien und Brandeffekten. Das Projekt zeigt tiefes Verständnis für **Physik-Systeme**, **Event-Handling** und **Optimierungstechniken**.\n\n Mehr Informationen und technische Details  im **README auf GitHub**.",
      image: "/Bilder/BoomForce/BoomForce.png",
      images: [] as ProjectImage[],
      detailComponent: "",
      videos: [
        { url: "/Videos/BoomForce/KettenReaktionen.mp4", caption: "Kettenreaktion in Aktion:\n Mehrere Explosionen lösen sich gegenseitig aus und erzeugen eine Kaskade von Zerstörung." },
        { url: "/Videos/BoomForce/Steine.mp4", caption: "Fallende Steine:\n\n Auslösebedingungen:\nTreffer durch Kugeln; Feuerkontakt; Kollision mit Spieler;\n\n Verhalten:\n Fällt, wenn nichts drunter ist; Fällt, wenn nur ein Nachber-Block vorhanden ist." },
        { url: "/Videos/BoomForce/Radius2.mp4", caption: "Explosionsradius eines Fasses:\n Radius = 2 Kacheln.\n Innere Kachel: Sofortige Zerstörung. \n Äußere Kacheln: 4s Brandeffekt." },
        { url: "/Videos/BoomForce/radius.mp4", caption: "Komplexe Kettenreaktion:\n Mehrere Fässer triggern sich gegenseitig und beeinflussen die Umliegenden Blöcke:\n\n Blöcke in Farb-Kategorien:\n Sofortige Zerstörung; Brennt und stirbt; Brennt und bleibt am leben;\n (je nach Anzahl und Radius der Fässer die den Block triggern) " }
      ],
      tags: ["Unity 2D", "Physics Engine", "Destructible Environment", "State Management", "C#"],
      features: [
        "Tilemap-basiertes Grid-System mit zerstörbaren Blöcken",
        "Physikbasiertes Explosionssystem mit Radiusberechnung",
        "Kettenreaktions-Engine mit Zustandsverfolgung",
        "Mehrere Fasstypen (Schwarz, Rot, Fliegend) mit unterschiedlichem Verhalten und Zündzeiten",
        "Brandausbreitungs-Mechanik mit Zeitsteuerung",
        "Robustes Input-Handling und Spieler-Steuerung",
        "Dynamische Objektzerstörung und Speicheroptimierung"
      ],
      techStack: ["Unity", "C#", "Physics2D", "Tilemap System"],
      demoLink: "https://062leo.itch.io/boomforce",
      demoImage: "/Bilder/BoomForce/demo.png",
      demoDownload: "",
      githubUrl: "https://github.com/LeosGmbH/BoomForce-BroforceClone",
      videoBig: "/Videos/Big/BroforceShowcase.mp4",
      custom1Link: "",
      custom1BTNText: "",
      customLabel: "",
      demotext: "**Hinweis zur Demo:** Zu Beginn siehst du alle Objekttypen. Gehe durch das blaue Portal, um in den Testbereich teleportiert zu werden, in dem du das Verhalten der einzelnen Objekte ausprobieren kannst. Läufst du anschließend weiter nach rechts, gelangst du nach dem Testbereich zu einem weiteren Portal, das dich ins Demolevel bringt. Alternativ kannst du auch einfach nach unten springen, falls du das Portal nicht erreichst. \n\n PS: Auf den fliegenden Fässern kannst du mitreiten, indem du dich auf sie stellst, nachdem du sie mit einem Schuss aktiviert hast.",
      demoControls: [
        "Links/Rechts: A/D oder Pfeiltasten ⬅️➡️",
        "Leitern: W/S oder Pfeiltasten ⬆️⬇️",
        "Springen: Leertaste",
        "Schießen: Linke Maustaste",
        "Menü öffnen: Tab"
      ],
      misctext: "",
      miscimage: "",
      miscTitle: "",
      stats: [ { icon: "Star",   label: "Entwicklung",      value: "Solo-Projekt" }]
    },
    {
      id: "prop-hunt",
      title: "Hide'n Hunt",
      subtitle:"",
      description: "Asymmetrisches 4 vs 1 Online-Multiplayer Survival-Horrorspiel mit Prop-Mechanik, Generatoren-Gameplay und Physik-basierter Prop-Bewegung.",
      longDescription: "**Hide'n Hunt** entstand als Projekt für den Kurs \"Labor Games\" in meinem Studium. Es ist ein Prototyp eines asymmetrischen 4 vs 1 Online-Multiplayer Survival-Horrorspiels, in dem bis zu vier Überlebende gegen einen Killer antreten.\n\nDie Besonderheit des Spiels ist die **Prop-Mechanik**: Überlebende können sich in nahezu jeden Gegenstand der Umgebung verwandeln, um sich zu verstecken oder den Killer zu täuschen. Das zentrale Spielziel besteht darin, gemeinsam **fünf Generatoren zu reparieren**, um das **Fluchttor** zu öffnen und der Map zu entkommen, während der Killer die Spieler jagt, niederschlägt und auf **Folterstühlen** platziert.\n\nTechnisch legt das Projekt den Fokus auf **Online-Multiplayer** und **Networking** mit Unitys Netcode for GameObjects. Die korrekte Synchronisation von Spielerbewegungen, Prop-Verwandlungen, Interaktionen und dem Wechsel zwischen First- und Third-Person-Perspektive war besonders herausfordernd und erforderte viele Iterationen und Debugging-Runden.\n\nMehr Informationen finden sich im **README auf GitHub**.",
      image: "/Bilder/HideAndHunt/menu.png",
      images: [] as ProjectImage[],
      detailComponent: "",
      videos: [],
      tags: ["Unity 3D", "C#", "Netcode for GameObjects", "Online Multiplayer", "Survival Horror", "Prop Hunt"],
      features: [
        "Asymmetrisches 4 vs 1-Gameplay (4 Survivors vs. 1 Killer)",
        "Prop-Mechanik: Verwandlung in nahezu jedes Objekt in der Umgebung",
        "Kooperatives Reparieren von fünf Generatoren zur Flucht",
        "Escape Door als finales Fluchtziel nach abgeschlossenen Reparaturen",
        "Physikbasierte Prop-Bewegung mit Forces und Impulsen der Unity-Physikengine",
        "Survival-Horror-Atmosphäre mit düsterem Setting"
      ],
      techStack: ["Unity", "C#", "Netcode for GameObjects", "Unity Transport"],
      demoLink: "https://062leo.itch.io/hunt-and-hide",
      demoImage: "/Bilder/HideAndHunt/demo.png",
      demoDownload: "",
      githubUrl: "https://github.com/062Leo/Hide-And-Hunt",
      videoBig: "/Videos/Big/HideAndHuntShowcaseFinal.mp4",
      custom1Link: "",
      custom1BTNText: "",
      customLabel: "",
      demotext: "Diese Demo-Version zeigt dir die grundlegenden Spielmechaniken, allerdings ohne vollständige Online-Funktionen.\n\n**So startest du die Demo:**\n\n1. Auf **Play** klicken.\n2. Auf **Create Lobby** klicken.\n3. Rolle wählen: **Killer** oder **Survivor**.\n\n",
      demoControls: [
        {
          title: "Survivor",
          items: [
            "Bewegen: WASD",
            "Sprinten: LShift",
            "Springen: Space",
            "Verwandeln in Objekt: Linke Maustaste",
            "Zurück in Mensch verwandeln: Rechte Maustaste",
            "Aufrichten als Prop: LShift",
            "Sprung / Doppelsprung als Prop: Space",
            "Interaktion (Generator reparieren, heilen, Escape Door öffnen): E",
          ],
        },
        {
          title: "Killer",
          items: [
            "Bewegen: WASD",
            "Sprinten: LShift",
            "Springen: Space",
            "Angreifen: Linke Maustaste",
            "Survivor aufheben/fallenlassen/in Death Chair setzen: Rechte Maustaste",
          ],
        },
      ],
      misctext: "Map Legende:\n\n - Rote Linie: Begrenzung der spielbaren Map\n - Gelbe Kreuze: Positionen der Generatoren\n- Grüne Kreuze: Positionen der Death Chairs\n- Oranger Pfeil: Position der Escape Door",
      miscimage: "/Bilder/HideAndHunt/Map.png",
      miscTitle: "Die Map:",
      stats: [
  { icon: "Users", label: "Spielerrollen",   value: "1 Killer, bis zu 4 Survivors" },
  { icon: "Layers", label: "Spielaufbau",    value: "Asymmetrisches 4v1-Setup" },
  { icon: "Code",   label: "Umfang",         value: "Kompletter Gameplay-Prototyp" },
  { icon: "Star",   label: "Entwicklung",      value: "Solo-Projekt" }
]
    },
    {
      id: "coming-soon",
      title: "Bald verfügbar",
      subtitle: "",
      description:
        "Dieses Projekt ist noch geheim - mehr Infos bald verfügbar.",
      longDescription:
        "Dieser Eintrag ist ein Platzhalter. In Zukunft werden hier weitere Projekte präsentiert.",
      image: "/Bilder/dummy.png",
      images: [] as ProjectImage[],
      detailComponent: "",
      videos: [],
      tags: ["Bald verfügbar", "Portfolio", "Mehr Projekte"],
      features: [
        "Platzhalter für zukünftige Projekte",
        "In Vorbereitung"
      ],
      techStack: ["Noch geheim"],
      demoLink: "",
      demoImage: "",
      demoDownload: "",
      githubUrl: "",
      videoBig: "",
      custom1Link: "",
      custom1BTNText: "",
      customLabel: "",
      demotext: "",
      demoControls: [],
      misctext: "",
      miscimage: "",
      miscTitle: "",
      stats: [
        { icon: "Layers", label: "Kategorie", value: "Streng Geheim" },
        { icon: "Clock", label: "Zeitplan", value: "Bald verfügbar" }
        
      ]
    }
  ]
};
