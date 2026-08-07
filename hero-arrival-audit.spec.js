const { test, expect } = require("@playwright/test");
const fs = require("node:fs");

async function captureArrival(page, viewport, name) {
  fs.mkdirSync(".hero-arrival-audit", { recursive: true });
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => message.type() === "error" && errors.push(`console: ${message.text()}`));
  await page.setViewportSize(viewport);
  await page.goto("http://127.0.0.1:4173", { waitUntil: "domcontentloaded" });
  await page.locator('body[data-state="intro"]').waitFor({ timeout: 12000 });
  await page.evaluate(() => {
    window.__arrivalStarted = performance.now();
    window.__arrivalReady = null;
    new MutationObserver(() => {
      if (document.body.dataset.state === "ready" && window.__arrivalReady === null) {
        window.__arrivalReady = performance.now();
      }
    }).observe(document.body, { attributes: true, attributeFilter: ["data-state"] });
  });
  const started = Date.now();
  const readings = [];
  for (const at of [0, 1.1, 2.35, 3.35, 4.65, 5.2]) {
    await page.waitForTimeout(Math.max(0, at * 1000 - (Date.now() - started)));
    readings.push(await page.evaluate((t) => ({
      t,
      state: document.body.dataset.state,
      hero: {
        transform: getComputedStyle(document.querySelector(".hero-media")).transform,
        filter: getComputedStyle(document.querySelector(".hero-media")).filter
      },
      clouds: [...document.querySelectorAll(".cloud")].map((el) => Number(getComputedStyle(el).opacity)),
      mist: [...document.querySelectorAll(".hero-mist")].map((el) => Number(getComputedStyle(el).opacity)),
      bird: document.querySelector("#bird") ? Number(getComputedStyle(document.querySelector("#bird")).opacity) : 0,
      hud: Number(getComputedStyle(document.querySelector(".hud")).opacity),
      title: Number(getComputedStyle(document.querySelector(".hero-type__title")).opacity)
    }), at));
    await page.screenshot({ path: `.hero-arrival-audit/${name}-${String(at).replace(".", "-")}.jpg`, type: "jpeg", quality: 82 });
  }
  const readyElapsed = await page.evaluate(() => window.__arrivalReady - window.__arrivalStarted);
  return { readings, readyElapsed, errors };
}

test("desktop arrival completes as one concise shot", async ({ page }) => {
  test.setTimeout(30000);
  const result = await captureArrival(page, { width: 1440, height: 900 }, "desktop");
  expect(result.readings[0].clouds.filter((v) => v > 0.5).length).toBeGreaterThanOrEqual(3);
  expect(result.readings[1].hero.transform).not.toEqual(result.readings[0].hero.transform);
  expect(result.readings[2].clouds.filter((v) => v > 0.1).length).toBeLessThan(result.readings[0].clouds.filter((v) => v > 0.1).length);
  expect(result.readings[4].bird).toBeGreaterThan(0.05);
  expect(result.readings[5].state).toBe("ready");
  expect(result.readings[5].hud).toBeGreaterThan(0.95);
  expect(result.readings[5].mist.some((v) => v > 0.05)).toBeTruthy();
  expect(result.readyElapsed).toBeLessThan(5800);
  expect(result.errors).toEqual([]);
});

test("mobile arrival follows the same compressed continuity", async ({ page }) => {
  test.setTimeout(30000);
  const result = await captureArrival(page, { width: 390, height: 844 }, "mobile");
  expect(result.readings[1].hero.transform).not.toEqual(result.readings[0].hero.transform);
  expect(result.readings[4].bird).toBeGreaterThan(0.05);
  expect(result.readings[5].state).toBe("ready");
  expect(result.readings[5].hud).toBeGreaterThan(0.95);
  expect(result.readyElapsed).toBeLessThan(5800);
  expect(result.errors).toEqual([]);
});
