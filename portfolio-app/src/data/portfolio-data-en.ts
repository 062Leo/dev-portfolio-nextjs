
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
    role: "Software Developer (B.Sc. Software Engineering, focus on Games Engineering)",
    tagline: "Unity, C# and .NET - Focus on Games Engineering & clean code",
    motivation:
      "Completed bachelor's degree in Software Engineering (focus on Games Engineering) and practical experience in C#, .NET and Unity - with a strong focus on clean code, refactoring and high-quality, maintainable software.",
    github: "https://github.com/062Leo",
  },
  about: {
    title: "About Me",
    description: [
      "I am a software developer with a successfully completed Bachelor of Science in Software Engineering (focus on Games Engineering) at Heilbronn University.",
      "During my studies and in practical projects, I gained extensive experience in developing 2D and 3D games with Unity and C# as well as implementing web and desktop applications.",
      "In the process I have worked intensively with clean code, refactoring and improving existing C# and .NET applications.",
      "I place great value on structured ways of working, high-quality software and continuous development - both professionally and personally."
    ],
    softSkills: [
      "Teamwork / Collaboration",
      "Self-directed way of working",
      "Structured and analytical way of working",
      "Willingness to learn / quick comprehension",
      "Problem-solving skills",
      "Communication skills",
      "Agile mindset",
      "High quality standards",
      "Motivation and enthusiasm"
    ]
  },
  projects: [
    {
      id: "ml-agent-bachelor",
      title: "Bachelor's Thesis: ML Agent in Unity",
      subtitle: "",
      description:
        "Reinforcement learning agent that masters several dynamic 3D parkours in Unity.",
      longDescription:
        "As part of my bachelor's thesis I trained an ML agent with the Unity ML-Agents Toolkit in Unity that masters various three-dimensional parkour levels with dynamic obstacles.\n\nThe focus of the thesis is on how training strategies, curriculum design and domain randomization must be structured so that the agent not only solves individual training scenarios but learns robust and generalizable strategies. The final model achieves high success rates in the training levels and at the same time shows transferable behaviour in a separate generalization level.\n\nTechnically, the project combines extensive raycast and vector observations, a hybrid action space (continuous movement + discrete actions) and a PPO algorithm with an LSTM network. A custom Python automation script controls long-term training runs, dynamically adjusts hyperparameters and enables a detailed evaluation of the results with TensorBoard.",
      image: "/Bilder/BachelorArbeit/BachelorArbeit.png",
      images: [] as ProjectImage[],
      detailComponent: "",
      videos: [],
      tags: ["Reinforcement Learning", "Unity 3D", "ML-Agents", "PPO", "LSTM"],
      features: [
        "Training an ML agent in 13 parkour levels with progressive complexity",
        "Several different variants for selected levels",
        "Extensive sensing with RayPerceptionSensor3D and vector observations (a total of 538 observations per step)",
        "Hybrid action space consisting of continuous movement and discrete actions (jumping, running)",
        "Sophisticated reward structure with checkpoints, time bonus and movement optimization",
        "Variant-based level design to promote generalization",
        "Python automation script for controlling long training runs and dynamic hyperparameters",
        "Evaluation of training runs with TensorBoard (rewards, losses, success rates)",
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
        { icon: "Layers", label: "Training levels", value: "13 levels + 1 generalization level" },
        { icon: "Layers", label: "Parkour variants", value: "31 different parkours" },
        { icon: "Target", label: "Success rate training levels", value: "approx. 92 %" },
        { icon: "Star", label: "Success rate generalization level", value: "43-53 %" },
        { icon: "Clock", label: "Total training time of all models", value: "711.17 hours" },
        { icon: "Zap", label: "Trained models", value: "approx. 88" },
        { icon: "Star", label: "Development", value: "Solo project" },
        { icon: "Award", label: "Grade", value: "1.0" },
      ]
    },
    {
      id: "broforce-clone",
      title: "BoomForce",
      subtitle: "(Broforce clone)",
      description:
        "2D side-scrolling shooter with destructible environment, chain-reaction engine and physics-based explosion system.",
      longDescription:
        "**BoomForce** was created as a project for the Game Engines course in my studies. I developed the prototype of a physics-based 2D side-scrolling shooter that focuses on **destructible environments** and **complex chain reactions**.\n\nThe game demonstrates advanced gameplay mechanics: a **sophisticated explosion system** calculates damage based on distance and object type. A **robust state management system** manages multiple simultaneous chain reactions without performance issues.\n\nPlayers interact with a dynamic world of **destructible blocks**, **falling rocks** and **different barrel types** - each with its own explosion radius and fire effects. The project demonstrates a deep understanding of **physics systems**, **event handling** and **optimization techniques**.\n\n More information and technical details can be found in the **README on GitHub**.",
      image: "/Bilder/BoomForce/BoomForce.png",
      images: [] as ProjectImage[],
      detailComponent: "",
      videos: [
        {
          url: "/Videos/BoomForce/KettenReaktionen.mp4",
          caption:
            "Chain reaction in action:\n Multiple explosions trigger each other and create a cascade of destruction.",
        },
        {
          url: "/Videos/BoomForce/Steine.mp4",
          caption:
            "Falling rocks:\n\n Trigger conditions:\nHit by bullets; contact with fire; collision with the player;\n\n Behaviour:\n Falls when there is nothing below; falls when only one neighboring block is present.",
        },
        {
          url: "/Videos/BoomForce/Radius2.mp4",
          caption:
            "Explosion radius of a barrel:\n Radius = 2 tiles.\n Inner tile: instant destruction. \n Outer tiles: 4s burn effect.",
        },
        {
          url: "/Videos/BoomForce/radius.mp4",
          caption:
            "Complex chain reaction:\n Multiple barrels trigger each other and affect the surrounding blocks:\n\n Blocks in color categories:\n Instant destruction; burns and dies; burns and survives;\n (depending on the number and radius of the barrels that trigger the block) ",
        },
      ],
      tags: ["Unity 2D", "Physics Engine", "Destructible Environment", "State Management", "C#"],
      features: [
        "Tilemap-based grid system with destructible blocks",
        "Physics-based explosion system with radius calculation",
        "Chain-reaction engine with state tracking",
        "Multiple barrel types (black, red, flying) with different behaviour and ignition times",
        "Fire propagation mechanic with time control",
        "Robust input handling and player controls",
        "Dynamic object destruction and memory optimization",
      ],
      techStack: ["Unity", "C#", "Physics2D", "Tilemap System"],
      demoLink: "https://062leo.itch.io/boomforce",
      demoImage: "/Bilder/BoomForce/demo.png",
      demoDownload: "",
      githubUrl: "https://github.com/LeosGmbH/BoomForce-BroforceClone",
      videoBig: "/Videos/Big/BroforceShowcase.mp4",
      demotext:
        "**Demo note:** At the beginning you see all object types. Go through the blue portal to be teleported to the test area where you can try out the behaviour of the individual objects. If you then continue to the right, you will reach another portal after the test area that takes you to the demo level. Alternatively, you can simply jump down if you do not reach the portal. \n\n PS: You can ride on the flying barrels by standing on them after activating them with a shot.",
      demoControls: [
        "Left/Right: A/D or arrow keys ⬅️➡️",
        "Ladders: W/S or arrow keys ⬆️⬇️",
        "Jump: Space",
        "Shoot: Left mouse button",
        "Open menu: Tab",
      ],
      misctext: "",
      miscimage: "",
      miscTitle: "",
      stats: [{ icon: "Star", label: "Development", value: "Solo project" }],
    },
    {
      id: "prop-hunt",
      title: "Hide'n Hunt",
      subtitle: "",
      description:
        "Asymmetric 4 vs 1 online multiplayer survival horror game with prop mechanics, generator gameplay and physics-based prop movement.",
      longDescription:
        "**Hide'n Hunt** was created as a project for the 'Labor Games' course in my studies. It is a prototype of an asymmetric 4 vs 1 online multiplayer survival horror game in which up to four survivors compete against one killer.\n\nThe special feature of the game is the **prop mechanic**: survivors can transform into almost any object in the environment to hide or deceive the killer. The central game objective is to work together to **repair five generators** in order to open the **escape gate** and escape the map while the killer hunts the players, knocks them down and places them on **torture chairs**.\n\nTechnically, the project focuses on **online multiplayer** and **networking** with Unity's Netcode for GameObjects. Correct synchronization of player movement, prop transformations, interactions and switching between first- and third-person perspectives was particularly challenging and required many iterations and debugging sessions.\n\nMore information can be found in the **README on GitHub**.",
      image: "/Bilder/HideAndHunt/menu.png",
      images: [] as ProjectImage[],
      detailComponent: "",
      videos: [],
      tags: ["Unity 3D", "C#", "Netcode for GameObjects", "Online Multiplayer", "Survival Horror", "Prop Hunt"],
      features: [
        "Asymmetric 4 vs 1 gameplay (4 survivors vs. 1 killer)",
        "Prop mechanic: transform into almost any object in the environment",
        "Cooperative repair of five generators to escape",
        "Escape door as final escape objective after completed repairs",
        "Physics-based prop movement with forces and impulses of the Unity physics engine",
        "Survival horror atmosphere with dark setting",
      ],
      techStack: ["Unity", "C#", "Netcode for GameObjects", "Unity Transport"],
      demoLink: "https://062leo.itch.io/hunt-and-hide",
      demoImage: "/Bilder/HideAndHunt/demo.png",
      demoDownload: "",
      githubUrl: "https://github.com/062Leo/Hide-And-Hunt",
      videoBig: "/Videos/Big/HideAndHuntShowcaseFinal.mp4",
      demotext:
        "This demo version shows you the basic game mechanics, but without full online functionality.\n\n**How to start the demo:**\n\n1. Click on **Play**.\n2. Click on **Create Lobby**.\n3. Choose a role: **Killer** or **Survivor**.\n\n",
      demoControls: [
        {
          title: "Survivor",
          items: [
            "Move: WASD",
            "Sprint: Left Shift",
            "Jump: Space",
            "Transform into object: Left mouse button",
            "Transform back into human: Right mouse button",
            "Stand up as prop: Left Shift",
            "Jump / double jump as prop: Space",
            "Interaction (repair generator, heal, open escape door): E",
          ],
        },
        {
          title: "Killer",
          items: [
            "Move: WASD",
            "Sprint: Left Shift",
            "Jump: Space",
            "Attack: Left mouse button",
            "Pick up/drop/put survivor into death chair: Right mouse button",
          ],
        },
      ],
      misctext:
        "Map legend:\n\n - Red line: boundary of the playable map\n - Yellow crosses: positions of the generators\n- Green crosses: positions of the death chairs\n- Orange arrow: position of the escape door",
      miscimage: "/Bilder/HideAndHunt/Map.png",
      miscTitle: "The map:",
      stats: [
        { icon: "Users", label: "Player roles", value: "1 killer, up to 4 survivors" },
        { icon: "Layers", label: "Game structure", value: "Asymmetric 4v1 setup" },
        { icon: "Code", label: "Scope", value: "Complete gameplay prototype" },
        { icon: "Star", label: "Development", value: "Solo project" },
      ]
    },
    
    {
      id: "game-of-life",
      title: "Conway's Game of Life",
      subtitle: "",
      description: "Desktop application for simulating Conway's Game of Life.",
      longDescription:
        "An interactive desktop application for Conway's Game of Life. It offers a free drawing mode and prefab placement, supports theme switching, variable brush sizes as well as flexible canvas size and speed settings, implemented with C#, .NET and WPF.",
      image: "/Bilder/GameOfLife/GameOfLife.png",
      images: [] as ProjectImage[],
      detailComponent: "",
      videos: [],
      tags: ["C#", ".NET", "WPF", "Desktop", "Simulation"],
      features: [
        "Free drawing and prefab mode for cell configurations",
        "Toggleable dark/light theme",
        "Brush size and canvas size zoom sliders for precise editing",
        "Adjustable simulation speed with start/stop controls",
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
      stats: [{ icon: "Star", label: "Development", value: "Solo project" }]
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
