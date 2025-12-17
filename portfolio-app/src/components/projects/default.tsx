"use client";

import { useEffect, useState } from "react";
import { portfolioData } from "@/data/portfolio-data";
import { portfolioData as portfolioDataEn } from "@/data/portfolio-data-en";
import { otherProjects } from "@/data/other_projects";
import { otherProjects as otherProjectsEn } from "@/data/other_projects_en";
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

export function DetailPage({ id }: { id: string }) {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isReady, setIsReady] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [pendingUrl, setPendingUrl] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<{ url: string; caption?: string } | null>(null);
    const { language } = useLanguage();
    const [project, setProject] = useState<
        (typeof portfolioData.projects)[number] | (typeof otherProjects.projects)[number] | null
    >(null);

    useEffect(() => {
        const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        setIsDarkMode(prefersDark);

        const data = language === "en" ? portfolioDataEn : portfolioData;
        const otherSource = language === "en" ? otherProjectsEn : otherProjects;

        // Zuerst in den Hauptprojekten suchen (DE/EN), dann in den weiteren Projekten (DE/EN) als Fallback
        const foundProject =
            data.projects.find((p) => p.id === id) ||
            otherSource.projects.find((p) => p.id === id) ||
            null;

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
                <Link href="/" className="mt-4 hover:underline" style={{ color: colors.boomforceBackLinkText }}>
                    Back to Home
                </Link>
            </div>
        );
    }

    // Dynamic stats from project data
    const showStats = project.stats && project.stats.length > 0;
    const hasImages = project.images && project.images.length > 0;

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
                                src={project.image || (project.images && project.images[0]?.url) || "/Bilder/dummy.png"}
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
                            {project.demoLink && (
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
                                <button
                                    type="button"
                                    className="flex items-center px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg"
                                    style={{ background: `linear-gradient(to right, ${colors.boomforceDemoBtnGradientStart}, ${colors.boomforceDemoBtnGradientEnd})`, color: colors.boomforceDemoBtnTextColor, boxShadow: `0 0 20px ${colors.boomforceDemoBtnShadow}` }}
                                    onClick={() => {
                                        setPendingUrl(project.demoDownload as string);
                                        setShowDialog(true);
                                    }}
                                >
                                    <Download className="mr-2 w-5 h-5" />
                                    {language === "de" ? "DEMO HERUNTERLADEN" : "DOWNLOAD DEMO"}
                                </button>
                            )}
                            {project.githubUrl && (
                                <button
                                    type="button"
                                    className="flex items-center gap-2 rounded-lg px-6 py-3 transition-all transform hover:scale-105 shadow-lg"
                                    style={{ border: `1px solid ${colors.boomforceViewCodeBtnBorder}`, color: colors.boomforceViewCodeBtnText, boxShadow: `0 0 20px ${colors.boomforceViewCodeBtnShadow}` }}
                                    onClick={() => {
                                        setPendingUrl(project.githubUrl as string);
                                        setShowDialog(true);
                                    }}
                                >
                                    <Github className="w-5 h-5" />
                                    {language === "de" ? "CODE ANSEHEN" : "VIEW CODE"}
                                </button>
                            )}
                        </div>


                        {hasImages && (
                            <div >
                                <h3
                                    className="mb-6 text-2xl font-semibold font-press-start text-center"
                                    style={{ color: colors.boomforceScreenshotsTitleColor }}
                                >
                                    SCREENSHOTS
                                </h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {project.images!.map((image, index) => (
                                        <div key={index} className="flex flex-col items-center gap-3">
                                            <div
                                                className="relative w-full max-w-md overflow-hidden rounded-xl border-2 aspect-video cursor-pointer group"
                                                style={{
                                                    borderColor: colors.boomforceScreenshotsBorder,
                                                    backgroundColor: colors.boomforceScreenshotsBackground,
                                                }}
                                                onClick={() => setSelectedImage(image)}
                                            >
                                                <img
                                                    src={image.url}
                                                    alt={image.caption || project.title}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <div
                                                    className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                                >
                                                    <span className="text-lg font-semibold text-white">Click me</span>
                                                </div>
                                            </div>
                                            {image.caption && (
                                                <p
                                                    className="text-sm text-center max-w-md"
                                                    style={{ color: colors.boomforceProjectDescriptionText }}
                                                >
                                                    {image.caption}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

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
                {selectedImage && (
                    <div
                        role="dialog"
                        aria-modal="true"
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <div
                            className="w-full max-w-[95vw] rounded-3xl bg-background/95 px-6 py-10 text-foreground shadow-2xl border border-border relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                type="button"
                                className="absolute -top-2 right-5 text-5xl font-extrabold text-red-500 drop-shadow-lg hover:scale-110 hover:opacity-90 transition-transform"
                                onClick={() => setSelectedImage(null)}
                            >
                                ×
                            </button>
                            <div className="flex justify-center pb-4">
                                <div className="w-full flex justify-center">
                                    <img
                                        src={selectedImage.url}
                                        alt={selectedImage.caption || "Screenshot"}
                                        className="min-h-[50vh] min-w-[50vw] max-h-[75vh] max-w-[95vw] h-auto w-auto object-contain rounded-xl"
                                    />
                                </div>
                            </div>
                            {selectedImage.caption && (
                                <p className="text-center text-base" style={{ color: colors.boomforceProjectDescriptionText }}>
                                    {selectedImage.caption}
                                </p>
                            )}
                        </div>
                    </div>
                )}
                {showDialog && pendingUrl && (
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
                                     ? "You are about to leave this website and will be redirected to an external platform (GitHub)."
                                     : "Sie verlassen diese Website und werden auf eine externe Plattform (GitHub) weitergeleitet."}
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
                                    onClick={() => {
                                        setShowDialog(false);
                                        setPendingUrl(null);
                                    }}
                                >
                                    {language === "en" ? "Cancel" : "Abbrechen"}
                                </button>
                                <button
                                    type="button"
                                    className="rounded-md px-4 py-2 text-xl font-semibold bg-foreground text-background hover:brightness-110 hover:shadow-xl hover:-translate-y-[2px] hover:ring-2 hover:ring-foreground/70 transition-all duration-150"
                                    onClick={() => {
                                        const url = pendingUrl;
                                        setShowDialog(false);
                                        setPendingUrl(null);
                                        if (url) {
                                            window.open(url, "_blank", "noopener,noreferrer");
                                        }
                                    }}
                                >
                                    {language === "en" ? "Continue" : "Fortfahren"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </>
    );
}
