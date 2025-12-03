"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { portfolioData } from "@/data/portfolio-data";
import { ArrowLeft, Github, Play, CheckCircle, Clock, Star, Code } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { NetworkBackground } from "@/components/NetworkBackground";
import { useThemeColors } from "@/components/colors";

export function DetailPage() {
    const params = useParams();
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
                <Link href="/" className="mt-4 hover:underline" style={{ color: colors.boomforceBackLinkText }}>
                    Back to Home
                </Link>
            </div>
        );
    }

    if (!isReady) {
        return null;
    }

    // Hardcoded stats for Broforce project (as requested to match example.html)
    // In a real app, these would come from the project data
    const showStats = project.id === 'broforce-clone';
    const stats = {
        devTime: "3 months",
        grade: "1.0 (A+)",
        loc: "~5,000"
    };

    return (
        <>
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Rubik+Mono+One&display=swap');
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
                        Back to Projects
                    </Link>
                </div>

                <div className="flex justify-center">
                    <div className="w-full max-w-4xl space-y-8">
                        <div>
                            <h1 className="mb-4 text-4xl font-bold font-rubik md:text-5xl uppercase" style={{ color: colors.boomforceProjectTitleColor, textShadow: colors.boomforceProjectTitleGlow }}>
                                {project.title}
                            </h1>
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

                        <p className="text-lg leading-relaxed" style={{ color: colors.boomforceProjectDescriptionText }}>
                            {project.longDescription || project.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="mb-4 text-xl font-semibold font-press-start" style={{ color: colors.boomforceFeatureTitleColor }}>KEY FEATURES</h3>
                                <ul className="space-y-2" style={{ color: colors.boomforceFeatureListText }}>
                                    {project.features?.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <CheckCircle className="mr-2 w-4 h-4 mt-1 shrink-0" style={{ color: colors.boomforceFeatureCheckmarkColor }} />
                                            <span>{feature}</span>
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
                                            <div className="flex items-center">
                                                <Clock className="mr-2 w-4 h-4" style={{ color: colors.boomforceStatsIconColor }} />
                                                <span>Development Time: {stats.devTime}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Star className="mr-2 w-4 h-4" style={{ color: colors.boomforceStatsIconColor }} />
                                                <span>Grade: {stats.grade}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Code className="mr-2 w-4 h-4" style={{ color: colors.boomforceStatsIconColor }} />
                                                <span>Lines of Code: {stats.loc}</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-6">
                            {project.demoUrl && (
                                <a
                                    href={project.demoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg"
                                    style={{ background: `linear-gradient(to right, ${colors.boomforceDemoBtnGradientStart}, ${colors.boomforceDemoBtnGradientEnd})`, color: colors.boomforceDemoBtnTextColor, boxShadow: `0 0 20px ${colors.boomforceDemoBtnShadow}` }}
                                >
                                    <Play className="mr-2 w-5 h-5" />
                                    PLAY DEMO
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
                                    VIEW CODE
                                </a>
                            )}
                        </div>

                        {/* Details Section */}
                        {project.images && project.images.length > 0 && (
                            <div className="pt-8">
                                <h3 className="mb-8 text-2xl font-semibold font-press-start text-center" style={{ color: colors.boomforceScreenshotsTitleColor }}>DETAILS</h3>
                                <div className="space-y-12">
                                    {project.images.map((img, index) => (
                                        <div 
                                            key={index} 
                                            className={`relative flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 group`}
                                        >
                                            {/* Connecting line */}
                                            <div className="hidden md:block absolute top-1/2 left-1/2 w-12 h-0.5 -translate-x-1/2 -translate-y-1/2 z-0" style={{ backgroundColor: colors.boomforceScreenshotsBorder }}></div>
                                            
                                            {/* Image container */}
                                            <div className="w-full md:w-1/2 p-2 relative z-10">
                                                <div className="aspect-video rounded-lg overflow-hidden h-full transition-all duration-300 group-hover:shadow-lg" 
                                                    style={{ 
                                                        border: `1px solid ${colors.boomforceScreenshotsBorder}`, 
                                                        backgroundColor: colors.boomforceScreenshotsBackground 
                                                    }}>
                                                    <img
                                                        src={img.url}
                                                        alt={img.caption || `Detail ${index + 1}`}
                                                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                                                    />
                                                </div>
                                            </div>
                                            
                                            {/* Text container */}
                                            <div className="w-full md:w-1/2 p-2 flex items-center relative z-10">
                                                {img.caption && (
                                                    <div className="w-full p-6 rounded-lg h-full flex items-center transition-all duration-300 group-hover:shadow-lg" 
                                                        style={{ 
                                                            backgroundColor: colors.boomforceScreenshotsBackground, 
                                                            border: `1px solid ${colors.boomforceScreenshotsBorder}`, 
                                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' 
                                                        }}>
                                                        <div className="w-full">
                                                            <p className="text-sm md:text-base" style={{ color: colors.boomforceProjectDescriptionText }}>
                                                                {img.caption}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}
