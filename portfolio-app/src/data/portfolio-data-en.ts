export type ProjectImage = {
  url: string;
  caption?: string;
};

export type ProjectStat = {
  icon:
    | "Clock"
    | "Star"
    | "Code"
    | "Zap"
    | "Users"
    | "Target"
    | "DollarSign"
    | "Layers"
    | "Download"
    | "Eye"
    | "TrendingUp";
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
    role: "Software Developer (B.Sc. Software Engineering, GPA 2.1) with expertise in AI, automation, and clean code",
  },
  about: {
    title: "About Me",
    description: [
      "I am a software developer with a successfully completed Bachelor of Science in Software Engineering at Heilbronn University. I completed my thesis with a 1.0 grade, with an overall GPA of 2.1.",
      "During my studies and in hands-on projects, I have gained experience across multiple domains: 2D and 3D game development with Unity and C#, web applications, desktop tools, and specialized tooling. For me, Unity is not just a game engine, but a versatile tool with applications across many industries.",
      "I am particularly interested in artificial intelligence and its practical application in everyday workflows, as well as its integration into projects and apps. I am equally passionate about automation, whether through Python scripts, TypeScript tools for browsers, or other workflows that reduce repetitive tasks.",
      "I take initiative, think critically, make decisions, and work independently. I spend much of my free time on projects that span planning, implementation, and research, continuously advancing my skills through hands-on work.",
    ],
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
      techStack: [
        "Unity",
        "ML-Agents Toolkit",
        "C#",
        "Python",
        "PPO",
        "TensorBoard",
      ],
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
        {
          icon: "Layers",
          label: "Training levels",
          value: "13 levels + 1 generalization level",
        },
        {
          icon: "Layers",
          label: "Parkour variants",
          value: "31 different parkours",
        },
        {
          icon: "Target",
          label: "Success rate training levels",
          value: "approx. 92 %",
        },
        {
          icon: "Star",
          label: "Success rate generalization level",
          value: "43-53 %",
        },
        {
          icon: "Clock",
          label: "Total training time of all models",
          value: "711.17 hours",
        },
        { icon: "Zap", label: "Trained models", value: "approx. 88" },
        { icon: "Star", label: "Development", value: "Solo project" },
        { icon: "Award", label: "Grade", value: "1.0" },
      ],
    },
    {
      id: "play-mode-saver",
      title: "Play Mode Changes Saver",
      subtitle: "Free Tool · Published on the Unity Asset Store",
      description:
        "Unity Editor tool that captures and reapplies Play Mode changes to Edit Mode, so your iteration progress is not lost after testing.",
      longDescription:
        "**Problem:** In professional **Unity** production workflows, important scene tweaks are often made during **Play Mode**, but Unity discards them when Play Mode ends. This repeatedly forces manual rework, slows iteration, and increases the risk of missing or inconsistent changes.\n\n**Solution:** Play Mode Changes Saver was built as a production-focused **Editor tool** that automatically snapshots scenes, tracks changes across **transforms**, all Unity components, custom components and scripts attached to GameObjects, materials, and names, and provides guided side-by-side review so only validated changes are applied back to Edit Mode. It includes inspector integration, multi-scene handling, undo/redo support, and robust object matching via **hybrid GUID+path identification** that remains stable across renames.\n\n**Result:** This is not just a prototype. It is a **production-ready product** published on the **Unity Asset Store**, demonstrating end-to-end delivery from problem analysis to a shipped solution that improves day-to-day developer and level-design workflows.\n\nMore information about the tool is available on the Unity Asset Store page.\n\nAccess the asset on the Unity Asset Store.",
      image: "/Bilder/RuntimeSaver/TitleImage.jpg",
      images: [],
      detailComponent: "",
      videos: [],
      tags: [
        "Unity",
        "Published",
        "Editor Tool",
        "Game Development",
        "Play Mode",
        "C#",
        "Workflow",
      ],
      features: [
        "Automatic baseline snapshots on Play Mode entry",
        "Inspector integration with a dedicated overrides button",
        "Side-by-side property comparison for selective apply",
        "Scene-wide overrides browser for centralized review",
        "Tracking for transforms, all Unity components, custom components and scripts attached to GameObjects, materials, and names",
        "Hybrid GUID+path object identification (rename-resilient)",
        "Persistent storage via ScriptableObjects",
        "Multi-scene support with automatic switching",
        "Full undo/redo integration",
        "Granular property-level control",
        "Original value retention for full revert",
        "Zero runtime overhead (editor-only)",
      ],
      techStack: [
        "C#",
        "Unity Editor",
        "GlobalObjectId",
        "SerializedObject / SerializedProperty",
        "ScriptableObject",
        "EditorGUI",
      ],
      demoLink: "",
      demoImage: "",
      demoDownload: "",
      githubUrl: "",
      videoBig: "/Videos/Big/PlayModeChangesSaver.mp4",
      custom1Link: "https://assetstore.unity.com/packages/slug/354984",
      custom1BTNText: "View on Asset Store",
      customLabel: "Unity Asset Store",
      demotext: "",
      demoControls: [],
      misctext: "",
      miscimage: "",
      miscTitle: "",
      stats: [
        { icon: "Download", label: "Sales", value: "> 750" },
        { icon: "Eye", label: "Page Views", value: "> 1,000" },
        { icon: "TrendingUp", label: "Conversion Rate", value: "~71.33%" },
        { icon: "Star", label: "Average Rating", value: "5/5 Stars" },
        { icon: "DollarSign", label: "Pricing", value: "Free" },
        { icon: "Zap", label: "Runtime Overhead", value: "None" },
        {
          icon: "Target",
          label: "Object Identification",
          value: "Hybrid GUID + Path",
        },
      ],
    },
    {
      id: "acms",
      title: "ACMS - Agentic Case Management System",
      subtitle:
        "Orchestration platform between input channels, AI and executable capabilities (in development)",
      description:
        "Platform that handles incoming requests (email, tickets, webhooks, ...) as cases. An AI suggests the next action, a human decides whether it is executed. Every step is audited.",
      longDescription:
        "Problem: Wherever incoming requests are processed (support, customer communication, internal tasks, clubs, projects), the same pattern plays out: a message comes in, someone decides, a follow-up action is triggered. At the interface between systems of record and unstructured customer requests, manual case handling is typically inefficient, error-prone, and hard to scale. Classical back-office processes have four typical weak spots: context fragmentation, because employees have to gather information from many different systems, inefficiency for routine tasks such as replies or system actions, missing auditability through media breaks between systems, and loss of control through any form of blind automation. Whether purely deterministic (too rigid) or purely AI-driven (hallucinations): both take the decision away from the human without giving it back reliably enough.\n\n" +
        "Solution: ACMS addresses each of these weak points individually. The case-centric approach bundles data, messages, and histories in one place and removes context fragmentation. AI agents take over the time-consuming analysis, structuring, and preparation but never output anything on their own. Instead of blind automation, a native human-in-the-loop principle applies: the AI suggests, the human approves. And because every action runs through defined capabilities, an unbroken, auditable trail emerges as the basis for compliance and revision safety.\n\n" +
        "ACMS is the thinking, coordinating layer between input channels, AI and the outside world. The system accepts any incoming requests (emails, tickets, webhooks, forms, chat, API calls, ...), processes them as structured cases, lets an AI generate suggestions for the next action, and ultimately executes these actions through versioned, audited capabilities — never autonomously, but only after explicit approval by a human.\n\n" +
        "Architecture: ACMS strictly separates three roles. **Ingress** (channel adapters) receives requests and normalizes them. **Brain** (AI) receives an immutable snapshot of the case and decides what should happen next, without direct access to the database or the outside world — it only returns JSON suggestions. **Hands** (capabilities) are named, versioned, audited actions like `send_email`, `query_database` or `create_github_issue` that never run autonomously. In between sits the human: they see the AI's suggestion and have several explicit options, e.g. Approve / Edit / Reprompt / Reject / Resubmit.\n\n" +
        "Security boundary: The AI service is an independent microservice without a database connection string. It only receives an immutable snapshot via HTTP and returns a suggestion. This is the explicit boundary against prompt injection: even if the AI is compromised, it can only make suggestions that a human still has to approve.\n\n" +
        "End-to-end flow: Every request is processed as a case, regardless of the channel. Phase 1: The AI extracts structured fields (name, IDs, topic, ...). Phase 2: Matching against existing cases. Phase 3: Promote / Merge / Reject by the human. Phase 4: The AI receives the full snapshot (extracted data, capability history, available capabilities, conversation history, optional reprompt instruction) and suggests concrete follow-up capabilities. It is presented with all available capabilities and performs a self-check to decide whether it has enough information to, for example, suggest a reply email directly, or whether it should suggest a data-fetching capability like a database query as the first step. Phase 5: Human-in-the-loop. Phase 6: Execution. Phase 7: Auto-loop, if only data-fetching capabilities have run, the system automatically jumps back to Phase 4 and asks the AI for the next step.\n\n" +
        "Extensibility: New capabilities are registered at runtime via `definition.json` + executable, without a code deploy. Input channels can be freely configured via an `IInputChannel` interface (email, web forms, REST API, chat, ticket systems, webhooks, IoT). The LLM is swappable via an `ILlmClient` interface, so all sorts of providers are possible, such as NVIDIA NIM, OpenAI, Anthropic, Azure OpenAI, local models (Ollama, llama.cpp, vLLM) or multi-provider setups.\n\n" +
        "Data model: Case-centric with `Case`, `Message`, `ExtractedData`, `CapabilityResults`, `LatestProposal`, `ResubmitAt` / `ResubmitConditions` and an append-only, immutable `AuditLog`. PostgreSQL with `jsonb` columns allows a growing schema without constant migrations.\n\n" +
        "Engineering: strict layer separation (Domain / Infrastructure / API), Domain-Driven Design, plugin architecture, SignalR-based real-time updates, fire-and-forget background tasks, full test pyramid (Vitest, pytest, xUnit) and reproducible Docker Compose setup with health checks for all services.",
      image: "/Bilder/ACMS/cases_view.png",
      images: [] as ProjectImage[],
      detailComponent: "",
      videos: [],
      tags: [
        "Agentic AI",
        "LLM Integration",
        "Plugin Architecture",
        "Channel-agnostic",
        "Provider-agnostic",
        "In Development",
      ],
      features: [
        "Channel-agnostic input via a unified IInputChannel interface, all data, messages, and histories are automatically bundled in the case",
        "Case-centric data model with explicit state machine from 'new' to 'Resolved'",
        "Matching & merge: system checks existing cases via scoring with field-level mismatch resolver",
        "Phase-2 planning with self-check: AI checks on its own whether it has enough info or should first suggest a data-fetching capability",
        "Human-in-the-loop with several explicit options per suggestion, e.g. Approve / Edit / Reprompt / Reject / Resubmit, deterministic and AI-driven actions stay strictly separated",
        "Capability plugin system: new actions are registered at runtime via definition.json + executable, without a code deploy",
        "Versioned, audited capabilities with structured result",
        "Auto-loop: after pure data-fetching capabilities, the system automatically jumps back to planning",
        "Append-only audit log as immutable trail of every action (actor, event, payload, time), media-break-free from input to the executed capability",
        "Security boundary: AI service as an independent microservice without database access (snapshot pattern)",
        "Provider-agnostic LLM via ILlmClient interface, supports all sorts of providers like NVIDIA NIM, OpenAI, Anthropic, local models or multi-provider setups",
        "Real-time updates via SignalR, abstracted behind an INotificationBus interface",
        "Resubmit / follow-up with timer (ResubmitAt) and conditions (ResubmitConditions)",
        "Role and rights management: admin account sets up accounts and groups (e.g. admins, seniors, juniors) and grants capabilities per person or per group (allow / deny)",
      ],
      techStack: [
        "Next.js 14 (App Router)",
        "React 18 + TypeScript 5",
        "Tailwind 3",
        "dnd-kit + react-resizable-panels",
        "@microsoft/signalr 10",
        "ASP.NET Core 8 (C#)",
        "EF Core + SignalR + JWT Auth",
        "FastAPI + Pydantic",
        "NVIDIA NIM (OpenAI-compatible SDK)",
        "PostgreSQL 16 (jsonb)",
        "Docker / Docker Compose",
        "Vitest + Testing Library (Frontend)",
        "pytest + pytest-asyncio (AI)",
        "xUnit (Backend)",
      ],
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
          value: "3 strictly separated roles (Ingress / Brain / Hands)",
        },
        {
          icon: "Zap",
          label: "Input channels",
          value: "Channel-agnostic (email, API, webhooks, chat, ...)",
        },
        {
          icon: "Code",
          label: "LLM providers",
          value: "Provider-agnostic",
        },
        {
          icon: "Users",
          label: "Capabilities",
          value: "Open plugin system, extensible at runtime",
        },
        {
          icon: "Star",
          label: "Status",
          value: "In development",
        },
        {
          icon: "Target",
          label: "Back-office weak spots",
          value: "4 covered (context, routine, control, revision)",
        },
      ],
    },
    {
      id: "food-check-scanner-app",
      title: "FoodCheck Scanner App",
      subtitle:
        "Barcode scanner for ingredient analysis, NOVA classification & nutritional risk assessment",
      description:
        "Privacy-first mobile app (Expo/React Native) that scans food barcodes, evaluates ingredients and additives against 683 health rules, and classifies processing levels — no proprietary backend, no tracking, no ads.",
      longDescription:
        "FoodCheck is a React Native (Expo) app that recognizes EAN-8/EAN-13 barcodes via the camera, caches product data locally in SQLite, and checks ingredients for health-related risk factors.\n\n" +
        "The app combines local SQLite persistence, on-device ML Kit OCR for ingredient scans, and lookups against the Open Food Facts API v2. It includes an extensive red-flag system with 683 seed rules across 19 categories (E-numbers, sweeteners, preservatives, emulsifiers, hydrogenated fats, phosphates, etc.), multilingual ingredient displays in 8 languages (de/en/fr/it/es/nl/pt/pl), and NOVA / Nutri-Score classification with color-coded traffic-light ratings. AI-powered insights from Robotoff complement the analysis with confidence-scored predictions for categories, labels, and ingredients.\n\n" +
        "Users can edit products with OCR-assisted ingredient and nutrition capture (on-device ML Kit or OFF Cloud Vision fallback), auto-translate ingredients via DeepL or MyMemory, and contribute directly to Open Food Facts. A full backup system (JSON export/import) and favorites management round out the feature set.\n\n" +
        "Privacy is a core principle: there is no FoodCheck-owned server, no user accounts, no cloud sync, no tracking, and no ads. Personal data (favorites, filter rules, settings, API keys) stays exclusively on the device. Product data is fetched from the public Open Food Facts database and cached locally for fast re-access. Uploads to OFF are strictly opt-in and user-initiated.\n\n" +
        "The architecture is strictly layered (screens → store → domain → infrastructure), follows SOLID principles, and is fully typed in TypeScript strict mode. The app is currently not published in an app store; a later release is possible. Anyone can build it from source or download a build from the GitHub releases.",
      image: "/Bilder/FoodCheck/AppIcon.png",
      images: [] as ProjectImage[],
      detailComponent: "",
      videos: [],
      tags: [
        "React Native",
        "Expo",
        "TypeScript",
        "Mobile App",
        "Food Tech",
        "Health",
        "Privacy",
        "OCR",
        "Open Food Facts",
      ],
      features: [
        "Real-time scanning of EAN-8/EAN-13 barcodes with haptic feedback",
        "Cache-first architecture: local SQLite with intelligent 7-day stale detection",
        "Traffic-light product rating (Green/Yellow/Red) based on red flags + NOVA score",
        "Risk assessment: 683 seed rules across 19 categories (additives, sugar, hydrogenated fats, E-numbers, etc.)",
        "Custom filters: user-defined ingredient keywords and nutrient thresholds with multi-language auto-translation",
        "NOVA classification (1-4, unprocessed to ultra-processed) and Nutri-Score (A-E), both color-coded",
        "On-device ML Kit OCR for ingredient lists and nutrition tables with automatic language detection",
        "Cloud Vision OCR fallback with crop tool and editing capability",
        "Product catalog with text search, risk filters (OK/Warning/Critical), sorting, and swipe-to-delete",
        "Favorites management with quick toggle from product detail and catalog",
        "Product editing in 8 languages: OCR capture, manual input, auto-translation (DeepL/MyMemory), batch translate",
        "Optional contribution to Open Food Facts (requires OFF account)",
        "Robotoff AI insights with confidence visualization",
        "Multi-language UI: German/English with runtime switching",
        "Swipeable product image gallery with local file caching",
        "Backup & restore: full SQLite export/import as JSON via native share sheet",
        "Dark mode first design",
        "Privacy-by-design: no backend, no cloud sync, no tracking, no ads. Data stays on device",
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
        "Jest + jest-expo (23 suites, 265 tests)",
      ],
      demoLink: "",
      demoImage: "",
      demoDownload: "",
      githubUrl: "https://github.com/062Leo/FoodCheck-Scanner",
      videoBig: "/Videos/Big/FoodCheck_Video.mp4",
      custom1Link: "https://github.com/062Leo/FoodCheck-Scanner/releases",
      custom1BTNText: "DOWNLOAD APK",
      customLabel: "GitHub",
      demotext: "",
      demoControls: [],
      misctext: "",
      miscimage: "",
      miscTitle: "",
      stats: [
        {
          icon: "Layers",
          label: "Risk rules",
          value: "683 seed rules in 19 categories",
        },
        {
          icon: "Zap",
          label: "OCR",
          value: "On-device ML Kit + OFF Cloud Vision",
        },
        { icon: "Code", label: "Tests", value: "265 tests across 23 suites" },
        {
          icon: "Eye",
          label: "Privacy",
          value: "Decentralized · No tracking · Ad-free",
        },
      ],
    },
    {
      id: "song-voyage",
      title: "SongVoyage",
      subtitle: "Random music discovery without the algorithm bubble",
      description:
        "Fully client-side Single Page Web Application for random music discovery across 126 years of music history. No algorithms, no server backend.",
      longDescription:
        "**SongVoyage** is a fully client-side, platform-independent **Single Page Web Application (SPA)** for unbiased music discovery. The application strictly follows a **Zero-Backend philosophy**: all user data remains decentralized and exclusively in the user's browser.\n\n" +
        "The app randomly selects songs from the MusicBrainz archive (1900-2026) and plays the corresponding YouTube videos, without algorithmic pre-filtering and without the YouTube Data API (zero-quota through HTML scraping). Users rate songs with 0-5 stars, create playlists, and can block artists.\n\n" +
        "Technically, SongVoyage is built with **Vue 3** (Composition API), **Pinia** for state management, and **Dexie.js** as an IndexedDB wrapper for local data storage. The **Dual-Player** with two YouTube IFrame instances enables gapless playback without noticeable delay.\n\n",
      image: "/Bilder/SongVoyage/Bild.png",
      images: [] as ProjectImage[],
      detailComponent: "",
      videos: [],
      tags: [
        "Vue 3",
        "TypeScript",
        "SPA",
        "Zero-Backend",
        "IndexedDB",
        "MusicBrainz",
        "YouTube",
      ],
      features: [
        "Random music discovery via MusicBrainz API — truly random selection across 126 years of music history",
        "YouTube video playback with gapless dual-player (two IFrame instances)",
        "0-5 star rating with keyboard shortcuts (keys 0-5, S for skip)",
        "Custom playlists and automatic rating playlists (one per rating level)",
        "Artist blocking with permanent filtering",
        "Full data export/import as JSON (data portability)",
        "Password protection with SHA-256 auto-login via URL parameter",
        "Fully client-side — no server data storage, no tracking, no cookies",
        "Zero-quota YouTube search via HTML scraping (no YouTube Data API)",
        "No registration — runs anonymously in the browser",
      ],
      techStack: [
        "Vue 3",
        "TypeScript",
        "Pinia",
        "Dexie.js",
        "Vite",
        "Vitest",
        "Vercel",
        "MusicBrainz API v2",
      ],
      demoLink: "",
      demoImage: "",
      demoDownload: "",
      githubUrl: "https://github.com/062Leo/song-voyage",
      videoBig: "",
      custom1Link: "https://song-voyage.vercel.app/?key=LeoDev2026",
      custom1BTNText: "SongVoyage Website",
      customLabel: "SongVoyage",
      demotext: "",
      demoControls: [],
      misctext: "",
      miscimage: "",
      miscTitle: "",
      stats: [
        {
          icon: "Layers",
          label: "Architecture",
          value: "Zero-Backend · Client-Only SPA",
        },
        {
          icon: "Zap",
          label: "Music sources",
          value: "MusicBrainz + YouTube (Zero-Quota Scraping)",
        },
        {
          icon: "Code",
          label: "Concept",
          value: "True random selection · 126 years of music history",
        },
        { icon: "Star", label: "Development", value: "Solo project" },
        { icon: "Award", label: "Website password", value: "LeoDev2026" },
      ],
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
      tags: [
        "Unity 3D",
        "C#",
        "Netcode for GameObjects",
        "Online Multiplayer",
        "Survival Horror",
        "Prop Hunt",
      ],
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
      custom1Link: "",
      custom1BTNText: "",
      customLabel: "",
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
        {
          icon: "Users",
          label: "Player roles",
          value: "1 killer, up to 4 survivors",
        },
        {
          icon: "Layers",
          label: "Game structure",
          value: "Asymmetric 4v1 setup",
        },
        { icon: "Code", label: "Scope", value: "Complete gameplay prototype" },
        { icon: "Star", label: "Development", value: "Solo project" },
      ],
    },
    {
      id: "broforce-clone",
      title: "BoomForce",
      subtitle: "(Broforce clone)",
      description:
        "2D side-scrolling shooter with destructible environment, chain-reaction engine and physics-based explosion system.",
      longDescription:
        "**BoomForce** was created as a project for the Game Engines course in my studies. I developed the prototype of a physics-based 2D side-scrolling shooter that focuses on **destructible environments** and **complex chain reactions**.\n\nThe game demonstrates advanced gameplay mechanics: a **sophisticated explosion system** calculates damage based on distance and object type. A **robust state management system** manages multiple simultaneous chain reactions without performance issues.\n\nPlayers interact with a dynamic world of **destructible blocks**, **falling rocks** and **different barrel types** - each with its own explosion radius and fire effects. The project demonstrates a deep understanding of **physics systems**, **event handling** and **optimization techniques**.\n\nMore information and technical details can be found in the **README on GitHub**.",
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
      tags: [
        "Unity 2D",
        "Physics Engine",
        "Destructible Environment",
        "State Management",
        "C#",
      ],
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
      custom1Link: "",
      custom1BTNText: "",
      customLabel: "",
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

    //,
    // {
    //   id: "coming-soon",
    //   title: "Coming soon",
    //   subtitle: "",
    //   description:
    //     "This project is still secret - more information coming soon.",
    //   longDescription:
    //     "This entry is a placeholder. In the future, additional projects will be presented here.",
    //   image: "/Bilder/dummy.png",
    //   images: [] as ProjectImage[],
    //   detailComponent: "",
    //   videos: [],
    //   tags: ["Coming soon", "Portfolio", "More projects"],
    //   features: [
    //     "Placeholder for future projects",
    //     "In preparation"
    //   ],
    //   techStack: ["Still secret"],
    //   demoLink: "",
    //   demoImage: "",
    //   demoDownload: "",
    //   githubUrl: "",
    //   videoBig: "",
    //   custom1Link: "",
    //   custom1BTNText: "",
    //   customLabel: "",
    //   demotext: "",
    //   demoControls: [],
    //   misctext: "",
    //   miscimage: "",
    //   miscTitle: "",
    //   stats: [
    //     { icon: "Eye", label: "Category", value: "Top secret" },
    //     { icon: "Clock", label: "Schedule", value: "Coming soon" }
    //   ]
    // }
  ],
};
