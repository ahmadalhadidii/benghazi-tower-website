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
        haze: document.querySelector("#haze") ? Number(getComputedStyle(document.querySelector("#haze")).opacity) : 0,
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
          objectPosition: videoStyle.objectPosition,
          muted: video.muted
        },
        audio: (() => {
          const ambient = document.querySelector("#ambient-audio");
          const sound = document.querySelector("#hero-sound");
          return {
            state: document.body.dataset.audio,
            paused: ambient.paused,
            muted: ambient.muted,
            loop: ambient.loop,
            currentTime: ambient.currentTime,
            duration: ambient.duration,
            buttonHidden: sound.hidden,
            buttonPressed: sound.getAttribute("aria-pressed")
          };
        })(),
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

  for (const at of [0, 3, 6, 8.7, 9.6, 11.2]) {
    if (at > 0) {
      await page.waitForFunction(
        (target) => document.body.dataset.state === "ready" || Intro.tl.time() >= target,
        at,
        { timeout: 20000 }
      );
    }
    await capture(at);
  }

  await page.waitForFunction(() => document.body.dataset.state === "ready", null, { timeout: 18000 });
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
  const overlap = result.readings.find((reading) =>
    reading.state === "intro" &&
    reading.video.currentTime > 0.15 &&
    (reading.clouds.some((value) => value > 0.02) || reading.haze > 0.02)
  );
  const handoff = result.readings.find((reading) => reading.state === "ready");
  expect(overlap).toBeTruthy();
  expect(overlap.video.opacity).toBeGreaterThan(0.05);
  expect(handoff).toBeTruthy();
  expect(handoff.video.readyState).toBeGreaterThanOrEqual(2);
  expect(handoff.video.currentTime).toBeGreaterThan(0.25);
  expect(handoff.video.opacity).toBeGreaterThan(0.25);
  expect(handoff.video.objectFit).toBe(handoff.poster.objectFit);
  expect(handoff.video.objectPosition).toBe(handoff.poster.objectPosition);
  expect(handoff.video.filter).toBe("none");
  expect(handoff.poster.filter).toBe("none");
  expect(handoff.mediaFilter).toBe("none");
  expect(handoff.heroScale).toBeGreaterThanOrEqual(1);
  expect(handoff.heroScale).toBeLessThanOrEqual(1.013);
  expect(handoff.video.width).toBe(1280);
  expect(handoff.video.height).toBe(720);
  expect(handoff.poster.width).toBe(1280);
  expect(handoff.poster.height).toBe(720);
  expect(handoff.video.muted).toBeTruthy();
  expect(Math.max(...Object.values(handoff.alignment))).toBeLessThan(0.5);
}

function expectCompletedArrival(result) {
  expect(result.readings[6].state).toBe("ready");
  expect(result.readings[6].hud).toBeGreaterThan(0.95);
  expect(result.readings[8].filmState).toBe("ended");
  expect(result.readings[8].mist.some((value) => value > 0.04)).toBeTruthy();
  expect(result.readings[0].intro.duration).toBeGreaterThan(11.5);
  expect(result.readings[0].intro.duration).toBeLessThan(14.2);
  expect(result.readings[0].audio.loop).toBeTruthy();
  expect(result.readings[0].audio.buttonHidden).toBeFalsy();
  expect(result.errors).toEqual([]);
}

for (const [name, viewport] of [
  ["desktop", { width: 1920, height: 1080 }],
  ["laptop", { width: 1440, height: 900 }],
  ["mobile", { width: 390, height: 844 }]
]) {
  test(`${name} arrival preserves the cinematic handoff`, async ({ page }) => {
    test.setTimeout(60000);
    const result = await captureArrival(page, viewport, name);
    const visibleAtmosphere = result.readings[0].cloudLayers.filter((layer) => layer.display !== "none" && layer.opacity > 0.15);
    expect(visibleAtmosphere.length).toBe(name === "mobile" ? 2 : 3);
    expect(visibleAtmosphere.every((layer) => layer.backgroundImage.includes("benghazi-tower-arrival-poster.webp"))).toBeTruthy();
    expect(result.readings[0].heroScale).toBeGreaterThan(1);
    expect(result.readings[0].heroScale).toBeLessThanOrEqual(1.04);
    expect(result.readings[1].heroTransform).not.toEqual(result.readings[0].heroTransform);
    expect(result.readings[4].video.currentTime).toBeGreaterThan(0.2);
    expect(result.readings[4].hud).toBeLessThan(0.1);
    expect(result.readings[6].clouds.every((value) => value < 0.1)).toBeTruthy();
    expectSeamlessMedia(result);
    expectCompletedArrival(result);
    if (name === "desktop") {
      await page.locator("#hud-cue").click();
      await page.waitForTimeout(2200);
      await expect(page.locator("#hud-progress-label")).toContainText("GROUND TO SKY");
    }
  });
}

