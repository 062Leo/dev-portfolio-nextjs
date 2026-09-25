import React, { useEffect, useRef } from "react";
import type { ProjectImage } from "@/data/types";
import { renderMarkdownText } from "@/lib/markdown";

interface ProjectVideosProps {
  videoBig?: string;
  videos: ProjectImage[] | undefined;
}

const ProjectVideos: React.FC<ProjectVideosProps> = ({ videoBig, videos }) => {
  const hasBigVideo = !!videoBig && videoBig.trim() !== "";
  const hasVideos = !!videos && videos.length > 0;

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    if (!videos || videos.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 },
    );

    videoRefs.current.forEach((video) => {
      if (video) {
        observer.observe(video);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [videos]);

  if (!hasBigVideo && !hasVideos) return null;

  const isValidVideo = (video: unknown): video is ProjectImage => {
    return !!video && typeof video === "object" && "url" in video;
  };

  return (
    <div className="pt-1 space-y-8">
      {hasBigVideo && (
        <div>
          <h3 className="mb-6 text-2xl font-semibold font-press-start text-center text-accent-2-light">
            VIDEO
          </h3>
          <div className="flex justify-center">
            <div className="aspect-video w-full max-w-4xl rounded-xl overflow-hidden border-2 border-accent bg-bg">
              <video
                src={videoBig}
                preload="auto"
                controls
                muted
                playsInline
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {hasVideos && (
        <>
          <h3 className="mb-8 text-2xl font-semibold font-press-start text-center text-accent-2-light">
            DETAILS
          </h3>
          <div className="space-y-8 md:space-y-10">
            {videos!.filter(isValidVideo).map((video, index) => (
              <div
                key={index}
                className={`relative flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-4 md:gap-8 p-4 rounded-lg group bg-accent/10`}
              >
                {/* Connecting line */}
                <div className="hidden md:block absolute top-1/2 left-1/2 w-12 h-0.5 -translate-x-1/2 -translate-y-1/2 z-0 bg-accent"></div>

                {/* Video container - 4:3 aspect ratio */}
                <div className="w-full md:w-1/2 p-2 relative z-10">
                  <div className="rounded-lg overflow-hidden h-full aspect-[4/3] border border-accent bg-bg transition-all duration-300 group-hover:shadow-lg">
                    <video
                      ref={(el) => {
                        videoRefs.current[index] = el;
                      }}
                      src={video.url}
                      preload="auto"
                      muted
                      loop
                      playsInline
                      controls
                      className="w-full h-full object-contain transition-all duration-500"
                    />
                  </div>
                </div>

                {/* Text container */}
                <div className="w-full md:w-1/2 p-2 flex items-center relative z-10">
                  {video.caption && (
                    <div className="w-full p-6 rounded-lg h-full flex items-center border border-accent bg-bg shadow-md transition-all duration-300 group-hover:shadow-lg">
                      <div className="w-full text-sm md:text-base">
                        {renderMarkdownText(video.caption, "text-text") || video.caption}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectVideos;
