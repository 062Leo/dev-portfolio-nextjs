
export type ProjectImage = {
  url: string;
  caption?: string;
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
  demoEmbedUrl?: string;
  demoDownload?: string;
  githubUrl?: string;
  features?: string[];
  techStack?: string[];
  detailComponent?: "BoomForce" | "Old";
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
      id: "prop-hunt",
      title: "Asymmetrisches Online-Multiplayer-Spiel",
      description: "Prop-Hunt / Killer Spiel mit Note 1.3. Physikbasierte Prop-Bewegung und komplexes Networking.",
      longDescription: "Ein asymmetrisches Online-Multiplayer-Spiel im Stil von Prop-Hunt. Das Projekt wurde mit der Note 1.3 bewertet. Es beinhaltet physikbasierte Prop-Bewegung, First-Person/Third-Person Kameras und eine komplexe Netzwerkarchitektur.",
      image: "/projects/dummy.png", // Placeholder
      detailComponent: "",
      tags: ["Unity 3D", "C#", "Netcode for GameObjects", "Multiplayer"],
      features: [
        "Physikbasierte Prop-Bewegung",
        "FP/TP-Kamera",
        "Komplexes Multiplayer-Debugging",
        "Netzwerkarchitektur / State Machines",
        "Map-Design & ProBuilder"
      ],
      techStack: ["Unity", "C#", "Netcode for GameObjects", "Unity Transport"],
      demoUrl: "/unity-demo/HuntAndHide_WebGl_Demo_Build/index.html",
      demoEmbedUrl: "/unity-demo/HuntAndHide_WebGl_Demo_Build/index.html",
      githubUrl: "#"
    },
    {
      id: "ml-agent-bachelor",
      title: "Bachelorarbeit - ML-Agent in Unity",
      description: "Reinforcement Learning Agent, der Hindernis-Parcours & Rätsel löst. Note 1.0.",
      longDescription: "Im Rahmen meiner Bachelorarbeit (Note 1.0) habe ich einen ML-Agenten mit Unity ML-Agents trainiert. Der Agent ist in der Lage, komplexe Hindernis-Parcours und Rätsel selbstständig zu lösen.",
      image: "/projects/dummy.png", // Placeholder
      detailComponent: "",
      tags: ["Reinforcement Learning", "Unity ML-Agents", "Python", "Research"],
      features: [
        "Training eines Agenten",
        "Lösung von Hindernis-Parcours & Rätseln",
        "Analyse von Belohnungssystemen"
      ],
      techStack: ["Unity", "ML-Agents", "Python", "TensorFlow"],
      demoUrl: "#",
      githubUrl: "#"
    },
    {
      id: "card-game-mobile",
      title: "2D Online Multiplayer Mobile Kartenspiel",
      description: "Privatprojekt mit Unity, C# und Photon PUN 2 für Android.",
      longDescription: "Ein 2D Online Multiplayer Kartenspiel für Mobile (Android), entwickelt als Privatprojekt. Es nutzt Photon PUN 2 für den Multiplayer-Part und bietet eine optimierte Mobile UI/UX.",
      image: "/projects/dummy.png", // Placeholder
      detailComponent: "",
      tags: ["Unity 2D", "Photon PUN 2", "Android", "Mobile"],
      features: [
        "Online Multiplayer",
        "Android Build",
        "Mobile UI/UX",
        "Komplexe Kartenlogik"
      ],
      techStack: ["Unity", "C#", "Photon PUN 2"],
      demoUrl: "#",
      githubUrl: "#"
    },
    {
      id: "broforce-clone",
      title: "BoomForce",
      subtitle:"(Broforce Klon)",
      description: "Dynamisches 2D-Spiel mit zerstörbarer Umgebung, physikbasierten Explosionen und Kettenreaktionen. Note 1.0.",
      longDescription: "**BoomForce** entstand als Projekt für den Game Engines-Kurs meines Studiums. Ich habe den Prototyp eines physikbasiertes 2D-Side-Scrolling-Shooters entwickelt, das sich auf **zerstörbare Umgebungen** und **komplexe Kettenreaktionen** konzentriert.\n\nDas Spiel demonstriert fortgeschrittene Spielmechaniken: Ein **ausgefeiltes Explosionssystem** berechnet Schäden basierend auf Nähe und Objekttyp. Ein **robustes State-Management** verwaltet mehrere gleichzeitige Kettenreaktionen ohne Performance-Probleme.\n\nSpieler interagieren mit einer dynamischen Welt aus **zerstörbaren Blöcken**, **fallenden Steinen** und **verschiedenen Fasstypen** - jedes mit eigenen Explosionsradien und Brandeffekten. Das Projekt zeigt tiefes Verständnis für **Physik-Systeme**, **Event-Handling** und **Optimierungstechniken**.",
      image: "/Bilder/BoomForce/BoomForce.png",
      detailComponent: "BoomForce",
      videos: [
        { url: "/Videos/BoomForce/KettenReaktionen.mp4", caption: "Kettenreaktion in Aktion: Mehrere Explosionen lösen sich gegenseitig aus und erzeugen eine Kaskade von Zerstörung" },
        { url: "/Videos/BoomForce/Steine.mp4", caption: "Fallende Steine-Mechanik: Blöcke stürzen ab, wenn die Unterstützung wegfällt - zentral für das Puzzle-Design" },
        { url: "/Videos/BoomForce/Radius2.mp4", caption: "Explosionsradius eines roten Fasses: Zeigt die präzise Schadensberechnung und Brandausbreitung" },
        { url: "/Videos/BoomForce/radius.mp4", caption: "Komplexe Kettenreaktion: Mehrere explodierende Fässer triggern sich gegenseitig und beeinflussen die Umgebung" }
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
      demoUrl: "/unity-demo/BroforceWebBuild/index.html",
      demoEmbedUrl: "/unity-demo/BroforceWebBuild/index.html",
      githubUrl: "https://github.com/LeosGmbH/BoomForce-BroforceClone"
    },
    {
      id: "buga23-web",
      title: "BUGA23 Interaktive Webanwendung",
      description: "Java Backend und Flutter Frontend für eine reale Messe.",
      longDescription: "Eine interaktive Webanwendung für die BUGA23. Das System besteht aus einem Java Backend und einem Flutter Frontend, containerisiert mit Docker.",
      image: "/projects/dummy.png",
      detailComponent: "",
      images: [
        { url: "/projects/dummy.png" },
        { url: "/projects/dummy2.png", caption: "Benutzeroberfläche der Webanwendung" },
        { url: "/projects/dummy3.png", caption: "Architekturübersicht" }
      ],
      tags: ["Java", "Flutter", "Docker", "MariaDB"],
      features: [
        "Java Backend",
        "Flutter / Dart Frontend",
        "MariaDB Datenbank",
        "Docker Containerisierung"
      ],
      techStack: ["Java", "Flutter", "Dart", "MariaDB", "Docker"],
      demoUrl: "#",
      githubUrl: "#"
    },
    {
      id: "oware-bot",
      title: "Oware Spiel + ML-Bot",
      description: "C#, .NET, Blazor Anwendung mit ML-Gegner.",
      longDescription: "Ein Oware Spiel, entwickelt als Praktikumsprojekt. Es verfügt über einen ML-basierten Bot-Gegner und wurde mit C#, .NET und Blazor umgesetzt.",
      image: "/projects/dummy.png", // Placeholder
      detailComponent: "",
      tags: ["C#", ".NET", "Blazor", "ML"],
      features: [
        "ML-Algorithmus für Bot-Gegner",
        "SQL Anbindung",
        "Azure Cloud Deployment",
        "Web UI"
      ],
      techStack: ["C#", ".NET", "Blazor", "SQL", "Azure"],
      demoUrl: "#",
      githubUrl: "#"
    },
    {
      id: "game-of-life",
      title: "Conway's Game of Life",
      description: "Desktop-Anwendung zur Simulation von Conways Game of Life.",
      longDescription:
        "Eine interaktive Desktop-Anwendung für Conways Game of Life. Sie bietet einen freies Zeichen Modus und Prefab-Platzierung, unterstützt Theme-Wechsel, variable Pinselgrößen sowie flexible Canvasgrößen- und Geschwindigkeitseinstellungen, umgesetzt mit C#, .NET und WPF.",
      image: "/projects/dummy.png",
      detailComponent: "",
      tags: ["C#", ".NET", "WPF", "Desktop", "Simulation"],
      features: [
        "Freies Zeichnen und Prefab-Modus für Zellkonfigurationen",
       "Umschaltbares Dark/Light Theme",
       "Pinsel- und Canvasgrößen Zoom-Regler für präzises Editing",
       "Anpassbare Simulationsgeschwindigkeit mit Start/Stopp-Steuerung"
      ],
      techStack: ["C#", ".NET", "WPF", "XAML"],
      demoDownload: "https://github.com/LeosGmbH/Conway-s-Game-of-Life-C_Sharp-WPF/releases/download/releaseV1/GameOfLife.zip",
      githubUrl: "https://github.com/LeosGmbH/Conway-s-Game-of-Life-C_Sharp-WPF"
    }
  ]
};
