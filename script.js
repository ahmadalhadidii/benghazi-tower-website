/* ==========================================================================
   BENGHAZI TOWER — A NEW WAY OF LIVING
   script.js

     1.  experienceConfig      — curated 9-scene configuration
     2.  Env                   — viewport detection
     3.  Loader                — real progress; asks for the render if absent
     4.  AmbientSound          — persistent ambience and master gain
     5.  HeroFilm              — silent live-film handoff
     6.  Atmosphere + Intro    — cloud depth and one-time descent
     7.  SceneNavigation       — one gesture = one scene (desktop + touch)
     8.  Interface + Boot      — HUD, menu, cue, startup
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. Configuration — 9 curated scenes, Proposal 01 only
   -------------------------------------------------------------------------- */

const experienceConfig = {
  /* Opening */
  descentStartScale: 1.018,
  introProfiles: {
    desktop:        { dprCap: 2,    cloudCount: 2, mistCount: 2, skyDrift: false },
    tabletLandscape:{ dprCap: 1.5,  cloudCount: 1, mistCount: 1, skyDrift: false },
    tabletPortrait: { dprCap: 1.5,  cloudCount: 1, mistCount: 1, skyDrift: false },
    tabletLite:     { dprCap: 1.25, cloudCount: 1, mistCount: 1, skyDrift: false },
    mobile:         { dprCap: 1.25, cloudCount: 1, mistCount: 1, skyDrift: false },
    lite:           { dprCap: 1,    cloudCount: 1, mistCount: 1, skyDrift: false }
  },

  /* Hero render */
  heroImage:              "assets/video/benghazi-tower-arrival-poster.webp",
  heroImageMobile:        "assets/video/benghazi-tower-arrival-poster.webp",
  heroImageFallbacks:     [
    "assets/images/benghazi-tower-hero.jpg",
    "assets/images/benghazi-tower-hero.png",
    "assets/images/benghazi-tower-hero.jpeg"
  ],
  heroObjectPosition:       "50% 50%",
  heroObjectPositionMobile: "50% 50%",

  /* Atmosphere */
  skyDriftEnabled:    false,
  skyDriftAmount:     1.1,
  skyDriftDuration:   190,
  skyDriftOpacity:    0.3,
  skyMaskEnd:         "9%",
  skyMaskFade:        "17%",

  debugMode: false,

  /* ─────────────────────────────────────────────────────────────────────────
     9-scene journey — Proposal 01 only
     ───────────────────────────────────────────────────────────────────────── */
  scenes: [

    /* 01 — ARRIVAL -------------------------------------------------------- */
    {
      id: "arrival",
      label: "A NEW WAY OF LIVING",
      eyebrow: "Benghazi, Libya",
      title: "Benghazi Tower",
      description: "Tower, podium and landscape form one continuous waterfront system rather than a building placed on an isolated base.",
      focus: { desktop: "50% 46%", tabletLandscape: "54% 46%", tabletPortrait: "56% 44%", mobile: "58% 43%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "cover", tabletLandscape: "cover", tabletPortrait: "cover", mobile: "cover" },
      tone: "#8b8176",
      transition: "hero",
      transitionTarget: "tower podium at 56% / 67%",
      camera: {
        origin: "52% 66%",
        start: [1,    0,    0   ],
        read:  [1.012,  -0.1, -0.2],
        end:   [1.048, -0.7, -1.0]
      },
      cameraMobile: {
        origin: "57% 63%",
        start: [1,    0,    0   ],
        read:  [1.008,  0,    -0.1],
        end:   [1.032, -0.3, -0.6]
      },
      caption: false
    },

    /* 02 — GROUND TO SKY -------------------------------------------------- */
    {
      id: "ground-to-sky",
      label: "GROUND TO SKY",
      eyebrow: "Architectural Form",
      title: "Ground to Sky",
      description: "The sculpted podium rises into an expressive shell, connecting public life at ground level with the vertical tower above.",
      proposalRef: "Proposal 01, page 18 — aerial master view",
      src:       "assets/scenes/01-aerial-detail-1600.webp",
      mobileSrc: "assets/scenes/01-aerial-detail-900.webp",
      focus: { desktop: "52% 50%", tabletLandscape: "52% 50%", tabletPortrait: "52% 50%", mobile: "52% 50%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "standard-landscape", tabletLandscape: "standard-landscape", tabletPortrait: "standard-landscape", mobile: "standard-landscape" },
      tone: "#7d776f",
      transition: "matched-push",
      transitionTarget: "podium-to-tower fold at 57% / 68%",
      camera: {
        origin: "57% 68%",
        start: [1,    0.4,  0  ],
        read:  [1.006, 0,    0  ],
        end:   [1.042, -0.6, 0  ]
      },
      cameraMobile: {
        origin: "57% 66%",
        start: [1,    0.2,  0  ],
        read:  [1.004, 0,    0  ],
        end:   [1.028, -0.3, 0  ]
      },
      caption: {
        desktop: { side: "left", vertical: "top",    tone: "dark",  scrim: "light", maxWidth: "20rem" },
        mobile:  { side: "left", vertical: "bottom", tone: "light", scrim: "dark",  maxWidth: "21rem" }
      },
      life: { type: "sea-shimmer", mask: "linear-gradient(180deg, transparent 0 42%, #000 58% 88%, transparent 98%)", opacity: 0.2 }
    },

    /* 03 — THE SCULPTED GROUND -------------------------------------------- */
    {
      id: "sculpted-ground",
      label: "THE SCULPTED GROUND",
      eyebrow: "Podium",
      title: "The Sculpted Ground",
      description: "Fluid carving opens the podium into terraces, landscape and circulation, extending public activity through the base of the tower.",
      proposalRef: "Proposal 01, page 19 — waterfront approach",
      src:       "assets/scenes/03-promenade-1600.webp",
      mobileSrc: "assets/scenes/03-promenade-900.webp",
      focus: { desktop: "50% 50%", tabletLandscape: "50% 50%", tabletPortrait: "50% 50%", mobile: "50% 50%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "standard-landscape", tabletLandscape: "standard-landscape", tabletPortrait: "standard-landscape", mobile: "standard-landscape" },
      tone: "#463f37",
      transition: "horizon-cut",
      transitionTarget: "glazed podium entrance at 73% / 54%",
      camera: {
        origin: "73% 54%",
        start: [1,    -0.35, 0  ],
        read:  [1.006,  0,    0  ],
        end:   [1.044, -0.75, 0  ]
      },
      cameraMobile: {
        origin: "70% 54%",
        start: [1,    -0.18, 0  ],
        read:  [1.004,  0,    0  ],
        end:   [1.028, -0.4,  0  ]
      },
      caption: {
        desktop: { side: "left", vertical: "bottom", tone: "light", scrim: "dark", maxWidth: "21rem" },
        mobile:  { side: "left", vertical: "bottom", tone: "light", scrim: "dark", maxWidth: "20rem" }
      },
      life: { type: "sea-shimmer", mask: "linear-gradient(90deg, #000 0 30%, transparent 47% 100%)", opacity: 0.22 }
    },

    /* 04 — A CONTINUOUS GROUND -------------------------------------------- */
    {
      id: "continuous-ground",
      label: "A CONTINUOUS GROUND",
      eyebrow: "Landscape",
      title: "A Continuous Ground",
      description: "Pedestrian movement and planting follow the building's curved geometry, connecting arrival, architecture and waterfront landscape.",
      proposalRef: "Proposal 01, page 20 — podium close",
      src:       "assets/scenes/04-podium-close-1600.webp",
      mobileSrc: "assets/scenes/04-podium-close-900.webp",
      focus: { desktop: "50% 50%", tabletLandscape: "50% 50%", tabletPortrait: "50% 50%", mobile: "50% 50%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "standard-landscape", tabletLandscape: "standard-landscape", tabletPortrait: "standard-landscape", mobile: "standard-landscape" },
      tone: "#5f615d",
      transition: "ribbon-wipe",
      transitionTarget: "sweeping planted ribbon at 61% / 55%",
      camera: {
        origin: "61% 55%",
        start: [1,    0.35, 0  ],
        read:  [1.006, 0,    0  ],
        end:   [1.044, -0.7, 0  ]
      },
      cameraMobile: {
        origin: "61% 55%",
        start: [1,    0.18, 0  ],
        read:  [1.004, 0,    0  ],
        end:   [1.028, -0.35, 0 ]
      },
      caption: {
        desktop: { side: "left", vertical: "top",    tone: "dark",  scrim: "light", maxWidth: "21rem" },
        mobile:  { side: "left", vertical: "bottom", tone: "light", scrim: "dark",  maxWidth: "20rem" }
      },
      life: { type: "water-reflection", mask: "radial-gradient(ellipse at 58% 78%, #000 0 24%, transparent 52%)", opacity: 0.24 }
    },

    /* 05 — COURTYARD INTERIOR --------------------------------------------- */
    {
      id: "courtyard",
      label: "THE SOCIAL HEART",
      eyebrow: "Courtyard Interior",
      title: "The Social Heart",
      description: "A multi-level court draws daylight, landscape and public activity deep into the podium while maintaining a direct visual connection to the waterfront.",
      proposalRef: "Proposal 01, page 22 — Courtyard Interior",
      src:       "assets/scenes/07-public-court-1600.webp",
      mobileSrc: "assets/scenes/07-public-court-900.webp",
      focus: { desktop: "50% 50%", tabletLandscape: "50% 50%", tabletPortrait: "50% 50%", mobile: "50% 50%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "standard-landscape", tabletLandscape: "standard-landscape", tabletPortrait: "standard-landscape", mobile: "standard-landscape" },
      tone: "#766757",
      transition: "void-push",
      transitionTarget: "central sky opening at 53% / 45%",
      camera: {
        origin: "53% 45%",
        start: [1,    0,    0  ],
        read:  [1.006, 0,    0  ],
        end:   [1.044, -0.18, 0 ]
      },
      cameraMobile: {
        origin: "53% 47%",
        start: [1,    0,    0  ],
        read:  [1.004, 0,    0  ],
        end:   [1.028, -0.1,  0 ]
      },
      caption: {
        desktop: { side: "left", vertical: "bottom", tone: "light", scrim: "dark", maxWidth: "20rem" },
        mobile:  { side: "left", vertical: "bottom", tone: "light", scrim: "dark", maxWidth: "20rem" }
      },
      life: { type: "water-reflection", mask: "radial-gradient(ellipse at 76% 82%, #000 0 20%, transparent 48%)", opacity: 0.22 }
    },

    /* 06 — RECEPTION ------------------------------------------------------ */
    {
      id: "reception",
      label: "AN OPEN ARRIVAL",
      eyebrow: "Reception",
      title: "An Open Arrival",
      description: "The reception carries the project's curved architectural language into a calm arrival space oriented toward panoramic coastal views.",
      proposalRef: "Proposal 01, page 23 — Reception",
      src:       "assets/scenes/10-social-lounge-1600.webp",
      mobileSrc: "assets/scenes/10-social-lounge-900.webp",
      focus: { desktop: "50% 50%", tabletLandscape: "50% 50%", tabletPortrait: "50% 50%", mobile: "50% 50%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "standard-landscape", tabletLandscape: "standard-landscape", tabletPortrait: "standard-landscape", mobile: "standard-landscape" },
      tone: "#433b35",
      transition: "glass-dissolve",
      transitionTarget: "central seating and coastal glazing at 58% / 58%",
      camera: {
        origin: "58% 58%",
        start: [1,    0.28, 0  ],
        read:  [1.006, 0,    0  ],
        end:   [1.042, -0.55, 0 ]
      },
      cameraMobile: {
        origin: "58% 58%",
        start: [1,    0.14, 0  ],
        read:  [1.004, 0,    0  ],
        end:   [1.028, -0.28, 0 ]
      },
      caption: {
        desktop: { side: "left", vertical: "top",    tone: "light", scrim: "dark", maxWidth: "21rem" },
        mobile:  { side: "left", vertical: "bottom", tone: "light", scrim: "dark", maxWidth: "20rem" }
      },
      life: { type: "light-breath", mask: "linear-gradient(90deg, transparent 0 24%, #000 48% 100%)", opacity: 0.16 }
    },

    /* 07 — OFFICES -------------------------------------------------------- */
    {
      id: "offices",
      label: "WORK ABOVE THE WATERFRONT",
      eyebrow: "Offices",
      title: "Work Above the Waterfront",
      description: "Workspaces occupy the panoramic façade, combining clear internal circulation with uninterrupted views across the coast.",
      proposalRef: "Proposal 01, page 23 — Offices",
      src:       "assets/scenes/09-office-1600.webp",
      mobileSrc: "assets/scenes/09-office-900.webp",
      focus: { desktop: "50% 50%", tabletLandscape: "50% 50%", tabletPortrait: "50% 50%", mobile: "50% 50%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "standard-landscape", tabletLandscape: "standard-landscape", tabletPortrait: "standard-landscape", mobile: "standard-landscape" },
      tone: "#3d4447",
      transition: "glass-wipe",
      transitionTarget: "panoramic glazing at 73% / 54%",
      camera: {
        origin: "73% 54%",
        start: [1,    0.45, 0  ],
        read:  [1.006, 0,    0  ],
        end:   [1.040, -0.85, 0 ]
      },
      cameraMobile: {
        origin: "70% 54%",
        start: [1,    0.22, 0  ],
        read:  [1.004, 0,    0  ],
        end:   [1.026, -0.42, 0 ]
      },
      caption: {
        desktop: { side: "left", vertical: "middle", tone: "dark",  scrim: "light", maxWidth: "20rem" },
        mobile:  { side: "left", vertical: "bottom", tone: "light", scrim: "dark",  maxWidth: "20rem" }
      },
      life: { type: "horizon-haze", mask: "linear-gradient(180deg, transparent 0 36%, #000 48% 68%, transparent 78%)", opacity: 0.15 }
    },

    /* 08 — LAKE-VIEW DUPLEX ----------------------------------------------- */
    {
      id: "lake-view-duplex",
      label: "LIVING WITH THE VIEW",
      eyebrow: "Lake-View Duplex",
      title: "Living with the View",
      description: "The duplex living space follows the curved façade, placing daily life along the project's panoramic waterfront edge.",
      proposalRef: "Proposal 01, page 24 — Lake-View Duplex",
      src:       "assets/scenes/12-sky-lounge-1600.webp",
      mobileSrc: "assets/scenes/12-sky-lounge-900.webp",
      focus: { desktop: "50% 52%", tabletLandscape: "52% 52%", tabletPortrait: "54% 52%", mobile: "55% 52%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "portrait", tabletLandscape: "portrait", tabletPortrait: "portrait", mobile: "portrait" },
      tone: "#2e2925",
      transition: "ceiling-match",
      transitionTarget: "sea horizon",
      camera: {
        origin: "52% 62%",
        start: [1,    0.14, 0  ],
        read:  [1.004, 0,    0  ],
        end:   [1.034, -0.18, 0 ]
      },
      cameraMobile: {
        origin: "52% 60%",
        start: [1,    0.08, 0  ],
        read:  [1.002, 0,    0  ],
        end:   [1.022, -0.1,  0 ]
      },
      caption: {
        desktop: { side: "left", vertical: "top",    tone: "light", scrim: "dark", maxWidth: "20rem" },
        mobile:  { side: "left", vertical: "bottom", tone: "light", scrim: "dark", maxWidth: "20rem" }
      },
      life: { type: "sea-shimmer", mask: "linear-gradient(180deg, transparent 0 47%, #000 58% 82%, transparent 92%)", opacity: 0.18 }
    },

    /* 09 — DUPLEX --------------------------------------------------------- */
    {
      id: "duplex",
      label: "VERTICAL LIVING",
      eyebrow: "Duplex",
      title: "Vertical Living",
      description: "Two residential levels connect through a continuous interior volume shaped by the tower's geometry.",
      proposalRef: "Proposal 01, page 25 — Duplex",
      src:       "assets/scenes/11-residence-1600.webp",
      mobileSrc: "assets/scenes/11-residence-900.webp",
      focus: { desktop: "50% 52%", tabletLandscape: "50% 52%", tabletPortrait: "52% 51%", mobile: "52% 51%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "portrait", tabletLandscape: "portrait", tabletPortrait: "portrait", mobile: "portrait" },
      tone: "#2c2824",
      transition: "depth-dissolve",
      transitionTarget: "curved living room and daylight",
      camera: {
        origin: "34% 48%",
        start: [1,    -0.22, 0  ],
        read:  [1.004,  0,    0  ],
        end:   [1.036,  0.38, 0  ]
      },
      cameraMobile: {
        origin: "38% 48%",
        start: [1,    -0.12, 0  ],
        read:  [1.002,  0,    0  ],
        end:   [1.024,  0.22, 0  ]
      },
      caption: {
        desktop: { side: "left", vertical: "top",    tone: "dark",  scrim: "light", maxWidth: "20rem" },
        mobile:  { side: "left", vertical: "bottom", tone: "dark",  scrim: "light", maxWidth: "20rem" }
      },
      life: { type: "garden-light", mask: "linear-gradient(180deg, transparent 0 34%, #000 48% 76%, transparent 88%)", opacity: 0.14 }
    }

  ] // end scenes
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
  highPixelTablet: false,
  lowPower: false,
  introMode: "desktop",

  sync() {
    const width  = window.innerWidth;
    const height = window.innerHeight;
    const phone  = Math.min(width, height) <= 600;
    this.mode = phone
      ? "mobile"
      : width <= 900 && height >= width
        ? "tabletPortrait"
        : width <= 1200
          ? "tabletLandscape"
          : "desktop";
    this.mobile          = this.mode === "mobile";
    this.tabletPortrait  = this.mode === "tabletPortrait";
    this.tabletLandscape = this.mode === "tabletLandscape";
    const memory      = Number(navigator.deviceMemory    || 8);
    const cores       = Number(navigator.hardwareConcurrency || 8);
    const renderPixels = width * height * Math.min(window.devicePixelRatio || 1, 2) ** 2;
    this.lowPower       = this.reducedMotion || memory <= 4 || cores <= 4;
    this.highPixelTablet = (this.tabletPortrait || this.tabletLandscape) && renderPixels > 3_500_000;
    this.introMode      = this.lowPower ? "lite" : this.highPixelTablet ? "tabletLite" : this.mode;
    document.documentElement.dataset.viewport  = this.mode;
    document.documentElement.dataset.introMode = this.introMode;
    document.documentElement.dataset.dprCap    = String(experienceConfig.introProfiles[this.introMode].dprCap);
    return this.mode;
  },

  get introProfile() {
    return experienceConfig.introProfiles[this.introMode] || experienceConfig.introProfiles.desktop;
  },

  get dpr() {
    return Math.min(window.devicePixelRatio || 1, this.introProfile.dprCap);
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
  el:     $("#loader"),
  bar:    $("#loader-bar"),
  value:  $("#loader-value"),
  status: $("#loader-status"),
  ask:    $("#loader-ask"),
  progress: 0,
  parts: { poster: 0, film: 0 },
  heroSrc: null,

  set(p) {
    this.progress = Math.max(this.progress, Math.min(p, 1));
    this.bar.style.transform = `scaleX(${this.progress})`;
    this.value.textContent = String(Math.round(this.progress * 100)).padStart(3, "0");
  },

  say(t) { this.status.textContent = t; },

  setPart(name, p) {
    this.parts[name] = Math.max(this.parts[name] || 0, Math.min(p, 1));
    this.set(0.02 + this.parts.poster * 0.36 + this.parts.film * 0.62);
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
      probe.onload  = () => resolve(src);
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
          src = await this.fetchImage(url, (p) => this.setPart("poster", p));
        } catch (e) {
          this.setPart("poster", 0.5);
        }
        const decoded = await this.decode(src);
        this.setPart("poster", 1);
        return decoded;
      } catch (e) { /* next candidate */ }
    }
    return null;
  },

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
    const hero = $("#hero-image");
    if (hero) hero.src = src;
    this.heroSrc = src;
    body.dataset.hero = "";
    Atmosphere.deriveFromRender(src);
  },

  async run() {
    this.set(0.02);
    this.say("Preparing the approach");
    const [foundSrc] = await Promise.all([
      this.findHero(),
      HeroFilm.prepare((p) => this.setPart("film", p))
    ]);
    let src = foundSrc;
    if (!src) {
      console.warn(`[Benghazi Tower] No render at "${experienceConfig.heroImage}". Place the file there, or select it in the loader.`);
      src = await this.requestHero();
    }
    if (src) {
      this.applyHero(src);
      this.say("Entering");
    } else {
      body.dataset.hero = "missing";
      this.say("Continuing without the render");
    }
    this.setPart("poster", 1);
    this.setPart("film", 1);
    this.set(1);
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
   4. Global audio — one persistent soundtrack and master gain
   -------------------------------------------------------------------------- */

const AmbientSound = {
  el:          $("#ambient-audio"),
  button:      $("#hero-sound"),
  enabled:     false,
  bound:       false,
  starting:    false,
  startingAutoplay: false,
  stage:       "intro",
  sceneIndex:  0,
  menuDucked:  false,
  playPromise: null,
  startAttempt: 0,
  timelineStartedAt: 0,
  hasStartedPlayback: false,
  unlockConsumed: false,
  _firstPointer: null,
  _firstTouch: null,
  _firstClick: null,
  _firstWheel: null,
  _firstKey: null,

  init() {
    if (this.bound || !this.el) return;
    this.bound = true;
    this.el.loop = true;
    this.el.muted = false;
    this.el.volume = this.targetGain();
    this.timelineStartedAt = performance.now();
    body.dataset.audio = "starting";
    this.updateButton();

    this.button?.addEventListener("click", (event) => {
      event.stopPropagation();
      if (this.enabled) this.disable();
      else this.startFromInteraction();
    });

    const firstInteraction = (event) => {
      const target = event.target;
      if (target instanceof Element && target.closest("#hero-sound")) return;
      if (this.unlockConsumed || this.enabled) return;
      this.startFromInteraction();
    };
    this._firstPointer = firstInteraction;
    this._firstTouch = firstInteraction;
    this._firstClick = firstInteraction;
    this._firstWheel = firstInteraction;
    this._firstKey = firstInteraction;
    document.addEventListener("pointerdown", this._firstPointer, { capture: true, passive: true });
    document.addEventListener("touchstart", this._firstTouch, { capture: true, passive: true });
    document.addEventListener("click", this._firstClick, { capture: true, passive: true });
    document.addEventListener("wheel", this._firstWheel, { capture: true, passive: true });
    document.addEventListener("keydown", this._firstKey, { capture: true });
    this.el.addEventListener("ended", () => this.ensurePlaying());
    this.enable({ autoplay: true });
  },

  startFromInteraction() {
    if (!this.el || this.enabled || this.unlockConsumed) return;
    if (this.starting) {
      if (!this.startingAutoplay) return;
      this.starting = false;
      this.startingAutoplay = false;
      this.playPromise = null;
    }
    this.enable();
  },

  removeUnlockListeners() {
    if (this._firstPointer) document.removeEventListener("pointerdown", this._firstPointer, true);
    if (this._firstTouch) document.removeEventListener("touchstart", this._firstTouch, true);
    if (this._firstClick) document.removeEventListener("click", this._firstClick, true);
    if (this._firstWheel) document.removeEventListener("wheel", this._firstWheel, true);
    if (this._firstKey) document.removeEventListener("keydown", this._firstKey, true);
    this._firstPointer = null;
    this._firstTouch = null;
    this._firstClick = null;
    this._firstWheel = null;
    this._firstKey = null;
  },

  ensurePlaying() {
    if (!this.el) return Promise.resolve(false);
    if (!this.el.paused) {
      this.hasStartedPlayback = true;
      return Promise.resolve(true);
    }
    if (this.playPromise) return this.playPromise;
    const request = this.el.play();
    if (!request || typeof request.then !== "function") {
      return Promise.resolve(!this.el.paused);
    }
    const pending = request
      .then(() => {
        this.hasStartedPlayback = true;
        return true;
      })
      .catch(() => false)
      .finally(() => {
        if (this.playPromise === pending) this.playPromise = null;
      });
    this.playPromise = pending;
    return pending;
  },

  alignInitialTimeline() {
    if (!this.el || this.hasStartedPlayback || !this.el.paused) return;
    const duration = this.el.duration;
    const elapsed = Math.max(0, (performance.now() - this.timelineStartedAt) / 1000);
    if (Number.isFinite(duration) && duration > 0 && elapsed > 0.35) {
      this.el.currentTime = elapsed % duration;
    }
  },

  timelineTime() {
    if (this.hasStartedPlayback || !this.el?.paused) return this.el?.currentTime || 0;
    return Math.max(0, (performance.now() - this.timelineStartedAt) / 1000);
  },

  async enable({ autoplay = false } = {}) {
    if (!this.el || this.enabled || this.starting) return;
    const attempt = ++this.startAttempt;
    this.starting = true;
    this.startingAutoplay = autoplay;
    body.dataset.audio = "starting";
    this.updateButton();

    const alignOnStart = !this.hasStartedPlayback && this.el.paused;
    this.alignInitialTimeline();
    this.el.muted = false;
    if (autoplay) this.el.volume = this.targetGain();
    const didPlay = await this.ensurePlaying();
    if (attempt !== this.startAttempt) return;
    if (didPlay === false || this.el.paused) {
      this.enabled = false;
      this.starting = false;
      this.startingAutoplay = false;
      body.dataset.audio = "blocked";
      this.updateButton();
      return;
    }
    if (alignOnStart && Number.isFinite(this.el.duration) && this.el.duration > 0) {
      const elapsed = Math.max(0, (performance.now() - this.timelineStartedAt) / 1000);
      this.el.currentTime = elapsed % this.el.duration;
    }

    this.enabled = true;
    this.starting = false;
    this.startingAutoplay = false;
    this.unlockConsumed = true;
    this.removeUnlockListeners();
    body.dataset.audio = "on";
    if (!autoplay || this.el.volume < this.targetGain() * 0.8) {
      this.fadeTo(this.targetGain(), 1.35);
    }
    this.updateButton();
  },

  disable() {
    if (!this.enabled) return;
    this.enabled = false;
    this.starting = false;
    this.startingAutoplay = false;
    body.dataset.audio = "muted";
    this.fadeTo(0, 1);
    this.updateButton();
  },

  targetGain() {
    if (this.menuDucked) return 0.16;
    if (this.stage === "intro") return 0.15;
    if (this.stage === "approach") return 0.24;
    if (this.sceneIndex === 0) return 0.34;
    if ([4, 7].includes(this.sceneIndex)) return 0.28;
    return 0.23;
  },

  fadeTo(value, seconds = 1.1) {
    if (!this.el) return;
    if (window.gsap) gsap.to(this.el, { volume: value, duration: seconds, ease: "power1.inOut", overwrite: true });
    else this.el.volume = value;
  },

  setStage(stage) {
    this.stage = stage;
    if (this.enabled) this.fadeTo(this.targetGain(), 1.35);
  },

  setScene(index) {
    this.stage = "scene";
    this.sceneIndex = index;
    if (this.enabled) this.fadeTo(this.targetGain(), 1.25);
  },

  setMenu(open) {
    this.menuDucked = open;
    if (this.enabled) this.fadeTo(this.targetGain(), open ? 0.9 : 1.15);
  },

  recoverFromBrowserInterruption() {
    if (!this.hasStartedPlayback && !this.enabled) {
      this.enable({ autoplay: true });
    } else if (this.el?.paused) {
      this.ensurePlaying();
    }
  },

  updateButton() {
    if (!this.button) return;
    const intendedOn = this.enabled || this.starting || body.dataset.audio === "starting";
    this.button.hidden = false;
    this.button.setAttribute("aria-pressed", String(intendedOn));
    this.button.setAttribute("aria-label", intendedOn ? "Mute ambient sound" : "Unmute ambient sound");
    const label = $("span:last-child", this.button);
    if (label) label.textContent = intendedOn ? "Sound on" : "Sound";
  }
};

/* --------------------------------------------------------------------------
   5. Hero film — silent frame-zero handoff and portrait tracking
   -------------------------------------------------------------------------- */

const HeroFilm = {
  el:       $("#hero-video"),
  frame:    $("#hero-film"),
  ready:    false,
  started:  false,
  ended:    false,
  bound:    false,
  tracking: null,
  wasPlaying: false,
  frameReady: false,

  silence() {
    if (!this.el) return;
    this.el.defaultMuted = true;
    if (!this.el.muted) this.el.muted = true;
    if (this.el.volume !== 0) this.el.volume = 0;
  },

  bind() {
    if (this.bound || !this.el) return;
    this.bound = true;
    this.silence();
    this.el.addEventListener("volumechange", () => this.silence());
    this.el.addEventListener("ended", () => this.settle());
  },

  prepare(onProgress = () => {}) {
    if (!this.el) return Promise.resolve(false);
    this.bind();
    this.silence();
    if (this.el.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      this.ready = true;
      onProgress(1);
      return Promise.resolve(true);
    }

    return new Promise((resolve) => {
      let complete = false;
      const progress = () => {
        if (!this.el.duration || !this.el.buffered.length) return;
        const end = this.el.buffered.end(this.el.buffered.length - 1);
        onProgress(Math.min(end / this.el.duration, 0.98));
      };
      const finish = (ready) => {
        if (complete) return;
        complete = true;
        clearTimeout(timeout);
        this.el.removeEventListener("progress", progress);
        this.el.removeEventListener("canplay", canPlay);
        this.el.removeEventListener("error", failed);
        this.ready = ready;
        onProgress(1);
        resolve(ready);
      };
      const canPlay = () => finish(true);
      const failed = () => finish(false);
      const timeout = setTimeout(
        () => finish(this.el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA),
        6500
      );

      this.el.addEventListener("progress", progress);
      this.el.addEventListener("canplay", canPlay, { once: true });
      this.el.addEventListener("error", failed, { once: true });
      this.el.load();
      progress();
    });
  },

  async start() {
    if (!this.el || !this.ready || this.started) return;
    this.started = true;
    this.el.currentTime = 0;
    this.silence();

    try {
      await this.el.play();
      await this.waitForDecodedFrame();
    } catch (error) {
      body.dataset.film = "static";
      this.started = false;
      this.settle();
      return;
    }

    gsap.set($(".hero-media"), { clearProps: "transform" });
    this.syncTracking(true);
    body.dataset.film = "playing";
    gsap.to(this.el, {
      opacity: 1,
      duration: 2.6,
      ease: "power1.inOut",
      overwrite: true
    });
  },

  waitForDecodedFrame() {
    if (!this.el || this.frameReady) return Promise.resolve();
    return new Promise((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        this.frameReady = true;
        resolve();
      };
      const timeout = setTimeout(finish, 1200);
      if (typeof this.el.requestVideoFrameCallback === "function") {
        this.el.requestVideoFrameCallback(finish);
      } else {
        requestAnimationFrame(() => requestAnimationFrame(finish));
      }
    });
  },

  syncTracking(animate = false) {
    if (!this.frame) return;
    if (this.tracking) this.tracking.kill();
    const portrait = Env.tabletPortrait || (Env.mobile && window.innerHeight > window.innerWidth);
    const duration = Number.isFinite(this.el?.duration) ? this.el.duration : 8.083;
    const progress = this.el && duration ? Math.min(this.el.currentTime / duration, 1) : 0;
    if (!portrait) {
      gsap.set(this.frame, { clearProps: "transform" });
      return;
    }
    const xPercent = portrait ? -53.5 - (2 * progress) : 0;
    gsap.set(this.frame, { xPercent });

    if (animate && portrait && this.el && !this.ended) {
      this.tracking = gsap.to(this.frame, {
        xPercent: -55.5,
        duration: Math.max(0.1, duration - this.el.currentTime),
        ease: "none"
      });
    }
  },

  settle() {
    if (this.ended) return;
    this.ended = true;
    if (this.tracking) this.tracking.kill();
    if (this.el) {
      this.el.pause();
      gsap.set(this.el, { opacity: this.started ? 1 : 0 });
    }
    body.dataset.film = this.started ? "ended" : "static";
    if (body.dataset.state === "ready" && SceneNavigation.currentScene === 0) {
      Atmosphere.start(Loader.heroSrc);
    }
  },

  leaveHero() {
    if (!this.el) return;
    this.wasPlaying = false;
    this.el.pause();
    if (this.tracking) this.tracking.kill();
    if (!this.ended && Number.isFinite(this.el.duration)) {
      this.el.currentTime = Math.max(0, this.el.duration - 0.04);
      this.ended = true;
      body.dataset.film = "ended";
      this.syncTracking(false);
    }
  },

  pause() {
    if (!this.el || this.ended) return;
    this.wasPlaying = !this.el.paused;
    this.el.pause();
    this.tracking?.pause();
  },

  resume() {
    if (!this.el || this.ended || !this.wasPlaying || SceneNavigation.currentScene !== 0) return;
    this.silence();
    this.el.play().catch(() => {});
    this.tracking?.resume();
  }
};

/* --------------------------------------------------------------------------
   6. Atmosphere — final-frame coastal mist (paused after scene 0 exit)
   -------------------------------------------------------------------------- */

const Atmosphere = {
  tweens: [],
  started: false,
  stopped: false,

  deriveFromRender(src) {
    const img = new Image();
    img.onload = () => {
      try {
        const W = 128, H = 128;
        const cv = document.createElement("canvas");
        cv.width = W; cv.height = H;
        const ctx = cv.getContext("2d");
        const target = window.innerWidth / window.innerHeight;
        const source = img.naturalWidth / img.naturalHeight;
        const pos = (Env.mobile
          ? experienceConfig.heroObjectPositionMobile
          : experienceConfig.heroObjectPosition)
          .split(/\s+/)
          .map((v) => parseFloat(v) / 100);
        let sw = img.naturalWidth, sh = img.naturalHeight;
        if (source > target) sw = sh * target;
        else sh = sw / target;
        const sx = (img.naturalWidth  - sw) * (isNaN(pos[0]) ? 0.5 : pos[0]);
        const sy = (img.naturalHeight - sh) * (isNaN(pos[1]) ? 0.5 : pos[1]);
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
        const px = ctx.getImageData(0, 0, W, H).data;
        const BANDS = 24;
        const rows = [];
        for (let bnd = 0; bnd < BANDS; bnd++) {
          const y0 = Math.floor((bnd * H) / BANDS);
          const y1 = Math.max(Math.floor(((bnd + 1) * H) / BANDS), y0 + 1);
          let r = 0, g = 0, b = 0, n = 0;
          for (let y = y0; y < y1; y++) {
            for (let x = 0; x < W; x++) {
              const i = (y * W + x) * 4;
              r += px[i]; g += px[i + 1]; b += px[i + 2]; n++;
            }
          }
          rows.push([Math.round(r / n), Math.round(g / n), Math.round(b / n)]);
        }
        const top  = rows.slice(0, 4);
        const tint = top
          .reduce((a, c) => [a[0] + c[0] / top.length, a[1] + c[1] / top.length, a[2] + c[2] / top.length], [0, 0, 0])
          .map((v) => Math.round(Math.min(v * 1.06, 255)));
        document.documentElement.style.setProperty("--haze-tint", tint.join(", "));
      } catch (e) { /* cross-origin taint — keep fallback */ }
    };
    img.src = src;
  },

  start(heroSrc = Loader.heroSrc) {
    if (this.started || this.stopped) return;
    this.started = true;
    const profile = Env.introProfile;
    const drift = $(".sky-drift");
    const useStaticSky = !HeroFilm.started || body.dataset.film === "static";
    if (drift && profile.skyDrift && experienceConfig.skyDriftEnabled && useStaticSky && body.dataset.hero !== "missing") {
      if (heroSrc && !drift.src) drift.src = heroSrc;
      const amount   = experienceConfig.skyDriftAmount * (Env.mobile ? 0.6 : 1);
      const duration = experienceConfig.skyDriftDuration * (Env.reducedMotion ? 3 : 1);
      gsap.set(drift, { opacity: experienceConfig.skyDriftOpacity, xPercent: -amount / 2 });
      this.tweens.push(
        gsap.to(drift, { xPercent: amount / 2, duration, ease: "sine.inOut", yoyo: true, repeat: -1 })
      );
      this.tweens.push(
        gsap.to(drift, { yPercent: -0.25, duration: duration * 1.7, ease: "sine.inOut", yoyo: true, repeat: -1 })
      );
    }

    const mistZones = $$(".hero-mist")
      .filter((zone) => getComputedStyle(zone).display !== "none")
      .slice(0, profile.mistCount);
    const mistRoutes = [
      { opacity: Env.mobile ? 0.05 : 0.065, fromX: -0.8, toX: 1.05, fromY: 0.18, toY: -0.12, duration: 24 },
      { opacity: 0.05, fromX: 0.7, toX: -0.8, fromY: -0.06, toY: 0.14, duration: 21 }
    ];
    mistZones.forEach((mist, i) => {
      const route = mistRoutes[i] || mistRoutes[0];
      gsap.set(mist, { opacity: route.opacity, xPercent: route.fromX, yPercent: route.fromY, scale: 1.008 });
      this.tweens.push(
        gsap.to(mist, {
          xPercent: route.toX,
          yPercent: route.toY,
          scale: 1.022,
          duration: Env.reducedMotion ? route.duration * 3 : route.duration,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1
        })
      );
    });
  },

  /* Called once when leaving scene 0 permanently. */
  stopAfterHero() {
    if (this.stopped) return;
    this.stopped = true;
    this.tweens.forEach((t) => {
      gsap.to(t.targets(), { opacity: 0, duration: 1.2, ease: "power1.inOut",
        onComplete: () => t.kill()
      });
    });
    this.tweens = [];
  },

  pause()  { this.tweens.forEach((t) => t.pause()); },
  resume() { this.tweens.forEach((t) => t.resume()); }
};

/* --------------------------------------------------------------------------
   7. Intro — one continuous atmospheric descent
   -------------------------------------------------------------------------- */

const Intro = {
  tl: null,
  prepared: false,

  build() {
    const media = $(".hero-media");
    const stage = $(".hero-reveal");
    const haze  = $("#haze");
    const far   = $(".cloud--far");
    const mid   = $(".cloud--mid");
    const near  = $(".cloud--near");

    body.dataset.state = "intro";
    AmbientSound.setStage("intro");

    const motion = Env.reducedMotion ? 0.32 : 1;
    const scale = (value) => 1 + (value - 1) * motion;
    const shift = (value) => value * motion;

    gsap.set(stage, { opacity: 1 });
    gsap.set(media, { scale: scale(1.025), xPercent: shift(-0.4), yPercent: shift(1.4), force3D: true });
    gsap.set($("#hero-video"), { opacity: 0 });
    HeroFilm.syncTracking(false);

    /* Prepare the complete first cinematic frame while the loader still covers it. */
    gsap.set(haze, { opacity: 1 });
    gsap.set(far,  { opacity: 0.48, scale: scale(1.008), xPercent: shift(-1.8), yPercent: shift(0.8), force3D: true });
    gsap.set(mid,  { opacity: 0.62, scale: scale(1.012), xPercent: shift(-2.2), yPercent: shift(1.3), force3D: true });
    gsap.set(near, { opacity: 0.7,  scale: scale(1.018), xPercent: shift(3.2),  yPercent: shift(2),   force3D: true });

    const tl = gsap.timeline({ paused: true, onComplete: () => Experience.finishIntro() });

    tl/* 0–4s: dense, continuous atmosphere establishes forward travel. */
      .to(haze, { opacity: 0.97, duration: 4, ease: "none" }, 0)
      .to(near, { opacity: 0.58, scale: scale(1.038), xPercent: shift(1),    yPercent: shift(0.7), duration: 4, ease: "power1.inOut" }, 0)
      .to(mid,  { opacity: 0.52, scale: scale(1.026), xPercent: shift(-0.8), yPercent: shift(0.5), duration: 4, ease: "power1.inOut" }, 0)
      .to(far,  { opacity: 0.42, scale: scale(1.017), xPercent: shift(-1.2), yPercent: shift(0.5), duration: 4, ease: "power1.inOut" }, 0)

      /* 4–8s: overlap shifts as warmer light begins to enter. */
      .to(haze, { opacity: 0.82, duration: 4, ease: "power1.inOut" }, 4)
      .to(near, { opacity: 0.66, scale: scale(1.058), xPercent: shift(-1.5), yPercent: shift(-0.8), duration: 4, ease: "power1.inOut" }, 4)
      .to(mid,  { opacity: 0.58, scale: scale(1.04),  xPercent: shift(0.8),  yPercent: shift(-0.4), duration: 4, ease: "power1.inOut" }, 4)
      .to(far,  { opacity: 0.38, scale: scale(1.029), xPercent: shift(-0.5), yPercent: shift(0), duration: 4, ease: "power1.inOut" }, 4)

      /* 8–12s: scale, exposure and direction converge on the film's first frame. */
      .to(haze, { opacity: 0.55, duration: 4, ease: "power1.inOut" }, 8)
      .to(near, { opacity: 0.38, scale: scale(1.078), xPercent: shift(-4), yPercent: shift(-2.5), duration: 4, ease: "power1.inOut" }, 8)
      .to(mid,  { opacity: 0.4,  scale: scale(1.054), xPercent: shift(2),  yPercent: shift(-1.5), duration: 4, ease: "power1.inOut" }, 8)
      .to(far,  { opacity: 0.3,  scale: scale(1.04),  xPercent: shift(0),  yPercent: shift(-0.6), duration: 4, ease: "power1.inOut" }, 8)
      .to(media, { scale: 1, xPercent: 0, yPercent: 0, duration: 12.3, ease: "power1.inOut" }, 0)

      /* 12–16s: the decoded MP4 runs underneath the continuous atmosphere. */
      .call(() => AmbientSound.setStage("approach"), null, 8)
      .call(() => HeroFilm.start(), null, 11.8)
      .to(haze, { opacity: 0.26, duration: 4, ease: "power1.inOut" }, 12)
      .to(near, { opacity: 0.14, scale: scale(1.098), xPercent: shift(-6.5), yPercent: shift(-4.4), duration: 4, ease: "power1.inOut" }, 12)
      .to(mid,  { opacity: 0.22, scale: scale(1.068), xPercent: shift(3),    yPercent: shift(-2.6), duration: 4, ease: "power1.inOut" }, 12)
      .to(far,  { opacity: 0.21, scale: scale(1.052), xPercent: shift(0.5),  yPercent: shift(-1.3), duration: 4, ease: "power1.inOut" }, 12)

      /* 16–18.6s: the film becomes dominant and the tower naturally establishes. */
      .to(haze, { opacity: 0, duration: 2.6, ease: "power1.inOut" }, 16)
      .to(near, { opacity: 0, scale: scale(1.115), xPercent: shift(-8), yPercent: shift(-5.4), duration: 1.8, ease: "power1.inOut" }, 16)
      .to(mid,  { opacity: 0, scale: scale(1.082), xPercent: shift(3.8), yPercent: shift(-3.4), duration: 2.25, ease: "power1.inOut" }, 16)
      .to(far,  { opacity: 0, scale: scale(1.062), xPercent: shift(0.8), yPercent: shift(-1.8), duration: 2.4, ease: "power1.inOut" }, 16);

    this.appendReveal(tl, 17.05, 0.9);
    this.tl = tl;
    this.prepared = true;
    return tl;
  },

  play() {
    if (!this.tl || !this.prepared) return;
    performance.mark("benghazi-intro-start");
    this.tl.play(0);
  },

  appendReveal(tl, at, pace = 1) {
    const rule     = $(".hero-type__rule");
    const place    = $(".hero-type__place");
    const lines    = $$(".hero-type__title .line > span");
    const subtitle = $(".hero-type__subtitle");
    const dur      = Env.reducedMotion ? 0.45 : pace;

    tl.to($(".hud"),       { autoAlpha: 1, duration: 0.6 * dur, ease: "power2.out" }, at - 0.08 * dur)
      .to($(".signature"), { autoAlpha: 1, duration: 0.6 * dur, ease: "power2.out" }, at + 0.02 * dur)
      .to(rule,            { scaleX: 1,    duration: 0.7 * dur, ease: "power3.inOut" }, at)
      .to(place,           { opacity: 1, y: 0, duration: 0.48 * dur, ease: "power2.out" }, at + 0.1 * dur)
      .to(lines,           { y: "0%", duration: 0.65 * dur, ease: "power3.out", stagger: 0.06 * dur }, at + 0.2 * dur)
      .to(subtitle,        { opacity: 1, duration: 0.52 * dur, ease: "power2.out" }, at + 0.58 * dur)
      .to($("#hud-cue"),   { opacity: 1, duration: 0.46 * dur, ease: "power2.out" }, at + 0.82 * dur)
      .to($(".hud__progress"), { opacity: 1, duration: 0.46 * dur, ease: "power2.out" }, at + 0.82 * dur);
  },

  skip() {
    if (!this.tl || !this.tl.isActive()) return;
    const target = this.tl.duration();
    if (this.tl.time() < target) this.tl.tweenTo(target, { duration: 0.7, ease: "power2.inOut" });
  }
};

/* --------------------------------------------------------------------------
   8. SceneDeck — manage cinematic layer DOM
   -------------------------------------------------------------------------- */

const SceneDeck = {
  layers: [],
  loaded: new Set(),
  current: 0,

  render() {
    const stack = $("#scene-stack");
    const hero  = $(".cinema-layer--hero");
    this.layers = [hero];

    experienceConfig.scenes.slice(1).forEach((scene, offset) => {
      const index = offset + 1;
      const layer = document.createElement("figure");
      layer.className = "cinema-layer";
      layer.dataset.sceneIndex  = String(index);
      layer.dataset.sceneId     = scene.id;
      layer.dataset.transition  = scene.transition;
      layer.setAttribute("aria-hidden", "true");
      layer.style.zIndex = String(index + 2);

      const media = document.createElement("div");
      media.className = "cinema-media";
      const img = document.createElement("img");
      img.alt         = scene.description;
      img.decoding    = "async";
      img.loading     = "lazy";
      img.dataset.src       = scene.src;
      img.dataset.mobileSrc = scene.mobileSrc;
      media.appendChild(img);

      const life = document.createElement("div");
      life.className = "scene-life";
      life.setAttribute("aria-hidden", "true");
      if (scene.life) life.dataset.life = scene.life.type;

      if (scene.caption) {
        const caption = document.createElement("figcaption");
        caption.className = "scene-caption";
        const indexLabel  = document.createElement("span");
        indexLabel.className   = "scene-caption__index u-label";
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
  },

  applyFraming() {
    const mode = Env.mode;
    experienceConfig.scenes.forEach((scene, index) => {
      const layer = this.layers[index];
      if (!layer) return;
      const focus        = scene.focus[mode]        || scene.focus.desktop;
      const scale        = scene.scale[mode]        || scene.scale.desktop;
      const presentation = scene.presentation[mode] || scene.presentation.desktop;
      layer.style.setProperty("--scene-focus",   focus);
      layer.style.setProperty("--scene-scale",   String(scale || 1));
      layer.style.setProperty("--scene-tone",    scene.tone || "#101215");
      layer.style.setProperty("--life-mask",     scene.life?.mask || "none");
      layer.style.setProperty("--life-opacity",  String(scene.life?.opacity || 0));
      layer.dataset.presentation = presentation;

      const caption      = $(".scene-caption", layer);
      const captionStyle = this.captionFor(scene, mode);
      if (caption && captionStyle) {
        caption.dataset.side     = captionStyle.side     || "left";
        caption.dataset.vertical = captionStyle.vertical || "bottom";
        caption.dataset.tone     = captionStyle.tone     || "light";
        caption.dataset.scrim    = captionStyle.scrim    || "dark";
        caption.style.setProperty("--caption-width", captionStyle.maxWidth || "22rem");
      }
    });
  },

  captionFor(scene, mode = Env.mode) {
    if (!scene.caption) return null;
    if (mode === "mobile") return scene.caption.mobile || scene.caption.desktop;
    if (mode === "tabletPortrait") return scene.caption.tabletPortrait || scene.caption.mobile || scene.caption.desktop;
    return scene.caption[mode] || scene.caption.desktop;
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
    const keep  = new Set();
    const start = body.dataset.state === "ready" ? Math.max(1, index - 1) : 1;
    for (let i = start; i <= Math.min(this.layers.length - 1, index + 1); i++) {
      keep.add(i);
      this.load(i);
    }
    if (body.dataset.state !== "ready") return;
    [...this.loaded].forEach((li) => {
      if (keep.has(li)) return;
      const img = $("img", this.layers[li]);
      if (img) img.removeAttribute("src");
      this.layers[li].style.removeProperty("--scene-image");
      this.loaded.delete(li);
    });
  },

  setActive(index) {
    const next = Math.max(0, Math.min(index, this.layers.length - 1));
    if (next === this.current) { this.loadAround(next); return; }
    this.layers.forEach((layer, i) => layer.setAttribute("aria-hidden", i === next ? "false" : "true"));
    this.current = next;
    this.loadAround(next);
  },

  enterState()    { return { autoAlpha: 0, scale: Env.reducedMotion ? 1 : 0.992, clipPath: "inset(0 0 0 0)", filter: "none" }; },
  enterEndState() { return { autoAlpha: 1, scale: 1, clipPath: "inset(0 0 0 0)", filter: "none" }; },

  cameraFor(scene) {
    const desktop = scene.camera;
    if (Env.mobile) return scene.cameraMobile || desktop;
    if (!Env.tabletPortrait && !Env.tabletLandscape) return desktop;
    const mobile = scene.cameraMobile || desktop;
    const amount = Env.tabletPortrait ? 0.55 : 0.28;
    const blend  = (a, b) => a.map((v, i) => v + (b[i] - v) * amount);
    return {
      origin: Env.tabletPortrait ? mobile.origin : desktop.origin,
      start:  blend(desktop.start, mobile.start),
      read:   blend(desktop.read,  mobile.read),
      end:    blend(desktop.end,   mobile.end)
    };
  }
};

/* --------------------------------------------------------------------------
   9. Scene Navigation — one gesture = one scene, guaranteed
   -------------------------------------------------------------------------- */

const SceneNavigation = {
  currentScene:     0,
  isTransitioning:  false,
  timeline:         null,
  ambient:          null,
  cueDismissed:     false,
  wheelAccumulator: 0,
  wheelDirection:   0,
  wheelLastAt:      0,
  wheelReady:       true,
  wheelReleaseTimer: null,
  touchStartX:      0,
  touchStartY:      0,
  touchActive:      false,
  _safetyTimer:     null,
  handlers:         {},

  build() {
    /* Guarantee body state */
    document.documentElement.style.touchAction = "none";
    document.body.style.touchAction            = "none";
    document.body.style.overflow               = "hidden";
    window.scrollTo(0, 0);

    this.bindInputs();
    this.setRestState(this.currentScene);
    this.updateHUD(this.currentScene);
    this.startAmbient(this.currentScene);
    Interface.buildMenu();
  },

  transitionDuration() {
    if (Env.reducedMotion) return 0.42;
    if (Env.mobile)        return 0.95;
    if (Env.tabletPortrait) return 1.0;
    return 1.08;
  },

  mediaFor(index) {
    const layer = SceneDeck.layers[index];
    return index === 0 ? $(".hero-media") : $(".cinema-media img", layer);
  },

  setRestState(activeIndex = this.currentScene) {
    SceneDeck.layers.forEach((layer, index) => {
      const scene   = experienceConfig.scenes[index];
      const camera  = SceneDeck.cameraFor(scene);
      const media   = this.mediaFor(index);
      const caption = $(".scene-caption", layer);
      const life    = $(".scene-life", layer);
      const active  = index === activeIndex;
      const preserveLiveHero = index === 0 && active && HeroFilm.started && !HeroFilm.ended;

      gsap.killTweensOf([layer, media, caption, life].filter(Boolean));
      gsap.set(layer, { autoAlpha: active ? 1 : 0, scale: 1, zIndex: active ? 5 : 1 });
      gsap.set(media, {
        transformOrigin: camera.origin,
        scale:    preserveLiveHero ? 1 : camera.read[0],
        xPercent: preserveLiveHero ? 0 : camera.read[1],
        yPercent: preserveLiveHero ? 0 : camera.read[2]
      });
      if (preserveLiveHero) gsap.set(media, { clearProps: "transform" });
      if (caption) gsap.set(caption, { opacity: active ? 1 : 0, y: 0 });
      if (life) {
        const opacity = scene.life ? (Env.reducedMotion ? scene.life.opacity * 0.45 : scene.life.opacity) : 0;
        gsap.set(life, { opacity: active ? opacity : 0, xPercent: 0, yPercent: 0 });
      }
      layer.setAttribute("aria-hidden", active ? "false" : "true");
    });

    SceneDeck.current = activeIndex;
    SceneDeck.loadAround(activeIndex);
    gsap.set($(".hero-type"), { autoAlpha: activeIndex === 0 ? 1 : 0 });
    gsap.set($(".hero-edge"), { opacity:   activeIndex === 0 ? 1 : 0 });
  },

  goToScene(nextIndex, direction = Math.sign(nextIndex - this.currentScene) || 1) {
    const lastIndex = experienceConfig.scenes.length - 1;
    const target    = Math.max(0, Math.min(lastIndex, nextIndex));
    if (this.isTransitioning) return false;
    if (target === this.currentScene) return false;
    if (body.dataset.state !== "ready") return false;
    if ($("#menu")?.dataset.open === "true") return false;

    this.isTransitioning = true;
    this.dismissCue();
    this.stopAmbient();
    AmbientSound.setScene(target);
    SceneDeck.load(target);

    /* Safety: if transition never completes, force-unlock after 2× duration + 800ms */
    const safetyMs = this.transitionDuration() * 2000 + 800;
    this._safetyTimer = setTimeout(() => {
      if (this.isTransitioning) {
        console.warn("[Benghazi Tower] Transition safety unlock fired.");
        this.currentScene    = target;
        this.isTransitioning = false;
        this.touchActive     = false;
        SceneDeck.setActive(target);
        this.setRestState(target);
        this.updateHUD(target);
        this.startAmbient(target);
        this.timeline = null;
      }
    }, safetyMs);

    /* Stop hero-only motion after the first departure. */
    if (this.currentScene === 0) {
      HeroFilm.leaveHero();
      Atmosphere.stopAfterHero();
    }

    const currentIndex  = this.currentScene;
    const currentLayer  = SceneDeck.layers[currentIndex];
    const nextLayer     = SceneDeck.layers[target];
    const currentScene  = experienceConfig.scenes[currentIndex];
    const nextScene     = experienceConfig.scenes[target];
    const currentMedia  = this.mediaFor(currentIndex);
    const nextMedia     = this.mediaFor(target);
    const currentCaption = $(".scene-caption", currentLayer);
    const nextCaption    = $(".scene-caption", nextLayer);
    const currentLife    = $(".scene-life", currentLayer);
    const nextLife       = $(".scene-life", nextLayer);
    const currentCamera  = SceneDeck.cameraFor(currentScene);
    const nextCamera     = SceneDeck.cameraFor(nextScene);
    const currentTarget  = direction > 0 ? currentCamera.end   : currentCamera.start;
    const nextStart      = direction > 0 ? nextCamera.start    : nextCamera.end;
    const duration       = this.transitionDuration();
    const nextLifeOpacity = nextScene.life
      ? (Env.reducedMotion ? nextScene.life.opacity * 0.45 : nextScene.life.opacity)
      : 0;
    const heroType = $(".hero-type");
    const heroEdge = $(".hero-edge");

    currentLayer.setAttribute("aria-hidden", "true");
    nextLayer.setAttribute("aria-hidden", "false");
    gsap.set(currentLayer, { autoAlpha: 1, scale: 1, zIndex: 5 });
    gsap.set(nextLayer,    { ...SceneDeck.enterState(), zIndex: 6 });
    gsap.set(nextMedia, {
      transformOrigin: nextCamera.origin,
      scale:    Env.reducedMotion ? nextCamera.read[0] : nextStart[0],
      xPercent: Env.reducedMotion ? nextCamera.read[1] : nextStart[1],
      yPercent: Env.reducedMotion ? nextCamera.read[2] : nextStart[2]
    });
    if (nextCaption) gsap.set(nextCaption, { opacity: 0, y: direction > 0 ? 12 : -12 });
    if (nextLife)    gsap.set(nextLife,    { opacity: 0, xPercent: direction > 0 ? -0.8 : 0.8, yPercent: 0.15 });

    const tl = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: () => {
        clearTimeout(this._safetyTimer);
        this.currentScene    = target;
        this.isTransitioning = false;
        this.touchActive     = false;
        SceneDeck.setActive(target);
        this.setRestState(target);
        this.updateHUD(target);
        this.startAmbient(target);
        this.timeline = null;
        /* Re-arm wheel */
        if (performance.now() - this.wheelLastAt >= 160) {
          clearTimeout(this.wheelReleaseTimer);
          this.wheelReady      = true;
          this.wheelAccumulator = 0;
          this.wheelDirection   = 0;
        }
      }
    });

    if (currentCaption) {
      tl.to(currentCaption, { opacity: 0, y: direction > 0 ? -7 : 7, duration: duration * 0.15, ease: "power1.in" }, 0);
    }
    if (currentIndex === 0) {
      tl.to(heroType, { autoAlpha: 0, duration: duration * 0.22, ease: "power1.in" }, 0);
      tl.to(heroEdge, { opacity: 0,   duration: duration * 0.3,  ease: "power1.inOut" }, 0);
    } else if (target === 0) {
      gsap.set(heroType, { autoAlpha: 0 });
      gsap.set(heroEdge, { opacity: 0 });
      tl.to(heroType, { autoAlpha: 1, duration: duration * 0.34, ease: "power2.out" }, duration * 0.66);
      tl.to(heroEdge, { opacity: 1,   duration: duration * 0.34, ease: "power1.inOut" }, duration * 0.62);
    }

    tl.to(currentMedia, {
      scale:    Env.reducedMotion ? currentCamera.read[0] : currentTarget[0],
      xPercent: Env.reducedMotion ? currentCamera.read[1] : currentTarget[1],
      yPercent: Env.reducedMotion ? currentCamera.read[2] : currentTarget[2],
      duration: duration * 0.7,
      ease: "power2.inOut"
    }, 0)
      .to(currentLayer, { autoAlpha: 0, duration: duration * 0.34, ease: "power1.inOut" }, duration * 0.36)
      .to(nextLayer,    { ...SceneDeck.enterEndState(), zIndex: 6, duration: duration * 0.38, ease: "power2.inOut" }, duration * 0.2)
      .to(nextMedia,    {
        scale: nextCamera.read[0], xPercent: nextCamera.read[1], yPercent: nextCamera.read[2],
        duration: duration * 0.72, ease: "power3.out"
      }, duration * 0.18);

    if (currentLife) tl.to(currentLife, { opacity: 0, duration: duration * 0.24, ease: "power1.in" }, 0);
    if (nextLife && nextScene.life) {
      tl.to(nextLife, {
        opacity: nextLifeOpacity, xPercent: 0, yPercent: 0,
        duration: duration * 0.44, ease: "sine.out"
      }, duration * 0.48);
    }
    if (nextCaption) {
      tl.to(nextCaption, { opacity: 1, y: 0, duration: duration * 0.32, ease: "power3.out" }, duration * 0.68);
    }

    tl.call(() => {}, null, duration);
    this.timeline = tl;
    return true;
  },

  navigate(direction) {
    return this.goToScene(this.currentScene + direction, direction);
  },

  updateHUD(index) {
    const label = $("#hud-progress-label");
    const bar   = $(".hud__progress-bar");
    const count = experienceConfig.scenes.length;
    const text  =
      String(index + 1).padStart(2, "0") + " / " +
      String(count).padStart(2, "0") + " — " +
      experienceConfig.scenes[index].label;
    if (label && label.textContent !== text) label.textContent = text;
    if (bar) gsap.to(bar, { scaleX: count > 1 ? index / (count - 1) : 1, duration: 0.34, ease: "power2.out" });
  },

  dismissCue() {
    if (this.cueDismissed) return;
    this.cueDismissed = true;
    const cue = $("#hud-cue");
    if (cue) {
      cue.classList.add("is-dismissed");
      gsap.to(cue, { autoAlpha: 0, duration: 0.24, ease: "power1.out" });
    }
  },

  startAmbient(index) {
    if (Env.reducedMotion) return;
    const life = $(".scene-life", SceneDeck.layers[index]);
    if (!life || !experienceConfig.scenes[index].life) return;
    this.ambient = gsap.to(life, {
      xPercent: 0.45, yPercent: -0.12,
      duration: 5.8, ease: "sine.inOut",
      repeat: -1, yoyo: true
    });
  },

  stopAmbient() {
    if (this.ambient) this.ambient.kill();
    this.ambient = null;
  },

  /* ── Wheel ──────────────────────────────────────────────────────────── */

  noteWheelActivity() {
    this.wheelReady = false;
    clearTimeout(this.wheelReleaseTimer);
    const armWhenQuiet = () => {
      const quietFor = performance.now() - this.wheelLastAt;
      if (this.isTransitioning || quietFor < 160) {
        this.wheelReleaseTimer = setTimeout(armWhenQuiet, Math.max(50, 160 - quietFor));
        return;
      }
      this.wheelReady       = true;
      this.wheelAccumulator = 0;
      this.wheelDirection   = 0;
    };
    this.wheelReleaseTimer = setTimeout(armWhenQuiet, 160);
  },

  onWheel(event) {
    if (body.dataset.state !== "ready" || $("#menu")?.dataset.open === "true") return;
    event.preventDefault();
    const modeMultiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
    const delta     = event.deltaY * modeMultiplier;
    if (!Number.isFinite(delta) || Math.abs(delta) < 0.5) return;
    const now       = performance.now();
    const direction = Math.sign(delta);
    const prev      = this.wheelDirection;
    const looksLikeWheel = event.deltaMode !== 0 || Math.abs(delta) >= 48;
    const threshold = looksLikeWheel ? 42 : 72;

    if (now - this.wheelLastAt > 190 || direction !== this.wheelDirection) this.wheelAccumulator = 0;
    this.wheelLastAt  = now;
    this.wheelDirection = direction;

    if (this.isTransitioning) { this.noteWheelActivity(); return; }
    if (!this.wheelReady) {
      if (prev && direction !== prev) {
        clearTimeout(this.wheelReleaseTimer);
        this.wheelReady       = true;
        this.wheelAccumulator = 0;
      } else {
        this.noteWheelActivity();
        return;
      }
    }

    this.wheelAccumulator += delta;
    if (Math.abs(this.wheelAccumulator) < threshold) return;
    this.wheelAccumulator = 0;
    this.noteWheelActivity();
    this.navigate(direction);
  },

  /* ── Touch ──────────────────────────────────────────────────────────── */

  onTouchStart(event) {
    if (body.dataset.state !== "ready") return;
    if ($("#menu")?.dataset.open === "true") return;
    if (event.touches.length !== 1) return;
    const touch      = event.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.touchActive = true;
  },

  onTouchMove(event) {
    if (!this.touchActive) return;
    if ($("#menu")?.dataset.open === "true") return;
    const touch = event.touches[0];
    if (!touch) return;
    const dy = touch.clientY - this.touchStartY;
    const dx = touch.clientX - this.touchStartX;
    /* Prevent browser scroll only for clearly vertical swipes */
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 6) {
      event.preventDefault();
    }
  },

  onTouchEnd(event) {
    if (!this.touchActive) return;
    this.touchActive = false;
    if (this.isTransitioning) return;
    if ($("#menu")?.dataset.open === "true") return;
    const touch = event.changedTouches[0];
    if (!touch) return;
    const dy        = touch.clientY - this.touchStartY;
    const dx        = touch.clientX - this.touchStartX;
    const threshold = Env.mobile ? 48 : 54;
    if (Math.abs(dy) < threshold || Math.abs(dy) < Math.abs(dx) * 1.1) return;
    this.navigate(dy < 0 ? 1 : -1);
  },

  /* ── Keyboard ───────────────────────────────────────────────────────── */

  onKeyDown(event) {
    if (body.dataset.state !== "ready") return;
    if ($("#menu")?.dataset.open === "true") return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(event.target?.tagName) || event.target?.isContentEditable) return;
    const forward  = ["ArrowDown", "PageDown", " "];
    const backward = ["ArrowUp", "PageUp"];
    if (!forward.includes(event.key) && !backward.includes(event.key)) return;
    event.preventDefault();
    this.navigate(backward.includes(event.key) || (event.key === " " && event.shiftKey) ? -1 : 1);
  },

  /* ── Bind ───────────────────────────────────────────────────────────── */

  bindInputs() {
    if (this.handlers.wheel) return;
    this.handlers = {
      wheel:      this.onWheel.bind(this),
      touchstart: this.onTouchStart.bind(this),
      touchmove:  this.onTouchMove.bind(this),
      touchend:   this.onTouchEnd.bind(this),
      keydown:    this.onKeyDown.bind(this)
    };
    window.addEventListener("wheel",      this.handlers.wheel,      { passive: false });
    window.addEventListener("touchstart", this.handlers.touchstart,  { passive: true  });
    window.addEventListener("touchmove",  this.handlers.touchmove,   { passive: false });
    window.addEventListener("touchend",   this.handlers.touchend,    { passive: true  });
    window.addEventListener("keydown",    this.handlers.keydown);
  },

  reframe() {
    if (this.timeline) this.timeline.kill();
    clearTimeout(this._safetyTimer);
    this.timeline        = null;
    this.isTransitioning = false;
    this.touchActive     = false;
    this.stopAmbient();
    this.setRestState(this.currentScene);
    this.updateHUD(this.currentScene);
    this.startAmbient(this.currentScene);
  },

  destroy() {
    if (this.timeline) this.timeline.kill();
    clearTimeout(this._safetyTimer);
    this.stopAmbient();
    clearTimeout(this.wheelReleaseTimer);
    if (this.handlers.wheel) {
      window.removeEventListener("wheel",      this.handlers.wheel);
      window.removeEventListener("touchstart", this.handlers.touchstart);
      window.removeEventListener("touchmove",  this.handlers.touchmove);
      window.removeEventListener("touchend",   this.handlers.touchend);
      window.removeEventListener("keydown",    this.handlers.keydown);
    }
    this.handlers        = {};
    this.timeline        = null;
    this.isTransitioning = false;
    this.touchActive     = false;
  }
};

/* --------------------------------------------------------------------------
   10. Interface — HUD, menu (built dynamically from scene config)
   -------------------------------------------------------------------------- */

const Interface = {
  menu:    $("#menu"),
  trigger: $("#menu-trigger"),
  close:   $("#menu-close"),
  lastFocus: null,

  /* Menu entries — semantic mapping to scene IDs */
  menuEntries: [
    { label: "Arrival",           sceneId: "arrival"          },
    { label: "Ground",            sceneId: "sculpted-ground"   },
    { label: "Courtyard",         sceneId: "courtyard"         },
    { label: "Reception",         sceneId: "reception"         },
    { label: "Offices",           sceneId: "offices"           },
    { label: "Living",            sceneId: "lake-view-duplex"  }
  ],

  buildMenu() {
    const list = $("#menu-list");
    if (!list) return;
    list.innerHTML = "";
    this.menuEntries.forEach((entry, entryIndex) => {
      const sceneIndex = experienceConfig.scenes.findIndex((s) => s.id === entry.sceneId);
      if (sceneIndex < 0) return;
      const li  = document.createElement("li");
      li.className = "menu__item";
      const btn = document.createElement("button");
      btn.className   = "menu__link";
      btn.type        = "button";
      btn.dataset.sceneTarget = String(sceneIndex);
      const idx = document.createElement("span");
      idx.className   = "menu__index";
      idx.textContent = String(entryIndex + 1).padStart(2, "0");
      btn.append(idx, entry.label);
      btn.addEventListener("click", () => {
        this.hide(false);
        requestAnimationFrame(() => SceneNavigation.goToScene(sceneIndex));
      });
      li.appendChild(btn);
      list.appendChild(li);
    });
  },

  init() {
    /* Update cue label based on device */
    const cueLabel = $("#hud-cue-label");
    if (cueLabel) {
      cueLabel.textContent = (Env.mobile || Env.tabletPortrait || Env.tabletLandscape)
        ? "Swipe to explore"
        : "Scroll to explore";
    }

    this.trigger.addEventListener("click", () => this.open());
    this.close.addEventListener("click",   () => this.hide());

    document.addEventListener("keydown", (e) => {
      if (this.menu.dataset.open === "true") {
        if (e.key === "Escape") this.hide();
        if (e.key === "Tab")    this.trap(e, this.menu);
      }
    });

    const cue = $("#hud-cue");
    if (cue) cue.addEventListener("click", () => SceneNavigation.goToScene(1));
  },

  open() {
    this.lastFocus = document.activeElement;
    this.menu.dataset.open = "true";
    this.menu.setAttribute("aria-hidden", "false");
    this.trigger.setAttribute("aria-expanded", "true");
    AmbientSound.setMenu(true);
    body.style.overflow = "hidden";
    const first = $(".menu__link", this.menu);
    requestAnimationFrame(() => first && first.focus());
  },

  hide(restoreFocus = true) {
    this.menu.dataset.open = "false";
    this.menu.setAttribute("aria-hidden", "true");
    this.trigger.setAttribute("aria-expanded", "false");
    AmbientSound.setMenu(false);
    if (body.dataset.state === "ready") body.style.overflow = "hidden";
    if (restoreFocus && this.lastFocus) this.lastFocus.focus();
  },

  trap(e, container) {
    const items = $$("a, button", container).filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last  = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
};

/* --------------------------------------------------------------------------
   11. Boot
   -------------------------------------------------------------------------- */

const Experience = {
  async start() {
    /* The one global soundtrack gets the earliest possible audible attempt. */
    AmbientSound.init();
    SceneDeck.render();
    this.applyFraming();
    Interface.init();

    await Loader.run();
    Intro.build();
    this.bindGlobal();
    await Loader.dismiss();
    Intro.play();
  },

  applyFraming() {
    const root = document.documentElement;
    const mode = Env.mode;
    root.style.setProperty(
      "--hero-object-position",
      experienceConfig.scenes[0].focus[mode] || experienceConfig.scenes[0].focus.desktop
    );
    root.style.setProperty("--sky-mask-end",  experienceConfig.skyMaskEnd);
    root.style.setProperty("--sky-mask-fade", experienceConfig.skyMaskFade);
    SceneDeck.applyFraming();
  },

  /* Single guaranteed handoff point after intro completes.
     This is the ONLY place that transitions from intro → interactive. */
  finishIntro() {
    if (body.dataset.state === "ready") return;

    /* 1. Kill the intro timeline if somehow still alive */
    if (Intro.tl && Intro.tl.isActive()) Intro.tl.kill();

    /* 2. Remove the cloud layer and haze — no longer needed */
    const flythrough = $("#flythrough");
    if (flythrough) flythrough.remove();
    const haze = $("#haze");
    if (haze) haze.remove();

    /* 3. Set ready state */
    body.dataset.state = "ready";
    performance.mark("benghazi-interactive");
    AmbientSound.setScene(0);

    /* 4. Guarantee no overflow/touch-action lock remains */
    document.documentElement.style.touchAction = "none";
    document.body.style.touchAction            = "none";
    document.body.style.overflow               = "hidden";
    window.scrollTo(0, 0);

    /* 5. Start navigation */
    SceneNavigation.build();

    /* 6. The live film keeps the hero moving; final mist begins on its end frame. */
    if (!HeroFilm.started || HeroFilm.ended) Atmosphere.start(Loader.heroSrc);
  },

  bindGlobal() {
    /* Visibility */
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        Atmosphere.pause();
        HeroFilm.pause();
        if (Intro.tl) Intro.tl.pause();
      } else {
        Atmosphere.resume();
        HeroFilm.resume();
        AmbientSound.recoverFromBrowserInterruption();
        if (Intro.tl) Intro.tl.resume();
      }
    });

    /* Resize / orientation change */
    let resizeTimer;
    let prevState = {
      width:       window.innerWidth,
      orientation: window.innerWidth >= window.innerHeight ? "landscape" : "portrait",
      mode:        Env.mode
    };
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const orientation         = window.innerWidth >= window.innerHeight ? "landscape" : "portrait";
        const substantialChange   = Math.abs(window.innerWidth - prevState.width) > 40;
        if (!substantialChange && orientation === prevState.orientation) return;

        const wasMobile = Env.mobile;
        Env.sync();

        /* Re-set cue label after rotation */
        const cueLabel = $("#hud-cue-label");
        if (cueLabel) {
          cueLabel.textContent = (Env.mobile || Env.tabletPortrait || Env.tabletLandscape)
            ? "Swipe to explore"
            : "Scroll to explore";
        }

        if (wasMobile !== Env.mobile) SceneDeck.refreshSources();
        this.applyFraming();
        HeroFilm.syncTracking(HeroFilm.started && !HeroFilm.ended && !HeroFilm.el.paused);

        if (body.dataset.state === "ready") {
          /* Force-unlock: orientation change may have interrupted a transition */
          SceneNavigation.reframe();
        }

        prevState = { width: window.innerWidth, orientation, mode: Env.mode };
      }, 240);
    }, { passive: true });
  }
};

