const { test, expect } = require("@playwright/test");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const auditDir = path.join(os.tmpdir(), "benghazi-hero-arrival-audit");

async function captureArrival(page, viewport, name) {
  fs.mkdirSync(auditDir, { recursive: true });
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => message.type() === "error" && errors.push(`console: ${message.text()}`));
  await page.setViewportSize(viewport);
  await page.goto("http://127.0.0.1:4173", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.body.dataset.state === "intro", null, { timeout: 12000 });
  const readings = [];
  const capture = async (at) => {
    readings.push(await page.evaluate((t) => {
      const poster = document.querySelector("#hero-image");
      const video = document.querySelector("#hero-video");
      const posterBox = poster.getBoundingClientRect();
      const videoBox = video.getBoundingClientRect();
      const posterStyle = getComputedStyle(poster);
      const videoStyle = getComputedStyle(video);
      const mediaStyle = getComputedStyle(document.querySelector(".hero-media"));
      const mediaMatrix = mediaStyle.transform === "none" ? null : new DOMMatrixReadOnly(mediaStyle.transform);
      return {
        t,
        state: document.body.dataset.state,
        intro: { time: Intro.tl?.time(), duration: Intro.tl?.duration(), paused: Intro.tl?.paused() },
        filmState: document.body.dataset.film || "playing",
        heroTransform: mediaStyle.transform,
        heroScale: mediaMatrix ? Math.hypot(mediaMatrix.a, mediaMatrix.b) : 1,
        mediaFilter: mediaStyle.filter,
        filmTransform: getComputedStyle(document.querySelector(".hero-film")).transform,
        clouds: [...document.querySelectorAll(".cloud")].map((el) => Number(getComputedStyle(el).opacity)),
        cloudLayers: [...document.querySelectorAll(".cloud")].map((el) => {
          const style = getComputedStyle(el);
          return { display: style.display, opacity: Number(style.opacity), backgroundImage: style.backgroundImage };
        }),
        mist: [...document.querySelectorAll(".hero-mist")].map((el) => Number(getComputedStyle(el).opacity)),
        hud: Number(getComputedStyle(document.querySelector(".hud")).opacity),
        titleLine: getComputedStyle(document.querySelector(".hero-type__title .line > span")).transform,
        video: {
          opacity: Number(videoStyle.opacity),
          currentTime: video.currentTime,
          duration: video.duration,
          readyState: video.readyState,
          paused: video.paused,
          width: video.videoWidth,
          height: video.videoHeight,
          filter: videoStyle.filter,
          objectFit: videoStyle.objectFit,
          objectPosition: videoStyle.objectPosition
        },
        poster: {
          width: poster.naturalWidth,
          height: poster.naturalHeight,
          filter: posterStyle.filter,
          objectFit: posterStyle.objectFit,
          objectPosition: posterStyle.objectPosition
        },
        alignment: {
          x: Math.abs(posterBox.x - videoBox.x),
          y: Math.abs(posterBox.y - videoBox.y),
          width: Math.abs(posterBox.width - videoBox.width),
          height: Math.abs(posterBox.height - videoBox.height)
        }
      };
    }, at));
    await page.screenshot({
      path: path.join(auditDir, `${name}-${String(at).replace(".", "-")}.jpg`),
      type: "jpeg",
      quality: 86
    });
  };

  for (const at of [0, 1.1, 2.35, 3.5, 4.35]) {
    if (at > 0) {
      await page.waitForFunction(
        (target) => document.body.dataset.state === "ready" || Intro.tl.time() >= target,
        at,
        { timeout: 10000 }
      );
    }
    await capture(at);
  }

  await page.waitForFunction(() => document.body.dataset.state === "ready", null, { timeout: 10000 });
  await capture("ready");
  await page.waitForFunction(() => {
    const video = document.querySelector("#hero-video");
    return video.ended || (video.duration && video.currentTime >= video.duration - 0.35);
  }, null, { timeout: 15000 });
  await capture("near-end");
  await page.waitForFunction(() => document.body.dataset.film === "ended", null, { timeout: 5000 });
  await page.waitForTimeout(500);
  await capture("ambient");
  return { readings, errors };
}

function expectSeamlessMedia(result) {
  const handoff = result.readings[4];
  expect(handoff.video.readyState).toBeGreaterThanOrEqual(2);
  expect(handoff.video.currentTime).toBeGreaterThan(0.25);
  expect(handoff.video.opacity).toBeGreaterThan(0.25);
  expect(handoff.video.objectFit).toBe(handoff.poster.objectFit);
  expect(handoff.video.objectPosition).toBe(handoff.poster.objectPosition);
  expect(handoff.video.filter).toBe("none");
  expect(handoff.poster.filter).toBe("none");
  expect(handoff.mediaFilter).toBe("none");
  expect(handoff.heroScale).toBeCloseTo(1, 4);
  expect(handoff.heroTransform).toBe("none");
  expect(handoff.video.width).toBe(1280);
  expect(handoff.video.height).toBe(720);
  expect(handoff.poster.width).toBe(1280);
  expect(handoff.poster.height).toBe(720);
  expect(Math.max(...Object.values(handoff.alignment))).toBeLessThan(0.5);
}

function expectCompletedArrival(result) {
  expect(result.readings[5].state).toBe("ready");
  expect(result.readings[5].hud).toBeGreaterThan(0.95);
  expect(result.readings[7].filmState).toBe("ended");
  expect(result.readings[7].mist.some((value) => value > 0.04)).toBeTruthy();
  expect(result.readings[0].intro.duration).toBeLessThan(5.2);
  expect(result.errors).toEqual([]);
}

for (const [name, viewport] of [
  ["desktop", { width: 1920, height: 1080 }],
  ["laptop", { width: 1440, height: 900 }],
  ["mobile", { width: 390, height: 844 }]
]) {
  test(`${name} arrival preserves the cinematic handoff`, async ({ page }) => {
    test.setTimeout(45000);
    const result = await captureArrival(page, viewport, name);
    const visibleAtmosphere = result.readings[0].cloudLayers.filter((layer) => layer.display !== "none" && layer.opacity > 0.15);
    expect(visibleAtmosphere.length).toBe(name === "mobile" ? 1 : 2);
    expect(visibleAtmosphere.every((layer) => !layer.backgroundImage.includes("url("))).toBeTruthy();
    expect(result.readings[0].heroScale).toBeGreaterThan(1);
    expect(result.readings[0].heroScale).toBeLessThanOrEqual(1.04);
    expect(result.readings[1].heroTransform).not.toEqual(result.readings[0].heroTransform);
    expect(result.readings[4].clouds.every((value) => value < 0.1)).toBeTruthy();
    expectSeamlessMedia(result);
    expectCompletedArrival(result);
    if (name === "desktop") {
      await page.locator("#hud-cue").click();
      await page.waitForTimeout(2200);
      await expect(page.locator("#hud-progress-label")).toContainText("GROUND TO SKY");
    }
  });
}

test("reduced motion uses the short dissolve", async ({ page }) => {
  test.setTimeout(15000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  const started = Date.now();
  await page.goto("http://127.0.0.1:4173", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.body.dataset.state === "ready", null, { timeout: 8000 });
  expect(Date.now() - started).toBeLessThan(4000);
  await expect(page.locator("#hero-image")).toBeVisible();
  await expect(page.locator(".hud")).toBeVisible();
});
