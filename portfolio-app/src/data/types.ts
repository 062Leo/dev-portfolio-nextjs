export type ProjectImage = {
  url: string;
  caption?: string;
};

export type ProjectStat = {
  icon:
    | "Clock"
    | "Star"
    | "Code"
    | "Zap"
    | "Users"
    | "Target"
    | "Award"
    | "Layers"
    | "DollarSign"
    | "Download"
    | "Eye"
    | "TrendingUp";
  label: string;
  value: string;
};

export type DemoControlsGroup = {
  title: string;
  items: string[];
};

export type Project = {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  longDescription?: string;
  image: string; // Kept for backward compatibility as the main image
  images?: ProjectImage[]; // New field for multiple images with captions
  videos?: ProjectImage[];
  tags: string[];
  demoLink?: string;
  demoImage?: string;
  demoDownload?: string;
  githubUrl?: string;
  videoBig?: string;
  youtubeLink?: string;
  custom1Link?: string;
  custom1BTNText?: string;
  customLabel?: string;
  demotext: string;
  demoControls: string[] | DemoControlsGroup[];
  misctext: string;
  miscimage: string;
  miscTitle: string;
  features?: string[];
  techStack?: string[];
  detailComponent?: "" | "BoomForce" | "Old";
  stats?: ProjectStat[];
};
