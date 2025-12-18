
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
      subtitle: "Central crypto dashboard with learning and trading platform",
      description:
        "Full-stack project with an Angular frontend and a Django backend that consolidates crypto holdings and prices from different exchanges in a single dashboard.",
      longDescription:
        "KryptoDash is a full-stack application that connects various crypto exchanges such as Binance, KuCoin, Bitget and Coinbase via API keys. Users get a central dashboard with live prices, a wallet overview as a pie chart and integrated TradingView charts for crypto and stocks. In addition, KryptoDash offers a learning platform with quizzes on historical financial events as well as a fake-wallet trading environment where users can trade with virtual money without risk and test different strategies.\n\nThe project was developed in a two-person team. I was responsible for the majority of the technical work: choosing the tech stack, setting up the project, integrating and implementing the backend APIs, the core backend logic, and most of the frontend.",
      image: "/Bilder/KryptoDash/landingpage.png",
      images: [
        {
          url: "/Bilder/KryptoDash/fakeWallet.png",
          caption: "Fake wallet trading with virtual money"
        },
        {
          url: "/Bilder/KryptoDash/wallet.png",
          caption: "Wallet overview with assets in a pie chart"
        },
        {
          url: "/Bilder/KryptoDash/fakeWalletSettings.png",
          caption: "Fake wallet settings and management"
        },
        {
          url: "/Bilder/KryptoDash/quiz.png",
          caption: "Learning platform with quizzes on historical events"
        }
      ] as ProjectImage[],
      detailComponent: "",
      videos: [],
      tags: [
        "Crypto Dashboard",
        "TradingView",
        "Learning platform",
        "Fake-Wallet",
        "API integration"
      ],
      features: [
        "Central overview of crypto holdings and prices across different exchanges",
        "Integration of multiple providers (e.g. Binance, KuCoin, Bitget, Coinbase) via API keys",
        "TradingView charts for interactive analysis of crypto and stocks with indicators",
        "Learning platform with quizzes and risk-free fake-wallet trading"
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
          label: "Architecture",
          value: "Angular-Frontend & Django-Backend"
        },
        {
          icon: "Users",
          label: "Target audience",
          value: "Crypto enthusiasts and trading beginners"
        },
        {
          icon: "Zap",
          label: "Features",
          value: "Live prices, wallet overview, fake wallet & coin exchange"
        },
        {
          icon: "Star",
          label: "Development",
          value: "Two-person team"
        }
      ]
    },
    {
          id: "doom-mobility-prototype",
          title: "DOOM Movement Prototype",
          subtitle: "",
          description:
            "High-mobility gameplay with dashes, wall-climbing and trampolines. First-person movement prototype inspired by DOOM with high mobility, dashes, trampolines and precise wall-climbing.",
          longDescription:
            "This prototype focuses on fast, vertical movement similar to DOOM. The player has two dashes with a cooldown indicator in the UI, trampolines with different jump heights and a well-thought-out wall-climbing system. Wall-climbing is only possible within specific view angles: vertically up to about 90 degrees away from the wall, horizontally up to about 70 degrees. This ensures the player is always ready to jump off, similar to the original DOOM. In addition, there are multiple spawn points and the player dies when falling out of the map.",
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
            "Two dashes with visible cooldown on the canvas",
            "Small and large trampolines with different jump heights",
            "Power-up that instantly refreshes the dash",
            "Multiple spawn points and death when falling out of the map",
            "Wall-climbing only within defined view angles for DOOM-style movement"
          ],
          techStack: ["Unity", "C#", "Netcode for GameObjects"],
          demoLink: "",
          demoImage: "",
          demoDownload: "",
          githubUrl: "",
          videoBig: "/Videos/Big/Doom_Showcase.mp4",
          demotext: "Short showcase of the high-mobility movement (dashes, trampolines, wall-climbing).",
          demoControls: [],
          misctext:
            "",
          miscimage: "",
          miscTitle: "",
          stats: [
            {
              icon: "Zap",
              label: "Focus",
              value: "High-mobility movement and networking"
            },
            {
              icon: "Layers",
              label: "Genre",
              value: "First-person movement prototype"
            },
            {
              icon: "Clock",
              label: "Type",
              value: "Experimental prototype"
            },
            { icon: "Star", label: "Development", value: "Solo project" }
          ]
        },

    {
          id: "arcanoid-3d",
          title: "Arcanoid 3D",
          subtitle: "",
          description:
            "3D Arcanoid prototype in Unity with different brick types, multiple power-ups, scoring and life system as well as game-over and win screens.",
          longDescription:
            "Arcanoid 3D is a modern 3D take on classic brick-breaker gameplay. There are different brick types that need to be hit a different number of times (blue bricks once, green twice, yellow three times). After every three destroyed bricks, power-ups spawn: a green power-up spawns a barrier below the paddle for 10 seconds so the ball cannot leave the play area; a yellow power-up makes the paddle wider for 10 seconds; a blue power-up fires two shots that each count as a ball hit. In addition, there is a game-over screen with a restart option when all lives are used up, and a won-game screen when all bricks have been destroyed. The score is displayed (each destroyed brick gives +10 points, when the ball is lost one life is removed and 50 points are deducted). On the top wall, the current lives and the remaining duration of the active power-ups are displayed, including an animated life indicator.",
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
            "Different brick types that require 1x, 2x or 3x hits",
            "Power-ups after every three destroyed bricks",
            "Green power-up: temporary barrier below the paddle (10 seconds)",
            "Yellow power-up: wider paddle for 10 seconds",
            "Blue power-up: two shots that count as ball hits",
            "Game-over and won-game screens with restart option",
            "Scoring system with points for bricks and deduction when losing a life",
            "Display of lives and power-up duration on the top wall with animation"
          ],
          techStack: ["Unity", "C#"],
          demoLink: "",
          demoImage: "",
          demoDownload: "",
          githubUrl: "",
          videoBig: "/Videos/Big/Arcanoid.mp4",
          demotext:
            "Gameplay showcase of Arcanoid 3D with bricks, power-ups, scoring and life system.",
          demoControls: [],
          misctext: "",
          miscimage: "",
          miscTitle: "",
          stats: [
            {
              icon: "Zap",
              label: "Focus",
              value: "Arcanoid-style gameplay with power-ups and scoring system"
            },
            {
              icon: "Layers",
              label: "Genre",
              value: "3D brick-breaker prototype"
            },
            {
              icon: "Clock",
              label: "Status",
              value: "Finished prototype with restart logic"
            },
            { icon: "Star", label: "Development", value: "Solo project" }
          ]
    },
    
        
         {
          id: "smart-color-following-car",
          title: "Smart Color Following Car",
          subtitle: "",
          description:
            "Autonomous vehicle based on the Elegoo Smart Robot Car V3 that independently follows a colored target object using a Pixy2 camera.",
          longDescription:
            "The goal of this project was to develop an autonomous vehicle that can follow a colored target object without any manual input. At the core of the system is the Pixy2 camera, which detects objects based on color signatures. An Elegoo Smart Robot Car V3 handles the movement, while an Arduino Uno processes the sensor data and controls the motors. In the code, various driving functions such as forward, left, right and stop are provided. Based on the position of the object derived from the camera image, the vehicle decides whether it should steer left or right or come to a stop.\n\nThe distance to the target object is determined solely by the size of the detected object in the camera image: the larger the object appears, the closer it is. This allows the vehicle to decide whether it should keep moving or stop. The resulting prototype clearly demonstrates how color detection and camera data can be used to realize autonomous color-following behavior and provides a solid foundation for further experiments.",
          image: "/Bilder/SmartCar/smartCar.png",
          images: [] as ProjectImage[],
          detailComponent: "",
          videos: [],
          tags: [
            "Arduino",
            "Elegoo Smart Robot Car",
            "Pixy2 camera",
            "Autonomous driving",
            "Color detection"
          ],
          features: [
            "Autonomous following of a colored target object using a Pixy2 camera",
            "Evaluation of color signatures for object detection",
            "Control of an Elegoo Smart Robot Car V3 via Arduino Uno",
            "Creative workarounds for hardware issues and motor control"
          ],
          techStack: [ "Arduino C++", "Pixy2", "Elegoo Smart Robot Car"],
          demoLink: "",
          demoImage: "",
          demoDownload: "",
          githubUrl: "",
          videoBig: "/Videos/Big/Smart-Colorfollowing-Car.mp4",
          demotext:
            "Live demonstration of the Smart Color Following Car with Pixy2 camera and color-based object detection.",
          demoControls: [],
          misctext:
            "The project showed how important solution-oriented thinking is when dealing with hardware issues and provides a solid basis for further experiments with sensors.",
          miscimage: "",
          miscTitle: "Challenges & Learnings",
          stats: [
            {
              icon: "Layers",
              label: "Category",
              value: "Embedded / robotics project"
            },
            {
              icon: "Target",
              label: "Goal",
              value: "Autonomous color-following vehicle"
            },
            {
              icon: "Clock",
              label: "Status",
              value: "Working prototype"
            },
            {
              icon: "Star",
              label: "Development",
              value: "Solo project"
            }
          ]
        },
    


    {
      id: "",
      title: "2D Online Multiplayer Mobile Card Game",
      subtitle: "",
      description: "Private project built with Unity, C# and Photon PUN 2 for Android.",
      longDescription:
        "A 2D online multiplayer card game for mobile (Android), developed as a private project. It uses Photon PUN 2 for the multiplayer part and provides an optimized mobile UI/UX.",
      image: "/Bilder/dummy.png", // Placeholder
      images: [],
      detailComponent: "",
      videos: [],
      tags: ["Unity 2D", "Photon PUN 2", "Android", "Mobile"],
      features: [
        "Online multiplayer",
        "Android build",
        "Mobile UI/UX",
        "Complex card logic"
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
      id: "",
      title: "dummy",
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
          id: "coming-soon",
          title: "Coming soon",
          subtitle: "",
          description:
            "This project is still secret - more information coming soon.",
          longDescription:
            "This entry is a placeholder. In the future, additional projects will be presented here.",
          image: "/Bilder/dummy.png",
          images: [] as ProjectImage[],
          detailComponent: "",
          videos: [],
          tags: ["Coming soon", "Portfolio", "More projects"],
          features: [
            "Placeholder for future projects",
            "In preparation"
          ],
          techStack: ["Still secret"],
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
            { icon: "Layers", label: "Category", value: "Top secret" },
            { icon: "Clock", label: "Schedule", value: "Coming soon" }
          ]
        }
  ]
};
