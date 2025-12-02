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
    // HomeSection Component Colors
    homeSectionBracketText: string;
    homeSectionHoverText: string;
    homeSectionSeparator: string;
    // HomeSection Visual Tokens
    homeSectionBackgroundGradient: string;
    homeSectionBorderGlow: string;
    homeSectionTitleColor: string;
    homeSectionTitleGlow: string;
    homeSectionDescriptionText: string;
    homeSectionButtonGradientStart: string;
    homeSectionButtonGradientEnd: string;
    homeSectionButtonText: string;
    homeSectionAccentLine: string;
    // Old Component Colors (Slider)
    oldSliderCounterBg: string;
    oldSliderCounterText: string;
    oldSliderButtonBg: string;
    oldSliderButtonText: string;
    oldSliderDotActive: string;
    oldSliderDotInactive: string;
    // BoomForce Component Colors
    boomforceBackLinkText: string;
    boomforceBackLinkHover: string;
    boomforceProjectTitleColor: string;
    boomforceProjectTitleGlow: string;
    boomforceTagBorder: string;
    boomforceTagBackground: string;
    boomforceTagText: string;
    boomforceMainImageBorder: string;
    boomforceMainImageBackground: string;
    boomforceProjectDescriptionText: string;
    boomforceFeatureTitleColor: string;
    boomforceFeatureListText: string;
    boomforceFeatureCheckmarkColor: string;
    boomforceTechStackTitleColor: string;
    boomforceTechStackBgColor: string;
    boomforceTechStackTextColor: string;
    boomforceStatsTitleColor: string;
    boomforceStatsTextColor: string;
    boomforceStatsIconColor: string;
    boomforceDemoBtnGradientStart: string;
    boomforceDemoBtnGradientEnd: string;
    boomforceDemoBtnTextColor: string;
    boomforceDemoBtnShadow: string;
    boomforceViewCodeBtnBorder: string;
    boomforceViewCodeBtnText: string;
    boomforceViewCodeBtnShadow: string;
    boomforceScreenshotsTitleColor: string;
    boomforceScreenshotsBorder: string;
    boomforceScreenshotsBackground: string;
    // ProjectsSection Visual Tokens
    projectsSectionTitleColor: string;
    projectsSectionAccentText: string;
    projectsSectionSubtitleColor: string;
    projectsSectionCardBackground: string;
    projectsSectionCardBorder: string;
    projectsSectionCardShadow: string;
    projectsSectionTagBorder: string;
    projectsSectionTagBackground: string;
    projectsSectionTagText: string;
    projectsSectionLinkColor: string;
    projectsSectionLinkHover: string;
    projectsSectionIconColor: string;
    projectsSectionDivider: string;

    // Navbar Colors
    navbarTitleColor: string;
    navbarTitleGlow: string;
    navbarLinkText: string;
    navbarLinkHover: string;
    navbarMenuBackdrop: string;
    navbarMenuText: string;
    navbarBackground: string;

    // ContactSection Colors
    contactSectionTitleColor: string;
    contactSectionAccentColor: string;
    contactSectionIconBackground: string;
    contactSectionIconColor: string;
    contactSectionCardBackground: string;
    contactSectionCardBorder: string;
    contactSectionCardShadow: string;

    // About Section Colors
    aboutSectionTitleColor: string;
    aboutSectionAccentColor: string;
    aboutSectionCardBackground: string;
    aboutSectionCardBorder: string;
    aboutSectionCardShadow: string;
    aboutSectionIconBackground: string;
    aboutSectionIconColor: string;
    aboutSectionDescriptionText: string;

    // Skills Section Colors
    skillsSectionTitleColor: string;
    skillsSectionButtonActiveBackground: string;
    skillsSectionButtonActiveText: string;
    skillsSectionButtonInactiveText: string;
    skillsSectionCardBackground: string;
    skillsSectionCardBorder: string;
    skillsSectionCardShadow: string;
    skillsSectionProgressBarBg: string;
    skillsSectionProgressBarFill: string;
    skillsSectionLevelText: string;
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

        // HomeSection Component Colors
        homeSectionBracketText: "rgba(209, 213, 219, 1)",
        homeSectionHoverText: "rgba(34, 197, 94, 1)",
        homeSectionSeparator: "rgba(34, 211, 238, 1)",
        // Old Component Colors (Slider)
        oldSliderCounterBg: "rgba(0, 0, 0, 1)",
        oldSliderCounterText: "rgba(255, 255, 255, 1)",
        oldSliderButtonBg: "rgba(0, 0, 0, 1)",
        oldSliderButtonText: "rgba(255, 255, 255, 1)",
        oldSliderDotActive: "rgba(255, 255, 255, 1)",
        oldSliderDotInactive: "rgba(255, 255, 255, 0.5)",
        // BoomForce Component Colors
        boomforceBackLinkText: "rgba(239, 68, 68, 1)",
        boomforceBackLinkHover: "rgba(239, 68, 68, 0.85)",
        boomforceProjectTitleColor: "rgba(239, 68, 68, 1)",
        boomforceProjectTitleGlow: "0 0 15px rgba(180, 162, 234, 0.3), 0 0 25px rgba(104, 80, 172, 0.3)",
        boomforceTagBorder: "rgba(139, 92, 246, 0.3)",
        boomforceTagBackground: "rgba(139, 92, 246, 0.1)",
        boomforceTagText: "rgba(139, 92, 246, 1)",
        boomforceMainImageBorder: "rgba(167, 139, 250, 1)",
        boomforceMainImageBackground: "rgba(0, 0, 0, 1)",
        boomforceProjectDescriptionText: "rgba(209, 213, 219, 1)",
        boomforceFeatureTitleColor: "rgba(248, 113, 113, 1)",
        boomforceFeatureListText: "rgba(209, 213, 219, 1)",
        boomforceFeatureCheckmarkColor: "rgba(74, 222, 128, 1)",
        boomforceTechStackTitleColor: "rgba(220, 38, 38, 1)",
        boomforceTechStackBgColor: "rgba(167, 139, 250, 0.33)",
        boomforceTechStackTextColor: "rgba(213, 220, 232, 1)",
        boomforceStatsTitleColor: "rgba(248, 113, 113, 1)",
        boomforceStatsTextColor: "rgba(209, 213, 219, 1)",
        boomforceStatsIconColor: "rgba(250, 204, 21, 1)",
        boomforceDemoBtnGradientStart: "rgba(220, 38, 38, 1)",
        boomforceDemoBtnGradientEnd: "rgba(127, 29, 29, 1)",
        boomforceDemoBtnTextColor: "rgba(255, 255, 255, 1)",
        boomforceDemoBtnShadow: "rgba(127, 29, 29, 1)",
        boomforceViewCodeBtnBorder: "rgba(220, 38, 38, 1)",
        boomforceViewCodeBtnText: "rgba(220, 38, 38, 1)",
        boomforceViewCodeBtnShadow: "rgba(220, 38, 38, 1)",
        boomforceScreenshotsTitleColor: "rgba(220, 38, 38, 1)",
        boomforceScreenshotsBorder: "rgba(220, 38, 38, 1)",
        boomforceScreenshotsBackground: "rgba(0, 0, 0, 1)",
        // HomeSection Visual Tokens
        homeSectionBackgroundGradient:
            "radial-gradient(circle at 20% 20%, rgba(239, 68, 68, 0.25), transparent 45%), radial-gradient(circle at 80% 0%, rgba(167, 139, 250, 0.35), transparent 55%)",
        homeSectionBorderGlow: "0 0 25px rgba(239, 68, 68, 0.6), 0 0 40px rgba(167, 139, 250, 0.6)",
        homeSectionTitleColor: "rgba(239, 68, 68, 1)",
        homeSectionTitleGlow: "0 0 15px rgba(180, 162, 234, 0.3), 0 0 25px rgba(104, 80, 172, 0.3)",
        homeSectionDescriptionText: "rgba(209, 213, 219, 0.95)",
        homeSectionButtonGradientStart: "rgba(220, 38, 38, 1)",
        homeSectionButtonGradientEnd: "rgba(127, 29, 29, 1)",
        homeSectionButtonText: "rgba(255, 255, 255, 1)",
        homeSectionAccentLine: "rgba(167, 139, 250, 1)",
        // ProjectsSection Visual Tokens
        projectsSectionTitleColor: "rgba(239, 68, 68, 1)",
        projectsSectionAccentText: "rgba(248, 113, 113, 1)",
        projectsSectionSubtitleColor: "rgba(209, 213, 219, 0.85)",
        projectsSectionCardBackground: "rgba(11, 13, 23, 0.95)",
        projectsSectionCardBorder: "rgba(167, 139, 250, 0.6)",
        projectsSectionCardShadow: "0 25px 60px rgba(167, 139, 250, 0.35)",
        projectsSectionTagBorder: "rgba(167, 139, 250, 0.4)",
        projectsSectionTagBackground: "rgba(167, 139, 250, 0.15)",
        projectsSectionTagText: "rgba(167, 139, 250, 1)",
        projectsSectionLinkColor: "rgba(239, 68, 68, 1)",
        projectsSectionLinkHover: "rgba(239, 68, 68, 0.8)",
        projectsSectionIconColor: "rgba(250, 204, 21, 1)",
        projectsSectionDivider: "rgba(167, 139, 250, 0.3)",

        navbarTitleColor: "rgba(239, 68, 68, 1)",
        navbarTitleGlow: "0 0 15px rgba(180, 162, 234, 0.3), 0 0 25px rgba(104, 80, 172, 0.3)",
        navbarLinkText: "rgba(209, 213, 219, 1)",
        navbarLinkHover: "rgba(248, 113, 113, 1)",
        navbarMenuBackdrop: "rgba(11, 13, 23, 0.95)",
        navbarMenuText: "rgba(209, 213, 219, 1)",
        navbarBackground: "rgba(11, 13, 23, 0.95)",

        contactSectionTitleColor: "rgba(239, 68, 68, 1)",
        contactSectionAccentColor: "rgba(248, 113, 113, 1)",
        contactSectionIconBackground: "rgba(139, 92, 246, 0.1)",
        contactSectionIconColor: "rgba(239, 68, 68, 1)",
        contactSectionCardBackground: "rgba(11, 13, 23, 0.95)",
        contactSectionCardBorder: "rgba(167, 139, 250, 0.6)",
        contactSectionCardShadow: "0 25px 60px rgba(167, 139, 250, 0.35)",

        aboutSectionTitleColor: "rgba(239, 68, 68, 1)",
        aboutSectionAccentColor: "rgba(248, 113, 113, 1)",
        aboutSectionCardBackground: "rgba(11, 13, 23, 0.95)",
        aboutSectionCardBorder: "rgba(167, 139, 250, 0.6)",
        aboutSectionCardShadow: "0 25px 60px rgba(167, 139, 250, 0.35)",
        aboutSectionIconBackground: "rgba(139, 92, 246, 0.1)",
        aboutSectionIconColor: "rgba(239, 68, 68, 1)",
        aboutSectionDescriptionText: "rgba(209, 213, 219, 0.9)",

        skillsSectionTitleColor: "rgba(239, 68, 68, 1)",
        skillsSectionButtonActiveBackground: "rgba(239, 68, 68, 1)",
        skillsSectionButtonActiveText: "rgba(255, 255, 255, 1)",
        skillsSectionButtonInactiveText: "rgba(209, 213, 219, 0.8)",
        skillsSectionCardBackground: "rgba(11, 13, 23, 0.95)",
        skillsSectionCardBorder: "rgba(167, 139, 250, 0.6)",
        skillsSectionCardShadow: "0 25px 60px rgba(167, 139, 250, 0.35)",
        skillsSectionProgressBarBg: "rgba(167, 139, 250, 0.33)",
        skillsSectionProgressBarFill: "rgba(248, 113, 113, 1)",
        skillsSectionLevelText: "rgba(209, 213, 219, 0.85)",
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

        // HomeSection Component Colors
        homeSectionBracketText: "rgba(213, 220, 232, 1)",
        homeSectionHoverText: "rgba(74, 222, 128, 1)",
        homeSectionSeparator: "rgba(34, 211, 238, 1)",
        // Old Component Colors (Slider)
        oldSliderCounterBg: "rgba(11, 13, 23, 1)",
        oldSliderCounterText: "rgba(255, 255, 255, 1)",
        oldSliderButtonBg: "rgba(11, 13, 23, 1)",
        oldSliderButtonText: "rgba(255, 255, 255, 1)",
        oldSliderDotActive: "rgba(255, 255, 255, 1)",
        oldSliderDotInactive: "rgba(255, 255, 255, 0.5)",
        // BoomForce Component Colors
        boomforceBackLinkText: "rgba(167, 139, 250, 1)",
        boomforceBackLinkHover: "rgba(167, 139, 250, 1)",
        boomforceProjectTitleColor: "rgba(239, 68, 68, 1)",
        boomforceProjectTitleGlow: "0 0 15px rgba(180, 162, 234, 0.3), 0 0 25px rgba(104, 80, 172, 0.3)",
        boomforceTagBorder: "rgba(167, 139, 250, 0.3)",
        boomforceTagBackground: "rgba(167, 139, 250, 0.1)",
        boomforceTagText: "rgba(167, 139, 250, 1)",
        boomforceMainImageBorder: "rgba(167, 139, 250, 1)",
        boomforceMainImageBackground: "rgba(11, 13, 23, 1)",
        boomforceProjectDescriptionText: "rgba(213, 220, 232, 1)",
        boomforceFeatureTitleColor: "rgba(248, 113, 113, 1)",
        boomforceFeatureListText: "rgba(213, 220, 232, 1)",
        boomforceFeatureCheckmarkColor: "rgba(74, 222, 128, 1)",
        boomforceTechStackTitleColor: "rgba(248, 113, 113, 1)",
        boomforceTechStackBgColor: "rgba(167, 139, 250, 0.33)",
        boomforceTechStackTextColor: "rgba(213, 220, 232, 1)",
        boomforceStatsTitleColor: "rgba(248, 113, 113, 1)",
        boomforceStatsTextColor: "rgba(213, 220, 232, 1)",
        boomforceStatsIconColor: "rgba(250, 204, 21, 1)",
        boomforceDemoBtnGradientStart: "rgba(105, 30, 155, 1)",
        boomforceDemoBtnGradientEnd: "rgba(167, 139, 250, .7)",
        boomforceDemoBtnTextColor: "rgba(213, 220, 232, 1)",
        boomforceDemoBtnShadow: "rgba(167, 139, 250, 0.5)",
        boomforceViewCodeBtnBorder: "rgba(167, 139, 250, 1)",
        boomforceViewCodeBtnText: "rgba(167, 139, 250, 1)",
        boomforceViewCodeBtnShadow: "rgba(167, 139, 250, 0.3)",
        boomforceScreenshotsTitleColor: "rgba(248, 113, 113, 1)",
        boomforceScreenshotsBorder: "rgba(167, 139, 250, 1)",
        boomforceScreenshotsBackground: "rgba(11, 13, 23, 1)",
        // HomeSection Visual Tokens
        homeSectionBackgroundGradient:
            "radial-gradient(circle at 20% 20%, rgba(239, 68, 68, 0.35), transparent 45%), radial-gradient(circle at 80% 0%, rgba(167, 139, 250, 0.4), transparent 50%)",
        homeSectionBorderGlow: "0 0 25px rgba(239, 68, 68, 0.5), 0 0 45px rgba(167, 139, 250, 0.4)",
        homeSectionTitleColor: "rgba(239, 68, 68, 1)",
        homeSectionTitleGlow: "0 0 15px rgba(180, 162, 234, 0.3), 0 0 25px rgba(104, 80, 172, 0.3)",
        homeSectionDescriptionText: "rgba(213, 220, 232, 0.95)",
        homeSectionButtonGradientStart: "rgba(105, 30, 155, 1)",
        homeSectionButtonGradientEnd: "rgba(131, 40, 40, 1)",
        homeSectionButtonText: "rgba(213, 220, 232, 1)",
        homeSectionAccentLine: "rgba(167, 139, 250, 1)",
        // ProjectsSection Visual Tokens
        projectsSectionTitleColor: "rgba(239, 68, 68, 1)",
        projectsSectionAccentText: "rgba(248, 113, 113, 1)",
        projectsSectionSubtitleColor: "rgba(213, 220, 232, 0.9)",
        projectsSectionCardBackground: "rgba(11, 13, 23, 0.92)",
        projectsSectionCardBorder: "rgba(167, 139, 250, 0.6)",
        projectsSectionCardShadow: "0 25px 60px rgba(167, 139, 250, 0.35)",
        projectsSectionTagBorder: "rgba(167, 139, 250, 0.4)",
        projectsSectionTagBackground: "rgba(167, 139, 250, 0.18)",
        projectsSectionTagText: "rgba(167, 139, 250, 1)",
        projectsSectionLinkColor: "rgba(239, 68, 68, 1)",
        projectsSectionLinkHover: "rgba(239, 68, 68, 0.8)",
        projectsSectionIconColor: "rgba(250, 204, 21, 1)",
        projectsSectionDivider: "rgba(167, 139, 250, 0.3)",

        navbarTitleColor: "rgba(213, 220, 232, 1)",
        navbarTitleGlow: "0 0 15px rgba(180, 162, 234, 0.3), 0 0 25px rgba(104, 80, 172, 0.3)",
        navbarLinkText: "rgba(213, 220, 232, 1)",
        navbarLinkHover: "rgba(248, 113, 113, 1)",
        navbarMenuBackdrop: "rgba(11, 13, 23, 0.95)",
        navbarMenuText: "rgba(213, 220, 232, 1)",
        navbarBackground: "rgba(11, 13, 23, 0.95)",

        contactSectionTitleColor: "rgba(239, 68, 68, 1)",
        contactSectionAccentColor: "rgba(248, 113, 113, 1)",
        contactSectionIconBackground: "rgba(139, 92, 246, 0.1)",
        contactSectionIconColor: "rgba(239, 68, 68, 1)",
        contactSectionCardBackground: "rgba(11, 13, 23, 0.95)",
        contactSectionCardBorder: "rgba(167, 139, 250, 0.6)",
        contactSectionCardShadow: "0 25px 60px rgba(167, 139, 250, 0.35)",

        aboutSectionTitleColor: "rgba(239, 68, 68, 1)",
        aboutSectionAccentColor: "rgba(248, 113, 113, 1)",
        aboutSectionCardBackground: "rgba(11, 13, 23, 0.95)",
        aboutSectionCardBorder: "rgba(167, 139, 250, 0.6)",
        aboutSectionCardShadow: "0 25px 60px rgba(167, 139, 250, 0.35)",
        aboutSectionIconBackground: "rgba(139, 92, 246, 0.1)",
        aboutSectionIconColor: "rgba(239, 68, 68, 1)",
        aboutSectionDescriptionText: "rgba(213, 220, 232, 0.9)",

        skillsSectionTitleColor: "rgba(239, 68, 68, 1)",
        skillsSectionButtonActiveBackground: "rgba(239, 68, 68, 1)",
        skillsSectionButtonActiveText: "rgba(255, 255, 255, 1)",
        skillsSectionButtonInactiveText: "rgba(213, 220, 232, 0.8)",
        skillsSectionCardBackground: "rgba(11, 13, 23, 0.95)",
        skillsSectionCardBorder: "rgba(167, 139, 250, 0.6)",
        skillsSectionCardShadow: "0 25px 60px rgba(167, 139, 250, 0.35)",
        skillsSectionProgressBarBg: "rgba(167, 139, 250, 0.33)",
        skillsSectionProgressBarFill: "rgba(248, 113, 113, 1)",
        skillsSectionLevelText: "rgba(213, 220, 232, 0.85)",
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
