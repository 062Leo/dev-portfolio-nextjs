import { expect, test, type Page } from "@playwright/test";

// The network background lights up the points around a focus point. A mobile browser
// fires resize whenever its address bar shows or hides; such a height-only resize must
// keep the network and its focus point instead of rebuilding it around the centre.

// Where the lit part of the canvas lies: the alpha-weighted centroid of its pixels, in
// CSS pixels.
function litCentroid(page: Page) {
  return page.evaluate(() => {
    const canvas = document.querySelector<HTMLCanvasElement>(".network-backdrop canvas")!;
    const { data, width, height } = canvas
      .getContext("2d")!
      .getImageData(0, 0, canvas.width, canvas.height);
    let sum = 0;
    let sumX = 0;
    let sumY = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const alpha = data[(y * width + x) * 4 + 3];
        sum += alpha;
        sumX += alpha * x;
        sumY += alpha * y;
      }
    }
    const scale = canvas.width / canvas.getBoundingClientRect().width;
    return { x: sumX / sum / scale, y: sumY / sum / scale, lit: sum > 0 };
  });
}

const distance = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);

test("keeps its focus point when only the viewport height changes (mobile only)", async ({
  page,
}, testInfo) => {
  if (testInfo.project.name !== "mobile") return;
  await page.goto("/");
  const viewport = page.viewportSize()!;

  // A tap pulls the focus point to the finger; from there it wanders off slowly (an eased
  // segment of three to six seconds), so it is still close by a second later.
  await expect(async () => {
    await page.touchscreen.tap(20, 150);
    const centroid = await litCentroid(page);
    expect(centroid.lit).toBe(true);
    expect(centroid.x).toBeLessThan(viewport.width / 2 - 40);
  }).toPass();
  const before = await litCentroid(page);

  const shorter = { width: viewport.width, height: viewport.height - 110 };
  await page.setViewportSize(shorter);
  // The debounced resize has been applied once the canvas backing store has the new height.
  await expect
    .poll(() =>
      page.evaluate(() => {
        const canvas = document.querySelector<HTMLCanvasElement>(".network-backdrop canvas")!;
        return Math.round(canvas.height / window.devicePixelRatio);
      }),
    )
    .toBe(shorter.height);
  const after = await litCentroid(page);
  const centre = { x: shorter.width / 2, y: shorter.height / 2 };

  const report = `before ${Math.round(before.x)},${Math.round(before.y)} after ${Math.round(after.x)},${Math.round(after.y)}`;
  expect(distance(after, before), report).toBeLessThan(60);
  expect(distance(after, centre), report).toBeGreaterThan(100);
});
