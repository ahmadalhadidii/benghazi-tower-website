/* ==========================================================================
   BENGHAZI TOWER — A NEW WAY OF LIVING
   script.js

     1.  experienceConfig      — all creative controls
     2.  Env
     3.  Loader                — real progress; asks for the render if absent
     4.  Atmosphere            — cloud plates cut from the render itself
     5.  Bird                  — asset-driven fly-by; nothing fake if absent
     6.  Intro                 — one continuous aerial descent (autoplay, once)
     8.  ScrollFramework       — scrubbed scene system, begins after arrival
     9.  Interface
     10. Boot
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. Configuration
   -------------------------------------------------------------------------- */

const experienceConfig = {
  /* Opening — an aerial descent through the cloud layer */
  introDuration: 8,              // scales the descent
  descentStartScale: 1.5,        // how far above the frame the camera begins
  descentBlur: 22,               // px of atmospheric defocus while inside cloud
  descentBlurMobile: 0,          // full-frame blur is too costly on phones

  /* Hero render */
  heroImage: "assets/images/benghazi-tower-hero.webp",
  heroImageFallbacks: [
    "assets/images/benghazi-tower-hero.jpg",
    "assets/images/benghazi-tower-hero.png",
    "assets/images/benghazi-tower-hero.jpeg"
  ],
  heroObjectPosition: "50% 46%",        // ← crop control, desktop
  heroObjectPositionMobile: "54% 44%",  // ← crop control, portrait
  heroArrivalScale: 1.16,               // camera is still moving on arrival
  heroScrollDistance: 2200,
  heroMaxScale: 1.08,

  /* Atmosphere — the sky of the render itself, drifting against a copy of
     itself. No procedural clouds, no invented shapes. */
  skyDriftEnabled: true,
  skyDriftAmount: 1.1,           // % of viewport width, total travel
  skyDriftDuration: 190,         // seconds per pass — deliberately unreadable
  skyDriftOpacity: 0.3,
  skyMaskEnd: "9%",              // fully drifting above this line
  skyMaskFade: "17%",            // no movement at all below this line

  /* Bird — real footage only. See assets/atmosphere/README.md */
  birdFlyByEnabled: true,
  birdManifest: "assets/atmosphere/atmosphere.json",
  birdFirstDelay: 2.2,
  birdIdleRepeatAfter: 90,

  /* System */
  debugMode: false
};

/* --------------------------------------------------------------------------
   2. Environment
   -------------------------------------------------------------------------- */

const Env = {
  reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  mobile: window.matchMedia("(max-width: 900px)").matches,
  get dpr() {
    return Math.min(window.devicePixelRatio || 1, this.mobile ? 1.6 : 2);
  }
};

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const body = document.body;

if (experienceConfig.debugMode) body.dataset.debug = "true";

/* --------------------------------------------------------------------------
   3. Loader
   -------------------------------------------------------------------------- */

