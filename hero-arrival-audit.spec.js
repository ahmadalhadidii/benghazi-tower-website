const { test, expect } = require("@playwright/test");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const auditDir = path.join(os.tmpdir(), "benghazi-hero-arrival-audit");

test("loop-safe production soundtrack matches the selected Pixabay master build", () => {
  const audioPath = path.join(__dirname, "assets", "audio", "benghazi-ambient.mp3");
  const hash = crypto.createHash("sha256").update(fs.readFileSync(audioPath)).digest("hex").toUpperCase();
  expect(hash).toBe("10E956ED41DBF155E9E566D0B72566FE17E8D70B7B5F7A05A54D54E09A75921A");
});

test("updated cinematic assets use one stable cache version", () => {
  const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  for (const asset of ["styles.css", "script.js", "benghazi-tower-arrival.mp4", "benghazi-ambient.mp3"]) {
    expect(html).toContain(`${asset}?v=20260809-cinematic5`);
  }
});

async function ensureSoundOn(page) {
  await page.waitForFunction(() => document.body.dataset.audio !== "starting", null, { timeout: 4000 });
  const state = await page.evaluate(() => document.body.dataset.audio);
  if (state !== "on") await page.mouse.click(18, 320);
  await page.waitForFunction(() => document.body.dataset.audio === "on", null, { timeout: 4000 });
}

