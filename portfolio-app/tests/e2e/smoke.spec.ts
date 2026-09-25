import { expect, test, type Page } from "@playwright/test";
import { de } from "../../src/i18n/de";
import { PAGES, openAndCollectErrors } from "./pages";

const DETAIL_PAGE = "/projects/ml-agent-bachelor";
// A project with screenshots, for the gallery and its lightbox.
const GALLERY_PAGE = "/projects/kryptodash";
// The longest project title across the German and English data files, and a demo page;
// both set their title in Rubik Mono One (issue #62).
const LONGEST_TITLE_PAGE = "/projects/acms";
const DEMO_PAGE = "/projects/prop-hunt/demo";
// A project with a main video and a list of detail videos.
const VIDEO_PAGE = "/projects/broforce-clone";
// The narrowest phone viewport in common use.
const NARROW_VIEWPORT = { width: 320, height: 568 };

// Headings and paragraphs that stick out of the viewport, or whose text is wider than
// their own box.
async function clippedText(page: Page) {
  return page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const found: string[] = [];
    for (const element of document.querySelectorAll<HTMLElement>("h1, h2, h3, p")) {
      const box = element.getBoundingClientRect();
      const inside = box.left >= 0 && box.right <= width;
      const fits = element.scrollWidth <= element.clientWidth;
      if (box.width === 0 || (inside && fits)) continue;
      const text = element.textContent?.trim().replace(/\s+/g, " ").slice(0, 40);
      found.push(
        `${element.tagName.toLowerCase()} "${text}" ${Math.round(box.left)}..${Math.round(box.right)}` +
          ` scrollWidth ${element.scrollWidth} clientWidth ${element.clientWidth}`,
      );
    }
    return found;
  });
}

for (const path of PAGES) {
  test.describe(path, () => {
    test("loads with status 200 and without console errors", async ({ page }) => {
      const { status, errors } = await openAndCollectErrors(page, path);
      expect(status).toBe(200);
      expect(errors, errors.join("\n")).toEqual([]);
    });

    test("tells search engines not to index it", async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        "content",
        /^noindex, nofollow/,
      );
    });

    test("has no horizontal overflow", async ({ page }) => {
      await page.goto(path);
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(
        scrollWidth,
        `scrollWidth ${scrollWidth} > clientWidth ${clientWidth}`,
      ).toBeLessThanOrEqual(clientWidth);
    });

    // The page wrappers use overflow-x: hidden, so text that is too wide gets clipped instead of
    // widening the document. This test catches that case.
    test("has no heading or paragraph wider than the viewport", async ({ page }, testInfo) => {
      await page.goto(path);
      const clipped = await clippedText(page);
      expect(clipped, `elements outside the viewport:\n${clipped.join("\n")}`).toEqual([]);

      // The project title is the widest text on a narrow phone (issue #62).
      if (testInfo.project.name !== "mobile" || path !== DETAIL_PAGE) return;
      await page.setViewportSize(NARROW_VIEWPORT);
      const clippedNarrow = await clippedText(page);
      expect(
        clippedNarrow,
        `elements outside the 320 px viewport:\n${clippedNarrow.join("\n")}`,
      ).toEqual([]);
    });
  });
}

// Project titles are set in a wide display font; the longest one and a demo title have to
// wrap inside the viewport instead of being clipped (issue #62).
test.describe("long project titles", () => {
  for (const path of [LONGEST_TITLE_PAGE, DEMO_PAGE]) {
    test(`${path} keeps its headings inside the viewport`, async ({ page }, testInfo) => {
      await page.goto(path);
      const clipped = await clippedText(page);
      expect(clipped, `elements outside the viewport:\n${clipped.join("\n")}`).toEqual([]);

      if (testInfo.project.name !== "mobile") return;
      await page.setViewportSize(NARROW_VIEWPORT);
      const clippedNarrow = await clippedText(page);
      expect(
        clippedNarrow,
        `elements outside the 320 px viewport:\n${clippedNarrow.join("\n")}`,
      ).toEqual([]);
    });
  }
});

