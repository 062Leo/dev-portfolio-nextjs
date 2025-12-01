"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { portfolioData } from "@/data/portfolio-data";
import { ArrowLeft, ChevronLeft, ChevronRight, Download, ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NetworkBackground } from "@/components/NetworkBackground";
import { ThemeToggle } from "@/components/ThemeToggle";

type ProjectImage = {
  url: string;
  caption?: string;
};

export default function ProjectPage() {
    const params = useParams();
    const id = params.id as string;
    const project = portfolioData.projects.find((p) => p.id === id);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isSliderPaused, setIsSliderPaused] = useState(false);

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

    const displayedImages: ProjectImage[] = project.images?.length ? project.images : [{ url: project.image }];
    const totalSlides = displayedImages.length;
    const currentImage = displayedImages[currentImageIndex] || displayedImages[0];
    const hasMultipleImages = totalSlides > 1;

    const goToNextImage = () => {
        if (!hasMultipleImages) return;
        setCurrentImageIndex((prev) => (prev + 1) % totalSlides);
    };

    const goToPrevImage = () => {
        if (!hasMultipleImages) return;
        setCurrentImageIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    useEffect(() => {
        if (!hasMultipleImages || isSliderPaused) return;

        const sliderTimer = window.setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % totalSlides);
        }, 3000);

        return () => window.clearInterval(sliderTimer);
    }, [hasMultipleImages, isSliderPaused, totalSlides]);

    const handleDemoClick = () => {
        if (project?.demoUrl) {
            window.open(project.demoUrl, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
            <ThemeToggle />
            <NetworkBackground />
            <Navbar />

            <main className="relative z-10 container mx-auto max-w-5xl px-4 py-24"
            >
                <Link
                    href="/projects"
                    className="mb-8 inline-flex items-center gap-2 text-foreground/70 transition-colors hover:text-primary"
                >
                    <ArrowLeft size={20} /> Back to Projects
                </Link>

                <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:justify-between lg:gap-16"
                >
                    {/* Image Section */}
                    <div className="self-center overflow-hidden rounded-xl border border-primary/20 bg-card shadow-lg">
                        <div className="relative w-full h-[70vh]">
                            <div className="relative w-full h-full overflow-hidden rounded-xl">
                                <div
                                    className="relative w-full h-full"
                                    onMouseEnter={() => hasMultipleImages && setIsSliderPaused(true)}
                                    onMouseLeave={() => hasMultipleImages && setIsSliderPaused(false)}
                                    onFocus={() => hasMultipleImages && setIsSliderPaused(true)}
                                    onBlur={() => hasMultipleImages && setIsSliderPaused(false)}
                                >
                                    <div className="relative h-full w-full overflow-hidden">
                                        <div
                                            className="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(1,.01,.32,1)]"
                                            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                                        >
                                            {displayedImages.map((image, index) => {
                                                const slideHasCaption = Boolean(image.caption && image.caption.trim() !== "");
                                                return (
                                                    <div
                                                        key={`${image.url}-${index}`}
                                                        className={`relative flex h-full w-full flex-shrink-0 overflow-hidden ${slideHasCaption ? 'flex-col' : ''}`}
                                                    >
                                                        <div
                                                            className={`relative w-full ${slideHasCaption ? 'h-1/2 flex items-center justify-center' : 'h-full flex items-center justify-center'}`}
                                                        >
                                                            <Image
                                                                src={image.url}
                                                                alt={`${project.title} - Image ${index + 1}`}
                                                                fill
                                                                sizes="(min-width: 1024px) 50vw, 100vw"
                                                                className="object-cover"
                                                                priority={index === 0}
                                                                style={{ objectFit: 'cover' }}
                                                            />
                                                        </div>
                                                        {slideHasCaption && (
                                                            <div className="flex h-1/2 items-center justify-center bg-muted/80 p-4 text-center backdrop-blur-sm">
                                                                <p className="text-sm text-muted-foreground">{image.caption}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {hasMultipleImages && (
                                        <>
                                            <div className="absolute top-4 right-4 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white shadow">
                                                {currentImageIndex + 1} / {totalSlides}
                                            </div>
                                            <button
                                                onClick={goToPrevImage}
                                                className="btns absolute left-4 top-1/2 -translate-y-1/2 rounded-md bg-black/40 text-white shadow hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-primary"
                                                aria-label="Previous image"
                                            >
                                                <ChevronLeft className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={goToNextImage}
                                                className="btns absolute right-4 top-1/2 -translate-y-1/2 rounded-md bg-black/40 text-white shadow hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-primary"
                                                aria-label="Next image"
                                            >
                                                <ChevronRight className="h-5 w-5" />
                                            </button>
                                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                                                <div className="flex items-center gap-2">
                                                    {displayedImages.map((_, index) => (
                                                        <button
                                                            key={`dot-${index}`}
                                                            onClick={() => setCurrentImageIndex(index)}
                                                            aria-label={`Go to image ${index + 1}`}
                                                            className={`h-2.5 w-2.5 rounded-full transition-all ${index === currentImageIndex ? 'h-3 w-3 bg-white shadow' : 'bg-white/50'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div
                        className="space-y-6 lg:max-w-[32rem]"
                    >
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
                                    className="cosmic-button flex items-center"
                                >
                                    <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
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

            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
}