async function captureArrival(page, viewport, name) {
  fs.mkdirSync(auditDir, { recursive: true });
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => message.type() === "error" && errors.push(`console: ${message.text()}`));
  await page.setViewportSize(viewport);
  await page.goto("http://127.0.0.1:4173", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.body.dataset.state === "intro", null, { timeout: 12000 });
  await page.waitForFunction(() => Intro.tl && Intro.tl.duration() > 0, null, { timeout: 3000 });
  await page.waitForFunction((expectedLayers) => {
    const visibleLayers = [...document.querySelectorAll(".cloud")].filter((element) => {
      const style = getComputedStyle(element);
      return style.display !== "none" && Number(style.opacity) > 0.15;
    });
    return visibleLayers.length === expectedLayers;
  }, 3, { timeout: 3000 });
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
        intro: {
          time: Intro.tl?.time(),
          duration: Intro.tl?.duration(),
          paused: Intro.tl?.paused(),
          elapsed: (() => {
            const start = performance.getEntriesByName("benghazi-intro-start").at(-1)?.startTime;
            const end = performance.getEntriesByName("benghazi-interactive").at(-1)?.startTime;
            return Number.isFinite(start) && Number.isFinite(end) ? end - start : null;
          })()
        },
        filmState: document.body.dataset.film || "playing",
        heroTransform: mediaStyle.transform,
        heroScale: mediaMatrix ? Math.hypot(mediaMatrix.a, mediaMatrix.b) : 1,
        mediaFilter: mediaStyle.filter,
        filmTransform: getComputedStyle(document.querySelector(".hero-film")).transform,
        clouds: [...document.querySelectorAll(".cloud")].map((el) => Number(getComputedStyle(el).opacity)),
        haze: document.querySelector("#haze") ? Number(getComputedStyle(document.querySelector("#haze")).opacity) : 0,
        cloudLayers: [...document.querySelectorAll(".cloud")].map((el) => {
          const style = getComputedStyle(el);
          const matrix = style.transform === "none" ? null : new DOMMatrixReadOnly(style.transform);
          return {
            display: style.display,
            opacity: Number(style.opacity),
            backgroundImage: style.backgroundImage,
            filter: style.filter,
            scale: matrix ? Math.hypot(matrix.a, matrix.b) : 1
          };
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
          muted: video.muted,
          volume: video.volume
        },
        audio: (() => {
          const ambient = document.querySelector("#ambient-audio");
          const sound = document.querySelector("#hero-sound");
          return {
            instances: document.querySelectorAll("audio").length,
            source: ambient.currentSrc,
            state: document.body.dataset.audio,
            paused: ambient.paused,
            muted: ambient.muted,
            loop: ambient.loop,
            currentTime: ambient.currentTime,
            timelineTime: AmbientSound.timelineTime(),
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

  for (const at of [0, 4, 8, 12, 13.5, 16, 18]) {
    if (at > 0) {
      await page.waitForFunction(
        (target) => document.body.dataset.state === "ready" || Intro.tl.time() >= target,
        at,
        { timeout: 20000 }
      );
    }
    await capture(at);
  }

  await page.waitForFunction(() => document.body.dataset.state === "ready", null, { timeout: 22000 });
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
    reading.video.opacity > 0.05 &&
    (reading.clouds.some((value) => value > 0.02) || reading.haze > 0.02)
  );
  const handoff = result.readings.find((reading) => reading.state === "ready");
  expect(overlap).toBeTruthy();
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
  expect(handoff.video.volume).toBe(0);
  expect(Math.max(...Object.values(handoff.alignment))).toBeLessThan(0.5);
}

function expectCompletedArrival(result) {
  const ready = result.readings.find((reading) => reading.t === "ready");
  const ambient = result.readings.find((reading) => reading.t === "ambient");
  expect(ready.state).toBe("ready");
  expect(ready.hud).toBeGreaterThan(0.95);
  expect(ready.intro.elapsed).toBeGreaterThan(18000);
  expect(ready.intro.elapsed).toBeLessThan(21000);
  expect(ambient.filmState).toBe("ended");
  expect(ambient.mist.some((value) => value > 0.04)).toBeTruthy();
  expect(result.readings[0].intro.duration).toBeGreaterThan(18);
  expect(result.readings[0].intro.duration).toBeLessThan(20);
  expect(result.readings[0].audio.loop).toBeTruthy();
  expect(result.readings[0].audio.instances).toBe(1);
  expect(result.readings[0].audio.source).toContain("assets/audio/benghazi-ambient.mp3");
  expect(result.readings[0].audio.buttonHidden).toBeFalsy();
  expect(result.errors).toEqual([]);
}

for (const [name, viewport] of [
  ["phone-390x844", { width: 390, height: 844 }],
  ["phone-430x932", { width: 430, height: 932 }],
  ["tablet-portrait-768x1024", { width: 768, height: 1024 }],
  ["tablet-landscape-1024x768", { width: 1024, height: 768 }],
  ["tablet-portrait-820x1180", { width: 820, height: 1180 }],
  ["tablet-landscape-1180x820", { width: 1180, height: 820 }],
  ["desktop-1366x768", { width: 1366, height: 768 }],
  ["desktop-1440x900", { width: 1440, height: 900 }],
  ["desktop-1536x864", { width: 1536, height: 864 }],
  ["desktop-1920x1080", { width: 1920, height: 1080 }]
]) {
  test(`${name} arrival preserves the cinematic handoff`, async ({ page }) => {
    test.setTimeout(70000);
    const result = await captureArrival(page, viewport, name);
    const visibleAtmosphere = result.readings[0].cloudLayers.filter((layer) => layer.display !== "none" && layer.opacity > 0.15);
    expect(visibleAtmosphere.length).toBe(3);
    expect(visibleAtmosphere.every((layer) => !layer.backgroundImage.includes("url("))).toBeTruthy();
    expect(visibleAtmosphere.every((layer) => layer.filter === "none")).toBeTruthy();
    expect(Math.max(...visibleAtmosphere.map((layer) => layer.scale))).toBeLessThanOrEqual(1.03);
    expect(result.readings[0].heroScale).toBeGreaterThan(1);
    expect(result.readings[0].heroScale).toBeLessThanOrEqual(1.06);
    expect(result.readings[1].heroTransform).not.toEqual(result.readings[0].heroTransform);
    expect(result.readings[1].audio.muted).toBeFalsy();
    expect(result.readings[1].audio.timelineTime).toBeGreaterThan(result.readings[0].audio.timelineTime + 3);
    expect(result.readings[4].video.currentTime).toBeGreaterThan(0.2);
    expect(result.readings[4].hud).toBeLessThan(0.1);
    expect(result.readings[6].clouds.every((value) => value < 0.1)).toBeTruthy();
    expectSeamlessMedia(result);
    expectCompletedArrival(result);
    if (name === "desktop-1366x768") {
      await page.locator("#hud-cue").click();
      await page.waitForTimeout(2200);
      await expect(page.locator("#hud-progress-label")).toContainText("GROUND TO SKY");
    }
  });
}

test("retina-like desktop keeps the atmosphere procedural through the film handoff", async ({ browser }) => {
  test.setTimeout(40000);
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.body.dataset.state === "intro" && Intro.tl?.isActive(), null, { timeout: 12000 });
  const firstFrame = await page.evaluate(() => ({
    dpr: window.devicePixelRatio,
    layers: [...document.querySelectorAll(".cloud")].map((element) => {
      const style = getComputedStyle(element);
      const matrix = new DOMMatrixReadOnly(style.transform);
      return {
        image: style.backgroundImage,
        filter: style.filter,
        scale: Math.hypot(matrix.a, matrix.b)
      };
    })
  }));
  expect(firstFrame.dpr).toBe(2);
  expect(firstFrame.layers).toHaveLength(3);
  expect(firstFrame.layers.every((layer) => !layer.image.includes("url(") && layer.filter === "none")).toBeTruthy();
  expect(Math.max(...firstFrame.layers.map((layer) => layer.scale))).toBeLessThanOrEqual(1.03);
  await page.waitForFunction(() => Intro.tl.time() >= 13.5, null, { timeout: 20000 });
  const handoff = await page.evaluate(() => {
    const video = document.querySelector("#hero-video");
    return { readyState: video.readyState, currentTime: video.currentTime, opacity: Number(getComputedStyle(video).opacity) };
  });
  expect(handoff.readyState).toBeGreaterThanOrEqual(2);
  expect(handoff.currentTime).toBeGreaterThan(0.2);
  expect(handoff.opacity).toBeGreaterThan(0.05);
  await context.close();
});

test("master arrival stays active for the full cinematic journey", async ({ page }) => {
  test.setTimeout(65000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("http://127.0.0.1:4173", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.body.dataset.state === "intro" && Intro.tl?.isActive(), null, { timeout: 12000 });

  const timelineDuration = await page.evaluate(() => Intro.tl.duration());
  expect(timelineDuration).toBeGreaterThan(18);
  expect(timelineDuration).toBeLessThan(20);

  await page.mouse.wheel(0, 900);
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(3200);
  const afterInput = await page.evaluate(() => ({ state: document.body.dataset.state, active: Intro.tl.isActive(), time: Intro.tl.time() }));
  expect(afterInput.state).toBe("intro");
  expect(afterInput.active).toBeTruthy();
  expect(afterInput.time).toBeLessThan(6);

  await page.waitForFunction(() => document.body.dataset.state === "ready", null, { timeout: 45000 });
  const elapsed = await page.evaluate(() => {
    const start = performance.getEntriesByName("benghazi-intro-start").at(-1)?.startTime;
    const end = performance.getEntriesByName("benghazi-interactive").at(-1)?.startTime;
    return end - start;
  });
  expect(elapsed).toBeGreaterThan(18000);
});

test("reduced motion preserves the full journey with restrained movement", async ({ page }) => {
  test.setTimeout(35000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("http://127.0.0.1:4173", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.body.dataset.state === "intro" && Intro.tl?.isActive(), null, { timeout: 12000 });
  const duration = await page.evaluate(() => Intro.tl.duration());
  expect(duration).toBeGreaterThan(18);
  expect(duration).toBeLessThan(20);
  await page.waitForFunction(() => document.body.dataset.state === "ready", null, { timeout: 22000 });
  await expect(page.locator("#hero-image")).toBeVisible();
  await expect(page.locator(".hud")).toBeVisible();
});

test("audible autoplay is attempted immediately with the global soundtrack", async ({ page }) => {
  await page.addInitScript(() => {
    window.__audioPlayAttempts = [];
    const nativePlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (...args) {
      if (this.tagName === "AUDIO") {
        window.__audioPlayAttempts.push({ muted: this.muted, volume: this.volume, source: this.currentSrc });
      }
      return nativePlay.apply(this, args);
    };
  });
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("http://127.0.0.1:4173", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.__audioPlayAttempts?.length > 0, null, { timeout: 5000 });
  const initial = await page.evaluate(() => ({
    attempt: window.__audioPlayAttempts[0],
    state: document.body.dataset.audio,
    instances: document.querySelectorAll("audio").length,
    filmMuted: document.querySelector("#hero-video").muted,
    filmVolume: document.querySelector("#hero-video").volume
  }));
  expect(initial.attempt.muted).toBeFalsy();
  expect(initial.attempt.volume).toBeGreaterThan(0.1);
  expect(initial.attempt.source).toContain("assets/audio/benghazi-ambient.mp3");
  expect(initial.instances).toBe(1);
  expect(initial.filmMuted).toBeTruthy();
  expect(initial.filmVolume).toBe(0);
  expect(["on", "starting", "blocked"]).toContain(initial.state);
  await ensureSoundOn(page);
});

test("blocked autoplay unlocks on the first normal touch anywhere", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.__allowAudioPlayback = false;
    window.__blockedAudioAttempts = [];
    window.addEventListener("pointerdown", () => { window.__allowAudioPlayback = true; }, { capture: true });
    window.addEventListener("touchstart", () => { window.__allowAudioPlayback = true; }, { capture: true });
    const nativePlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (...args) {
      if (this.tagName !== "AUDIO") return nativePlay.apply(this, args);
      window.__blockedAudioAttempts.push({ muted: this.muted, volume: this.volume, time: this.currentTime });
      if (!window.__allowAudioPlayback) return Promise.reject(new DOMException("Autoplay blocked", "NotAllowedError"));
      Object.defineProperty(this, "paused", { configurable: true, get: () => false });
      return Promise.resolve();
    };
  });
  await page.goto("http://127.0.0.1:4173", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.body.dataset.audio === "blocked", null, { timeout: 5000 });
  await page.waitForFunction(() => document.body.dataset.state === "intro" && Intro.tl?.time() > 2, null, { timeout: 12000 });
  const before = await page.evaluate(() => ({
    timeline: AmbientSound.timelineTime(),
    attempts: window.__blockedAudioAttempts.length,
    pressed: document.querySelector("#hero-sound").getAttribute("aria-pressed")
  }));
  expect(before.timeline).toBeGreaterThan(2);
  expect(before.attempts).toBe(1);
  expect(before.pressed).toBe("false");

  await page.touchscreen.tap(18, 320);
  await page.waitForFunction(() => document.body.dataset.audio === "on", null, { timeout: 4000 });
  await page.waitForTimeout(500);
  const after = await page.evaluate(() => ({
    time: document.querySelector("#ambient-audio").currentTime,
    paused: document.querySelector("#ambient-audio").paused,
    muted: document.querySelector("#ambient-audio").muted,
    instances: document.querySelectorAll("audio").length,
    attempts: window.__blockedAudioAttempts.length,
    pressed: document.querySelector("#hero-sound").getAttribute("aria-pressed")
  }));
  expect(after.time).toBeGreaterThan(before.timeline - 0.1);
  expect(after.time).toBeLessThan(before.timeline + 1.5);
  expect(after.paused).toBeFalsy();
  expect(after.muted).toBeFalsy();
  expect(after.instances).toBe(1);
  expect(after.attempts).toBe(2);
  expect(after.pressed).toBe("true");
  await context.close();
});

