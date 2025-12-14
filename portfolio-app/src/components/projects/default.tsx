"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { portfolioData } from "@/data/portfolio-data";
import { portfolioData as portfolioDataEn } from "@/data/portfolio-data-en";
import { ArrowLeft, Github, Play, CheckCircle, Clock, Star, Code, Zap, Users, Target, Award, Layers, Download, Youtube } from "lucide-react";
import Link from "next/link";
import { useThemeColors } from "@/components/colors";
import { useLanguage } from "@/context/LanguageContext";
import ProjectVideos from "./components/ProjectVideos";

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

export function DetailPage() {
    const params = useParams();
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
                <Link href="/" className="mt-4 hover:underline" style={{ color: colors.boomforceBackLinkText }}>
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
                .font-rubik { font-family: 'Rubik Mono One', sans-serif; }
                .font-press-start { font-family: 'Press Start 2P', cursive; }
            `}</style>

            <main className="relative z-10 container mx-auto max-w-5xl px-4 py-24">
                <div className="mb-8">
                    <Link
                        href="/projects"
                        className="mb-8 inline-flex items-center gap-2 transition-colors"
                        style={{ color: colors.boomforceBackLinkText }}
                        onMouseEnter={(e) => e.currentTarget.style.color = colors.boomforceBackLinkHover}
                        onMouseLeave={(e) => e.currentTarget.style.color = colors.boomforceBackLinkText}
                    >
                        <ArrowLeft size={20} />
                        {language === "de" ? "Zurück zur Projektübersicht" : "Back to Projects"}
                    </Link>
                </div>

                <div className="flex justify-center">
                    <div className="w-full max-w-4xl space-y-8">
                        <div>
                            <div className="mb-4 flex items-baseline gap-3 flex-wrap">
                                <h1 className="text-4xl font-bold font-rubik md:text-5xl uppercase" style={{ color: colors.boomforceProjectTitleColor, textShadow: colors.boomforceProjectTitleGlow }}>
                                    {renderMarkdownText(project.title, colors.boomforceProjectTitleColor) || project.title}
                                </h1>
                                {project.subtitle && project.subtitle.trim() && (
                                    <h2 className="text-xl font-semibold font-rubik md:text-2xl uppercase" style={{ color: colors.boomforceProjectTitleColor, textShadow: colors.boomforceProjectTitleGlow }}>
                                        {project.subtitle}
                                    </h2>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-full px-3 py-1 text-sm font-medium"
                                        style={{ borderColor: colors.boomforceTagBorder, border: `1px solid ${colors.boomforceTagBorder}`, backgroundColor: colors.boomforceTagBackground, color: colors.boomforceTagText }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Main Image */}
                        <div className="aspect-video w-full max-w-4xl rounded-xl overflow-hidden border-2" style={{ borderColor: colors.boomforceMainImageBorder, backgroundColor: colors.boomforceMainImageBackground }}>
                            {/* Use project.image if available, otherwise a placeholder or the first image from images array */}
                            <img
                                src={project.image || (project.images && project.images[0]?.url) || "/api/placeholder/800/450"}
                                alt={project.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="text-lg leading-relaxed">
                            {renderMarkdownText(project.longDescription || project.description, colors.boomforceProjectDescriptionText)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="mb-4 text-xl font-semibold font-press-start" style={{ color: colors.boomforceFeatureTitleColor }}>KEY FEATURES</h3>
                                <ul className="space-y-2" style={{ color: colors.boomforceFeatureListText }}>
                                    {project.features?.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <CheckCircle className="mr-2 w-4 h-4 mt-1 shrink-0" style={{ color: colors.boomforceFeatureCheckmarkColor }} />
                                            <div className="flex-1">
                                                {renderMarkdownText(feature, colors.boomforceFeatureListText) || feature}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="mb-4 text-xl font-semibold font-press-start" style={{ color: colors.boomforceTechStackTitleColor }}>TECH STACK</h3>
                                <div className="flex flex-wrap gap-3">
                                    {project.techStack?.map((tech) => (
                                        <span
                                            key={tech}
                                            className="rounded-md px-3 py-1.5 text-sm font-mono uppercase"
                                            style={{ backgroundColor: colors.boomforceTechStackBgColor, color: colors.boomforceTechStackTextColor }}
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                {showStats && (
                                    <>
                                        <h3 className="mt-6 mb-4 text-xl font-semibold font-press-start" style={{ color: colors.boomforceStatsTitleColor }}>STATS</h3>
                                        <div className="space-y-2" style={{ color: colors.boomforceStatsTextColor }}>
                                            {project.stats?.map((stat, index) => {
                                                const IconComponent = iconMap[stat.icon as keyof typeof iconMap];
                                                return (
                                                    <div key={index} className="flex items-center">
                                                        {IconComponent && <IconComponent className="mr-2 w-4 h-4" style={{ color: colors.boomforceStatsIconColor }} />}
                                                        <span>{stat.label}: {stat.value}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-6">
                            {project.demoUrl && (
                                <Link
                                    href={`/projects/${id}/demo`}
                                    className="flex items-center px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg"
                                    style={{ background: `linear-gradient(to right, ${colors.boomforceDemoBtnGradientStart}, ${colors.boomforceDemoBtnGradientEnd})`, color: colors.boomforceDemoBtnTextColor, boxShadow: `0 0 20px ${colors.boomforceDemoBtnShadow}` }}
                                >
                                    <Play className="mr-2 w-5 h-5" />
                                    {language === "de" ? "DEMO SPIELEN" : "PLAY DEMO"}
                                </Link>
                            )}
                            {project.demoDownload && (
                                <a
                                href={project.demoDownload}
                                download
                                className="flex items-center px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg"
                                style={{ background: `linear-gradient(to right, ${colors.boomforceDemoBtnGradientStart}, ${colors.boomforceDemoBtnGradientEnd})`, color: colors.boomforceDemoBtnTextColor, boxShadow: `0 0 20px ${colors.boomforceDemoBtnShadow}` }}
                                >
                                    <Download className="mr-2 w-5 h-5" />
                                    {language === "de" ? "DEMO HERUNTERLADEN" : "DOWNLOAD DEMO"}
                                </a>
                            )}
                             {project.githubUrl && (
                                 <a
                                 href={project.githubUrl}
                                 target="_blank"
                                 rel="noreferrer"
                                 className="flex items-center gap-2 rounded-lg px-6 py-3 transition-all transform hover:scale-105 shadow-lg"
                                 style={{ border: `1px solid ${colors.boomforceViewCodeBtnBorder}`, color: colors.boomforceViewCodeBtnText, boxShadow: `0 0 20px ${colors.boomforceViewCodeBtnShadow}` }}
                                 >
                                    <Github className="w-5 h-5" />
                                    {language === "de" ? "CODE ANSEHEN" : "VIEW CODE"}
                                </a>
                            )}
                            
                        </div>

                        {/* Details Section with Videos */}
                        <ProjectVideos 
                            videoBig={project.videoBig}
                            videos={project.videos}
                            colors={{
                                boomforceScreenshotsTitleColor: colors.boomforceScreenshotsTitleColor,
                                boomforceScreenshotsBorder: colors.boomforceScreenshotsBorder,
                                boomforceScreenshotsBackground: colors.boomforceScreenshotsBackground,
                                boomforceProjectDescriptionText: colors.boomforceProjectDescriptionText
                            }}
                        />
                    </div>
                </div>
            </main>
        </>
    );
}
