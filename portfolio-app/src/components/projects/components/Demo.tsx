"use client";

import { useParams, useRouter } from "next/navigation";
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

export function DetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isReady, setIsReady] = useState(false);
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

    if (!isReady) {
        return null;
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
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="mb-8 inline-flex items-center gap-2 transition-colors"
                        style={{ color: colors.demoBackLinkText }}
                        onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.color = colors.demoBackLinkHover}
                        onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.color = colors.demoBackLinkText}
                    >
                        <ArrowLeft size={20} />
                        {language === "en" ? "Back to Project" : "Zurück zum Projekt"}
                    </button>
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
                        {project.demoUrl && (
                            <div
                                className="w-full rounded-xl overflow-hidden border-2"
                                style={{
                                    borderColor: colors.demoFrameBorderColor,
                                    backgroundColor: colors.demoFrameBackgroundColor,
                                    height: "80vh",
                                }}
                            >
                                <div className="w-full h-full">
                                    <iframe
                                        src={project.demoUrl}
                                        className="w-full h-full border-0"
                                        allowFullScreen
                                    />
                                </div>
                            </div>
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

                    {project.demoUrl && (
                        <div className="flex flex-wrap gap-4 pt-4">
                            <a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg"
                                style={{
                                    background: `linear-gradient(to right, ${colors.demoButtonGradientStart}, ${colors.demoButtonGradientEnd})`,
                                    color: colors.demoButtonTextColor,
                                    boxShadow: `0 0 20px ${colors.demoButtonShadowColor}`,
                                }}
                            >
                                <Play className="mr-2 w-5 h-5" />
                                {language === "en" ? "OPEN DEMO IN NEW TAB" : "DEMO IM NEUEN TAB ÖFFNEN"}
                            </a>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
