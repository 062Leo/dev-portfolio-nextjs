"use client";

import { useParams } from "next/navigation";
import { portfolioData } from "@/data/portfolio-data";
import { ArrowLeft, ExternalLink, Github, Play, CheckCircle, Clock, Star, Code } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { NetworkBackground } from "@/components/NetworkBackground";
import { ThemeToggle } from "@/components/ThemeToggle";

export function DetailPage() {
    const params = useParams();
    const id = params.id as string;
    const project = portfolioData.projects.find((p) => p.id === id);

    // Early return if project is not found
    if (!project) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
                <h1 className="text-4xl font-bold">Project not found</h1>
                <Link href="/" className="mt-4 text-primary hover:underline">
                    Back to Home
                </Link>
            </div>
        );
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
        <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground font-sans">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Rubik+Mono+One&display=swap');
                .font-rubik { font-family: 'Rubik Mono One', sans-serif; }
                .font-press-start { font-family: 'Press Start 2P', cursive; }
            `}</style>

            <ThemeToggle />
            <NetworkBackground />
            <Navbar />

            <main className="relative z-10 container mx-auto max-w-5xl px-4 py-24">
                <div className="mb-8">
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Projects
                    </Link>
                </div>

                <div className="flex justify-center">
                    <div className="w-full max-w-3xl space-y-8">
                        <div>
                            <h1 className="mb-4 text-4xl font-bold font-rubik md:text-5xl text-primary uppercase">
                                {project.title}
                            </h1>
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Main Image */}
                        <div className="aspect-video w-full rounded-xl overflow-hidden border-2 border-primary/30 bg-card/50">
                            {/* Use project.image if available, otherwise a placeholder or the first image from images array */}
                            <img
                                src={project.image || (project.images && project.images[0]?.url) || "/api/placeholder/800/450"}
                                alt={project.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <p className="text-lg leading-relaxed text-foreground/80">
                            {project.longDescription || project.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="mb-4 text-xl font-semibold text-primary font-press-start">KEY FEATURES</h3>
                                <ul className="space-y-2 text-foreground/80">
                                    {project.features?.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <CheckCircle className="mr-2 text-primary w-4 h-4 mt-1 shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="mb-4 text-xl font-semibold text-primary font-press-start">TECH STACK</h3>
                                <div className="flex flex-wrap gap-3">
                                    {project.techStack?.map((tech) => (
                                        <span
                                            key={tech}
                                            className="rounded-md bg-primary/10 px-3 py-1.5 text-sm font-mono uppercase text-primary"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                {showStats && (
                                    <>
                                        <h3 className="mt-6 mb-4 text-xl font-semibold text-primary font-press-start">STATS</h3>
                                        <div className="space-y-2 text-foreground/80">
                                            <div className="flex items-center">
                                                <Clock className="mr-2 text-primary w-4 h-4" />
                                                <span>Development Time: {stats.devTime}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Star className="mr-2 text-primary w-4 h-4" />
                                                <span>Grade: {stats.grade}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Code className="mr-2 text-primary w-4 h-4" />
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
                                    className="cosmic-button flex items-center"
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
                                    className="flex items-center gap-2 rounded-lg border border-primary px-6 py-3 text-primary hover:bg-primary/10 transition-colors"
                                >
                                    <Github className="w-5 h-5" />
                                    VIEW CODE
                                </a>
                            )}
                        </div>

                        {/* Screenshots Section */}
                        {project.images && project.images.length > 0 && (
                            <div className="pt-8">
                                <h3 className="mb-4 text-xl font-semibold text-primary font-press-start">SCREENSHOTS</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {project.images.map((img, index) => (
                                        <div key={index} className="aspect-video rounded-lg overflow-hidden border border-primary/30 hover:border-primary transition-all cursor-pointer bg-card/30">
                                            <img
                                                src={img.url}
                                                alt={img.caption || `Screenshot ${index + 1}`}
                                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
