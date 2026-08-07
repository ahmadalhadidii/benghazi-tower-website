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
  introDuration: 4.52,           // concise first-load arrival, including the interface reveal
  descentStartScale: 1.14,       // wider/higher opening frame keeps upper atmosphere present
  descentBlur: 10,               // restrained; cloud depth comes from plates, not blur
  descentBlurMobile: 0,          // full-frame blur is too costly on phones

  /* Hero render */
  heroImage: "assets/images/benghazi-tower-hero.webp",
  heroImageMobile: "assets/scenes/00-hero-aerial-900.webp",
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
  birdFirstDelay: 0.38,
  birdIdleRepeatAfter: 0,         // the brief calls for one fly-by only

  /* System */
  debugMode: false,

  /* The complete journey. Every scene is art-directed around three beats:
     arrive (show the shot), read (hold it), move forward (aim at the next). */
  scenes: [
    {
      id: "arrival", label: "THE ARRIVAL", eyebrow: "Benghazi, Libya", title: "Benghazi Tower",
      description: "The tower rises from a continuous ground condition, where podium, landscape and circulation merge into one fluid waterfront system.",
      focus: { desktop: "50% 46%", tabletLandscape: "54% 46%", tabletPortrait: "56% 44%", mobile: "58% 43%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "cover", tabletLandscape: "cover", tabletPortrait: "cover", mobile: "cover" },
      tone: "#8b8176", transition: "hero", transitionTarget: "tower podium at 56% / 67%",
      camera: { origin: "52% 66%", start: [1, 0, 0], read: [1.014, -0.1, -0.2], end: [1.054, -0.8, -1.1] },
      cameraMobile: { origin: "57% 63%", start: [1, 0, 0], read: [1.01, 0, -0.1], end: [1.038, -0.35, -0.65] },
      caption: false
    },
    {
      id: "aerial-detail", label: "ONE SYSTEM", eyebrow: "Masterplan", title: "One Continuous System",
      description: "Tower, podium, circulation and waterfront landscape are read as one connected composition from ground to sky.",
      src: "assets/scenes/01-aerial-detail-1600.webp", mobileSrc: "assets/scenes/01-aerial-detail-900.webp",
      focus: { desktop: "52% 50%", tabletLandscape: "52% 50%", tabletPortrait: "52% 50%", mobile: "52% 50%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "balanced-stage", tabletLandscape: "balanced-stage", tabletPortrait: "balanced-stage", mobile: "balanced-stage" },
      tone: "#7d776f", transition: "matched-push", transitionTarget: "podium-to-tower fold at 57% / 68%",
      camera: { origin: "57% 68%", start: [0.988, 0.6, 0.6], read: [1.002, 0, 0], end: [1.044, -0.8, -1.1] },
      cameraMobile: { origin: "57% 66%", start: [0.992, 0.2, 0.3], read: [1, 0, 0], end: [1.03, -0.35, -0.55] },
      caption: { side: "right", vertical: "bottom" },
      life: { type: "sea-shimmer", mask: "linear-gradient(180deg, transparent 0 42%, #000 58% 88%, transparent 98%)", opacity: 0.2 }
    },
    {
      id: "icon-exterior", label: "GROUND TO SKY", eyebrow: "Tower + podium", title: "Ground to Sky",
      description: "The podium folds upward instead of ending at the base, becoming part of the tower’s vertical expression.",
      src: "assets/scenes/02-icon-exterior-1600.webp", mobileSrc: "assets/scenes/02-icon-exterior-900.webp",
      focus: { desktop: "50% 50%", tabletLandscape: "50% 50%", tabletPortrait: "50% 50%", mobile: "50% 50%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "balanced-stage", tabletLandscape: "balanced-stage", tabletPortrait: "balanced-stage", mobile: "balanced-stage" },
      tone: "#82786c", transition: "tower-rise", transitionTarget: "seaward podium sweep at 39% / 72%",
      camera: { origin: "39% 72%", start: [0.99, -0.35, 0.35], read: [1.003, 0, 0], end: [1.045, 0.9, -0.45] },
      cameraMobile: { origin: "45% 70%", start: [0.992, -0.15, 0.2], read: [1, 0, 0], end: [1.03, 0.45, -0.25] },
      caption: { side: "left", vertical: "top" },
      life: { type: "light-breath", mask: "radial-gradient(circle at 18% 30%, #000 0 19%, transparent 44%)", opacity: 0.2 }
    },
    {
      id: "promenade", label: "THE WATERFRONT", eyebrow: "Waterfront", title: "Open to the Horizon",
      description: "The architecture bends toward the sea, aligning public movement and terraces with uninterrupted Mediterranean views.",
      src: "assets/scenes/03-promenade-1600.webp", mobileSrc: "assets/scenes/03-promenade-900.webp",
      focus: { desktop: "50% 50%", tabletLandscape: "50% 50%", tabletPortrait: "50% 50%", mobile: "50% 50%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "balanced-stage", tabletLandscape: "balanced-stage", tabletPortrait: "balanced-stage", mobile: "balanced-stage" },
      tone: "#463f37", transition: "horizon-cut", transitionTarget: "glazed podium entrance at 73% / 54%",
      camera: { origin: "73% 54%", start: [0.99, -0.45, 0.35], read: [1.004, 0, 0], end: [1.046, -0.9, -0.35] },
      cameraMobile: { origin: "70% 54%", start: [0.992, -0.2, 0.2], read: [1, 0, 0], end: [1.032, -0.5, -0.2] },
      caption: { side: "left", vertical: "top" },
      life: { type: "sea-shimmer", mask: "linear-gradient(90deg, #000 0 30%, transparent 47% 100%)", opacity: 0.22 }
    },
    {
      id: "podium-close", label: "THE FOLDED GROUND", eyebrow: "Podium", title: "The Folded Ground",
      description: "Landscape, circulation and occupied terraces layer through the podium, extending public life into the tower base.",
      src: "assets/scenes/04-podium-close-1600.webp", mobileSrc: "assets/scenes/04-podium-close-900.webp",
      focus: { desktop: "50% 50%", tabletLandscape: "50% 50%", tabletPortrait: "50% 50%", mobile: "50% 50%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "cover", tabletLandscape: "cover", tabletPortrait: "balanced-stage", mobile: "balanced-stage" },
      tone: "#5f615d", transition: "ribbon-wipe", transitionTarget: "sweeping planted ribbon at 61% / 55%",
      camera: { origin: "61% 55%", start: [0.992, 0.45, 0.25], read: [1.006, 0, 0], end: [1.048, -0.85, -0.25] },
      cameraMobile: { origin: "61% 55%", start: [0.994, 0.2, 0.1], read: [1, 0, 0], end: [1.03, -0.4, -0.15] },
      caption: { side: "left", vertical: "bottom" },
      life: { type: "water-reflection", mask: "radial-gradient(ellipse at 58% 78%, #000 0 24%, transparent 52%)", opacity: 0.24 }
    },
    {
      id: "podium-landscape", label: "LANDSCAPE", eyebrow: "Landscape", title: "Landscape as Architecture",
      description: "Planting and pedestrian routes follow the curved geometry, dissolving the boundary between building and waterfront landscape.",
      src: "assets/scenes/05-podium-landscape-1600.webp", mobileSrc: "assets/scenes/05-podium-landscape-900.webp",
      focus: { desktop: "48% 50%", tabletLandscape: "48% 50%", tabletPortrait: "50% 50%", mobile: "50% 50%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "cover", tabletLandscape: "cover", tabletPortrait: "balanced-stage", mobile: "balanced-stage" },
      tone: "#506169", transition: "ribbon-match", transitionTarget: "white loop and inner garden at 34% / 52%",
      camera: { origin: "34% 52%", start: [0.992, -0.45, 0.3], read: [1.004, 0, 0], end: [1.045, 0.85, -0.3] },
      cameraMobile: { origin: "38% 52%", start: [0.994, -0.2, 0.15], read: [1, 0, 0], end: [1.03, 0.45, -0.15] },
      caption: { side: "right", vertical: "top" },
      life: { type: "garden-light", mask: "linear-gradient(180deg, transparent 0 40%, #000 57% 86%, transparent 100%)", opacity: 0.18 }
    },
    {
      id: "envelope", label: "THE ENVELOPE", eyebrow: "Envelope", title: "An Inhabited Envelope",
      description: "A continuous white ribbon wraps planted terraces and glazing, turning the façade into occupied circulation and shade.",
      src: "assets/scenes/06-envelope-1600.webp", mobileSrc: "assets/scenes/06-envelope-900.webp",
      focus: { desktop: "50% 50%", tabletLandscape: "50% 50%", tabletPortrait: "50% 50%", mobile: "50% 50%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "wide-stage", tabletLandscape: "wide-stage", tabletPortrait: "wide-stage", mobile: "wide-stage" },
      tone: "#56666c", transition: "ribbon-wipe", transitionTarget: "central glazed opening at 54% / 49%",
      camera: { origin: "54% 49%", start: [0.988, 0.45, 0.25], read: [1.002, 0, 0], end: [1.05, -0.75, -0.45] },
      cameraMobile: { origin: "54% 49%", start: [0.992, 0.2, 0.1], read: [1, 0, 0], end: [1.032, -0.4, -0.2] },
      caption: { side: "right", vertical: "top" },
      life: { type: "sea-shimmer", mask: "linear-gradient(90deg, transparent 0 58%, #000 72% 100%)", opacity: 0.18 }
    },
    {
      id: "public-court", label: "THE SOCIAL HEART", eyebrow: "Public court", title: "The Social Heart",
      description: "A carved multi-level court pulls daylight, landscape and public activity deep into the podium.",
      src: "assets/scenes/07-public-court-1600.webp", mobileSrc: "assets/scenes/07-public-court-900.webp",
      focus: { desktop: "50% 50%", tabletLandscape: "50% 50%", tabletPortrait: "50% 50%", mobile: "50% 50%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "balanced-stage", tabletLandscape: "balanced-stage", tabletPortrait: "balanced-stage", mobile: "balanced-stage" },
      tone: "#766757", transition: "void-push", transitionTarget: "central sky opening at 53% / 45%",
      camera: { origin: "53% 45%", start: [0.99, 0, 0.5], read: [1.004, 0, 0], end: [1.052, -0.2, -0.85] },
      cameraMobile: { origin: "53% 47%", start: [0.993, 0, 0.25], read: [1, 0, 0], end: [1.034, -0.1, -0.45] },
      caption: { side: "left", vertical: "bottom" },
      life: { type: "water-reflection", mask: "radial-gradient(ellipse at 76% 82%, #000 0 20%, transparent 48%)", opacity: 0.22 }
    },
    {
      id: "atrium", label: "AN OPEN INTERIOR", eyebrow: "Atrium", title: "An Open Interior",
      description: "The central void connects levels as a sequence of terraces, gardens and shared routes open to the sea.",
      src: "assets/scenes/08-atrium-1600.webp", mobileSrc: "assets/scenes/08-atrium-900.webp",
      focus: { desktop: "50% 50%", tabletLandscape: "50% 50%", tabletPortrait: "50% 50%", mobile: "50% 50%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "cover", tabletLandscape: "cover", tabletPortrait: "balanced-stage", mobile: "balanced-stage" },
      tone: "#6b5b4b", transition: "void-match", transitionTarget: "sea-facing glazing at 67% / 56%",
      camera: { origin: "67% 56%", start: [0.992, 0.45, 0.25], read: [1.004, 0, 0], end: [1.046, -0.8, -0.3] },
      cameraMobile: { origin: "65% 55%", start: [0.994, 0.2, 0.1], read: [1, 0, 0], end: [1.03, -0.4, -0.15] },
      caption: { side: "right", vertical: "bottom" },
      life: { type: "water-reflection", mask: "radial-gradient(ellipse at 58% 80%, #000 0 24%, transparent 53%)", opacity: 0.22 }
    },
    {
      id: "social-lounge", label: "SHARED LIFE", eyebrow: "Shared interior", title: "A Shared Living Room",
      description: "Hospitality spaces extend life beyond the apartment through interiors shaped around view, landscape and social exchange.",
      src: "assets/scenes/10-social-lounge-1600.webp", mobileSrc: "assets/scenes/10-social-lounge-900.webp",
      focus: { desktop: "50% 50%", tabletLandscape: "50% 50%", tabletPortrait: "50% 50%", mobile: "50% 50%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "cover", tabletLandscape: "cover", tabletPortrait: "balanced-stage", mobile: "balanced-stage" },
      tone: "#433b35", transition: "glass-dissolve", transitionTarget: "central seating and coastal glazing at 58% / 58%",
      camera: { origin: "58% 58%", start: [0.992, 0.35, 0.3], read: [1.004, 0, 0], end: [1.045, -0.65, -0.4] },
      cameraMobile: { origin: "58% 58%", start: [0.994, 0.15, 0.15], read: [1, 0, 0], end: [1.03, -0.35, -0.2] },
      caption: { side: "left", vertical: "bottom" },
      life: { type: "light-breath", mask: "linear-gradient(90deg, transparent 0 24%, #000 48% 100%)", opacity: 0.16 }
    },
    {
      id: "office", label: "WORK", eyebrow: "Workplace", title: "Work Above the Horizon",
      description: "Flexible workspaces occupy the perimeter, connecting everyday work with panoramic views across the bay.",
      src: "assets/scenes/09-office-1600.webp", mobileSrc: "assets/scenes/09-office-900.webp",
      focus: { desktop: "50% 50%", tabletLandscape: "50% 50%", tabletPortrait: "50% 50%", mobile: "50% 50%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "balanced-stage", tabletLandscape: "balanced-stage", tabletPortrait: "balanced-stage", mobile: "balanced-stage" },
      tone: "#3d4447", transition: "glass-wipe", transitionTarget: "panoramic glazing at 73% / 54%",
      camera: { origin: "73% 54%", start: [0.99, 0.6, 0.1], read: [1.002, 0, 0], end: [1.04, -1.05, -0.1] },
      cameraMobile: { origin: "70% 54%", start: [0.993, 0.25, 0.05], read: [1, 0, 0], end: [1.027, -0.5, -0.05] },
      caption: { side: "left", vertical: "middle" },
      life: { type: "horizon-haze", mask: "linear-gradient(180deg, transparent 0 36%, #000 48% 68%, transparent 78%)", opacity: 0.15 }
    },
    {
      id: "residence", label: "LIVING", eyebrow: "Residence", title: "Living with the View",
      description: "Curved interiors follow the tower envelope, positioning daily life along the panoramic edge between city and sea.",
      src: "assets/scenes/11-residence-1600.webp", mobileSrc: "assets/scenes/11-residence-900.webp",
      focus: { desktop: "50% 52%", tabletLandscape: "50% 52%", tabletPortrait: "52% 51%", mobile: "52% 51%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "portrait-stage", tabletLandscape: "portrait-stage", tabletPortrait: "portrait-stage", mobile: "portrait-stage" },
      tone: "#2c2824", transition: "depth-dissolve", transitionTarget: "curved living room and daylight",
      camera: { origin: "34% 48%", start: [0.99, 0, 0.35], read: [1.002, 0, 0], end: [1.038, 0.45, -0.35] },
      cameraMobile: { origin: "38% 48%", start: [0.994, 0, 0.15], read: [1, 0, 0], end: [1.025, 0.25, -0.18] },
      caption: { side: "left", vertical: "middle" },
      life: { type: "garden-light", mask: "linear-gradient(180deg, transparent 0 34%, #000 48% 76%, transparent 88%)", opacity: 0.14 }
    },
    {
      id: "sky-lounge", label: "LIFE AT THE EDGE", eyebrow: "Sea lounge", title: "Life at the Edge",
      description: "Living spaces gather around the horizon, where architecture becomes a frame for light, sea and social life.",
      src: "assets/scenes/12-sky-lounge-1600.webp", mobileSrc: "assets/scenes/12-sky-lounge-900.webp",
      focus: { desktop: "50% 52%", tabletLandscape: "52% 52%", tabletPortrait: "54% 52%", mobile: "55% 52%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "portrait-stage", tabletLandscape: "portrait-stage", tabletPortrait: "portrait-stage", mobile: "portrait-stage" },
      tone: "#2e2925", transition: "ceiling-match", transitionTarget: "sea horizon",
      camera: { origin: "52% 62%", start: [0.992, 0, 0.3], read: [1.002, 0, 0], end: [1.036, -0.2, -0.4] },
      cameraMobile: { origin: "52% 60%", start: [0.994, 0, 0.15], read: [1, 0, 0], end: [1.024, -0.1, -0.2] },
      caption: { side: "left", vertical: "middle" },
      life: { type: "sea-shimmer", mask: "linear-gradient(180deg, transparent 0 47%, #000 58% 82%, transparent 92%)", opacity: 0.18 }
    },
    {
      id: "waterfront-coda", label: "CITY TO SEA", eyebrow: "Waterfront coda", title: "City to Sea",
      description: "The completed composition mediates between Benghazi and the Mediterranean through one continuous inhabited ground.",
      src: "assets/scenes/13-waterfront-coda-1600.webp", mobileSrc: "assets/scenes/13-waterfront-coda-900.webp",
      focus: { desktop: "50% 50%", tabletLandscape: "50% 50%", tabletPortrait: "50% 50%", mobile: "50% 50%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "balanced-stage", tabletLandscape: "balanced-stage", tabletPortrait: "balanced-stage", mobile: "balanced-stage" },
      tone: "#657c8a", transition: "horizon-dissolve", transitionTarget: "tower and open sea",
      camera: { origin: "55% 52%", start: [0.99, 0.45, 0.35], read: [1.002, 0, 0], end: [1.034, -0.35, -0.45] },
      cameraMobile: { origin: "55% 52%", start: [0.994, 0.2, 0.15], read: [1, 0, 0], end: [1.022, -0.2, -0.25] },
      caption: { side: "right", vertical: "top" },
      life: { type: "sea-shimmer", mask: "linear-gradient(90deg, #000 0 46%, transparent 68% 100%)", opacity: 0.2 }
    }
  ]
};

/* --------------------------------------------------------------------------
   2. Environment
   -------------------------------------------------------------------------- */

const Env = {
  reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  mode: "desktop",
  mobile: false,
  tabletPortrait: false,
  tabletLandscape: false,
  sync() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const phone = Math.min(width, height) <= 600;
    this.mode = phone
      ? "mobile"
      : width <= 900 && height >= width
        ? "tabletPortrait"
        : width <= 1200
          ? "tabletLandscape"
          : "desktop";
    this.mobile = this.mode === "mobile";
    this.tabletPortrait = this.mode === "tabletPortrait";
    this.tabletLandscape = this.mode === "tabletLandscape";
    document.documentElement.dataset.viewport = this.mode;
    return this.mode;
  },
  get dpr() {
    return Math.min(window.devicePixelRatio || 1, this.mobile ? 1.6 : 2);
  }
};

Env.sync();

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
    const preferred = Env.mobile ? experienceConfig.heroImageMobile : experienceConfig.heroImage;
    for (const url of [preferred, experienceConfig.heroImage, ...experienceConfig.heroImageFallbacks]) {
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
    await new Promise((r) => setTimeout(r, 120));
    return !!src;
  },

  dismiss() {
    return gsap.to(this.el, {
      autoAlpha: 0,
      duration: 0.34,
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

    const mistZones = $$(".hero-mist").filter((zone) => getComputedStyle(zone).display !== "none");
    const mistRoutes = [
      { opacity: Env.mobile ? 0.09 : 0.14, fromX: -2.2, toX: 2.4, fromY: 0.2, toY: -0.3, duration: 138 },
      { opacity: Env.mobile ? 0.07 : 0.11, fromX: 1.8, toX: -1.6, fromY: -0.1, toY: 0.25, duration: 184 },
      { opacity: 0.09, fromX: -1.2, toX: 1.4, fromY: 0.4, toY: -0.25, duration: 156 }
    ];
    mistZones.forEach((mist, index) => {
      const route = mistRoutes[index] || mistRoutes[0];
      gsap.set(mist, { opacity: route.opacity, xPercent: route.fromX, yPercent: route.fromY, scale: 1.03 });
      this.tweens.push(
        gsap.to(mist, {
          xPercent: route.toX,
          yPercent: route.toY,
          scale: 1.055,
          duration: Env.reducedMotion ? route.duration * 3 : route.duration,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1
        })
      );
    });

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
  mode: null, // "video" | "sequence" | "image" | null
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
      } else if (/\.webp$|\.png$|\.jpe?g$/i.test(asset)) {
        if (await this.tryImage(url)) {
          this.mode = "image";
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

  tryImage(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.className = "bird__media";
      img.alt = "";
      img.onload = () => {
        this.image = img;
        this.el.appendChild(img);
        resolve(true);
      };
      img.onerror = () => resolve(false);
      img.src = url;
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
    } else if (this.mode === "sequence") {
      this.seqStart = performance.now();
      this.drawSequence();
    }

    /* Open sky only. The route never crosses the tower's silhouette; portrait
       crops put the tower mid-frame, so they get a higher, shorter route. */
    const route = Env.mobile
      ? [
          { x: 0.86, y: 0.01, s: 0.42, d: 0.24 },
          { x: 0.52, y: 0.015, s: 0.62, d: 0.34 },
          { x: 0.15, y: 0.12, s: 1.08, d: 0.4 },
          { x: -0.3, y: 0.28, s: 1.42, d: 0.35 }
        ]
      : [
          { x: 0.84, y: -0.02, s: 0.44, d: 0.26 },
          { x: 0.52, y: -0.025, s: 0.62, d: 0.4 },
          { x: 0.14, y: 0.11, s: 1.18, d: 0.44 },
          { x: -0.28, y: 0.27, s: 1.72, d: 0.4 }
        ];

    this.tl = gsap
      .timeline({
        onComplete: () => {
          this.el.style.filter = "none";
          if (this.mode === "video") this.video.pause();
          else if (this.mode === "sequence") cancelAnimationFrame(this.seqFrame);
          this.queueIdleRepeat();
        }
      })
      .set(this.el, { x: vw * 1.08, y: vh * 0.08, scale: 0.38 * scaleFactor, opacity: 0 })
      .to(this.el, { opacity: 1, duration: 0.18, ease: "power1.out" }, 0)
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
      .to(blur, { v: 2.2 * scaleFactor, duration: 0.45, ease: "power2.in", onUpdate: applyBlur }, 0.8)
      .to(this.el, { opacity: 0, duration: 0.26, ease: "power2.in" }, 1.18);
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
    if (!experienceConfig.birdIdleRepeatAfter) return;
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

const SceneDeck = {
  layers: [],
  loaded: new Set(),
  current: 0,

  render() {
    const stack = $("#scene-stack");
    const hero = $(".cinema-layer--hero");
    this.layers = [hero];

    experienceConfig.scenes.slice(1).forEach((scene, offset) => {
      const index = offset + 1;
      const layer = document.createElement("figure");
      layer.className = "cinema-layer";
      layer.dataset.sceneIndex = String(index);
      layer.dataset.sceneId = scene.id;
      layer.dataset.transition = scene.transition;
      layer.setAttribute("aria-hidden", "true");
      layer.style.zIndex = String(index + 2);

      const media = document.createElement("div");
      media.className = "cinema-media";
      const img = document.createElement("img");
      img.alt = scene.description;
      img.decoding = "async";
      img.loading = "lazy";
      img.dataset.src = scene.src;
      img.dataset.mobileSrc = scene.mobileSrc;
      media.appendChild(img);

      const life = document.createElement("div");
      life.className = "scene-life";
      life.setAttribute("aria-hidden", "true");
      if (scene.life) life.dataset.life = scene.life.type;

      if (scene.caption) {
        const caption = document.createElement("figcaption");
        caption.className = "scene-caption";
        caption.dataset.side = scene.caption.side || "left";
        caption.dataset.vertical = scene.caption.vertical || "bottom";
        const indexLabel = document.createElement("span");
        indexLabel.className = "scene-caption__index u-label";
        indexLabel.textContent = `${String(index + 1).padStart(2, "0")} — ${scene.eyebrow}`;
        const title = document.createElement("h2");
        title.textContent = scene.title;
        const statement = document.createElement("p");
        statement.textContent = scene.description;
        caption.append(indexLabel, title, statement);
        layer.append(media, life, caption);
      } else {
        layer.append(media, life);
      }
      stack.appendChild(layer);
      this.layers.push(layer);
    });

    this.applyFraming();
    this.loadAround(0);
  },

  applyFraming() {
    const mode = Env.mode;
    experienceConfig.scenes.forEach((scene, index) => {
      const layer = this.layers[index];
      if (!layer) return;
      const focus = scene.focus[mode] || scene.focus.desktop;
      const scale = scene.scale[mode] || scene.scale.desktop;
      const presentation = scene.presentation[mode] || scene.presentation.desktop;
      layer.style.setProperty("--scene-focus", focus);
      layer.style.setProperty("--scene-scale", String(scale || 1));
      layer.style.setProperty("--scene-tone", scene.tone || "#101215");
      layer.style.setProperty("--life-mask", scene.life?.mask || "none");
      layer.style.setProperty("--life-opacity", String(scene.life?.opacity || 0));
      layer.dataset.presentation = presentation;
    });
  },

  refreshSources() {
    this.loaded.forEach((index) => {
      const img = $("img", this.layers[index]);
      if (!img) return;
      const source = Env.mobile ? img.dataset.mobileSrc : img.dataset.src;
      img.src = source;
      this.layers[index].style.setProperty("--scene-image", `url("${source}")`);
    });
  },

  load(index) {
    if (index <= 0 || index >= this.layers.length || this.loaded.has(index)) return;
    const img = $("img", this.layers[index]);
    if (!img) return;
    const source = Env.mobile ? img.dataset.mobileSrc : img.dataset.src;
    img.src = source;
    this.layers[index].style.setProperty("--scene-image", `url("${source}")`);
    this.loaded.add(index);
  },

  loadAround(index) {
    const keep = new Set();
    const start = body.dataset.state === "ready" ? Math.max(1, index - 1) : 1;
    for (let i = start; i <= Math.min(this.layers.length - 1, index + 1); i++) {
      keep.add(i);
      this.load(i);
    }
    if (body.dataset.state !== "ready") return;
    [...this.loaded].forEach((loadedIndex) => {
      if (keep.has(loadedIndex)) return;
      const img = $("img", this.layers[loadedIndex]);
      if (img) img.removeAttribute("src");
      this.layers[loadedIndex].style.removeProperty("--scene-image");
      this.loaded.delete(loadedIndex);
    });
  },

  setActive(index) {
    const next = Math.max(0, Math.min(index, this.layers.length - 1));
    if (next === this.current) {
      this.loadAround(next);
      return;
    }
    this.layers.forEach((layer, i) => layer.setAttribute("aria-hidden", i === next ? "false" : "true"));
    this.current = next;
    this.loadAround(next);
  },

  enterState(type) {
    if (Env.reducedMotion) return { autoAlpha: 0 };
    if (Env.mobile) {
      return { autoAlpha: 0, scale: ["matched-push", "void-push", "void-match"].includes(type) ? 1.012 : 1.006 };
    }
    if (Env.tabletPortrait && ["ribbon-wipe", "ribbon-match", "void-push", "void-match"].includes(type)) {
      return { autoAlpha: 0, scale: 1.018 };
    }
    switch (type) {
      case "matched-push":
        return { autoAlpha: 0, scale: 0.985 };
      case "tower-rise":
        return { autoAlpha: 1, clipPath: "inset(100% 0 0 0)", scale: 0.994 };
      case "horizon-cut":
        return { autoAlpha: 1, clipPath: "inset(0 0 100% 0)", scale: 1.004 };
      case "ribbon-wipe":
      case "ribbon-match":
        return { autoAlpha: 1, clipPath: "polygon(0 86%, 30% 78%, 68% 94%, 100% 82%, 100% 100%, 0 100%)" };
      case "void-push":
      case "void-match":
        return { autoAlpha: 1, clipPath: "circle(7% at 54% 47%)", scale: 1.015 };
      case "glass-wipe":
        return { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" };
      case "ceiling-match":
        return { autoAlpha: 1, clipPath: "inset(100% 0 0 0)" };
      case "depth-dissolve":
        return { autoAlpha: 0, scale: 1.035, filter: "blur(3px)" };
      default:
        return { autoAlpha: 0, scale: 1.008 };
    }
  },

  enterEndState(type) {
    if (Env.mobile || Env.tabletPortrait) {
      return { autoAlpha: 1, scale: 1, clipPath: "inset(0 0 0 0)", filter: "none" };
    }
    if (["ribbon-wipe", "ribbon-match"].includes(type)) {
      return { autoAlpha: 1, scale: 1, clipPath: "polygon(0 0, 30% 0, 68% 0, 100% 0, 100% 100%, 0 100%)", filter: "none" };
    }
    if (["void-push", "void-match"].includes(type)) {
      return { autoAlpha: 1, scale: 1, clipPath: "circle(150% at 54% 47%)", filter: "none" };
    }
    return { autoAlpha: 1, scale: 1, clipPath: "inset(0 0 0 0)", filter: "none" };
  },

  cameraFor(scene) {
    const desktop = scene.camera;
    if (Env.mobile) return scene.cameraMobile || desktop;
    if (!Env.tabletPortrait && !Env.tabletLandscape) return desktop;
    const mobile = scene.cameraMobile || desktop;
    const amount = Env.tabletPortrait ? 0.55 : 0.28;
    const blend = (a, b) => a.map((value, index) => value + (b[index] - value) * amount);
    return {
      origin: Env.tabletPortrait ? mobile.origin : desktop.origin,
      start: blend(desktop.start, mobile.start),
      read: blend(desktop.read, mobile.read),
      end: blend(desktop.end, mobile.end)
    };
  }
};

const Intro = {
  tl: null,

  build() {
    const media = $(".hero-media");
    const stage = $(".hero-reveal");
    const haze = $("#haze");
    const far = $(".cloud--far");
    const mid = $(".cloud--mid");
    const near = $(".cloud--near");
    const foreground = $(".cloud--foreground");
    const blurAmount = Env.mobile ? experienceConfig.descentBlurMobile : experienceConfig.descentBlur;
    const defocus = { v: blurAmount };
    const applyDefocus = () => {
      media.style.filter = defocus.v > 0.3 ? `blur(${defocus.v.toFixed(1)}px)` : "none";
    };

    body.dataset.state = "intro";

    /* The destination frame is already in place from the first millisecond —
       high above, defocused, and completely inside the cloud layer. */
    gsap.set(stage, { opacity: 1 });
    gsap.set(media, { scale: experienceConfig.descentStartScale, yPercent: 2.2 });
    applyDefocus();

    if (Env.reducedMotion) return this.buildReduced(media, haze, defocus, applyDefocus);
    if (Env.mobile) return this.buildMobile(media, stage, haze, far, mid, near);

    const tl = gsap.timeline({ onComplete: () => Experience.handOver() });

    /* ── inside the cloud ───────────────────────────────────────────────── */
    tl.set(haze, { opacity: 0.22 })
      .set(far, { opacity: 0.62, scale: 1.01, xPercent: -1, yPercent: -1 })
      .set(mid, { opacity: 0.76, scale: 1.06, xPercent: 1.5, yPercent: 1 })
      .set(near, { opacity: 0.88, scale: 1.12, xPercent: -2, yPercent: -1 })
      .set(foreground, { opacity: 0.94, scale: 1.25, xPercent: 4, yPercent: 3 })

      /* ── the near banks pass the camera first ──────────────────────────── */
      .to(foreground, { scale: 3.9, xPercent: 13, yPercent: 16, duration: 1.35, ease: "power2.in" }, 0)
      .to(foreground, { opacity: 0, duration: 0.75, ease: "power1.in" }, 0.55)
      .to(near, { scale: 3.2, xPercent: -8, yPercent: 12, duration: 2.1, ease: "power1.in" }, 0.05)
      .to(near, { opacity: 0, duration: 1.05, ease: "power1.in" }, 0.9)

      /* ── the mid bank opens: light, horizon and sea start to come through ─ */
      .to(mid, { scale: 2.4, xPercent: 7, yPercent: 8, duration: 2.75, ease: "power1.in" }, 0.35)
      .to(mid, { opacity: 0.3, duration: 0.9, ease: "none" }, 1.15)
      .to(mid, { opacity: 0, duration: 1.25, ease: "power1.inOut" }, 2.05)

      /* ── the far haze thins last ───────────────────────────────────────── */
      .to(far, { scale: 1.72, xPercent: -3, yPercent: 5, duration: 2.95, ease: "power1.inOut" }, 0.65)
      .to(far, { opacity: 0.28, duration: 1, ease: "none" }, 1.55)
      .to(far, { opacity: 0, duration: 1.2, ease: "power1.inOut" }, 2.35)

      /* ── the whiteout lifts in stages, never in one fade ───────────────── */
      .to(haze, { opacity: 0.08, duration: 1.15, ease: "none" }, 0.25)
      .to(haze, { opacity: 0, duration: 1.2, ease: "power1.inOut" }, 1.35)

      /* ── the descent itself: still falling, then easing to a stop ───────── */
      .addLabel("arrival", 3.72)
      .to(media, { scale: 1.075, yPercent: 0.9, duration: 2.15, ease: "none" }, 0)
      .to(
        media,
        {
          scale: 1.012,
          yPercent: 0,
          duration: 1.55,
          ease: "power2.out"
        },
        2.15
      )

      /* ── focus resolves as we come out of the cloud ─────────────────────── */
      .to(defocus, { v: Math.min(blurAmount * 0.4, 4), duration: 1.45, ease: "none", onUpdate: applyDefocus }, 0.15)
      .to(defocus, { v: 0, duration: 1.7, ease: "power2.out", onUpdate: applyDefocus }, 1.55)

      .call(() => Atmosphere.start(), null, 2.95);

    /* Only once the frame has settled. */
    this.appendReveal(tl, 3.18);
    this.tl = tl;
    return tl;
  },

  buildMobile(media, stage, haze, far, mid, near) {
    const tl = gsap.timeline({ onComplete: () => Experience.handOver() });

    gsap.set(stage, { opacity: 1 });
    tl.set(haze, { opacity: 0.2 })
      .set(far, { opacity: 0.6, scale: 1.02, xPercent: -1, yPercent: -1 })
      .set(mid, { opacity: 0.72, scale: 1.08, xPercent: 2, yPercent: 1 })
      .set(near, { opacity: 0.86, scale: 1.15, xPercent: -2, yPercent: -1 })
      .to(near, { scale: 2.95, xPercent: -8, yPercent: 11, opacity: 0, duration: 1.85, ease: "power1.in" }, 0)
      .to(mid, { scale: 2.15, xPercent: 7, yPercent: 7, opacity: 0, duration: 2.45, ease: "power1.inOut" }, 0.35)
      .to(far, { scale: 1.6, xPercent: -2, yPercent: 4, opacity: 0, duration: 2.95, ease: "power1.inOut" }, 0.7)
      .to(haze, { opacity: 0.07, duration: 0.95, ease: "none" }, 0.25)
      .to(haze, { opacity: 0, duration: 1.1, ease: "power1.inOut" }, 1.15)
      .to(media, { scale: 1.06, yPercent: 0.8, duration: 2.1, ease: "none" }, 0)
      .to(media, { scale: 1.012, yPercent: 0, duration: 1.4, ease: "power2.out" }, 2.1)
      .addLabel("arrival", 3.52)
      .call(() => Atmosphere.start(), null, 2.75);

    this.appendReveal(tl, 3.1);
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
    const dur = Env.reducedMotion ? 0.45 : 1;

    /* the bird crosses the settled frame before the title arrives */
    const birdScale = Env.mobile ? 0.76 : Env.tabletPortrait ? 0.86 : Env.tabletLandscape ? 0.94 : 1;
    const birdAt = (tl.labels.arrival ?? at - 1.8) + experienceConfig.birdFirstDelay;
    tl.call(() => Bird.fly(birdScale), null, birdAt)
      .to($(".hud"), { autoAlpha: 1, duration: 0.62 * dur, ease: "power2.out" }, at - 0.08)
      .to($(".signature"), { autoAlpha: 1, duration: 0.62 * dur, ease: "power2.out" }, at + 0.02)
      .to(rule, { scaleX: 1, duration: 0.72 * dur, ease: "power3.inOut" }, at)
      .to(place, { opacity: 1, y: 0, duration: 0.5 * dur, ease: "power2.out" }, at + 0.1)
      .to(lines, { y: "0%", duration: 0.68 * dur, ease: "power3.out", stagger: 0.06 }, at + 0.2)
      .to(subtitle, { opacity: 1, duration: 0.55 * dur, ease: "power2.out" }, at + 0.62)
      .to($(".hud__cue"), { opacity: 1, duration: 0.48 * dur, ease: "power2.out" }, at + 0.86)
      .to($(".hud__progress"), { opacity: 1, duration: 0.48 * dur, ease: "power2.out" }, at + 0.86);
  },

  /* No visible control sits over the descent; the gesture is enough. */
  skip() {
    if (!this.tl || !this.tl.isActive()) return;
    const target = this.tl.duration();
    if (this.tl.time() < target) this.tl.tweenTo(target, { duration: 0.7, ease: "power2.inOut" });
  }
};

/* --------------------------------------------------------------------------
   8. Scroll framework — engaged only after arrival
   -------------------------------------------------------------------------- */

const ScrollFramework = {
  triggers: [],
  timeline: null,
  trigger: null,
  currentIndex: 0,
  segmentDuration: 1.12,

  build() {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    this.buildJourney();
    ScrollTrigger.refresh();
  },

  buildJourney() {
    const type = $(".hero-type");
    const drift = $(".sky-drift");
    const flare = $(".transition-flare");
    const layers = SceneDeck.layers;
    const segment = this.segmentDuration;
    const distance = () => {
      const pace = Env.mobile ? 0.78 : Env.tabletPortrait ? 0.88 : Env.tabletLandscape ? 0.96 : 1.08;
      return Math.max(900, (experienceConfig.scenes.length - 1) * window.innerHeight * pace);
    };

    gsap.set(layers.slice(1), { clearProps: "transform,opacity,visibility,clipPath,filter" });
    gsap.set(layers[0], { autoAlpha: 1 });
    gsap.set(layers.slice(1), { autoAlpha: 0 });
    gsap.set($$(".scene-caption"), { opacity: 0, y: 14 });
    gsap.set($$(".scene-life"), { opacity: 0, xPercent: -1 });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        id: "architecturalJourney",
        trigger: "#scene-project",
        start: "top top",
        end: () => `+=${distance()}`,
        pin: true,
        pinSpacing: true,
        scrub: true, // bound to the scrollbar: stop = frozen, up = reversed
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => this.updateProgress(self.progress)
      }
    });

    experienceConfig.scenes.forEach((scene, index) => {
      const at = index * segment;
      const layer = layers[index];
      const media = index === 0 ? $(".hero-media") : $(".cinema-media img", layer);
      const caption = $(".scene-caption", layer);
      const life = $(".scene-life", layer);
      const camera = SceneDeck.cameraFor(scene);
      const arriveDuration = segment * 0.22;
      const readDuration = segment * 0.42;
      const moveDuration = segment - arriveDuration - readDuration;

      tl.addLabel(scene.id, at)
        .fromTo(
          media,
          {
            transformOrigin: camera.origin,
            scale: Env.reducedMotion ? camera.read[0] : camera.start[0],
            xPercent: Env.reducedMotion ? camera.read[1] : camera.start[1],
            yPercent: Env.reducedMotion ? camera.read[2] : camera.start[2]
          },
          {
            scale: camera.read[0],
            xPercent: camera.read[1],
            yPercent: camera.read[2],
            duration: arriveDuration,
            ease: "power1.out",
            immediateRender: index === 0
          },
          at
        )
        .to(
          media,
          {
            scale: camera.read[0],
            xPercent: camera.read[1],
            yPercent: camera.read[2],
            duration: readDuration,
            ease: "none"
          },
          at + arriveDuration
        )
        .to(
          media,
          {
            scale: Env.reducedMotion ? camera.read[0] : camera.end[0],
            xPercent: Env.reducedMotion ? camera.read[1] : camera.end[1],
            yPercent: Env.reducedMotion ? camera.read[2] : camera.end[2],
            duration: moveDuration,
            ease: "power1.in"
          },
          at + arriveDuration + readDuration
        );

      if (index === 0) {
        tl.to(drift, { opacity: 0.2, duration: segment * 0.65 }, at)
          .to(type, { yPercent: -22, opacity: 0, ease: "power1.in", duration: segment * 0.48 }, at + segment * 0.18)
          .to(document.documentElement, { "--scrim-strength": 0.62, "--vignette-strength": 0.46, duration: segment * 0.62 }, at + segment * 0.08)
          .to($(".hud__cue"), { opacity: 0, duration: segment * 0.14 }, at + segment * 0.04);
        return;
      }

      const previous = layers[index - 1];
      const transitionAt = at - segment * 0.14;
      const transitionDuration = Env.reducedMotion ? segment * 0.16 : segment * 0.34;
      tl.fromTo(
        layer,
        SceneDeck.enterState(scene.transition),
        {
          ...SceneDeck.enterEndState(scene.transition),
          duration: transitionDuration,
          ease: ["matched-push", "void-push", "void-match"].includes(scene.transition) ? "power2.out" : "power1.inOut",
          immediateRender: false
        },
        transitionAt
      ).to(previous, { autoAlpha: 0, duration: segment * 0.22, ease: "power1.in" }, at + segment * 0.08);

      if (caption) {
        tl.fromTo(
          caption,
          { opacity: 0, y: Env.reducedMotion ? 0 : 14 },
          { opacity: 1, y: 0, duration: segment * 0.16, ease: "power2.out", immediateRender: false },
          at + segment * 0.12
        ).to(
          caption,
          { opacity: 0, y: Env.reducedMotion ? 0 : -6, duration: segment * 0.12, ease: "power1.in" },
          at + segment * 0.52
        );
      }

      if (life && scene.life) {
        tl.fromTo(
          life,
          { opacity: 0, xPercent: -1.2, yPercent: 0.25 },
          {
            opacity: Env.reducedMotion ? scene.life.opacity * 0.45 : scene.life.opacity,
            xPercent: 0,
            yPercent: 0,
            duration: arriveDuration + readDuration,
            ease: "sine.out",
            immediateRender: false
          },
          at
        ).to(
          life,
          {
            opacity: Env.reducedMotion ? scene.life.opacity * 0.35 : scene.life.opacity * 0.72,
            xPercent: Env.reducedMotion ? 0 : 1.2,
            yPercent: Env.reducedMotion ? 0 : -0.2,
            duration: moveDuration,
            ease: "sine.inOut"
          },
          at + arriveDuration + readDuration
        );
      }

      if (["light-cut", "horizon-cut", "horizon-dissolve"].includes(scene.transition)) {
        tl.fromTo(
          flare,
          { opacity: 0 },
          { opacity: Env.reducedMotion ? 0 : 0.32, duration: segment * 0.12, yoyo: true, repeat: 1, ease: "sine.inOut" },
          transitionAt + segment * 0.08
        );
      }
    });

    tl.call(() => {}, null, experienceConfig.scenes.length * segment);

    this.timeline = tl;
    this.trigger = tl.scrollTrigger;
    this.triggers.push(tl.scrollTrigger);
    return tl;
  },

  updateProgress(progress) {
    const bar = $(".hud__progress-bar");
    const label = $(".hud__progress-label");
    const time = progress * this.timeline.duration();
    const index = Math.max(
      0,
      Math.min(experienceConfig.scenes.length - 1, Math.floor((time + this.segmentDuration * 0.12) / this.segmentDuration))
    );
    gsap.set(bar, { scaleY: progress });
    if (index !== this.currentIndex) {
      this.currentIndex = index;
      SceneDeck.setActive(index);
    }
    const nextLabel = `${String(index + 1).padStart(2, "0")} — ${experienceConfig.scenes[index].label}`;
    if (label.textContent !== nextLabel) label.textContent = nextLabel;
  },

  scrollToScene(index, behavior = Env.reducedMotion ? "auto" : "smooth") {
    if (!this.trigger || !this.timeline) return;
    const scene = experienceConfig.scenes[index];
    if (!scene) return;
    const labelTime = this.timeline.labels[scene.id] || 0;
    const time = Math.min(this.timeline.duration(), labelTime + (index ? this.segmentDuration * 0.28 : 0));
    const progress = time / this.timeline.duration();
    const top = this.trigger.start + (this.trigger.end - this.trigger.start) * progress;
    window.scrollTo({ top, behavior });
  },

  destroy() {
    this.triggers.forEach((t) => t && t.kill());
    this.timeline && this.timeline.kill();
    this.triggers = [];
    this.timeline = null;
    this.trigger = null;
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
    $$('[data-scene-target]', this.menu).forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.sceneTarget);
        this.hide(false);
        requestAnimationFrame(() => ScrollFramework.scrollToScene(index));
      });
    });
    document.addEventListener("keydown", (e) => {
      if (this.menu.dataset.open === "true") {
        if (e.key === "Escape") this.hide();
        if (e.key === "Tab") this.trap(e, this.menu);
      }
    });
    $(".hud__cue").addEventListener("click", () => {
      ScrollFramework.scrollToScene(1);
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

  hide(restoreFocus = true) {
    this.menu.dataset.open = "false";
    this.menu.setAttribute("aria-hidden", "true");
    this.trigger.setAttribute("aria-expanded", "false");
    if (body.dataset.state === "ready") body.style.overflow = "";
    if (restoreFocus) this.lastFocus && this.lastFocus.focus();
  },

  trap(e, container) {
    const items = $$("a, button", container).filter((el) => el.offsetParent !== null);
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
    SceneDeck.render();
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
    const mode = Env.mode;
    root.style.setProperty(
      "--hero-object-position",
      experienceConfig.scenes[0].focus[mode] || experienceConfig.scenes[0].focus.desktop
    );
    root.style.setProperty("--sky-mask-end", experienceConfig.skyMaskEnd);
    root.style.setProperty("--sky-mask-fade", experienceConfig.skyMaskFade);
    SceneDeck.applyFraming();
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
    let sceneBeforeResize = null;
    let viewportState = {
      width: window.innerWidth,
      orientation: window.innerWidth >= window.innerHeight ? "landscape" : "portrait",
      mode: Env.mode
    };
    window.addEventListener(
      "resize",
      () => {
        if (sceneBeforeResize === null) sceneBeforeResize = ScrollFramework.currentIndex;
        clearTimeout(rt);
        rt = setTimeout(() => {
          const orientation = window.innerWidth >= window.innerHeight ? "landscape" : "portrait";
          const substantialWidthChange = Math.abs(window.innerWidth - viewportState.width) > 40;
          if (!substantialWidthChange && orientation === viewportState.orientation) {
            sceneBeforeResize = null;
            return;
          }

          const activeScene = sceneBeforeResize;
          const wasMobile = Env.mobile;
          Env.sync();
          if (wasMobile !== Env.mobile) SceneDeck.refreshSources();
          this.applyFraming();
          if (window.ScrollTrigger && ScrollFramework.trigger) {
            ScrollFramework.destroy();
            ScrollFramework.currentIndex = activeScene;
            ScrollFramework.build();
            requestAnimationFrame(() => ScrollFramework.scrollToScene(activeScene, "auto"));
          }
          viewportState = { width: window.innerWidth, orientation, mode: Env.mode };
          sceneBeforeResize = null;
        }, 240);
      },
      { passive: true }
    );
  }
};

if (window.gsap) {
  Experience.start();
} else {
  /* No GSAP: still deliver the project, statically and completely. */
  SceneDeck.render();
  Experience.applyFraming();
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
  $(".signature").style.cssText = "opacity:1;visibility:visible";
  $$(".hero-type__title .line > span").forEach((el) => (el.style.transform = "none"));
  $(".hero-type__rule").style.transform = "scaleX(1)";
  $(".hero-type__place").style.opacity = 1;
  $(".hero-type__subtitle").style.opacity = 1;
  $(".hud__cue").style.opacity = 1;
}