const Loader = {
  el: $("#loader"),
  bar: $("#loader-bar"),
  value: $("#loader-value"),
  status: $("#loader-status"),
  ask: $("#loader-ask"),
  progress: 0,

  set(p) {
    this.progress = Math.max(this.progress, Math.min(p, 1));
    this.bar.style.transform = `scaleX(${this.progress})`;
    this.value.textContent = String(Math.round(this.progress * 100)).padStart(3, "0");
  },

  say(t) {
    this.status.textContent = t;
  },

  async fetchImage(url, onProgress) {
    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) throw new Error(String(res.status));
    const total = Number(res.headers.get("content-length")) || 0;
    if (!res.body || !total) {
      const blob = await res.blob();
      onProgress(1);
      return URL.createObjectURL(blob);
    }
    const reader = res.body.getReader();
    const chunks = [];
    let got = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      got += value.length;
      onProgress(Math.min(got / total, 1));
    }
    return URL.createObjectURL(new Blob(chunks, { type: res.headers.get("content-type") || "image/jpeg" }));
  },

  decode(src) {
    return new Promise((resolve, reject) => {
      const probe = new Image();
      probe.onload = () => resolve(src);
      probe.onerror = () => reject(new Error("decode"));
      probe.src = src;
    });
  },

  async findHero() {
    for (const url of [experienceConfig.heroImage, ...experienceConfig.heroImageFallbacks]) {
      try {
        let src = url;
        try {
          src = await this.fetchImage(url, (p) => this.set(0.06 + p * 0.76));
        } catch (e) {
          this.set(0.4); // file:// or no content-length — plain load, honest ramp
        }
        return await this.decode(src);
      } catch (e) {
        /* next candidate */
      }
    }
    return null;
  },

  /* The opening is built around one specific render. Rather than inventing a
     substitute, ask for it. */
  requestHero() {
    return new Promise((resolve) => {
      this.ask.hidden = false;
      this.say("Awaiting render");
      this.set(0.5);
      $("#hero-picker").addEventListener("change", async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        try {
          const src = await this.decode(URL.createObjectURL(file));
          this.ask.hidden = true;
          resolve(src);
        } catch (err) {
          this.say("That file could not be read — try another");
        }
      });
      $("#loader-skip").addEventListener("click", () => {
        this.ask.hidden = true;
        resolve(null);
      });
    });
  },

  applyHero(src) {
    $$(".js-hero-src").forEach((img) => {
      img.src = src;
    });
    body.dataset.hero = "";
    Atmosphere.deriveFromRender(src);
  },

  async run() {
    this.set(0.04);
    this.say("Preparing the approach");

    let src = await this.findHero();
    if (!src) {
      console.warn(
        `[Benghazi Tower] No render at "${experienceConfig.heroImage}". Place the file there, or select it in the loader.`
      );
      src = await this.requestHero();
    }

    if (src) {
      this.applyHero(src);
      this.say("Entering");
    } else {
      body.dataset.hero = "missing";
      this.say("Continuing without the render");
    }

    this.set(1);
    await new Promise((r) => setTimeout(r, 380));
    return !!src;
  },

  dismiss() {
    return gsap.to(this.el, {
      autoAlpha: 0,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => this.el.remove()
    });
  }
};

/* --------------------------------------------------------------------------
   4. Atmosphere — the render's own sky, moving against itself
   -------------------------------------------------------------------------- */