test("master arrival stays active for the full cinematic journey", async ({ page }) => {
  test.setTimeout(30000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("http://127.0.0.1:4173", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.body.dataset.state === "intro" && Intro.tl?.isActive(), null, { timeout: 12000 });

  const timelineDuration = await page.evaluate(() => Intro.tl.duration());
  expect(timelineDuration).toBeGreaterThan(12.8);
  expect(timelineDuration).toBeLessThan(14.2);

  await page.mouse.wheel(0, 900);
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(3200);
  const afterInput = await page.evaluate(() => ({ state: document.body.dataset.state, active: Intro.tl.isActive(), time: Intro.tl.time() }));
  expect(afterInput.state).toBe("intro");
  expect(afterInput.active).toBeTruthy();
  expect(afterInput.time).toBeLessThan(6);

  await page.waitForFunction(() => document.body.dataset.state === "ready", null, { timeout: 16000 });
  const elapsed = await page.evaluate(() => {
    const start = performance.getEntriesByName("benghazi-intro-start").at(-1)?.startTime;
    const end = performance.getEntriesByName("benghazi-interactive").at(-1)?.startTime;
    return end - start;
  });
  expect(elapsed).toBeGreaterThan(12500);
  expect(elapsed).toBeLessThan(15000);
});

test("reduced motion uses the short dissolve", async ({ page }) => {
  test.setTimeout(15000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  const started = Date.now();
  await page.goto("http://127.0.0.1:4173", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.body.dataset.state === "ready", null, { timeout: 8000 });
  expect(Date.now() - started).toBeLessThan(5000);
  await expect(page.locator("#hero-image")).toBeVisible();
  await expect(page.locator(".hud")).toBeVisible();
});

for (const [name, viewport] of [
  ["desktop", { width: 1440, height: 900 }],
  ["mobile", { width: 390, height: 844 }]
]) {
  test(`${name} ambience persists through sound, scene and menu changes`, async ({ page }) => {
    test.setTimeout(30000);
    const errors = [];
    page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
    page.on("console", (message) => message.type() === "error" && errors.push(`console: ${message.text()}`));
    await page.setViewportSize(viewport);
    await page.goto("http://127.0.0.1:4173", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => document.body.dataset.state === "intro", null, { timeout: 12000 });
    await page.waitForFunction(() => Intro.tl && Intro.tl.isActive(), null, { timeout: 3000 });
    await page.evaluate(() => Intro.skip());
    await page.waitForFunction(() => document.body.dataset.state === "ready", null, { timeout: 6000 });

    await page.locator("#hero-sound").click();
    await page.waitForFunction(() => document.body.dataset.audio === "on", null, { timeout: 4000 });
    await page.waitForTimeout(2000);
    const started = await page.evaluate(() => ({
      time: document.querySelector("#ambient-audio").currentTime,
      gain: AmbientSound.gain?.gain.value ?? document.querySelector("#ambient-audio").volume,
      heroMuted: document.querySelector("#hero-video").muted
    }));
    expect(started.heroMuted).toBeTruthy();
    expect(started.gain).toBeGreaterThan(0.15);

    await page.locator("#hud-cue").click();
    await page.waitForFunction(() => SceneNavigation.currentScene === 1, null, { timeout: 6000 });
    const afterScene = await page.evaluate(() => document.querySelector("#ambient-audio").currentTime);
    expect(afterScene).toBeGreaterThan(started.time + 0.8);

    await page.locator("#menu-trigger").click();
    await page.waitForTimeout(1000);
    const menuGain = await page.evaluate(() => AmbientSound.gain?.gain.value ?? document.querySelector("#ambient-audio").volume);
    expect(menuGain).toBeLessThan(0.23);
    await page.locator('[data-scene-target="0"]').click();
    await page.waitForFunction(() => SceneNavigation.currentScene === 0, null, { timeout: 6000 });
    const afterReturn = await page.evaluate(() => document.querySelector("#ambient-audio").currentTime);
    expect(afterReturn).toBeGreaterThan(afterScene);

    await page.evaluate(async () => {
      if (AmbientSound.context) await AmbientSound.context.suspend();
      AmbientSound.recoverFromBrowserInterruption();
    });
    await page.waitForFunction(() => !AmbientSound.context || AmbientSound.context.state === "running", null, { timeout: 3000 });
    await page.waitForTimeout(700);
    const afterRecovery = await page.evaluate(() => ({
      paused: document.querySelector("#ambient-audio").paused,
      time: document.querySelector("#ambient-audio").currentTime
    }));
    expect(afterRecovery.paused).toBeFalsy();
    expect(afterRecovery.time).toBeGreaterThan(afterReturn + 0.4);

    await page.locator("#hero-sound").click();
    await page.waitForTimeout(1150);
    const muted = await page.evaluate(() => ({
      state: document.body.dataset.audio,
      gain: AmbientSound.gain?.gain.value ?? document.querySelector("#ambient-audio").volume,
      paused: document.querySelector("#ambient-audio").paused,
      time: document.querySelector("#ambient-audio").currentTime
    }));
    expect(muted.state).toBe("muted");
    expect(muted.gain).toBeLessThan(0.03);
    expect(muted.paused).toBeFalsy();
    expect(muted.time).toBeGreaterThan(afterReturn);
    expect(errors).toEqual([]);
  });
}

test("one long soundtrack survives the film and sixty seconds of exploration", async ({ page }) => {
  test.setTimeout(100000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => message.type() === "error" && errors.push(`console: ${message.text()}`));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("http://127.0.0.1:4173", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.body.dataset.state === "intro" && Intro.tl?.isActive(), null, { timeout: 12000 });
  await page.evaluate(() => Intro.skip());
  await page.waitForFunction(() => document.body.dataset.state === "ready", null, { timeout: 6000 });

  await page.locator("#hero-sound").click();
  await page.waitForFunction(() => document.body.dataset.audio === "on", null, { timeout: 4000 });
  await page.evaluate(() => { window.__ambientIdentity = document.querySelector("#ambient-audio"); });
  await page.waitForFunction(() => document.body.dataset.film === "ended", null, { timeout: 12000 });
  const atFilmEnd = await page.evaluate(() => ({
    time: window.__ambientIdentity.currentTime,
    paused: window.__ambientIdentity.paused,
    instances: document.querySelectorAll("#ambient-audio").length,
    duration: window.__ambientIdentity.duration
  }));
  expect(atFilmEnd.paused).toBeFalsy();
  expect(atFilmEnd.instances).toBe(1);
  expect(atFilmEnd.duration).toBeGreaterThan(120);
  expect(atFilmEnd.duration).toBeLessThan(300);

  for (const target of [1, 3, 5, 7, 4, 2]) {
    await page.evaluate((scene) => SceneNavigation.goToScene(scene), target);
    await page.waitForFunction((scene) => SceneNavigation.currentScene === scene, target, { timeout: 6000 });
    await page.waitForTimeout(9200);
  }
  await page.locator("#menu-trigger").click();
  await page.waitForTimeout(1300);
  await page.locator("#menu-close").click();
  await page.waitForTimeout(4200);
  await page.evaluate(() => SceneNavigation.goToScene(0));
  await page.waitForFunction(() => SceneNavigation.currentScene === 0, null, { timeout: 6000 });

  const afterExploration = await page.evaluate(() => ({
    sameInstance: window.__ambientIdentity === document.querySelector("#ambient-audio"),
    time: window.__ambientIdentity.currentTime,
    paused: window.__ambientIdentity.paused,
    state: document.body.dataset.audio
  }));
  expect(afterExploration.sameInstance).toBeTruthy();
  expect(afterExploration.paused).toBeFalsy();
  expect(afterExploration.state).toBe("on");
  expect(afterExploration.time - atFilmEnd.time).toBeGreaterThan(60);
  expect(errors).toEqual([]);
});

test("ambient loop boundary keeps the same live audio instance", async ({ page }) => {
  test.setTimeout(30000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://127.0.0.1:4173", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.body.dataset.state === "intro" && Intro.tl?.isActive(), null, { timeout: 12000 });
  await page.evaluate(() => Intro.skip());
  await page.waitForFunction(() => document.body.dataset.state === "ready", null, { timeout: 6000 });
  await page.locator("#hero-sound").click();
  await page.waitForFunction(() => document.body.dataset.audio === "on", null, { timeout: 4000 });
  const duration = await page.evaluate(() => {
    const audio = document.querySelector("#ambient-audio");
    window.__loopIdentity = audio;
    audio.currentTime = audio.duration - 1.5;
    return audio.duration;
  });
  expect(duration).toBeGreaterThan(120);
  await page.waitForTimeout(3500);
  const looped = await page.evaluate(() => ({
    sameInstance: window.__loopIdentity === document.querySelector("#ambient-audio"),
    paused: window.__loopIdentity.paused,
    time: window.__loopIdentity.currentTime,
    state: document.body.dataset.audio
  }));
  expect(looped.sameInstance).toBeTruthy();
  expect(looped.paused).toBeFalsy();
  expect(looped.time).toBeGreaterThan(0.5);
  expect(looped.time).toBeLessThan(6);
  expect(looped.state).toBe("on");
});
