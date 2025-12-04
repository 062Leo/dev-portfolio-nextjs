import React, { useRef, useState } from 'react';
import { Project, ProjectImage } from '@/data/portfolio-data';
import { Play } from 'lucide-react';

interface ProjectVideosProps {
  videos: ProjectImage[] | undefined;
  colors: {
    boomforceScreenshotsTitleColor: string;
    boomforceScreenshotsBorder: string;
    boomforceScreenshotsBackground: string;
    boomforceProjectDescriptionText: string;
  };
}

const ProjectVideos: React.FC<ProjectVideosProps> = ({ videos, colors }) => {
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const [playingStates, setPlayingStates] = useState<{ [key: number]: boolean }>({});
  const [showControls, setShowControls] = useState<{ [key: number]: boolean }>({});

  if (!videos || videos.length === 0) return null;
  
  // Type guard to ensure video has required properties
  const isValidVideo = (video: any): video is { url: string; caption?: string } => {
    return video && typeof video === 'object' && 'url' in video;
  };

  const handleVideoPlay = (index: number) => {
    setPlayingStates(prev => ({
      ...prev,
      [index]: true
    }));
  };

  const handleVideoPause = (index: number) => {
    setPlayingStates(prev => ({
      ...prev,
      [index]: false
    }));
  };
  
  const handleVideoClick = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const hoverY = event.clientY - bounds.top;
    const lowerThreshold = bounds.height * 0.25;
    const shouldShowControls = hoverY >= bounds.height - lowerThreshold;
    setShowControls(prev => ({
      ...prev,
      [index]: shouldShowControls
    }));
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const leavingFromBottom = event.clientY >= bounds.bottom - 5;
    setShowControls(prev => ({
      ...prev,
      [index]: leavingFromBottom ? prev[index] ?? false : false
    }));
  };

  return (
    <div className="pt-8">
      <h3 
        className="mb-8 text-2xl font-semibold font-press-start text-center" 
        style={{ color: colors.boomforceScreenshotsTitleColor }}
      >
        DETAILS
      </h3>
      <div className="space-y-12">
        {videos.filter(isValidVideo).map((video, index) => (
          <div 
            key={index} 
            className={`relative flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 group`}
          >
            {/* Connecting line */}
            <div 
              className="hidden md:block absolute top-1/2 left-1/2 w-12 h-0.5 -translate-x-1/2 -translate-y-1/2 z-0" 
              style={{ backgroundColor: colors.boomforceScreenshotsBorder }}
            ></div>
            
            {/* Video container - 4:3 aspect ratio */}
            <div className="w-full md:w-1/2 p-2 relative z-10 group/video">
              <div 
                className="rounded-lg overflow-hidden h-full relative cursor-pointer" 
                style={{ 
                  border: `1px solid ${colors.boomforceScreenshotsBorder}`, 
                  backgroundColor: colors.boomforceScreenshotsBackground,
                  aspectRatio: '4/3'
                }}
                onClick={() => handleVideoClick(index)}
                onMouseMove={event => handleMouseMove(event, index)}
                onMouseLeave={event => handleMouseLeave(event, index)}
              >
                <video
                  ref={el => { videoRefs.current[index] = el; }}
                  src={video.url}
                  controls={!!showControls[index]}
                  className="w-full h-full object-contain"
                  onPlay={() => handleVideoPlay(index)}
                  onPause={() => handleVideoPause(index)}
                />
                {!playingStates[index] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover/video:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center">
                      <Play className="w-8 h-8 text-gray-800 ml-1" />
                    </div>
                  </div>
                )}
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
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' 
                  }}
                >
                  <div className="w-full">
                    <p 
                      className="text-sm md:text-base" 
                      style={{ color: colors.boomforceProjectDescriptionText }}
                    >
                      {video.caption}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectVideos;
