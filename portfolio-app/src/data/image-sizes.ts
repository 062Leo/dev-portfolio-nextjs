// Pixel dimensions of the images that are shown at their own aspect ratio (gallery
// lightbox, demo and illustration images). next/image needs them to reserve the space
// before the file has loaded. tests/unit/images.test.ts checks every entry against the
// file and that every such image in the project data has one.
type ImageSize = { width: number; height: number };

export const IMAGE_SIZES: Record<string, ImageSize> = {
  "/Bilder/BoomForce/demo.png": { width: 1391, height: 428 },
  "/Bilder/HideAndHunt/demo.png": { width: 1748, height: 543 },
  "/Bilder/HideAndHunt/Map.png": { width: 735, height: 719 },
  "/Bilder/KryptoDash/fakeWallet.png": { width: 1530, height: 755 },
  "/Bilder/KryptoDash/fakeWalletSettings.png": { width: 602, height: 621 },
  "/Bilder/KryptoDash/quiz.png": { width: 1219, height: 651 },
  "/Bilder/KryptoDash/wallet.png": { width: 416, height: 294 },
};

// 16:9 for an image without an entry; the unit test keeps that case from shipping.
const FALLBACK: ImageSize = { width: 1600, height: 900 };

export function imageSize(src: string): ImageSize {
  return IMAGE_SIZES[src] ?? FALLBACK;
}
