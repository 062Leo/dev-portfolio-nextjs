
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
      id: "kryptodash",
      title: "KryptoDash",
      subtitle: "Zentrales Crypto-Dashboard mit Lern- und Tradingplattform",
      description:
        "Fullstack-Projekt mit Angular-Frontend und Django-Backend, das Krypto-Bestände und Kurse verschiedener Börsen in einem Dashboard bündelt.",
      longDescription:
        "KryptoDash ist eine Fullstack-Anwendung, die verschiedene Crypto-Börsen wie Binance, KuCoin, Bitget und Coinbase über API-Keys verbindet. Nutzer erhalten ein zentrales Dashboard mit Live-Kursen, Wallet-Übersicht als Kreisdiagramm und integrierten TradingView-Charts für Krypto und Aktien. Zusätzlich bietet KryptoDash eine Lernplattform mit Quizzen zu historischen Finanzereignissen sowie eine Fake-Wallet-Trading-Umgebung, in der ohne Risiko mit virtuellem Geld gehandelt und unterschiedliche Strategien getestet werden können.\n\nDas Projekt wurde in einem 2-Personen-Team umgesetzt. Den Großteil der technischen Arbeit habe ich übernommen: Auswahl des Tech-Stacks, Projekt-Setup, Anbindung und Implementierung der Backend-APIs, zentrale Backend-Logik sowie der überwiegende Teil des Frontends.",
      image: "/Bilder/KryptoDash/landingpage.png",
      images: [
        {
          url: "/Bilder/KryptoDash/fakeWallet.png",
          caption: "Fake-Wallet-Trading mit virtuellem Geld"
        },
        {
          url: "/Bilder/KryptoDash/wallet.png",
          caption: "Wallet-Übersicht mit Kreisdiagramm der Assets"
        },
        {
          url: "/Bilder/KryptoDash/fakeWalletSettings.png",
          caption: "Einstellungen und Verwaltung der Fake-Wallet"
        },
        {
          url: "/Bilder/KryptoDash/quiz.png",
          caption: "Learning-Plattform mit Quiz zu historischen Ereignissen"
        }
      ] as ProjectImage[],
      detailComponent: "",
      videos: [],
      tags: [
        "Crypto Dashboard",
        "TradingView",
        "Lernplattform",
        "Fake-Wallet",
        "API-Integration"
      ],
      features: [
        "Zentrale Übersicht über Krypto-Bestände und Kurse verschiedener Börsen",
        "Integration mehrerer Anbieter (z. B. Binance, KuCoin, Bitget, Coinbase) über API-Keys",
        "TradingView-Charts für interaktive Analysen von Krypto und Aktien mit Indikatoren",
        "Lernplattform mit Quizzen und Fake-Wallet-Trading ohne Risiko"
      ],
      techStack: ["Angular", "TypeScript", "Django", "Python", "REST API"],
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
        {
          icon: "Layers",
          label: "Architektur",
          value: "Angular-Frontend & Django-Backend"
        },
        {
          icon: "Users",
          label: "Zielgruppe",
          value: "Krypto-Enthusiasten und Trading-Einsteiger"
        },
        {
          icon: "Zap",
          label: "Funktionen",
          value: "Live-Kurse, Wallet-Übersicht, Fake-Wallet & Coin-Exchange"
        },
        {
          icon: "Star",
          label: "Entwicklung",
          value: "2-Personen-Team"
        }
      ]
    },

     {
      id: "",
      title: "",
      subtitle: "",
      description: "",
      longDescription:
        "",
      image: "",
      images: [] as ProjectImage[],
      detailComponent: "",
      videos: [],
      tags: ["", "", "", "", ""],
      features: [
        "",
        "",
        "",
        ""
      ],
      techStack: ["", "", "", ""],
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
      stats: []
    },




    {
      id: "",
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
      demoLink: "",
      demoImage: "",
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
      id: "doom-mobility-prototype",
      title: "DOOM Movement Prototype",
      subtitle: "",
      description:
        "High Mobility Gameplay mit Dashes, Wall-Climbing und Trampolinen. First-Person-Bewegungs-Prototyp inspiriert von DOOM mit hoher Mobilität, Dashes, Trampolinen und präzisem Wall-Climbing.",
      longDescription:
        "Dieser Prototyp fokussiert sich auf das schnelle, vertikale Movement wie in DOOM. Der Spieler verfügt über zwei Dashes mit Cooldown-Anzeige im UI, Trampoline mit unterschiedlicher Sprunghöhe und ein durchdachtes Wall-Climbing-System. An Wänden kann nur in bestimmten Blickwinkeln geklettert werden: vertikal bis ca. 90 Grad von der Wand wegschauen, horizontal bis ca. 70 Grad. Dadurch ist der Spieler immer absprungbereit, ähnlich wie im Original-DOOM. Zusätzlich existieren mehrere Spawnpoints und der Spieler stirbt, wenn er aus der Map fällt.",
      image: "/Bilder/Doom/Doom.png",
      images: [] as ProjectImage[],
      detailComponent: "",
      videos: [],
      tags: [
        "Unity",
        "Networking",
        "Prototype",
        "High Mobility",
        "First Person",
        "Movement",
        "Level Design",
      ],
      features: [
        "Zwei Dashes mit sichtbarem Cooldown auf dem Canvas",
        "Kleine und große Trampoline mit unterschiedlicher Sprunghöhe",
        "Powerup, das den Dash sofort wieder verfügbar macht",
        "Mehrere Spawnpoints und Tod beim Fallen aus der Map",
        "Wall-Climbing nur in definierten Blickwinkeln für DOOM-typisches Movement"
      ],
      techStack: ["Unity", "C#", "Netcode for GameObjects"],
      demoLink: "",
      demoImage: "",
      demoDownload: "",
      githubUrl: "",
      videoBig: "/Videos/Big/Doom_Showcase.mp4",
      demotext: "Kurzer Showcase des High-Mobility-Movements (Dashes, Trampoline, Wall-Climbing).",
      demoControls: [],
      misctext:
        "",
      miscimage: "",
      miscTitle: "",
      stats: [
        {
          icon: "Zap",
          label: "Fokus",
          value: "High-Mobility-Movement und Networking"
        },
        {
          icon: "Layers",
          label: "Genre",
          value: "First-Person Movement Prototype"
        },
        {
          icon: "Clock",
          label: "Typ",
          value: "Experimenteller Prototyp"
        }
      ]
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