const Atmosphere = {
  tweens: [],

  /* The haze the descent begins inside is sampled from the render itself. */
  deriveFromRender(src) {
    const img = new Image();
    img.onload = () => {
      try {
        const W = 128;
        const H = 128;
        const cv = document.createElement("canvas");
        cv.width = W;
        cv.height = H;
        const ctx = cv.getContext("2d");

        /* replicate object-fit: cover with the configured object-position */
        const target = window.innerWidth / window.innerHeight;
        const source = img.naturalWidth / img.naturalHeight;
        const pos = (Env.mobile
          ? experienceConfig.heroObjectPositionMobile
          : experienceConfig.heroObjectPosition
        )
          .split(/\s+/)
          .map((v) => parseFloat(v) / 100);
        let sw = img.naturalWidth;
        let sh = img.naturalHeight;
        if (source > target) sw = sh * target;
        else sh = sw / target;
        const sx = (img.naturalWidth - sw) * (isNaN(pos[0]) ? 0.5 : pos[0]);
        const sy = (img.naturalHeight - sh) * (isNaN(pos[1]) ? 0.5 : pos[1]);
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);

        /* Average each horizontal band across the full width: all geometry
           averages away and only the render's tonal profile remains — this is
           atmosphere, not a blurred preview of the building. */
        const px = ctx.getImageData(0, 0, W, H).data;
        const BANDS = 24;
        const rows = [];
        for (let bnd = 0; bnd < BANDS; bnd++) {
          const y0 = Math.floor((bnd * H) / BANDS);
          const y1 = Math.max(Math.floor(((bnd + 1) * H) / BANDS), y0 + 1);
          let r = 0;
          let g = 0;
          let b = 0;
          let n = 0;
          for (let y = y0; y < y1; y++) {
            for (let x = 0; x < W; x++) {
              const i = (y * W + x) * 4;
              r += px[i];
              g += px[i + 1];
              b += px[i + 2];
              n++;
            }
          }
          rows.push([Math.round(r / n), Math.round(g / n), Math.round(b / n)]);
        }

        /* The haze the descent begins inside is the render's own upper sky,
           lifted slightly toward the light. Nothing is guessed. */
        const top = rows.slice(0, 4);
        const tint = top
          .reduce((a, c) => [a[0] + c[0] / top.length, a[1] + c[1] / top.length, a[2] + c[2] / top.length], [0, 0, 0])
          .map((v) => Math.round(Math.min(v * 1.06, 255)));
        document.documentElement.style.setProperty("--haze-tint", tint.join(", "));
      } catch (e) {
        /* a cross-origin render taints the canvas — keep the fallback wash */
      }
    };
    img.src = src;
  },

  start() {
    const drift = $(".sky-drift");
    if (drift && experienceConfig.skyDriftEnabled && body.dataset.hero !== "missing") {
      const amount = experienceConfig.skyDriftAmount * (Env.mobile ? 0.6 : 1);
      const duration = experienceConfig.skyDriftDuration * (Env.reducedMotion ? 3 : 1);
      gsap.set(drift, { opacity: experienceConfig.skyDriftOpacity, xPercent: -amount / 2 });
      this.tweens.push(
        gsap.to(drift, { xPercent: amount / 2, duration, ease: "sine.inOut", yoyo: true, repeat: -1 })
      );
      /* A second, slower pass on another axis so no single rhythm becomes
         readable as a loop. */
      this.tweens.push(
        gsap.to(drift, {
          yPercent: -0.25,
          duration: duration * 1.7,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1
        })
      );
    }

    const mist = $(".mist-rest");
    if (mist && !Env.mobile) {
      const d = Env.reducedMotion ? 420 : 150;
      gsap.set(mist, { opacity: 0.11, xPercent: -6 });
      this.tweens.push(
        gsap.to(mist, { xPercent: 6, duration: d, ease: "sine.inOut", yoyo: true, repeat: -1 })
      );
    }

    const breath = $(".sky-breath");
    if (breath) {
      this.tweens.push(
        gsap.fromTo(
          breath,
          { opacity: 0.04 },
          {
            opacity: Env.reducedMotion ? 0.07 : 0.18,
            duration: 46,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1
          }
        )
      );
    }
  },

  pause() {
    this.tweens.forEach((t) => t.pause());
  },

  resume() {
    this.tweens.forEach((t) => t.resume());
  }
};

/* --------------------------------------------------------------------------
   6. Bird — real footage or nothing at all
   -------------------------------------------------------------------------- */

