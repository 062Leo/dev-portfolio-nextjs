import React, { useEffect, useRef } from 'react';
import { ProjectImage } from '@/data/portfolio-data';

interface ProjectVideosProps {
  videoBig?: string;
  videos: ProjectImage[] | undefined;
  colors: {
    boomforceScreenshotsTitleColor: string;
    boomforceScreenshotsBorder: string;
    boomforceScreenshotsBackground: string;
    boomforceProjectDescriptionText: string;
  };
}

// Helper function to render markdown-like formatting
const renderMarkdownText = (text: string, color: string) => {
    if (!text) return null;
    
    // First split by double newlines to handle paragraphs
    return text.split('\n\n').map((paragraph, pIndex, arr) => {
        // Then split each paragraph by single newlines
        const lines = paragraph.split('\n');
        
        return (
            <p key={pIndex} className={pIndex < arr.length - 1 ? 'mb-4' : 'mb-0'}>
                {lines.map((line, lineIndex) => (
                    <React.Fragment key={lineIndex}>
                        {lineIndex > 0 && <br />}
                        {line.split(/(\*\*.*?\*\*)/g).map((part, partIndex) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                                return (
                                    <strong key={partIndex} style={{ color }}>
                                        {part.slice(2, -2)}
                                    </strong>
                                );
                            }
                            return <span key={partIndex} style={{ color }}>{part}</span>;
                        })}
                    </React.Fragment>
                ))}
            </p>
        );
    });
};

const ProjectVideos: React.FC<ProjectVideosProps> = ({ videoBig, videos, colors }) => {
  const hasBigVideo = !!videoBig && videoBig.trim() !== "";
  const hasVideos = !!videos && videos.length > 0;

  if (!hasBigVideo && !hasVideos) return null;

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
      { threshold: 0.5 }
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

  const isValidVideo = (video: any): video is { url: string; caption?: string } => {
    return video && typeof video === 'object' && 'url' in video;
  };

  return (
    <div className="pt-8 space-y-8">
      {hasBigVideo && (
        <div>
          <h3
            className="mb-8 text-2xl font-semibold font-press-start text-center"
            style={{ color: colors.boomforceScreenshotsTitleColor }}
          >
            VIDEO
          </h3>
          <div className="flex justify-center">
            <div
              className="aspect-video w-full max-w-4xl rounded-xl overflow-hidden border-2"
              style={{ borderColor: colors.boomforceScreenshotsBorder, backgroundColor: colors.boomforceScreenshotsBackground }}
            >
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
          <h3
            className="mb-8 text-2xl font-semibold font-press-start text-center"
            style={{ color: colors.boomforceScreenshotsTitleColor }}
          >
            DETAILS
          </h3>
          <div className="space-y-8 md:space-y-10">
            {videos!.filter(isValidVideo).map((video, index) => (
              <div
                key={index}
                className={`relative flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-4 md:gap-8 p-4 rounded-lg group`}
                style={{ backgroundColor: 'rgba(72, 51, 95, 0.25)' }}
              >
                {/* Connecting line */}
                <div
                  className="hidden md:block absolute top-1/2 left-1/2 w-12 h-0.5 -translate-x-1/2 -translate-y-1/2 z-0"
                  style={{ backgroundColor: colors.boomforceScreenshotsBorder }}
                ></div>
            
                {/* Video container - 4:3 aspect ratio */}
                <div className="w-full md:w-1/2 p-2 relative z-10">
                  <div
                    className="rounded-lg overflow-hidden h-full transition-all duration-300 group-hover:shadow-lg"
                    style={{
                      border: `1px solid ${colors.boomforceScreenshotsBorder}`,
                      backgroundColor: colors.boomforceScreenshotsBackground,
                      aspectRatio: '4/3',
                    }}
                  >
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
                    <div
                      className="w-full p-6 rounded-lg h-full flex items-center transition-all duration-300 group-hover:shadow-lg"
                      style={{
                        backgroundColor: colors.boomforceScreenshotsBackground,
                        border: `1px solid ${colors.boomforceScreenshotsBorder}`,
                        boxShadow:
                          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      }}
                    >
                      <div className="w-full text-sm md:text-base">
                        {renderMarkdownText(video.caption, colors.boomforceProjectDescriptionText) ||
                          video.caption}
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
