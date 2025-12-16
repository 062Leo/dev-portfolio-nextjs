"use client";

import { useEffect, useState } from "react";
import { portfolioData, type DemoControlsGroup } from "@/data/portfolio-data";
import { portfolioData as portfolioDataEn } from "@/data/portfolio-data-en";
import { ArrowLeft,  Play,  Clock, Star, Code, Zap, Users, Target, Award, Layers } from "lucide-react";
import Link from "next/link";
import { useThemeColors } from "@/components/colors";
import { useLanguage } from "@/context/LanguageContext";

// Icon map for dynamic stat rendering
const iconMap = {
  Clock,
  Star,
  Code,
  Zap,
  Users,
  Target,
  Award,
  Layers
};

// Helper function to render markdown-like formatting
const renderMarkdownText = (text: string, color: string) => {
    if (!text) return null;
    
    // Split by double newlines to create paragraphs
    const paragraphs = text.split('\n\n');

    return paragraphs.map((paragraph, pIndex) => {
        const lines = paragraph.split('\n');

        return (
            <p key={pIndex} className="mb-4 last:mb-0">
                {lines.map((line, lineIndex) => (
                    <span key={lineIndex}>
                        {line.split(/(\*\*.*?\*\*)/g).map((part, index) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                                return (
                                    <strong key={index} style={{ color }}>
                                        {part.slice(2, -2)}
                                    </strong>
                                );
                            }
                            return <span key={index} style={{ color }}>{part}</span>;
                        })}
                        {lineIndex < lines.length - 1 && <br />}
                    </span>
                ))}
            </p>
        );
    });
};

const isGroupedControls = (
    controls: string[] | DemoControlsGroup[]
): controls is DemoControlsGroup[] => {
    return (
        Array.isArray(controls) &&
        controls.length > 0 &&
        typeof controls[0] === "object" &&
        controls[0] !== null &&
        "title" in controls[0]
    );
};