const Bird = {
  el: $("#bird"),
  mode: null, // "video" | "sequence" | null
  frames: [],
  tl: null,
  idleTimer: null,

  async init() {
    if (!this.el || !experienceConfig.birdFlyByEnabled || Env.reducedMotion) return;

    /* A manifest that always exists names the asset, so probing never produces
       404 noise in the console. */
    let asset = null;
    if (experienceConfig.birdManifest) {
      try {
        const res = await fetch(experienceConfig.birdManifest, { cache: "force-cache" });
        if (res.ok) asset = (await res.json()).bird || null;
      } catch (e) {
        /* no manifest — treat as no asset */
      }
    }

    if (asset) {
      const base = experienceConfig.birdManifest.replace(/[^/]+$/, "");
      const url = base + asset;
      if (/\.webm$|\.mp4$|\.mov$/i.test(asset)) {
        if (await this.tryVideo(url)) {
          this.mode = "video";
          return;
        }
      } else if (await this.trySequence(url)) {
        this.mode = "sequence";
        return;
      }
    }

    /* Nothing convincing available — the slot stays empty rather than being
       filled with something that reads as fake. */
    this.el.remove();
    this.el = null;
    console.info(
      "[Benghazi Tower] Bird fly-by idle: no footage yet. Add a transparent WebM or a frame " +
        `sequence and name it in "${experienceConfig.birdManifest}". See assets/atmosphere/README.md — ` +
        "the flight path, defocus and timing are already wired."
    );
  },

  tryVideo(url) {
    return new Promise((resolve) => {
      const v = document.createElement("video");
      v.muted = true;
      v.playsInline = true;
      v.preload = "auto";
      v.className = "bird__media";
      let settled = false;
      const done = (ok) => {
        if (settled) return;
        settled = true;
        if (ok) {
          this.video = v;
          this.el.appendChild(v);
        }
        resolve(ok);
      };
      v.addEventListener("loadeddata", () => done(true));
      v.addEventListener("error", () => done(false));
      setTimeout(() => done(false), 4000);
      v.src = url;
    });
  },

  async trySequence(url) {
    try {
      const res = await fetch(url, { cache: "force-cache" });
      if (!res.ok) return false;
      const manifest = await res.json();
      if (!manifest.frames || !manifest.frames.length) return false;
      const base = url.replace(/[^/]+$/, "");
      this.frames = await Promise.all(
        manifest.frames.map(
          (f) =>
            new Promise((resolve, reject) => {
              const i = new Image();
              i.onload = () => resolve(i);
              i.onerror = reject;
              i.src = base + f;
            })
        )
      );
      this.fps = manifest.fps || 24;
      this.canvas = document.createElement("canvas");
      this.canvas.className = "bird__media";
      this.canvas.width = this.frames[0].naturalWidth;
      this.canvas.height = this.frames[0].naturalHeight;
      this.cctx = this.canvas.getContext("2d");
      this.el.appendChild(this.canvas);
      return true;
    } catch (e) {
      return false;
    }
  },

  fly(scaleFactor = 1) {
    if (!this.el || !this.mode) return;
    if (this.tl && this.tl.isActive()) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const blur = { v: 0 };
    const applyBlur = () => {
      this.el.style.filter = blur.v > 0.05 ? `blur(${blur.v.toFixed(2)}px)` : "none";
    };

    if (this.mode === "video") {
      this.video.currentTime = 0;
      const p = this.video.play();
      p && p.catch(() => {});
    } else {
      this.seqStart = performance.now();
      this.drawSequence();
    }

    /* Open sky only. The route never crosses the tower's silhouette; portrait
       crops put the tower mid-frame, so they get a higher, shorter route. */
    const route = Env.mobile
      ? [
          { x: 0.55, y: 0.08, s: 0.5, d: 0.55 },
          { x: 0.18, y: 0.16, s: 1.0, d: 0.45 },
          { x: -0.1, y: 0.36, s: 2.2, d: 0.4 },
          { x: -0.45, y: 0.66, s: 2.8, d: 0.3 }
        ]
      : [
          { x: 0.6, y: 0.11, s: 0.55, d: 0.55 },
          { x: 0.28, y: 0.28, s: 1.2, d: 0.45 },
          { x: 0.02, y: 0.62, s: 2.8, d: 0.4 },
          { x: -0.32, y: 0.98, s: 3.4, d: 0.3 }
        ];

    this.tl = gsap
      .timeline({
        onComplete: () => {
          this.el.style.filter = "none";
          if (this.mode === "video") this.video.pause();
          else cancelAnimationFrame(this.seqFrame);
          this.queueIdleRepeat();
        }
      })
      .set(this.el, { x: vw * 1.05, y: vh * 0.05, scale: 0.34 * scaleFactor, opacity: 0 })
      .to(this.el, { opacity: 1, duration: 0.25, ease: "power1.out" }, 0)
      .to(
        this.el,
        {
          keyframes: route.map((k, i) => ({
            x: vw * k.x,
            y: vh * k.y,
            scale: k.s * scaleFactor,
            duration: k.d,
            /* it accelerates across the frame as it nears the lens */
            ease: i === 0 ? "none" : "power1.in"
          }))
        },
        0
      )
      .to(blur, { v: 4.2 * scaleFactor, duration: 0.7, ease: "power2.in", onUpdate: applyBlur }, 0.95)
      .to(this.el, { opacity: 0, duration: 0.22, ease: "power2.in" }, 1.55);
  },

  drawSequence() {
    const elapsed = (performance.now() - this.seqStart) / 1000;
    const idx = Math.floor(elapsed * this.fps) % this.frames.length;
    this.cctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.cctx.drawImage(this.frames[idx], 0, 0);
    this.seqFrame = requestAnimationFrame(this.drawSequence.bind(this));
  },

  queueIdleRepeat() {
    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      if (document.hidden) return this.queueIdleRepeat();
      this.fly(0.4);
    }, experienceConfig.birdIdleRepeatAfter * 1000);
  },

  pause() {
    this.tl && this.tl.pause();
    if (this.mode === "video" && this.video) this.video.pause();
  },

  resume() {
    if (this.tl && this.tl.isActive()) {
      this.tl.resume();
      if (this.mode === "video" && this.video) this.video.play().catch(() => {});
    }
  }
};

