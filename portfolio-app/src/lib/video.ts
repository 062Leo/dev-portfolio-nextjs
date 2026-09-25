// Every video under public/ has a poster frame next to it: same name, .jpg instead of .mp4
// (issue #78). The browser shows it until the video plays, so it only has to load metadata.
export function posterFor(videoUrl: string): string {
  return videoUrl.replace(/\.mp4$/, ".jpg");
}