test("first touch supersedes an autoplay request that is still pending", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 430, height: 932 },
    hasTouch: true,
    isMobile: true
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.__pendingAudioAttempts = 0;
    window.__touchReachedPage = false;
    window.addEventListener("pointerdown", () => { window.__touchReachedPage = true; }, { capture: true });
    window.addEventListener("touchstart", () => { window.__touchReachedPage = true; }, { capture: true });
    const nativePlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (...args) {
      if (this.tagName !== "AUDIO") return nativePlay.apply(this, args);
      window.__pendingAudioAttempts += 1;
      if (!window.__touchReachedPage) return new Promise(() => {});
      Object.defineProperty(this, "paused", { configurable: true, get: () => false });
      return Promise.resolve();
    };
  });
  await page.goto("http://127.0.0.1:4173", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () => document.body.dataset.audio === "starting" && document.body.dataset.state === "intro" && Intro.tl?.time() > 2,
    null,
    { timeout: 12000 }
  );
  await page.touchscreen.tap(24, 360);
  await page.waitForFunction(() => document.body.dataset.audio === "on", null, { timeout: 4000 });
  const result = await page.evaluate(() => ({
    attempts: window.__pendingAudioAttempts,
    instances: document.querySelectorAll("audio").length,
    time: document.querySelector("#ambient-audio").currentTime,
    pressed: document.querySelector("#hero-sound").getAttribute("aria-pressed")
  }));
  expect(result.attempts).toBe(2);
  expect(result.instances).toBe(1);
  expect(result.time).toBeGreaterThan(1.8);
  expect(result.pressed).toBe("true");
  await context.close();
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
    await ensureSoundOn(page);
    await page.evaluate(() => Intro.skip());
    await page.waitForFunction(() => document.body.dataset.state === "ready", null, { timeout: 6000 });

    await page.waitForTimeout(2000);
    const started = await page.evaluate(() => ({
      time: document.querySelector("#ambient-audio").currentTime,
      gain: AmbientSound.gain?.gain.value ?? document.querySelector("#ambient-audio").volume,
      heroMuted: document.querySelector("#hero-video").muted,
      heroVolume: document.querySelector("#hero-video").volume
    }));
    expect(started.heroMuted).toBeTruthy();
    expect(started.heroVolume).toBe(0);
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

    await page.locator("#menu-trigger").click();
    await page.waitForTimeout(650);
    const remainsMuted = await page.evaluate(() => ({
      state: document.body.dataset.audio,
      gain: AmbientSound.gain?.gain.value ?? document.querySelector("#ambient-audio").volume,
      paused: document.querySelector("#ambient-audio").paused,
      time: document.querySelector("#ambient-audio").currentTime
    }));
    expect(remainsMuted.state).toBe("muted");
    expect(remainsMuted.gain).toBeLessThan(0.03);
    expect(remainsMuted.paused).toBeFalsy();
    expect(remainsMuted.time).toBeGreaterThan(muted.time + 0.4);
    expect(errors).toEqual([]);
  });
}

