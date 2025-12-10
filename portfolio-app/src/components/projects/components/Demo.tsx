"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { portfolioData } from "@/data/portfolio-data";
import { ArrowLeft, Github, Play, CheckCircle, Clock, Star, Code, Zap, Users, Target, Award, Layers, Download } from "lucide-react";
import Link from "next/link";
import { useThemeColors } from "@/components/colors";

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
    
    return paragraphs.map((paragraph, pIndex) => (
        <p key={pIndex} className="mb-4 last:mb-0">
            {paragraph.split(/(\*\*.*?\*\*)/g).map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return (
                        <strong key={index} style={{ color }}>
                            {part.slice(2, -2)}
                        </strong>
                    );
                }
                return <span key={index} style={{ color }}>{part}</span>;
            })}
        </p>
    ));
};

export function DetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const storedTheme = window.localStorage.getItem("theme");
        const isDark = storedTheme ? storedTheme === "dark" : true;
        setIsDarkMode(isDark);
        setIsReady(true);
    }, []);

    const project = portfolioData.projects.find((p) => p.id === id);
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

    return (
        <>
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Rubik+Mono+One&display=swap');
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
                        Back to Project
                    </button>
                </div>

                <div className="space-y-8">
                    <div>
                        <h1
                            className="text-3xl md:text-4xl font-bold font-rubik uppercase"
                            style={{ color: colors.demoTitleColor, textShadow: colors.demoTitleGlow }}
                        >
                            {project.title} – Demo
                        </h1>
                    </div>

                    <div
                        className="text-base md:text-lg leading-relaxed space-y-4"
                        style={{ color: colors.demoTextColor }}
                    >
                        {project.demotext && renderMarkdownText(project.demotext, colors.demoTextColor)}
                        {project.demoControls && project.demoControls.length > 0 && (
                            <>
                                <h3 className="mb-4 text-xl font-semibold font-press-start" style={{ color: colors.demoControlsTitleColor }}>STEUERUNG</h3>
                                <div className="inline-block overflow-x-auto max-w-md">
                                    <table className="text-sm md:text-base border-collapse">
                                        <thead>
                                            <tr
                                                style={{ borderBottom: `1px solid ${colors.demoControlsHeaderSeparatorColor}` }}
                                            >
                                                <th
                                                    className="py-1 pr-4 font-semibold text-right font-press-start"
                                                    style={{ color: colors.demoControlsHeaderActionColor }}
                                                >
                                                    Aktion
                                                </th>
                                                <th
                                                    className="py-1 pl-4 font-semibold text-left font-press-start"
                                                    style={{
                                                        borderLeft: `1px solid ${colors.demoControlsHeaderSeparatorColor}`,
                                                        color: colors.demoControlsHeaderKeysColor,
                                                    }}
                                                >
                                                    Tasten
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {project.demoControls.map((control, index) => {
                                                const [action, input] = control.split(":");
                                                return (
                                                    <tr
                                                        key={index}
                                                        className="last:border-b-0"
                                                        style={{ borderBottom: `1px solid ${colors.demoControlsRowSeparatorColor}` }}
                                                    >
                                                        <td
                                                            className="py-1 pr-4 font-semibold text-right"
                                                            style={{ color: colors.demoControlsActionTextColor }}
                                                        >
                                                            {action}
                                                        </td>
                                                        <td
                                                            className="py-1 pl-4 text-left"
                                                            style={{
                                                                borderLeft: `1px solid ${colors.demoControlsRowSeparatorColor}`,
                                                                color: colors.demoControlsKeysTextColor,
                                                            }}
                                                        >
                                                            {input?.trim()}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
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
                                IM NEUEN TAB ÖFFNEN
                            </a>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
