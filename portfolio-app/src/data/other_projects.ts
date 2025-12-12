
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
  demoUrl?: string;
  demoDownload?: string;
  githubUrl?: string;
  youtubeLink?: string;
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

export const otherProjects = {
  projects: [
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
      youtubeLink: "",
      demotext: "",
      demoControls: [],
      misctext: "",
      miscimage: "",
      miscTitle: "",
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
      youtubeLink: "",
      demotext: "",
      demoControls: [],
      stats: []
    },{
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
      youtubeLink: "",
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
      youtubeLink: "",
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
      youtubeLink: "",
      demotext: "",
      demoControls: [],
      misctext: "",
      miscimage: "",
      miscTitle: "",
      stats: []
    }
  ]
};