test("tablet rotation preserves the live intro, film and soundtrack timelines", async ({ page }) => {
  test.setTimeout(45000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => message.type() === "error" && errors.push(`console: ${message.text()}`));
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("http://127.0.0.1:4173", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.body.dataset.state === "intro" && Intro.tl?.time() > 4, null, { timeout: 14000 });
  await ensureSoundOn(page);
  const portrait = await page.evaluate(() => {
    window.__rotationAudio = document.querySelector("#ambient-audio");
    window.__rotationVideo = document.querySelector("#hero-video");
    return { intro: Intro.tl.time(), audio: window.__rotationAudio.currentTime };
  });

  await page.setViewportSize({ width: 1024, height: 768 });
  await page.waitForTimeout(700);
  const landscape = await page.evaluate(() => ({
    sameAudio: window.__rotationAudio === document.querySelector("#ambient-audio"),
    sameVideo: window.__rotationVideo === document.querySelector("#hero-video"),
    intro: Intro.tl.time(),
    audio: window.__rotationAudio.currentTime,
    video: window.__rotationVideo.currentTime,
    mode: Env.mode
  }));
  expect(landscape.sameAudio).toBeTruthy();
  expect(landscape.sameVideo).toBeTruthy();
  expect(landscape.intro).toBeGreaterThan(portrait.intro + 0.4);
  expect(landscape.audio).toBeGreaterThan(portrait.audio + 0.4);
  expect(landscape.mode).toBe("tabletLandscape");

  await page.waitForFunction(() => document.querySelector("#hero-video").currentTime > 1, null, { timeout: 12000 });
  const beforeSecondRotation = await page.evaluate(() => ({
    intro: Intro.tl.time(),
    audio: window.__rotationAudio.currentTime,
    video: window.__rotationVideo.currentTime
  }));
  await page.setViewportSize({ width: 820, height: 1180 });
  await page.waitForTimeout(700);
  const returnedPortrait = await page.evaluate(() => {
    const frame = document.querySelector("#hero-film").getBoundingClientRect();
    return {
      sameAudio: window.__rotationAudio === document.querySelector("#ambient-audio"),
      sameVideo: window.__rotationVideo === document.querySelector("#hero-video"),
      intro: Intro.tl.time(),
      audio: window.__rotationAudio.currentTime,
      video: window.__rotationVideo.currentTime,
      videoReady: window.__rotationVideo.readyState,
      mode: Env.mode,
      coverage: { left: frame.left, right: frame.right, top: frame.top, bottom: frame.bottom }
    };
  });
  expect(returnedPortrait.sameAudio).toBeTruthy();
  expect(returnedPortrait.sameVideo).toBeTruthy();
  expect(returnedPortrait.intro).toBeGreaterThan(beforeSecondRotation.intro + 0.4);
  expect(returnedPortrait.audio).toBeGreaterThan(beforeSecondRotation.audio + 0.4);
  expect(returnedPortrait.video).toBeGreaterThan(beforeSecondRotation.video + 0.4);
  expect(returnedPortrait.videoReady).toBeGreaterThanOrEqual(2);
  expect(returnedPortrait.mode).toBe("tabletPortrait");
  expect(returnedPortrait.coverage.left).toBeLessThanOrEqual(0);
  expect(returnedPortrait.coverage.right).toBeGreaterThanOrEqual(820);
  expect(returnedPortrait.coverage.top).toBeLessThanOrEqual(0);
  expect(returnedPortrait.coverage.bottom).toBeGreaterThanOrEqual(1180);
  await page.waitForFunction(() => document.body.dataset.state === "ready", null, { timeout: 10000 });
  expect(errors).toEqual([]);
});

test("one long soundtrack survives the film and sixty seconds of exploration", async ({ page }) => {
  test.setTimeout(100000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => message.type() === "error" && errors.push(`console: ${message.text()}`));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("http://127.0.0.1:4173", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.body.dataset.state === "intro" && Intro.tl?.isActive(), null, { timeout: 12000 });
  await ensureSoundOn(page);
  await page.evaluate(() => Intro.skip());
  await page.waitForFunction(() => document.body.dataset.state === "ready", null, { timeout: 6000 });

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
  expect(atFilmEnd.duration).toBeGreaterThan(313.5);
  expect(atFilmEnd.duration).toBeLessThan(314.5);

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
  await ensureSoundOn(page);
  await page.evaluate(() => Intro.skip());
  await page.waitForFunction(() => document.body.dataset.state === "ready", null, { timeout: 6000 });
  const duration = await page.evaluate(() => {
    const audio = document.querySelector("#ambient-audio");
    window.__loopIdentity = audio;
    audio.currentTime = audio.duration - 1.5;
    return audio.duration;
  });
  expect(duration).toBeGreaterThan(313.5);
  expect(duration).toBeLessThan(314.5);
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
