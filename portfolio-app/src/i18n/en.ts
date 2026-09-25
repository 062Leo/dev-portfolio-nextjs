import type { Dictionary } from "./de";

// English dictionary. Typed against the German one, so a missing or extra key is a type
// error.

export const en: Dictionary = {
  meta: {
    title: "leo.dev — Portfolio",
    description:
      "leo.dev — Software developer portfolio focused on AI, automation and interactive applications",
    projectsTitle: "Projects",
    loginTitle: "Login",
  },
  nav: {
    home: "Home",
    about: "About",
    skills: "Skills",
    projects: "Projects",
    toggleLanguage: "Toggle language",
    currentLanguage: "English",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  hero: {
    greeting: "Hi, I'm ",
    cta: "View My Work",
    scroll: "Scroll",
  },
  about: {
    titleStart: "About",
    titleAccent: "Me",
    headline: "Software Developer focused on applications, tools & AI",
    cards: {
      development: {
        title: "Software Development",
        description:
          "Development of modern applications from web frontends to desktop and backend solutions with a focus on clean architecture, maintainable code and practical delivery.",
      },
      interactive: {
        title: "Interactive Systems",
        description:
          "Concept and implementation of interactive systems with Unity and C# from games and simulations to applications where real-time interaction, physics or complex workflows matter.",
      },
      ai: {
        title: "AI & Automation",
        description:
          "Strong interest in AI, its productive use in everyday work and its integration into projects and apps, combined with automation via Python, TypeScript or browser workflows.",
      },
      collaboration: {
        title: "Collaboration & Communication",
        description:
          "Collaboration in agile projects with clear communication, structured alignment and a reliable approach from planning to delivery.",
      },
      ownership: {
        title: "Ownership & Mindset",
        description:
          "Initiative, independent work, active thinking and the willingness to make decisions and keep developing through projects and research.",
      },
    },
  },
  skills: {
    rating: "Rating:",
    ratingOf: (rating: number) => `Rating ${rating} of 5`,
    applyFilter: "Apply Filter",
    reset: "Reset",
  },
  projectsPreview: {
    titleStart: "Featured",
    titleAccent: "Projects",
    subtitle: (total: number) => `3 of ${total} projects — from AI to mobile to game development.`,
    viewAll: (total: number) => `View All ${total} Projects`,
  },
  projects: {
    titleStart: "Featured",
    titleAccent: "Projects",
    intro: "Here are some of my recent projects that combine design, performance, and clean code.",
    moreDetails: "View more Details",
    moreTitle: "More Projects",
    moreIntro: "Additional projects and experiments that complement my portfolio.",
    githubCta: "Check My Personal GitHub",
  },
  notFound: {
    heading: "Page not found",
    toProjects: "Back to projects",
  },
  projectDetail: {
    back: "Back to Projects",
    keyFeatures: "KEY FEATURES",
    techStack: "TECH STACK",
    stats: "STATS",
    screenshots: "SCREENSHOTS",
    clickMe: "Click me",
    screenshotAlt: "Screenshot",
    playDemo: "PLAY DEMO",
    downloadDemo: "DOWNLOAD DEMO",
    viewCode: "VIEW CODE",
  },
  demo: {
    back: "Back to Project",
    controls: "CONTROLS",
    keys: "Keys",
    action: "Action",
    illustrationAlt: "Additional illustration",
  },
  footer: {
    tagline: "Software developer focused on AI, automation and interactive applications.",
    navigation: "Navigation",
    links: "Links",
    notice:
      "Private portfolio website. External links open external platforms. This website does not store any personal data.",
    rights: "All rights reserved.",
    backToTop: "Back to top",
  },
  dialog: {
    title: "External link",
    defaultLabel: "External Website",
    leaving: (label: string) =>
      `You are about to leave this website and will be redirected to an external platform (${label}).`,
    responsibility:
      "The processing of personal data on the destination website is the sole responsibility of the respective operator.",
    redirectingTo: (url: string) => `(redirecting to: ${url})`,
    cancel: "Cancel",
    continue: "Continue",
  },
  login: {
    title: "Protected Site",
    prompt: "Enter the password to continue",
    passwordPlaceholder: "Password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    submit: "Login",
    verifying: "Verifying...",
    invalidPassword: "Invalid password",
    help: "Find the password next to the website link at the source where you obtained the link, or request it from the website owner via the link below or any contact details you already have.",
    requestAccess: "Request access",
  },
};
