
export type ProjectImage = {
  url: string;
  caption?: string;
};

export type Project = {
  id: string;
  title: string;
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
    role: "Softwareentwickler (B.Sc.) – Schwerpunkt Games Engineering",
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
      title: "Bachelorarbeit – ML-Agent in Unity",
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
      title: "Broforce 2D Nachbau",
      description: "Unity 2D Projekt mit zerstörbarer Umgebung und Physik. Note 1.0.",
      longDescription: "Ein Nachbau des Spiels Broforce in Unity 2D. Das Projekt erhielt die Note 1.0 und zeichnet sich durch eine dynamische, zerstörbare Umgebung, Physik-Effekte und ein ausgefeiltes State Management aus.",
      image: "/projects/BoomForce.png",
      detailComponent: "BoomForce",
      images: [
        { url: "/projects/BoomForce3_4.png", caption: "" },
        { url: "/projects/BoomForce3_2.png", caption: "Gameplay mit zerstörbarer Umgebung" }
      ],
      videos: [
        { url: "/Videos/BoomForce/KettenReaktionen.mp4", caption: "Hier sieht man eine Beispielhafte Kettenreaktion in einem möglichen Level" },
        { url: "/Videos/BoomForce/SteineShowcase.mp4", caption: "Hier sieht man das Verhalten der fallenden Steine" }
      ],
      tags: ["Unity 2D", "Physics", "Destructible Environment"],
      features: [
        "Tilemap & Grid-System",
        "Physik, Explosionen, Kettenreaktionen",
        "State Management",
        "Input Handling",
        "Dynamische, zerstörbare Umgebung"
      ],
      techStack: ["Unity", "C#"],
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