/* --------------------------------------------------------------------------
   Boot
   -------------------------------------------------------------------------- */

if (window.gsap) {
  Experience.start();
} else {
  /* No GSAP: static fallback */
  AmbientSound.init();
  SceneDeck.render();
  Experience.applyFraming();
  const heroImg = $("#hero-image");
  heroImg.src = experienceConfig.heroImage;
  heroImg.onerror = () => (body.dataset.hero = "missing");
  $(".hero-reveal").style.opacity = 1;
  body.dataset.state = "ready";
  document.documentElement.style.touchAction = "none";
  document.body.style.touchAction            = "none";
  $("#loader").remove();
  const ft = $("#flythrough"); if (ft) ft.remove();
  const hz = $("#haze");       if (hz) hz.remove();
  $(".hud").style.cssText = "opacity:1;visibility:visible";
  $(".signature").style.cssText = "opacity:1;visibility:visible";
  $$(".hero-type__title .line > span").forEach((el) => (el.style.transform = "none"));
  $(".hero-type__rule").style.transform = "scaleX(1)";
  $(".hero-type__place").style.opacity = 1;
  $(".hero-type__subtitle").style.opacity = 1;
  Interface.init();
  Interface.buildMenu();
  SceneNavigation.build();
  SceneNavigation.updateHUD(0);
  const cue = $("#hud-cue"); if (cue) cue.style.opacity = 1;
}
