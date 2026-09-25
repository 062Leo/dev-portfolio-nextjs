// German dictionary. This file defines the key shape; en.ts must provide every key.
// Grouped per component. Strings with a variable part are functions.

export const de = {
  meta: {
    title: "leo.dev — Portfolio",
    description:
      "leo.dev — Softwareentwickler Portfolio mit Fokus auf AI, Automatisierung und interaktive Anwendungen",
    projectsTitle: "Projekte",
    loginTitle: "Anmeldung",
  },
  nav: {
    home: "Home",
    about: "Über mich",
    skills: "Skills",
    projects: "Projekte",
    toggleLanguage: "Sprache wechseln",
    currentLanguage: "Deutsch",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    label: "Hauptnavigation",
  },
  hero: {
    greeting: "Hallo, ich bin ",
    cta: "Meine Projekte",
    scroll: "Scrollen",
  },
  about: {
    titleStart: "Über",
    titleAccent: "mich",
    headline: "Softwareentwickler mit Fokus auf Anwendungen, Tools & AI",
    cards: {
      development: {
        title: "Software Development",
        description:
          "Entwicklung moderner Anwendungen von Web-Frontends über Desktop bis zu Backend-Lösungen mit Fokus auf sauberer Architektur, wartbarem Code und praxisnaher Umsetzbarkeit.",
      },
      interactive: {
        title: "Interactive Systems",
        description:
          "Konzeption und Umsetzung interaktiver Systeme mit Unity und C# von Spielen und Simulationen bis zu Anwendungen, in denen Echtzeit-Interaktion, Physik oder komplexe Abläufe gefragt sind.",
      },
      ai: {
        title: "AI & Automation",
        description:
          "Großes Interesse an Künstlicher Intelligenz (KI), insbesondere ihrem produktiven Einsatz im Arbeitsalltag und dem sinnvollen Einbau in Projekte und Apps, kombiniert mit Automatisierung via Python, TypeScript oder Browser-Workflows.",
      },
      collaboration: {
        title: "Collaboration & Communication",
        description:
          "Zusammenarbeit in agilen Projekten mit klarer Kommunikation, strukturierter Abstimmung und einem verlässlichen Vorgehen von der Planung bis zur Umsetzung.",
      },
      ownership: {
        title: "Ownership & Mindset",
        description:
          "Eigeninitiative, selbstständiges Arbeiten, aktives Mitdenken und die Bereitschaft, Entscheidungen zu treffen und sich durch Projekte und Recherche kontinuierlich weiterzuentwickeln.",
      },
    },
  },
  skills: {
    title: "Skills & Expertise",
    graphLabel: "Skill-Graph: meine Fähigkeiten nach Kategorie, mit Bewertung von 1 bis 5",
    rating: "Bewertung:",
    ratingOf: (rating: number) => `Bewertung ${rating} von 5`,
    applyFilter: "Filter anwenden",
    reset: "Zurücksetzen",
  },
  projectsPreview: {
    titleStart: "Ausgewählte",
    titleAccent: "Projekte",
    subtitle: (total: number) =>
      `3 von ${total} Projekten — von AI über Mobile bis Game Development.`,
    viewAll: (total: number) => `Alle ${total} Projekte ansehen`,
  },
  projects: {
    titleStart: "Ausgewählte",
    titleAccent: "Projekte",
    intro:
      "Hier sind einige meiner aktuellen Projekte, die Design, Performance und sauberen Code verbinden.",
    moreDetails: "Mehr Details anzeigen",
    moreTitle: "Weitere Projekte",
    moreIntro: "Zusätzliche Projekte und Experimente, die mein Portfolio ergänzen.",
    githubCta: "Mein GitHub-Profil ansehen",
  },
  notFound: {
    heading: "Seite nicht gefunden",
    toProjects: "Zur Projektübersicht",
  },
  projectDetail: {
    back: "Zurück zur Projektübersicht",
    keyFeatures: "KEY FEATURES",
    techStack: "TECH STACK",
    stats: "STATS",
    screenshots: "SCREENSHOTS",
    clickMe: "Anklicken",
    screenshotAlt: "Screenshot",
    closeScreenshot: "Screenshot schließen",
    playDemo: "DEMO SPIELEN",
    downloadDemo: "DEMO HERUNTERLADEN",
    viewCode: "CODE ANSEHEN",
  },
  demo: {
    back: "Zurück zum Projekt",
    controls: "STEUERUNG",
    keys: "Tasten",
    action: "Aktion",
    illustrationAlt: "Zusätzliche Abbildung",
  },
  footer: {
    tagline: "Softwareentwickler mit Fokus auf AI, Automatisierung und interaktive Anwendungen.",
    navigation: "Navigation",
    links: "Links",
    notice:
      "Private Portfolio-Website. Externe Links öffnen externe Plattformen. Diese Website speichert keine personenbezogenen Daten.",
    rights: "Alle Rechte vorbehalten.",
    backToTop: "Nach oben",
    navLabel: "Fußzeilennavigation",
  },
  dialog: {
    title: "Externer Link",
    defaultLabel: "Externe Website",
    leaving: (label: string) =>
      `Sie verlassen diese Website und werden auf eine externe Plattform (${label}) weitergeleitet.`,
    responsibility:
      "Für die Verarbeitung personenbezogener Daten auf der Zielseite ist ausschließlich der jeweilige Betreiber verantwortlich.",
    redirectingTo: (url: string) => `(Weiterleitung zu: ${url})`,
    cancel: "Abbrechen",
    continue: "Fortfahren",
  },
  login: {
    title: "Geschützte Website",
    prompt: "Passwort eingeben, um fortzufahren",
    passwordPlaceholder: "Passwort",
    showPassword: "Passwort anzeigen",
    hidePassword: "Passwort verbergen",
    submit: "Anmelden",
    verifying: "Wird geprüft...",
    invalidPassword: "Falsches Passwort",
    tooManyAttempts: "Zu viele Versuche. Bitte in einer Viertelstunde noch einmal versuchen.",
    help: "Das Passwort steht neben dem Link zur Website an der Stelle, von der der Link stammt. Alternativ kann es über den Link unten oder über bereits bekannte Kontaktdaten beim Betreiber der Website angefragt werden.",
    requestAccess: "Zugang anfragen",
  },
};

export type Dictionary = typeof de;