/* --------------------------------------------------------------------------
   7. Intro — one continuous camera journey
   -------------------------------------------------------------------------- */

const Intro = {
  tl: null,

  build() {
    const media = $(".hero-media");
    const stage = $(".hero-reveal");
    const haze = $("#haze");
    const far = $(".cloud--far");
    const mid = $(".cloud--mid");
    const nearA = $(".cloud--near-a");
    const nearB = $(".cloud--near-b");
    const blurAmount = Env.mobile ? experienceConfig.descentBlurMobile : experienceConfig.descentBlur;
    const defocus = { v: blurAmount };
    const applyDefocus = () => {
      media.style.filter = defocus.v > 0.3 ? `blur(${defocus.v.toFixed(1)}px)` : "none";
    };

    body.dataset.state = "intro";

    /* The destination frame is already in place from the first millisecond —
       high above, defocused, and completely inside the cloud layer. */
    gsap.set(stage, { opacity: 1 });
    gsap.set(media, { scale: experienceConfig.descentStartScale, yPercent: -2.6 });
    applyDefocus();

    if (Env.reducedMotion) return this.buildReduced(media, haze, defocus, applyDefocus);

    const tl = gsap.timeline({ onComplete: () => Experience.handOver() });

    /* ── inside the cloud ───────────────────────────────────────────────── */
    tl.set(haze, { opacity: 1 })
      .set(far, { opacity: 0.85, scale: 1, xPercent: -3, yPercent: -2 })
      .set(mid, { opacity: 0.95, scale: 1.2, xPercent: 4, yPercent: 3 })
      .set(nearA, { opacity: 1, scale: 1.7, xPercent: -6, yPercent: -4 })
      .set(nearB, { opacity: 0.95, scale: 2.4, xPercent: 8, yPercent: 6 })

      /* ── the near banks pass the camera first ──────────────────────────── */
      .to(nearB, { scale: 6.2, xPercent: 26, yPercent: 30, duration: 3.4, ease: "power1.in" }, 0)
      .to(nearB, { opacity: 0, duration: 2.2, ease: "power1.in" }, 1.1)
      .to(nearA, { scale: 5.4, xPercent: -22, yPercent: 26, duration: 4.6, ease: "power1.in" }, 0.7)
      .to(nearA, { opacity: 0, duration: 2.6, ease: "power1.in" }, 2.5)

      /* ── the mid bank opens: light, horizon and sea start to come through ─ */
      .to(mid, { scale: 3.2, xPercent: 14, yPercent: 18, duration: 6.4, ease: "power1.in" }, 1.4)
      .to(mid, { opacity: 0.5, duration: 3.4, ease: "none" }, 3.4)
      .to(mid, { opacity: 0, duration: 3, ease: "power1.inOut" }, 7)

      /* ── the far haze thins last ───────────────────────────────────────── */
      .to(far, { scale: 2.1, yPercent: 12, duration: 8.6, ease: "power1.inOut" }, 0.6)
      .to(far, { opacity: 0.34, duration: 4.4, ease: "none" }, 3.2)
      .to(far, { opacity: 0, duration: 3, ease: "power1.inOut" }, 8.8)

      /* ── the whiteout lifts in stages, never in one fade ───────────────── */
      .to(haze, { opacity: 0.88, duration: 2.2, ease: "power1.out" }, 1)
      .to(haze, { opacity: 0.6, duration: 2.4, ease: "none" }, 3.4)
      .to(haze, { opacity: 0.32, duration: 2.4, ease: "power1.inOut" }, 5.9)
      .to(haze, { opacity: 0.1, duration: 2.2, ease: "power1.inOut" }, 8.3)
      .to(haze, { opacity: 0, duration: 2, ease: "power1.inOut" }, 10.4)

      /* ── the descent itself: still falling, then easing to a stop ───────── */
      .addLabel("arrival", 8)
      .to(media, { scale: 1.38, yPercent: -2, duration: 4.2, ease: "none" }, 0)
      .to(
        media,
        {
          scale: experienceConfig.heroArrivalScale,
          yPercent: -0.8,
          duration: 5.2,
          ease: "none"
        },
        4.2
      )
      .to(media, { scale: 1, yPercent: 0, duration: 4.6, ease: "power2.out" }, 9.4)

      /* ── focus resolves as we come out of the cloud ─────────────────────── */
      .to(defocus, { v: blurAmount * 0.6, duration: 4.4, ease: "none", onUpdate: applyDefocus }, 1.4)
      .to(defocus, { v: 0, duration: 4.4, ease: "power2.out", onUpdate: applyDefocus }, 6.4)

      .call(() => Atmosphere.start(), null, 11.4);

    /* Only once the frame has settled. */
    this.appendReveal(tl, 14.2);
    tl.timeScale(8 / Math.max(experienceConfig.introDuration, 3));
    this.tl = tl;
    return tl;
  },

  buildReduced(media, haze, defocus, applyDefocus) {
    const tl = gsap.timeline({ onComplete: () => Experience.handOver() });
    tl.set(haze, { opacity: 1 })
      .set(media, { scale: 1, yPercent: 0 })
      .call(() => {
        defocus.v = 0;
        applyDefocus();
      })
      .to(haze, { opacity: 0, duration: 1.4, ease: "power1.inOut" }, 0.3)
      .call(() => Atmosphere.start(), null, 1);
    this.appendReveal(tl, 1.6);
    this.tl = tl;
    return tl;
  },

  /* Interface exists only after the camera has landed. */
  appendReveal(tl, at) {
    const rule = $(".hero-type__rule");
    const place = $(".hero-type__place");
    const lines = $$(".hero-type__title .line > span");
    const subtitle = $(".hero-type__subtitle");
    const dur = Env.reducedMotion ? 0.5 : 1;

    /* the bird crosses the settled frame before the title arrives */
    tl.call(() => Bird.fly(1), null, at - 1.6 + experienceConfig.birdFirstDelay)
      .to($(".hud"), { autoAlpha: 1, duration: 1.4 * dur, ease: "power2.out" }, at - 0.2)
      .to(rule, { scaleX: 1, duration: 1.8 * dur, ease: "power3.inOut" }, at)
      .to(place, { opacity: 1, y: 0, duration: 1.1 * dur, ease: "power2.out" }, at + 0.2)
      .to(lines, { y: "0%", duration: 1.6 * dur, ease: "power3.out", stagger: 0.14 }, at + 0.4)
      .to(subtitle, { opacity: 1, duration: 1.4 * dur, ease: "power2.out" }, at + 1.1)
      .to($(".hud__cue"), { opacity: 1, duration: 1.1 * dur, ease: "power2.out" }, at + 1.6)
      .to($(".hud__progress"), { opacity: 1, duration: 1.1 * dur, ease: "power2.out" }, at + 1.6);
  },

  /* No visible control sits over the descent; the gesture is enough. */
  skip() {
    if (!this.tl || !this.tl.isActive()) return;
    const target = this.tl.labels.arrival || 0;
    if (this.tl.time() < target) this.tl.tweenTo(target, { duration: 0.7, ease: "power2.inOut" });
  }
};

