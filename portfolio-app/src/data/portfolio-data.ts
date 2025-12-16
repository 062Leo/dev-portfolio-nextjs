
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
    lastName: "",
    role: "Softwareentwickler (B.Sc. Softwareentwicklung, Schwerpunkt Games Engineering)",
    tagline: "Unity, C# und .NET - Fokus auf Games Engineering & sauberen Code",
    motivation: "Abgeschlossenes Bachelorstudium der Softwareentwicklung (Schwerpunkt Games Engineering) und Praxiserfahrung in C#, .NET und Unity - mit starkem Fokus auf Clean Code, Refactoring und qualitativ hochwertige, wartbare Software.",
    github: "https://github.com/062Leo",
  },
  about: {
    title: "About Me",
    description: [
      "Ich bin Softwareentwickler mit einem erfolgreich abgeschlossenen Bachelor of Science in Softwareentwicklung (Schwerpunkt Games Engineering) an der Hochschule Heilbronn.",
      "Im Studium und in praxisnahen Projekten habe ich umfangreiche Erfahrung in der Entwicklung von 2D- und 3D-Spielen mit Unity und C# sowie in der Umsetzung von Web- und Desktopanwendungen gesammelt.",
      "Dabei habe ich mich intensiv mit Clean Code, Refactoring und der Verbesserung bestehender C#- und .NET-Anwendungen auseinandergesetzt.",
      "Ich lege großen Wert auf strukturierte Arbeitsweisen, qualitativ hochwertige Software und kontinuierliche Weiterentwicklung - sowohl beruflich als auch persönlich."
    ],
    softSkills: [
      "Teamfähigkeit / Kollaboration",
      "Eigenverantwortliche Arbeitsweise",
      "Strukturierte und analytische Arbeitsweise",
      "Lernbereitschaft / Schnelle Auffassungsgabe",
      "Problemlösungskompetenz",
      "Kommunikationsfähigkeit",
      "Agiles Mindset",
      "Hoher Qualitätsanspruch",
      "Motivation und Begeisterung"
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
      id: "game-of-life",
      title: "Conway's Game of Life",
      subtitle: "",
      description: "Desktop-Anwendung zur Simulation von Conways Game of Life.",
      longDescription:
        "Eine interaktive Desktop-Anwendung für Conways Game of Life. Sie bietet einen freies Zeichen Modus und Prefab-Platzierung, unterstützt Theme-Wechsel, variable Pinselgrößen sowie flexible Canvasgrößen- und Geschwindigkeitseinstellungen, umgesetzt mit C#, .NET und WPF.",
      image: "/Bilder/GameOfLife/GameOfLife.png",
      images: [] as ProjectImage[],
      detailComponent: "",
      videos: [],
      tags: ["C#", ".NET", "WPF", "Desktop", "Simulation"],
      features: [
        "Freies Zeichnen und Prefab-Modus für Zellkonfigurationen",
        "Umschaltbares Dark/Light Theme",
        "Pinsel- und Canvasgrößen Zoom-Regler für präzises Editing",
        "Anpassbare Simulationsgeschwindigkeit mit Start/Stopp-Steuerung"
      ],
      techStack: ["C#", ".NET", "WPF", "XAML"],
      demoLink: "",
      demoImage: "",
      demoDownload: "https://github.com/062Leo/Conway-s-Game-of-Life-C_Sharp-WPF/releases/tag/releaseV1",
      githubUrl: "https://github.com/LeosGmbH/Conway-s-Game-of-Life-C_Sharp-WPF",
      videoBig: "/Videos/Big/GameOfLife.mp4",
      demotext: "",
      demoControls: [],
      misctext: "",
      miscimage: "",
      miscTitle: "",
      stats: [{ icon: "Star",   label: "Entwicklung",      value: "Solo-Projekt" },]
    },
    {
      id: "coming-soon",
      title: "Bald verfügbar",
      subtitle: "",
      description:
        "Dieses Projekt ist noch geheim - mehr Infos bald verfügbar.",
      longDescription:
        "Dieser Eintrag ist ein Platzhalter. In Zukunft werden hier weitere Projekte präsentieren.",
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