// The detail page is composed for a phone first (issue #85): the action buttons stack at
// full width, the screenshots stand in one column, and the lightbox is a native dialog.
test.describe("project detail page", () => {
  test("stacks its action buttons at full width and 44 px on a phone", async ({
    page,
  }, testInfo) => {
    if (testInfo.project.name !== "mobile") return;
    await page.goto(DETAIL_PAGE);
    const buttons = page.getByRole("button", {
      name: new RegExp(`${de.projectDetail.downloadDemo}|${de.projectDetail.viewCode}`),
    });
    await expect(buttons).toHaveCount(2);
    const boxes = await buttons.evaluateAll((elements) =>
      elements.map((element) => {
        const box = element.getBoundingClientRect();
        const container = element.parentElement!.getBoundingClientRect();
        return {
          label: element.textContent?.trim(),
          height: box.height,
          share: box.width / container.width,
        };
      }),
    );
    for (const { label, height, share } of boxes) {
      expect(height, `${label}: ${Math.round(height)} px high`).toBeGreaterThanOrEqual(44);
      expect(share, `${label}: ${Math.round(share * 100)} % of the row`).toBeGreaterThanOrEqual(
        0.9,
      );
    }
  });

  test("shows the screenshots in one column on a phone and three on a desktop", async ({
    page,
  }, testInfo) => {
    await page.goto(GALLERY_PAGE);
    const gallery = page.getByRole("region", { name: de.projectDetail.screenshots });
    const thumbnails = gallery.getByRole("button");
    await expect(thumbnails).toHaveCount(4);
    const lefts = await thumbnails.evaluateAll((elements) =>
      elements.map((element) => Math.round(element.getBoundingClientRect().left)),
    );
    const columns = new Set(lefts).size;
    expect(columns, `thumbnail lefts ${lefts.join(", ")}`).toBe(
      testInfo.project.name === "mobile" ? 1 : 3,
    );
  });

  test("opens a screenshot in a lightbox that Escape closes with focus back on the thumbnail", async ({
    page,
  }) => {
    await page.goto(GALLERY_PAGE);
    const gallery = page.getByRole("region", { name: de.projectDetail.screenshots });
    const thumbnail = gallery.getByRole("button").first();
    const caption = await thumbnail.locator("img").getAttribute("alt");
    const lightbox = page.getByRole("dialog", { name: caption! });
    // A click before hydration does nothing; retry until the lightbox shows up.
    await expect(async () => {
      await thumbnail.click();
      await expect(lightbox).toBeVisible({ timeout: 1_000 });
    }).toPass();
    await expect(lightbox.getByRole("img")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(lightbox).toBeHidden();
    await expect(thumbnail).toBeFocused();
  });
});

// Every image is a next/image (issue #79): either it fills a positioned box (fill) or it
// carries its width and height, so its space is reserved before the file has loaded.
test.describe("project detail images", () => {
  for (const path of [DETAIL_PAGE, GALLERY_PAGE]) {
    test(`${path} loads every image with reserved space`, async ({ page }) => {
      await page.goto(path);
      const images = page.locator("main img");
      const count = await images.count();
      expect(count).toBeGreaterThan(0);
      for (let index = 0; index < count; index++) {
        const image = images.nth(index);
        // Lazy images only load near the viewport.
        await image.scrollIntoViewIfNeeded();
        await expect
          .poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth))
          .toBeGreaterThan(0);
        const sizing = await image.evaluate((element: HTMLImageElement) => ({
          src: element.getAttribute("src"),
          fill: getComputedStyle(element).position === "absolute",
          width: element.getAttribute("width"),
          height: element.getAttribute("height"),
        }));
        expect(
          sizing.fill || (!!sizing.width && !!sizing.height),
          `${sizing.src} has neither fill nor width and height`,
        ).toBe(true);
      }
    });
  }

  test("loads the gallery thumbnails lazily", async ({ page }) => {
    await page.goto(GALLERY_PAGE);
    const gallery = page.getByRole("region", { name: de.projectDetail.screenshots });
    const loading = await gallery
      .locator("img")
      .evaluateAll((elements) => elements.map((element) => element.getAttribute("loading")));
    expect(loading).toHaveLength(4);
    expect(new Set(loading)).toEqual(new Set(["lazy"]));
  });
});