/* --------------------------------------------------------------------------
   8. Scroll framework — engaged only after arrival
   -------------------------------------------------------------------------- */

const ScrollFramework = {
  triggers: [],

  build() {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    this.buildHeroApproach();
    this.buildProgress();
    ScrollTrigger.refresh();
  },

  buildHeroApproach() {
    const media = $(".hero-media");
    const type = $(".hero-type");
    const marker = $(".dev-marker");
    const drift = $(".sky-drift");
    const maxScale = Env.reducedMotion ? 1.02 : experienceConfig.heroMaxScale;

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        id: "exteriorApproach",
        trigger: "#scene-hero",
        start: "top top",
        end: () => `+=${experienceConfig.heroScrollDistance}`,
        pin: true,
        pinSpacing: true,
        scrub: true, // bound to the scrollbar: stop = frozen, up = reversed
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    tl.to(media, { scale: maxScale, yPercent: -1.6 }, 0)
      .to(drift, { opacity: 0.2 }, 0)
      .to(type, { yPercent: -34, opacity: 0, ease: "power1.in", duration: 0.72 }, 0)
      .to(document.documentElement, { "--scrim-strength": 0.72, "--vignette-strength": 0.55 }, 0)
      .to($(".hud__cue"), { opacity: 0, duration: 0.18 }, 0)
      .to(marker, { opacity: 1, duration: 0.16 }, 0.82);

    this.triggers.push(tl.scrollTrigger);
    return tl;
  },

  buildProgress() {
    const bar = $(".hud__progress-bar");
    const label = $(".hud__progress-label");
    const names = ["01 — ARRIVAL", "02 — EXTERIOR APPROACH"];
    this.triggers.push(
      ScrollTrigger.create({
        id: "sceneProgress",
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          gsap.set(bar, { scaleY: self.progress });
          const idx = self.progress > 0.28 ? 1 : 0;
          if (label.textContent !== names[idx]) label.textContent = names[idx];
        }
      })
    );
  },

  destroy() {
    this.triggers.forEach((t) => t && t.kill());
    this.triggers = [];
  }
};

