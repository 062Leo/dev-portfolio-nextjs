
export type ProjectImage = {
  url: string;
  caption?: string;
};

export type ProjectStat = {
  icon: "Clock" | "Star" | "Code" | "Zap" | "Users" | "Target" | "Award" | "Layers";
  label: string;
  value: string;
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
  demoUrl?: string;
  demoDownload?: string;
  githubUrl?: string;
  demotext: string;
  demoControls: string[];
  features?: string[];
  techStack?: string[];
  detailComponent?: "BoomForce" | "Old";
  stats?: ProjectStat[];
};

export const portfolioData = {
  personal: {
    firstName: "Leo",
    lastName: "",
    role: "Softwareentwickler (B.Sc.) - Schwerpunkt Games Engineering",
    tagline: "Spezialisiert in Unity, C#, .NET",
    motivation: "Fokus auf Clean Code, Refactoring, qualitativ hochwertige Software. Leidenschaft für Game Dev & Software Engineering.",
    email: "contact@example.com", // Placeholder
    github: "https://github.com/062Leo",
    linkedin: "#", // Placeholder
  },
  about: {
    title: "About Me",
    description: [
      "Ich bin Softwareentwickler mit einem Bachelor of Science in Games Engineering.",
      "Mein Fokus liegt auf der Entwicklung von qualitativ hochwertiger Software, Clean Code und Refactoring. Ich habe eine Leidenschaft für sowohl Game Development als auch klassisches Software Engineering.",
      "Ich arbeite gerne mit modernen Technologien und bin immer motiviert, neue Dinge zu lernen."
    ],
    softSkills: [
      "Teamfähigkeit",
      "Analytische & strukturierte Arbeitsweise",
      "Schnelle Auffassungsgabe",
      "Lernbereitschaft",
      "Problemlösungskompetenz",
      "Kommunikationsfähigkeit",
      "Agiles Mindset",
      "Hoher Qualitätsanspruch",
      "Motivation / Begeisterung"
    ]
  },
  skills: [
    // Languages
    { name: "C#", level: 95, category: "languages" },
    { name: "Java", level: 90, category: "languages" },
    { name: "JavaScript/TypeScript", level: 85, category: "languages" },
    { name: "HTML/CSS", level: 80, category: "languages" },
    { name: "C", level: 50, category: "languages" },
    
    // Game Dev
    { name: "Unity", level: 95, category: "game engines" },
    { name: "Photon PUN 2", level: 80, category: "game engines" },
    { name: "Netcode for GameObjects", level: 75, category: "game engines" },
    { name: "Unity ML-Agents", level: 85, category: "game engines" },
    { name: "Mobile / Android", level: 70, category: "game engines" },
    { name: "Unity Performance Opt.", level: 80, category: "game engines" },

    // Frameworks & Tech
    { name: ".NET", level: 90, category: "frameworks & libraries" },
    { name: "Blazor", level: 70, category: "frameworks & libraries" },
    { name: "Flutter", level: 65, category: "frameworks & libraries" },
    { name: "Angular", level: 60, category: "frameworks & libraries" },
    { name: "MariaDB", level: 70, category: "frameworks & libraries" },
    { name: "Docker", level: 60, category: "devOps & tools" },
    { name: "REST APIs", level: 80, category: "frameworks & libraries" },

    // Tools
    { name: "Git", level: 90, category: "devOps & tools" },
    { name: "GitHub / GitLab", level: 85, category: "devOps & tools" },
    { name: "Azure DevOps (CI/CD)", level: 75, category: "devOps & tools" },
    { name: "Jenkins", level: 60, category: "devOps & tools" },
    { name: "Jira / Confluence", level: 80, category: "devOps & tools" },
    { name: "Scrum / Agile", level: 85, category: "devOps & tools" },
  ],
  projects: [
    {
      id: "broforce-clone",
      title: "BoomForce",
      subtitle:"(Broforce Klon)",
      description: "2D-Side-Scrolling-Shooter mit zerstörbarer Umgebung, Kettenreaktions-Engine und physikbasiertem Explosionssystem.",
      longDescription: "**BoomForce** entstand als Projekt für den Game Engines-Kurs meines Studiums. Ich habe den Prototyp eines physikbasiertes 2D-Side-Scrolling-Shooters entwickelt, das sich auf **zerstörbare Umgebungen** und **komplexe Kettenreaktionen** konzentriert.\n\nDas Spiel demonstriert fortgeschrittene Spielmechaniken: Ein **ausgefeiltes Explosionssystem** berechnet Schäden basierend auf Nähe und Objekttyp. Ein **robustes State-Management** verwaltet mehrere gleichzeitige Kettenreaktionen ohne Performance-Probleme.\n\nSpieler interagieren mit einer dynamischen Welt aus **zerstörbaren Blöcken**, **fallenden Steinen** und **verschiedenen Fasstypen** - jedes mit eigenen Explosionsradien und Brandeffekten. Das Projekt zeigt tiefes Verständnis für **Physik-Systeme**, **Event-Handling** und **Optimierungstechniken**.\n\n Mehr Informationen und technische Details  im **README auf GitHub**.",
      image: "/Bilder/BoomForce/BoomForce.png",
      images: [],
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
      demoUrl: "/Live-Demos/BroforceWebBuild/index.html",
      demoDownload: "",
      githubUrl: "https://github.com/LeosGmbH/BoomForce-BroforceClone",
      demotext: "**Hinweis zur Web-Demo:** In dieser Demo kannst du die zerstörbare Umgebung, physikbasierten Kettenreaktionen und das Zusammenspiel von Fässern, Blöcken und fallenden Steinen direkt ausprobieren. Experimentiere mit verschiedenen Situationen, löse Explosionen aus und beobachte, wie sich die Effekte über das Level ausbreiten.",
      demoControls: [
        "Links/Rechts: A/D oder Pfeiltasten",
        "Leitern: W/S oder Pfeiltasten Hoch/Runter",
        "Springen: Leertaste",
        "Schießen: Linke Maustaste"
      ],
      stats: [
        { icon: "Clock", label: "Entwicklungszeit", value: "1 Monat" },
        { icon: "Award", label: "Note", value: "1.0" }
      ]
    },
    {
      id: "prop-hunt",
      title: "Hide'n Hunt",
      subtitle:"",
      description: "Asymmetrisches 4 vs 1 Online-Multiplayer Survival-Horrorspiel mit Prop-Mechanik, Generatoren-Gameplay und Physik-basierter Prop-Bewegung.",
      longDescription: "**Hide'n Hunt** entstand als Projekt für den Kurs \"Labor Games\" in meinem Studium. Es ist ein Prototyp eines asymmetrischen 4 vs 1 Online-Multiplayer Survival-Horrorspiels, in dem bis zu vier Überlebende gegen einen Killer antreten.\n\nDie Besonderheit des Spiels ist die **Prop-Mechanik**: Überlebende können sich in nahezu jeden Gegenstand der Umgebung verwandeln, um sich zu verstecken oder den Killer zu täuschen. Das zentrale Spielziel besteht darin, gemeinsam **fünf Generatoren zu reparieren**, um das **Fluchttor** zu öffnen und der Map zu entkommen, während der Killer die Spieler jagt, niederschlägt und auf **Folterstühlen** platziert.\n\nTechnisch legt das Projekt den Fokus auf **Online-Multiplayer** und **Networking** mit Unitys Netcode for GameObjects. Die korrekte Synchronisation von Spielerbewegungen, Prop-Verwandlungen, Interaktionen und dem Wechsel zwischen First- und Third-Person-Perspektive war besonders herausfordernd und erforderte viele Iterationen und Debugging-Runden.\n\nMehr Informationen finden sich im **README auf GitHub**.",
      image: "/Bilder/dummy.png", // Placeholder
      images: [],
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
      demoUrl: "/Live-Demos/HuntAndHide_WebGl_Demo_Build/index.html",
      demoDownload: "",
      githubUrl: "https://github.com/062Leo/Hide-And-Hunt",
      demotext: "",
      demoControls: [],
      stats: []
    },
    {
      id: "ml-agent-bachelor",
      title: "Bachelorarbeit: ML-Agent in Unity",
      subtitle: "",
      description: "Reinforcement-Learning-Agent, der dynamische 3D-Parkours und Rätsel in Unity meistert (Note 1,0).",
      longDescription:"Im Rahmen meiner Bachelorarbeit habe ich einen ML-Agenten mit dem Unity ML-Agents Toolkit in Unity trainiert, der verschiedene dreidimensionale Parkour-Level mit dynamischen Hindernissen bewältigt.\n\nDer Fokus der Arbeit liegt auf der Frage, wie Trainingsstrategien, Curriculum-Design und Domain Randomization gestaltet werden müssen, damit der Agent nicht nur einzelne Trainingsszenarien löst, sondern robuste und generalisierungsfähige Strategien lernt. Das finale Modell erreicht hohe Erfolgsraten in den Trainingsleveln und zeigt zugleich übertragbares Verhalten in einem separaten Generalisierungs-Level.\n\nTechnisch kombiniert das Projekt umfangreiche Raycast- und Vektorbeobachtungen, einen hybriden Aktionsraum (kontinuierliche Bewegung + diskrete Aktionen) sowie einen PPO-Algorithmus mit LSTM-Netzwerk. Ein eigenes Python-Automatisierungsskript steuert Langzeittrainings, passt Hyperparameter dynamisch an und ermöglicht eine detaillierte Auswertung der Ergebnisse mit TensorBoard.",
      image: "/Bilder/dummy.png", // Placeholder
      images: [],
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
      demoUrl: "",
      demoDownload: "https://github.com/062Leo/Bachelorarbeit-Demo/releases",
      githubUrl: "https://github.com/062Leo/Bachelorarbeit-Demo",
      demotext: "",
      demoControls: [],
      stats: [
        { icon: "Layers", label: "Trainingslevel", value: "13 Level + 1 Generalisierungslevel" },
        { icon: "Layers", label: "Parkour-Varianten", value: "31 unterschiedliche Parkours" },
        { icon: "Target", label: "Erfolgsrate Trainingslevel", value: "ca. 92 %" },
        { icon: "Star", label: "Erfolgsrate Generalisierungslevel", value: "43–53 %" },
        { icon: "Clock", label: "Trainingsdauer aller Modelle insgesamt", value: "711,17 Stunden" },
        { icon: "Zap", label: "Trainierte Modelle", value: "ca. 88" },
        { icon: "Award", label: "Note", value: "1.0" },
      ]
    },
    {
      id: "card-game-mobile",
      title: "2D Online Multiplayer Mobile Kartenspiel",
      subtitle: "",
      description: "Privatprojekt mit Unity, C# und Photon PUN 2 für Android.",
      longDescription: "Ein 2D Online Multiplayer Kartenspiel für Mobile (Android), entwickelt als Privatprojekt. Es nutzt Photon PUN 2 für den Multiplayer-Part und bietet eine optimierte Mobile UI/UX.",
      image: "/Bilder/dummy.png", // Placeholder
      images: [],
      detailComponent: "",
      videos: [],
      tags: ["Unity 2D", "Photon PUN 2", "Android", "Mobile"],
      features: [
        "Online Multiplayer",
        "Android Build",
        "Mobile UI/UX",
        "Komplexe Kartenlogik"
      ],
      techStack: ["Unity", "C#", "Photon PUN 2"],
      demoUrl: "#",
      demoDownload: "",
      githubUrl: "#",
      demotext: "",
      demoControls: [],
      stats: []
    },
    {
      id: "buga23-web",
      title: "BUGA23 Interaktive Webanwendung",
      subtitle: "",
      description: "Java Backend und Flutter Frontend für eine reale Messe.",
      longDescription: "Eine interaktive Webanwendung für die BUGA23. Das System besteht aus einem Java Backend und einem Flutter Frontend, containerisiert mit Docker.",
      image: "/Bilder/dummy.png",
      images: [
        { url: "/Bilder/dummy.png" },
        { url: "/projects/dummy2.png", caption: "Benutzeroberfläche der Webanwendung" },
        { url: "/projects/dummy3.png", caption: "Architekturübersicht" }
      ],
      detailComponent: "",
      videos: [],
      tags: ["Java", "Flutter", "Docker", "MariaDB"],
      features: [
        "Java Backend",
        "Flutter / Dart Frontend",
        "MariaDB Datenbank",
        "Docker Containerisierung"
      ],
      techStack: ["Java", "Flutter", "Dart", "MariaDB", "Docker"],
      demoUrl: "#",
      demoDownload: "",
      githubUrl: "#",
      demotext: "",
      demoControls: [],
      stats: []
    },
    {
      id: "oware-bot",
      title: "Oware Spiel + ML-Bot",
      subtitle: "",
      description: "C#, .NET, Blazor Anwendung mit ML-Gegner.",
      longDescription: "Ein Oware Spiel, entwickelt als Praktikumsprojekt. Es verfügt über einen ML-basierten Bot-Gegner und wurde mit C#, .NET und Blazor umgesetzt.",
      image: "/Bilder/dummy.png", // Placeholder
      images: [],
      detailComponent: "",
      videos: [],
      tags: ["C#", ".NET", "Blazor", "ML"],
      features: [
        "ML-Algorithmus für Bot-Gegner",
        "SQL Anbindung",
        "Azure Cloud Deployment",
        "Web UI"
      ],
      techStack: ["C#", ".NET", "Blazor", "SQL", "Azure"],
      demoUrl: "#",
      demoDownload: "",
      githubUrl: "#",
      demotext: "",
      demoControls: [],
      stats: []
    },
    {
      id: "game-of-life",
      title: "Conway's Game of Life",
      subtitle: "",
      description: "Desktop-Anwendung zur Simulation von Conways Game of Life.",
      longDescription:
        "Eine interaktive Desktop-Anwendung für Conways Game of Life. Sie bietet einen freies Zeichen Modus und Prefab-Platzierung, unterstützt Theme-Wechsel, variable Pinselgrößen sowie flexible Canvasgrößen- und Geschwindigkeitseinstellungen, umgesetzt mit C#, .NET und WPF.",
      image: "/Bilder/dummy.png",
      images: [],
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
      demoUrl: "",
      demoDownload: "https://github.com/LeosGmbH/Conway-s-Game-of-Life-C_Sharp-WPF/releases/download/releaseV1/GameOfLife.zip",
      githubUrl: "https://github.com/LeosGmbH/Conway-s-Game-of-Life-C_Sharp-WPF",
      demotext: "",
      demoControls: [],
      stats: []
    }
  ]
};
