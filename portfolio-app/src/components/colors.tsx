export type ThemeColorSet = {
    background: string;
    foreground: string;
    primary: string;
    primaryForeground: string;
    card: string;
    border: string;
    networkBackground: string;
    networkStroke: string;
    networkCircle: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    // Additional colors
    red: string;
    redLight: string;
    redDark: string;
    green: string;
    greenLight: string;
    yellow: string;
    cyan: string;
    grayLight: string;
    white: string;
    black: string;
};

export const themeColors: Record<"light" | "dark", ThemeColorSet> = {
    light: {
        // Background & Foreground
        // background: Used in body, cards, inputs (globals.css, all components)
        background: "rgba(240, 239, 235, 1)",
        // foreground: Used for text, default text color (globals.css, all components)
        foreground: "rgba(21, 23, 31, 1)",

        // Primary Colors
        // primary: Used in buttons, links, headings, highlights (cosmic-button, HomeSection, BoomForce)
        primary: "rgba(139, 92, 246, 1)",
        // primaryForeground: Text color on primary backgrounds (cosmic-button)
        primaryForeground: "rgba(240, 239, 235, 1)",

        // Card & Border
        // card: Background for cards, containers (About, Skills, Projects sections)
        card: "rgba(219, 214, 204, 1)",
        // border: Border colors for elements (gradient-border utility)
        border: "rgba(214, 210, 196, 1)",

        // Network Background Component
        // networkBackground: Radial gradient for NetworkBackground canvas (NetworkBackground.tsx)
        networkBackground: "radial-gradient(circle at center, rgba(155, 144, 136, 0.9), rgba(240, 239, 235, 1))",
        // networkStroke: Lines in network animation (NetworkBackground.tsx)
        networkStroke: "rgba(21, 23, 31, 1)",
        // networkCircle: Circles in network animation (NetworkBackground.tsx)
        networkCircle: "rgba(27, 34, 54, 1)",

        // Text Colors
        // textPrimary: Primary text color (CSS variable --text-primary)
        textPrimary: "rgba(21, 23, 31, 1)",
        // textSecondary: Secondary text color with 80% opacity (CSS variable --text-secondary)
        textSecondary: "rgba(21, 23, 31, 0.8)",
        // textMuted: Muted text color with 60% opacity (CSS variable --text-muted)
        textMuted: "rgba(21, 23, 31, 0.6)",

        // Additional Colors
        // red: Project titles, headings, key features (BoomForce.tsx - h3 titles, borders)
        red: "rgba(220, 38, 38, 1)",
        // redLight: Tech stack badges text (BoomForce.tsx - tech stack items)
        redLight: "rgba(248, 113, 113, 1)",
        // redDark: Tech stack badges background (BoomForce.tsx - tech stack bg)
        redDark: "rgba(127, 29, 29, 1)",
        // green: Feature icons, checkmarks (BoomForce.tsx - CheckCircle icons)
        green: "rgba(34, 197, 94, 1)",
        // greenLight: Hover text animation (HomeSection.tsx - hover character animation)
        greenLight: "rgba(134, 239, 172, 1)",
        // yellow: Stats icons (BoomForce.tsx - Clock, Star, Code icons)
        yellow: "rgba(234, 179, 8, 1)",
        // cyan: Slash separator in name (HomeSection.tsx - "/" character)
        cyan: "rgba(34, 211, 238, 1)",
        // grayLight: Description text, secondary text (BoomForce.tsx - project description, feature list)
        grayLight: "rgba(209, 213, 219, 1)",
        // white: Slider dots, button text (Old.tsx - slider navigation dots)
        white: "rgba(255, 255, 255, 1)",
        // black: Image backgrounds, slider controls (BoomForce.tsx - image border, Old.tsx - slider buttons)
        black: "rgba(0, 0, 0, 1)",
    },
    dark: {
        // Background & Foreground
        // background: Used in body, cards, inputs (globals.css, all components)
        background: "rgba(11, 13, 23, 1)",
        // foreground: Used for text, default text color (globals.css, all components)
        foreground: "rgba(213, 220, 232, 1)",

        // Primary Colors
        // primary: Used in buttons, links, headings, highlights (cosmic-button, HomeSection, BoomForce)
        primary: "rgba(167, 139, 250, 1)",
        // primaryForeground: Text color on primary backgrounds (cosmic-button)
        primaryForeground: "rgba(213, 220, 232, 1)",

        // Card & Border
        // card: Background for cards, containers (About, Skills, Projects sections)
        card: "rgba(11, 17, 30, 1)",
        // border: Border colors for elements (gradient-border utility)
        border: "rgba(38, 46, 66, 1)",

        // Network Background Component
        // networkBackground: Radial gradient for NetworkBackground canvas (NetworkBackground.tsx)
        networkBackground: "radial-gradient(circle at center, rgba(41, 41, 94, 0.9), rgba(0, 0, 0, 1))",
        // networkStroke: Lines in network animation (NetworkBackground.tsx)
        networkStroke: "rgba(239, 68, 68, 1)",
        // networkCircle: Circles in network animation (NetworkBackground.tsx)
        networkCircle: "rgba(156, 217, 249, 1)",

        // Text Colors
        // textPrimary: Primary text color (CSS variable --text-primary)
        textPrimary: "rgba(213, 220, 232, 1)",
        // textSecondary: Secondary text color with 80% opacity (CSS variable --text-secondary)
        textSecondary: "rgba(213, 220, 232, 0.8)",
        // textMuted: Muted text color with 60% opacity (CSS variable --text-muted)
        textMuted: "rgba(213, 220, 232, 0.6)",

        // Additional Colors
        // red: Project titles, headings, key features (BoomForce.tsx - h3 titles, borders)
        red: "rgba(239, 68, 68, 1)",
        // redLight: Tech stack badges text (BoomForce.tsx - tech stack items)
        redLight: "rgba(248, 113, 113, 1)",
        // redDark: Tech stack badges background (BoomForce.tsx - tech stack bg)
        redDark: "rgba(75, 43, 150, 1)",
        // green: Feature icons, checkmarks (BoomForce.tsx - CheckCircle icons)
        green: "rgba(74, 222, 128, 1)",
        // greenLight: Hover text animation (HomeSection.tsx - hover character animation)
        greenLight: "rgba(134, 239, 172, 1)",
        // yellow: Stats icons (BoomForce.tsx - Clock, Star, Code icons)
        yellow: "rgba(250, 204, 21, 1)",
        // cyan: Slash separator in name (HomeSection.tsx - "/" character)
        cyan: "rgba(34, 211, 238, 1)",
        // grayLight: Description text, secondary text (BoomForce.tsx - project description, feature list)
        grayLight: "rgba(209, 213, 219, 1)",
        // white: Slider dots, button text (Old.tsx - slider navigation dots)
        white: "rgba(255, 255, 255, 1)",
        // black: Image backgrounds, slider controls (BoomForce.tsx - image border, Old.tsx - slider buttons)
        black: "rgba(0, 0, 0, 1)",
    }
};

export const getColor = (isDarkMode: boolean): ThemeColorSet => {
    return isDarkMode ? themeColors.dark : themeColors.light;
};

const themeVariableMap = (colors: ThemeColorSet) => ({
    "--background": colors.background,
    "--foreground": colors.foreground,
    "--primary": colors.primary,
    "--primary-foreground": colors.primaryForeground,
    "--card": colors.card,
    "--border": colors.border,
    "--text-primary": colors.textPrimary,
    "--text-secondary": colors.textSecondary,
    "--text-muted": colors.textMuted,
    "--network-background": colors.networkBackground,
    "--network-stroke": colors.networkStroke,
    "--network-circle": colors.networkCircle,
});

export const applyThemeColors = (isDarkMode: boolean) => {
    if (typeof document === "undefined") {
        return;
    }

    const colors = getColor(isDarkMode);
    const root = document.documentElement;

    Object.entries(themeVariableMap(colors)).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });
};

// Hook to get current theme colors in components
export const useThemeColors = (isDarkMode: boolean): ThemeColorSet => {
    return getColor(isDarkMode);
};