/* --------------------------------------------------------------------------
   9. Interface
   -------------------------------------------------------------------------- */

const Interface = {
  menu: $("#menu"),
  trigger: $("#menu-trigger"),
  close: $("#menu-close"),
  lastFocus: null,

  init() {
    this.trigger.addEventListener("click", () => this.open());
    this.close.addEventListener("click", () => this.hide());
    document.addEventListener("keydown", (e) => {
      if (this.menu.dataset.open !== "true") return;
      if (e.key === "Escape") this.hide();
      if (e.key === "Tab") this.trap(e);
    });
    $(".hud__cue").addEventListener("click", () => {
      window.scrollTo({ top: window.innerHeight * 0.6, behavior: "smooth" });
    });
  },

  open() {
    this.lastFocus = document.activeElement;
    this.menu.dataset.open = "true";
    this.menu.setAttribute("aria-hidden", "false");
    this.trigger.setAttribute("aria-expanded", "true");
    body.style.overflow = "hidden";
    const first = $(".menu__link", this.menu);
    requestAnimationFrame(() => first && first.focus());
  },

  hide() {
    this.menu.dataset.open = "false";
    this.menu.setAttribute("aria-hidden", "true");
    this.trigger.setAttribute("aria-expanded", "false");
    if (body.dataset.state === "ready") body.style.overflow = "";
    this.lastFocus && this.lastFocus.focus();
  },

  trap(e) {
    const items = $$("a, button", this.menu).filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
};

/* --------------------------------------------------------------------------
   10. Boot
   -------------------------------------------------------------------------- */

const Experience = {
  async start() {
    this.applyFraming();
    Interface.init();
    Bird.init();

    await Loader.run();
    Loader.dismiss();
    Intro.build();
    this.bindGlobal();
  },

  applyFraming() {
    const root = document.documentElement;
    root.style.setProperty(
      "--hero-object-position",
      Env.mobile ? experienceConfig.heroObjectPositionMobile : experienceConfig.heroObjectPosition
    );
    root.style.setProperty("--sky-mask-end", experienceConfig.skyMaskEnd);
    root.style.setProperty("--sky-mask-fade", experienceConfig.skyMaskFade);
  },

  /* Autoplay ends here. Everything beyond this point is scroll-controlled. */
  handOver() {
    body.dataset.state = "ready";
    body.style.overflow = "";
    /* the cloud layer has been left behind — take it out of the DOM */
    const flythrough = $("#flythrough");
    flythrough && flythrough.remove();
    const haze = $("#haze");
    haze && haze.remove();
    ScrollFramework.build();
    Bird.queueIdleRepeat();
  },

  bindGlobal() {
    const impatient = (e) => {
      if (body.dataset.state !== "intro") return;
      if (e.type === "keydown" && !["Enter", " ", "ArrowDown", "PageDown", "Escape"].includes(e.key)) return;
      Intro.skip();
    };
    window.addEventListener("wheel", impatient, { passive: true });
    window.addEventListener("touchmove", impatient, { passive: true });
    window.addEventListener("keydown", impatient);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        Atmosphere.pause();
        Bird.pause();
        Intro.tl && Intro.tl.pause();
      } else {
        Atmosphere.resume();
        Bird.resume();
        Intro.tl && Intro.tl.resume();
      }
    });

    window.addEventListener("load", () => window.ScrollTrigger && ScrollTrigger.refresh());
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => window.ScrollTrigger && ScrollTrigger.refresh());
    }

    let rt;
    window.addEventListener(
      "resize",
      () => {
        clearTimeout(rt);
        rt = setTimeout(() => {
          Env.mobile = window.matchMedia("(max-width: 900px)").matches;
          this.applyFraming();
          window.ScrollTrigger && ScrollTrigger.refresh();
        }, 200);
      },
      { passive: true }
    );
  }
};

if (window.gsap) {
  Experience.start();
} else {
  /* No GSAP: still deliver the project, statically and completely. */
  const heroImg = $("#hero-image");
  heroImg.src = experienceConfig.heroImage;
  heroImg.onerror = () => (body.dataset.hero = "missing");
  $(".hero-reveal").style.opacity = 1;
  body.dataset.state = "ready";
  $("#loader").remove();
  const ft = $("#flythrough");
  if (ft) ft.remove();
  const hz = $("#haze");
  if (hz) hz.remove();
  $(".hud").style.cssText = "opacity:1;visibility:visible";
  $$(".hero-type__title .line > span").forEach((el) => (el.style.transform = "none"));
  $(".hero-type__rule").style.transform = "scaleX(1)";
  $(".hero-type__place").style.opacity = 1;
  $(".hero-type__subtitle").style.opacity = 1;
  $(".hud__cue").style.opacity = 1;
}