// Videos load nothing on open; a poster frame stands in until they play (issue #78).
test.describe("project videos", () => {
  for (const path of [DETAIL_PAGE, VIDEO_PAGE]) {
    test(`${path} loads no video data on open and shows a poster`, async ({ page, request }) => {
      await page.goto(path);
      const videos = page.locator("main video");
      await expect(videos.first()).toBeAttached();
      const attributes = await videos.evaluateAll((elements) =>
        elements.map((element) => ({
          src: element.getAttribute("src"),
          preload: element.getAttribute("preload"),
          poster: element.getAttribute("poster"),
        })),
      );
      for (const { src, preload, poster } of attributes) {
        expect(preload, `${src}`).toBe("none");
        expect(poster, `${src} has no poster`).toBeTruthy();
        const response = await request.get(poster!);
        expect(response.status(), poster!).toBe(200);
        expect(response.headers()["content-type"], poster!).toBe("image/jpeg");
      }
    });
  }

  // Without preloaded metadata Chromium ignores a click on the video surface; the component
  // starts playback itself.
  test("starts the main video with a click in its middle", async ({ page }) => {
    await page.goto(DETAIL_PAGE);
    const video = page.locator("main video").first();
    await video.scrollIntoViewIfNeeded();
    // A click before hydration does nothing; retry until playback has started.
    await expect(async () => {
      await video.click();
      await expect
        .poll(() => video.evaluate((element: HTMLVideoElement) => element.paused), {
          timeout: 1_000,
        })
        .toBe(false);
    }).toPass();
    await page.waitForTimeout(2_000);
    const currentTime = await video.evaluate((element: HTMLVideoElement) => element.currentTime);
    expect(currentTime).toBeGreaterThan(0);
  });
});

// The hero is as high as its card plus fixed spacing, not a full screen that grows and
// shrinks with the mobile browser bars (issue #68).
test.describe("hero section", () => {
  test("fits the viewport and keeps its card in the first screen", async ({ page }) => {
    await page.goto("/");
    const viewport = page.viewportSize();
    // #home > container > card
    const section = await page.locator("#home").boundingBox();
    const card = await page.locator("#home > div > div").first().boundingBox();
    expect(viewport).not.toBeNull();
    expect(section).not.toBeNull();
    expect(card).not.toBeNull();
    const height = viewport!.height;

    expect(section!.height).toBeLessThanOrEqual(height * 1.05);
    expect(card!.y).toBeGreaterThanOrEqual(0);
    expect(card!.y).toBeLessThan(height);
    // Space above and below the card, the scroll hint included.
    const empty = section!.height - card!.height;
    expect(empty, `${Math.round(empty)} px empty around the card`).toBeLessThanOrEqual(
      height * 0.25,
    );
  });
});

// The layout sets a title template: a page with its own title gets the brand appended,
// the home page keeps the default title.
test.describe("page titles", () => {
  test("differ between the home page and a project page", async ({ page }) => {
    await page.goto("/");
    const homeTitle = await page.title();
    await page.goto(DETAIL_PAGE);
    const detailTitle = await page.title();
    expect(homeTitle).not.toContain(" · leo.dev");
    expect(detailTitle).toMatch(/.+ · leo\.dev$/);
    expect(detailTitle).not.toBe(homeTitle);
  });
});

// The headers come from next.config.ts and are the same on every path, so one page is
// enough; CSP violations on the pages above surface as console errors.
test.describe("security headers", () => {
  test("are sent with the login page", async ({ request }) => {
    const response = await request.get("/login");
    expect(response.status()).toBe(200);
    const headers = response.headers();
    expect(headers["content-security-policy"]).toContain("default-src 'self'");
    expect(headers["strict-transport-security"]).toBeTruthy();
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("no-referrer");
    expect(headers["permissions-policy"]).toBeTruthy();
  });
});

// Images and videos under public/ are behind the password like every page (issue #76).
const MEDIA = ["/Bilder/Arcanoid/arcanoid.png", "/Videos/Big/Arcanoid.mp4"];

test.describe("media", () => {
  test("is served with a session", async ({ request }) => {
    for (const path of MEDIA) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(200);
    }
  });

  test("redirects to /login without a session", async ({ playwright, baseURL }) => {
    // A context created here inherits the project's storageState, so the session is
    // removed explicitly.
    const anonymous = await playwright.request.newContext({
      baseURL,
      storageState: { cookies: [], origins: [] },
    });
    try {
      for (const path of MEDIA) {
        const response = await anonymous.get(path, { maxRedirects: 0 });
        expect([302, 303, 307], path).toContain(response.status());
        expect(new URL(response.headers()["location"], response.url()).pathname, path).toBe(
          "/login",
        );
      }
    } finally {
      await anonymous.dispose();
    }
  });
});