export function DetailPage({ id }: { id: string }) {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isReady, setIsReady] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const { language } = useLanguage();
    const [project, setProject] = useState<(typeof portfolioData.projects)[number] | null>(null);

    useEffect(() => {
        const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        setIsDarkMode(prefersDark);

        const data = language === "en" ? portfolioDataEn : portfolioData;
        const foundProject = data.projects.find((p) => p.id === id) || null;
        setProject(foundProject);

        setIsReady(true);
    }, [id, language]);
    const colors = useThemeColors(isDarkMode);

    if (!isReady) {
        return null;
    }

    // Early return if project is not found
    if (!project) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
                <h1 className="text-4xl font-bold">Project not found</h1>
                <Link href="/" className="mt-4 hover:underline" style={{ color: colors.demoBackLinkText }}>
                    Back to Home
                </Link>
            </div>
        );
    }

    // Dynamic stats from project data
    const showStats = project.stats && project.stats.length > 0;
    const hasDemoControls = project.demoControls && project.demoControls.length > 0;

    let groupedControls: DemoControlsGroup[] | null = null;
    let flatControls: string[] | null = null;

    if (hasDemoControls) {
        const controls = project.demoControls;
        if (isGroupedControls(controls)) {
            groupedControls = controls as DemoControlsGroup[];
        } else {
            flatControls = controls as string[];
        }
    }

    return (
        <>
            <style jsx global>{`
                .font-rubik { font-family: 'Rubik Mono One', sans-serif; }
                .font-press-start { font-family: 'Press Start 2P', cursive; }
            `}</style>

            <main className="relative z-10 container mx-auto max-w-5xl px-4 py-24">
                <div className="mb-8">
                    <Link
                        href={`/projects/${id}`}
                        className="mb-8 inline-flex items-center gap-2 transition-colors"
                        style={{ color: colors.demoBackLinkText }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = colors.demoBackLinkHover)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = colors.demoBackLinkText)}
                    >
                        <ArrowLeft size={20} />
                        {language === "en" ? "Back to Project" : "Zurück zum Projekt"}
                    </Link>
                </div>

                <div className="space-y-8">
                    <div>
                        <h1
                            className="text-3xl md:text-4xl font-bold font-rubik uppercase"
                            style={{ color: colors.demoTitleColor, textShadow: colors.demoTitleGlow }}
                        >
                            {project.title} - Demo
                        </h1>
                    </div>

                            
                    <div className="text-base md:text-lg leading-relaxed space-y-4" style={{ color: colors.demoTextColor }}>
                        {project.demotext && renderMarkdownText(project.demotext, colors.demoTextColor)}
                    </div>




                    <div className="mt-4">

                        {/* border_width: 5
                        bg_color: #1c055b
                        fg_color: #ffffff
                        link_color: #e86e6e
                        border_color: #ec5261
                        iframe_width: 560
                        iframe_height: 175 */}
                        {project.demoImage && (
                            <button
                                type="button"
                                className="w-full rounded-xl overflow-hidden border-2 cursor-pointer block"
                                style={{
                                    borderColor: colors.demoFrameBorderColor,
                                    backgroundColor: colors.demoFrameBackgroundColor,
                                }}
                                onClick={() => {
                                    if (project.demoLink) {
                                        setShowDialog(true);
                                    }
                                }}
                            >
                                <div className="w-full h-full">
                                    <img
                                        src={project.demoImage}
                                        alt={project.title}
                                        className="w-full h-auto"
                                    />
                                </div>
                            </button>
                        )}
                    </div>


                          <div
                        className="text-base md:text-lg leading-relaxed space-y-4"
                        style={{ color: colors.demoTextColor }}
                    >
                        {hasDemoControls && (
                            <>
                                <h3
                                    className="mb-4 text-xl font-semibold font-press-start"
                                    style={{ color: colors.demoControlsTitleColor }}
                                >
                                    {language === "en" ? "CONTROLS" : "STEUERUNG"}
                                </h3>
                                {groupedControls ? (
                                    <div className="flex flex-col md:flex-row gap-8">
                                        {groupedControls.map((group: DemoControlsGroup, groupIndex: number) => (
                                            <div
                                                key={groupIndex}
                                                className="inline-block overflow-x-auto max-w-md md:flex-1"
                                            >
                                                <h4
                                                    className="mb-2 text-base md:text-lg font-semibold font-press-start"
                                                    style={{ color: colors.demoControlsTitleColor }}
                                                >
                                                    {group.title}
                                                </h4>
                                                <table className="text-sm md:text-base border-collapse">
                                                    <thead>
                                                        <tr
                                                            style={{ borderBottom: `1px solid ${colors.demoControlsHeaderSeparatorColor}` }}
                                                        >
                                                            <th
                                                                className="py-1 pr-4 font-semibold text-right font-press-start"
                                                                style={{ color: colors.demoControlsHeaderKeysColor }}
                                                            >
                                                                {language === "en" ? "Keys" : "Tasten"}
                                                            </th>
                                                            <th
                                                                className="py-1 pl-4 font-semibold text-left font-press-start"
                                                                style={{
                                                                    borderLeft: `1px solid ${colors.demoControlsHeaderSeparatorColor}`,
                                                                    color: colors.demoControlsHeaderActionColor,
                                                                }}
                                                            >
                                                                {language === "en" ? "Action" : "Aktion"}
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {group.items.map((item: string, index: number) => {
                                                            const [action, input] = item.split(":");
                                                            return (
                                                                <tr
                                                                    key={index}
                                                                    className="last:border-b-0"
                                                                    style={{ borderBottom: `1px solid ${colors.demoControlsRowSeparatorColor}` }}
                                                                >
                                                                    <td
                                                                        className="py-1 pr-4 font-semibold text-right"
                                                                        style={{ color: colors.demoControlsKeysTextColor }}
                                                                    >
                                                                        {input?.trim()}
                                                                    </td>
                                                                    <td
                                                                        className="py-1 pl-4 text-left"
                                                                        style={{
                                                                            borderLeft: `1px solid ${colors.demoControlsRowSeparatorColor}`,
                                                                            color: colors.demoControlsActionTextColor,
                                                                        }}
                                                                    >
                                                                        {action}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    flatControls && (
                                        <div className="inline-block overflow-x-auto max-w-md">
                                            <table className="text-sm md:text-base border-collapse">
                                                <thead>
                                                    <tr
                                                        style={{ borderBottom: `1px solid ${colors.demoControlsHeaderSeparatorColor}` }}
                                                    >
                                                        <th
                                                            className="py-1 pr-4 font-semibold text-right font-press-start"
                                                            style={{ color: colors.demoControlsHeaderKeysColor }}
                                                        >
                                                            {language === "en" ? "Keys" : "Tasten"}
                                                        </th>
                                                        <th
                                                            className="py-1 pl-4 font-semibold text-left font-press-start"
                                                            style={{
                                                                borderLeft: `1px solid ${colors.demoControlsHeaderSeparatorColor}`,
                                                                color: colors.demoControlsHeaderActionColor,
                                                            }}
                                                        >
                                                            {language === "en" ? "Action" : "Aktion"}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {flatControls.map((control, index) => {
                                                        const [action, input] = control.split(":");
                                                        return (
                                                            <tr
                                                                key={index}
                                                                className="last:border-b-0"
                                                                style={{ borderBottom: `1px solid ${colors.demoControlsRowSeparatorColor}` }}
                                                            >
                                                                <td
                                                                    className="py-1 pr-4 font-semibold text-right"
                                                                    style={{ color: colors.demoControlsKeysTextColor }}
                                                                >
                                                                    {input?.trim()}
                                                                </td>
                                                                <td
                                                                    className="py-1 pl-4 text-left"
                                                                    style={{
                                                                        borderLeft: `1px solid ${colors.demoControlsRowSeparatorColor}`,
                                                                        color: colors.demoControlsActionTextColor,
                                                                    }}
                                                                >
                                                                    {action}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )
                                )}
                            </>
                        )}
                    </div>

                    {project.miscTitle && (
                        <h3
                            className="mb-2 w-full max-w-3xl text-left text-xl font-semibold font-press-start"
                            style={{ color: colors.demoControlsTitleColor }}
                        >
                            {project.miscTitle}
                        </h3>
                    )}
                    {project.miscimage && (
                        <div className="mt-8 flex flex-col items-center">
                            <div
                                className="w-full max-w-3xl rounded-xl overflow-hidden border-2"
                                style={{
                                    borderColor: colors.demoFrameBorderColor,
                                    backgroundColor: colors.demoFrameBackgroundColor,
                                }}
                            >
                                <img
                                    src={project.miscimage}
                                    alt="Additional illustration"
                                    className="w-full h-auto"
                                />
                            </div>
                            {project.misctext && (
                                <div
                                    className="mt-4 w-full max-w-3xl  text-sm md:text-base leading-relaxed"
                                    style={{ color: colors.demoTextColor }}
                                >
                                    {renderMarkdownText(project.misctext, colors.demoTextColor)}
                                </div>
                            )}
                        </div>
                    )}
                    
                </div>

                {showDialog && project.demoLink && (
                    <div
                        role="dialog"
                        aria-modal="true"
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
                    >
                        <div className="w-full max-w-2xl rounded-3xl bg-background/95 px-10 py-12 text-foreground shadow-2xl border border-border">
                            <h2 className="mb-6 text-4xl font-semibold">
                                {language === "en" ? "External link" : "Externer Link"}
                            </h2>
                            <p className="mb-4 text-2xl">
                                {language === "en"
                                    ? "You are about to leave this website and will be redirected to an external platform (itch.io)."
                                    : "Sie verlassen diese Website und werden auf eine externe Plattform (itch.io) weitergeleitet."}
                            </p>
                            <p className="mb-10 text-2xl">
                                {language === "en"
                                    ? "The processing of personal data on the destination website is the sole responsibility of the respective operator."
                                    : "Für die Verarbeitung personenbezogener Daten auf der Zielseite ist ausschließlich der jeweilige Betreiber verantwortlich."}
                            </p>
                            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    className="rounded-md px-4 py-2 text-xl font-medium border border-border bg-background hover:bg-muted hover:shadow-lg hover:-translate-y-[2px] hover:border-foreground/60 transition-all duration-150"
                                    onClick={() => setShowDialog(false)}
                                >
                                    {language === "en" ? "Cancel" : "Abbrechen"}
                                </button>
                                <a
                                    href={project.demoLink as string}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center rounded-md px-4 py-2 text-xl font-semibold bg-foreground text-background hover:brightness-110 hover:shadow-xl hover:-translate-y-[2px] hover:ring-2 hover:ring-foreground/70 transition-all duration-150"
                                    onClick={() => {
                                        setShowDialog(false);
                                    }}
                                >
                                    {language === "en" ? "Continue to itch.io" : "Weiter zu itch.io"}
                                </a>

                                
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}
