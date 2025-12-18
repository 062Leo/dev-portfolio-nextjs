
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
        },
        { icon: "Star",   label: "Entwicklung",      value: "Solo-Projekt" }
      ]
    },

    
    
     {
      id: "arcanoid-3d",
      title: "Arcanoid 3D",
      subtitle: "",
      description:
        "3D-Arcanoid-Prototyp in Unity mit verschiedenen Brick-Typen, mehreren Powerups, Score- und Lebenssystem sowie Game-Over- und Win-Screens.",
      longDescription:
        "Arcanoid 3D ist eine moderne 3D-Variante des klassischen Brick-Breaker-Gameplays. Es gibt verschiedene Brick-Typen, die unterschiedlich oft getroffen werden müssen (blaue Bricks 1x, grüne 2x, gelbe 3x). Nach jeweils drei zerstörten Bricks spawnen Powerups: ein grünes Powerup erzeugt eine Barriere unter dem Paddle für 10 Sekunden, sodass der Ball nicht aus dem Spielfeld fallen kann; ein gelbes Powerup vergrößert das Paddle für 10 Sekunden; ein blaues Powerup feuert zwei Schüsse ab, die jeweils wie ein Treffer des Balls zählen. Zusätzlich gibt es einen Game-Over-Screen mit Restart-Möglichkeit, wenn alle Leben verbraucht sind, sowie einen Won-Game-Screen, wenn alle Bricks zerstört wurden. Der Score wird angezeigt (jeder zerstörte Brick +10 Punkte, bei einem verlorenen Ball wird ein Leben abgezogen und 50 Punkte werden abgezogen). Auf der oberen Mauer werden die aktuellen Leben sowie die Restdauer der aktiven Powerups dargestellt, inklusive animierter Lebensanzeige.",
      image: "/Bilder/Arcanoid/arcanoid.png",
      images: [] as ProjectImage[],
      detailComponent: "",
      videos: [],
      tags: [
        "Unity 3D",
        "Arcanoid",
        "Powerups",
        "Score System",
        "Prototype"
      ],
      features: [
        "Unterschiedliche Brick-Typen mit 1x, 2x oder 3x Treffern",
        "Powerups nach jeweils drei zerstörten Bricks",
        "Grünes Powerup: temporäre Barriere unter dem Paddle (10 Sekunden)",
        "Gelbes Powerup: breiteres Paddle für 10 Sekunden",
        "Blaues Powerup: zwei Schüsse, die wie Balltreffer zählen",
        "Game-Over- und Won-Game-Screens mit Restart-Möglichkeit",
        "Score-System mit Punkten für Bricks und Abzug bei Lebensverlust",
        "Anzeige von Leben und Powerup-Dauer auf der oberen Mauer mit Animation"
      ],
      techStack: ["Unity", "C#"],
      demoLink: "",
      demoImage: "",
      demoDownload: "",
      githubUrl: "",
      videoBig: "/Videos/Big/Arcanoid.mp4",
      demotext:
        "Gameplay-Showcase von Arcanoid 3D mit Bricks, Powerups, Score- und Lebenssystem.",
      demoControls: [],
      misctext: "",
      miscimage: "",
      miscTitle: "",
      stats: [
        {
          icon: "Zap",
          label: "Fokus",
          value: "Arcanoid-Gameplay mit Powerups und Score-System"
        },
        {
          icon: "Layers",
          label: "Genre",
          value: "3D Brick-Breaker Prototype"
        },
        {
          icon: "Clock",
          label: "Status",
          value: "Fertiger Prototyp mit Restart-Logik"
        },
        { icon: "Star",   label: "Entwicklung",      value: "Solo-Projekt" }
      ]
    },


    
    
     {
      id: "smart-color-following-car",
      title: "Smart Color Following Car",
      subtitle: "",
      description:
        "Autonomes Fahrzeug auf Basis des Elegoo Smart Robot Car V3, das mithilfe einer Pixy2-Kamera einem farbigen Zielobjekt selbstständig folgt.",
      longDescription:
        "Ziel des Projekts war es, ein autonomes Fahrzeug zu entwickeln, das einem farbigen Zielobjekt ohne manuellen Eingriff folgen kann. Kern des Systems ist die Pixy2-Kamera, die Objekte anhand von Farbsignaturen erkennt. Ein Elegoo Smart Robot Car V3 übernimmt die Bewegung, während ein Arduino Uno die Sensordaten auswertet und die Motoren steuert. Im Code werden verschiedene Fahrfunktionen wie forward, left, right und stop bereitgestellt. Anhand der vom Kamerabild abgeleiteten Objektposition entscheidet das Fahrzeug, ob es nach links oder rechts lenken oder anhalten soll.\n\nDie Entfernung zum Zielobjekt wird ausschließlich über die Größe des erkannten Objekts im Kamerabild bestimmt: Je größer das Objekt erscheint, desto näher ist es. So kann das Fahrzeug entscheiden, ob es weiterfahren oder anhalten soll. Der entstandene Prototyp zeigt anschaulich, wie Farberkennung und Kameradaten genutzt werden können, um ein autonomes, farbfolgenden Fahrverhalten zu realisieren und bildet eine gute Basis für weitere Experimente.",
      image: "/Bilder/SmartCar/smartCar.png",
      images: [] as ProjectImage[],
      detailComponent: "",
      videos: [],
      tags: [
        "Arduino",
        "Elegoo Smart Robot Car",
        "Pixy2 Kamera",
        "Autonomes Fahren",
        "Farberkennung"
      ],
      features: [
        "Autonomes Folgen eines farbigen Zielobjekts mittels Pixy2-Kamera",
        "Auswertung von Farbsignaturen zur Objekterkennung",
        "Steuerung eines Elegoo Smart Robot Car V3 über Arduino Uno",
        "Kreative Workarounds bei Hardware-Problemen und Motorsteuerung"
      ],
      techStack: [ "Arduino C++", "Pixy2", "Elegoo Smart Robot Car"],
      demoLink: "",
      demoImage: "",
      demoDownload: "",
      githubUrl: "",
      videoBig: "/Videos/Big/Smart-Colorfollowing-Car.mp4",
      demotext:
        "Live-Demonstration des Smart Color Following Car mit Pixy2-Kamera und farbbasierter Objekterkennung.",
      demoControls: [],
      misctext:
        "Das Projekt zeigte, wie wichtig lösungsorientiertes Denken bei Hardware-Problemen ist und bietet eine solide Grundlage für weitere Sensor-Experimente.",
      miscimage: "",
      miscTitle: "Herausforderungen & Learnings",
      stats: [
        {
          icon: "Layers",
          label: "Kategorie",
          value: "Embedded / Robotik-Projekt"
        },
        {
          icon: "Target",
          label: "Ziel",
          value: "Autonomes Farbverfolgungsfahrzeug"
        },
        {
          icon: "Clock",
          label: "Status",
          value: "Funktionsfähiger Prototyp"
        },
        {
          icon: "Star",
          label: "Entwicklung",
          value: "Solo-Projekt"
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
