"use client";

import { useParams } from "next/navigation";
import { portfolioData } from "@/data/portfolio-data";
import { ArrowLeft, Download, ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NetworkBackground } from "@/components/NetworkBackground";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function ProjectPage() {
    const params = useParams();
    const id = params.id as string;
    const project = portfolioData.projects.find((p) => p.id === id);

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

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
            <ThemeToggle />
            <NetworkBackground />
            <Navbar />

            <main className="relative z-10 container mx-auto max-w-5xl px-4 py-24">
                <Link
                    href="/#projects"
                    className="mb-8 inline-flex items-center gap-2 text-foreground/70 transition-colors hover:text-primary"
                >
                    <ArrowLeft size={20} /> Back to Projects
                </Link>

                <div className="grid gap-12 lg:grid-cols-2">
                    {/* Image Section */}
                    <div className="overflow-hidden rounded-xl border border-primary/20 bg-card shadow-lg">
                        {project.demoEmbedUrl ? (
                            <iframe
                                src={project.demoEmbedUrl}
                                title={`${project.title} demo`}
                                className="aspect-video w-full"
                                allow="fullscreen; xr-spatial-tracking"
                                allowFullScreen
                                loading="lazy"
                            />
                        ) : (
                            <div className="relative aspect-video w-full">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="mb-2 text-3xl font-bold md:text-4xl">{project.title}</h1>
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

                        <p className="text-lg leading-relaxed text-foreground/80">
                            {project.longDescription || project.description}
                        </p>

                        {project.features && (
                            <div>
                                <h3 className="mb-3 text-xl font-semibold">Key Features</h3>
                                <ul className="list-inside list-disc space-y-2 text-foreground/80">
                                    {project.features.map((feature, index) => (
                                        <li key={index}>{feature}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {project.techStack && (
                            <div>
                                <h3 className="mb-3 text-xl font-semibold">Tech Stack</h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.techStack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="rounded-md bg-secondary px-2 py-1 text-sm text-secondary-foreground"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-4 pt-4">
                            {project.demoUrl && (
                                <a
                                    href={project.demoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="cosmic-button flex items-center gap-2"
                                >
                                    <ExternalLink size={18} /> Live Demo
                                </a>
                            )}
                            {project.demoDownload && (
                                <a
                                    href={project.demoDownload}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 rounded-full border border-primary px-6 py-2 text-primary transition-colors hover:bg-primary/10"
                                >
                                    <Download size={18} /> Download Demo
                                </a>
                            )}
                            {project.githubUrl && (
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 rounded-full border border-primary px-6 py-2 text-primary transition-colors hover:bg-primary/10"
                                >
                                    <Github size={18} /> View Code
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
