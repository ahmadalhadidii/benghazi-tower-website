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
const wrapIndex = (index, count) => ((index % count) + count) % count;
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
  el:             $("#ambient-audio"),
  button:         $("#hero-sound"),
  enabled:        false,
  unlocked:       false,
  userWantsSound: true,
  bound:          false,
  starting:       false,
  startingFromInteraction: false,
  stage:          "intro",
  sceneIndex:     0,
  menuDucked:     false,
  startAttempt:   0,
  timelineStartedAt: performance.now(),
  hasStartedPlayback: false,
  unlockEvents:   [],
  _firstInteraction: null,

  init() {
    if (this.bound || !this.el) return;
    this.bound = true;
    this.el.loop = true;
    this.el.muted = false;
    this.el.volume = this.targetGain();
    body.dataset.audio = "starting";
    this.updateButton();

    this.button?.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (this.isActuallyPlaying()) this.disable();
      else await this.enable({ fromInteraction: true });
    });

    this._firstInteraction = (event) => {
      const target = event.target;
      if (target instanceof Element && target.closest("#hero-sound")) return;
      if (!this.userWantsSound || this.isActuallyPlaying()) return;
      if (this.starting && this.startingFromInteraction) return;
      this.enable({ fromInteraction: true });
    };
    this.unlockEvents = window.PointerEvent
      ? ["pointerdown", "click", "keydown"]
      : ["touchstart", "mousedown", "click", "keydown"];
    this.unlockEvents.forEach((type) => document.addEventListener(type, this._firstInteraction, {
      capture: true,
      passive: type !== "keydown"
    }));

    ["play", "playing", "pause", "volumechange", "ended"].forEach((type) => {
      this.el.addEventListener(type, () => this.syncFromMedia(type));
    });

    /* Make one best-effort audible attempt. A real interaction retries it. */
    this.enable({ autoplay: true });
  },

  isActuallyPlaying() {
    return !!this.el && !this.el.paused && !this.el.ended && !this.el.muted && this.el.volume > 0;
  },

  syncFromMedia(type) {
    if (!this.el) return;
    const playing = this.isActuallyPlaying();
    if (playing) {
      this.enabled = true;
      this.unlocked = true;
      this.hasStartedPlayback = true;
      this.starting = false;
      this.startingFromInteraction = false;
    } else if (type === "pause" || type === "ended" || this.el.muted) {
      this.enabled = false;
    }
    this.updateButton();
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

  async enable({ autoplay = false, fromInteraction = false } = {}) {
    if (!this.el) return false;
    if (this.isActuallyPlaying()) {
      this.enabled = true;
      this.updateButton();
      return true;
    }
    this.userWantsSound = true;
    const attempt = ++this.startAttempt;
    this.starting = true;
    this.startingFromInteraction = fromInteraction;
    body.dataset.audio = "starting";
    this.updateButton();

    const alignOnStart = !this.hasStartedPlayback && this.el.paused;
    this.alignInitialTimeline();
    this.el.muted = false;
    this.el.volume = this.targetGain();

    let didPlay = false;
    try {
      const request = this.el.play();
      if (request && typeof request.then === "function") await request;
      didPlay = !this.el.paused;
    } catch (error) {
      didPlay = false;
    }

    if (attempt !== this.startAttempt) return false;
    if (!didPlay || this.el.paused) {
      this.enabled = false;
      this.starting = false;
      this.startingFromInteraction = false;
      body.dataset.audio = "blocked";
      this.updateButton();
      return false;
    }
    if (alignOnStart && Number.isFinite(this.el.duration) && this.el.duration > 0) {
      const elapsed = Math.max(0, (performance.now() - this.timelineStartedAt) / 1000);
      this.el.currentTime = elapsed % this.el.duration;
    }

    this.enabled = true;
    this.unlocked = this.unlocked || fromInteraction || !autoplay;
    this.starting = false;
    this.startingFromInteraction = false;
    this.hasStartedPlayback = true;
    body.dataset.audio = "on";
    this.updateButton();
    return true;
  },

  disable() {
    if (!this.el) return;
    this.userWantsSound = false;
    this.startAttempt += 1;
    this.enabled = false;
    this.starting = false;
    this.startingFromInteraction = false;
    if (window.gsap) gsap.killTweensOf(this.el);
    this.el.muted = true;
    this.el.pause();
    body.dataset.audio = "muted";
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
    if (!this.el || !this.userWantsSound) return;
    if (this.el.paused || this.el.muted) this.enable({ autoplay: true });
    else this.syncFromMedia("playing");
  },

  updateButton() {
    if (!this.button) return;
    const actuallyOn = this.isActuallyPlaying();
    this.enabled = actuallyOn;
    if (actuallyOn) body.dataset.audio = "on";
    else if (!this.starting && body.dataset.audio !== "blocked") body.dataset.audio = "muted";
    this.button.hidden = false;
    this.button.setAttribute("aria-pressed", String(actuallyOn));
    this.button.setAttribute("aria-label", actuallyOn ? "Turn ambient sound off" : "Turn ambient sound on");
    const label = $("span:last-child", this.button);
    if (label) label.textContent = actuallyOn ? "Sound on" : "Sound off";
  }
};

/* Three alternatives share one scene system. Proposal 01 remains the original
   configuration above; the two additions are still-image journeys. */
const proposal01Scenes = experienceConfig.scenes;

const stillScene = ({
  proposal,
  number,
  id,
  title,
  description,
  src,
  focus = "50% 50%",
  tabletFocus = focus,
  portraitFocus = focus,
  mobileFocus = portraitFocus,
  presentation = "standard-landscape",
  mobilePresentation = presentation,
  side = "left",
  vertical = "bottom",
  tone = "light",
  scrim = tone === "light" ? "dark" : "light",
  color = "#67635d",
  chapter = null,
  final = false,
  main = false
}) => ({
  id,
  label: title.toUpperCase(),
  eyebrow: main ? `${String(proposal).padStart(2, "0")} / 03` : `P${String(proposal).padStart(2, "0")} — ${String(number).padStart(2, "0")}`,
  title,
  description,
  src,
  mobileSrc: src,
  focus: {
    desktop: focus,
    tabletLandscape: tabletFocus,
    tabletPortrait: portraitFocus,
    mobile: mobileFocus
  },
  scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
  presentation: {
    desktop: presentation,
    tabletLandscape: presentation,
    tabletPortrait: mobilePresentation,
    mobile: mobilePresentation
  },
  tone: color,
  transition: "editorial-dissolve",
  camera: {
    origin: focus,
    start: [1.008, 0.16, 0],
    read:  [1, 0, 0],
    end:   [1.014, -0.2, 0]
  },
  cameraMobile: {
    origin: mobileFocus,
    start: [1.004, 0.08, 0],
    read:  [1, 0, 0],
    end:   [1.008, -0.1, 0]
  },
  caption: main ? false : {
    desktop: { side, vertical, tone, scrim, maxWidth: "23rem" },
    mobile:  { side, vertical: "bottom", tone, scrim, maxWidth: "21rem" }
  },
  chapter,
  final,
  main
});

const proposal02Scenes = [
  stillScene({ proposal: 2, number: 0, id: "proposal-02-main", main: true,
    title: "Design Proposal 02",
    description: "A sculptural landmark shaped by movement, landscape and the sea.",
    src: "assets/proposals/02/main.webp", focus: "50% 50%", portraitFocus: "50% 48%", mobileFocus: "50% 46%", color: "#8b8176" }),
  stillScene({ proposal: 2, number: 1, id: "benghazi-waterfront", title: "Benghazi Waterfront",
    description: "A new landmark emerges between the city and the Mediterranean.",
    src: "assets/proposals/02/benghazi-waterfront.webp", focus: "50% 52%", portraitFocus: "50% 47%", mobileFocus: "50% 45%" }),
  stillScene({ proposal: 2, number: 2, id: "the-landmark", title: "The Landmark",
    description: "A single vertical gesture rises from a ground shaped by movement.",
    src: "assets/proposals/02/landmark.webp", focus: "50% 50%", portraitFocus: "50% 48%", mobileFocus: "50% 46%", tone: "dark", scrim: "light" }),
  stillScene({ proposal: 2, number: 3, id: "architecture-as-landscape", title: "Architecture as Landscape",
    description: "The tower descends into terraces, gardens and a continuous public ground.",
    src: "assets/proposals/02/architecture-landscape.webp", focus: "56% 52%", tabletFocus: "54% 52%", portraitFocus: "45% 49%", mobileFocus: "40% 48%", side: "right" }),
  stillScene({ proposal: 2, number: 4, id: "active-podium", title: "The Active Podium",
    description: "Layered terraces turn the base of the tower into a walkable waterfront experience.",
    src: "assets/proposals/02/active-podium.webp", focus: "55% 50%", portraitFocus: "57% 50%", mobileFocus: "60% 50%" }),
  stillScene({ proposal: 2, number: 5, id: "sculpted-ground-02", title: "Sculpted Ground",
    description: "The architecture folds outward, blurring the line between building and ground.",
    src: "assets/proposals/02/sculpted-ground.webp", focus: "52% 50%", portraitFocus: "44% 48%", mobileFocus: "39% 47%", presentation: "wide-cinematic", mobilePresentation: "wide-cinematic", side: "right", tone: "dark", scrim: "light" }),
  stillScene({ proposal: 2, number: 6, id: "coastal-arrival", title: "Coastal Arrival",
    description: "The experience shifts to human scale — between gardens, glazing and the sea.",
    src: "assets/proposals/02/coastal-arrival.webp", focus: "54% 50%", portraitFocus: "43% 48%", mobileFocus: "38% 47%", presentation: "wide-cinematic", mobilePresentation: "wide-cinematic", side: "right", tone: "dark", scrim: "light" }),
  stillScene({ proposal: 2, number: 7, id: "at-the-waters-edge", title: "At the Water's Edge",
    description: "Curved terraces frame the horizon as the podium opens toward the Mediterranean.",
    src: "assets/proposals/02/waters-edge.webp", focus: "51% 50%", portraitFocus: "42% 49%", mobileFocus: "38% 48%", presentation: "wide-cinematic", mobilePresentation: "wide-cinematic", side: "right" }),
  stillScene({ proposal: 2, number: 8, id: "work-above-the-city", title: "Work Above the City",
    description: "Panoramic workspaces follow the curvature of the tower and open toward the coast.",
    src: "assets/proposals/02/work-above-city.webp", focus: "54% 50%", portraitFocus: "58% 50%", mobileFocus: "60% 50%", tone: "dark", scrim: "light", vertical: "top",
    chapter: { kicker: "INSIDE THE TOWER", line: "THE ARCHITECTURAL LANGUAGE CONTINUES WITHIN.", duration: 0.82 } }),
  stillScene({ proposal: 2, number: 9, id: "living-in-the-sky", title: "Living in the Sky",
    description: "A duplex residence framed by the structure, the city and the sea.",
    src: "assets/proposals/02/living-in-sky.webp", focus: "52% 50%", portraitFocus: "55% 50%", mobileFocus: "58% 50%", tone: "dark", scrim: "light" }),
  stillScene({ proposal: 2, number: 10, id: "above-benghazi", title: "Above Benghazi",
    description: "Dining becomes a panoramic experience between the city and the horizon.",
    src: "assets/proposals/02/above-benghazi.webp", focus: "58% 50%", portraitFocus: "64% 50%", mobileFocus: "67% 50%", tone: "dark", scrim: "light", side: "right" }),
  stillScene({ proposal: 2, number: 11, id: "elevated-garden", title: "The Elevated Garden",
    description: "The journey ends where architecture opens again to landscape, light and the sea.",
    src: "assets/proposals/02/elevated-garden.webp", focus: "56% 50%", portraitFocus: "62% 50%", mobileFocus: "65% 50%", presentation: "wide-cinematic", mobilePresentation: "wide-cinematic", final: true })
];

const proposal03Scenes = [
  stillScene({ proposal: 3, number: 0, id: "proposal-03-main", main: true,
    title: "Design Proposal 03",
    description: "A twin landmark where architecture, landscape and water become one.",
    src: "assets/proposals/03/main.webp", focus: "50% 48%", portraitFocus: "50% 47%", mobileFocus: "50% 45%", color: "#756f67" }),
  stillScene({ proposal: 3, number: 1, id: "twin-horizon", title: "Twin Horizon",
    description: "Two vertical forms rise together as a new mark on the Benghazi coastline.",
    src: "assets/proposals/03/twin-horizon.webp", focus: "50% 50%", portraitFocus: "50% 47%", mobileFocus: "50% 45%" }),
  stillScene({ proposal: 3, number: 2, id: "between-sky-and-sea", title: "Between Sky and Sea",
    description: "Light passes through the towers, revealing the void as part of the architecture.",
    src: "assets/proposals/03/sky-and-sea.webp", focus: "50% 50%", portraitFocus: "50% 48%", mobileFocus: "50% 46%" }),
  stillScene({ proposal: 3, number: 3, id: "central-frame", title: "The Central Frame",
    description: "The structure opens into monumental voids that frame the sky beyond.",
    src: "assets/proposals/03/central-frame.webp", focus: "44% 49%", portraitFocus: "37% 48%", mobileFocus: "33% 47%", side: "right", tone: "dark", scrim: "light" }),
  stillScene({ proposal: 3, number: 4, id: "ribbons-in-motion", title: "Ribbons in Motion",
    description: "Structure, terraces and landscape flow through a single continuous language.",
    src: "assets/proposals/03/ribbons-motion.webp", focus: "52% 50%", portraitFocus: "56% 50%", mobileFocus: "60% 50%", presentation: "wide-cinematic", mobilePresentation: "wide-cinematic", tone: "dark", scrim: "light" }),
  stillScene({ proposal: 3, number: 5, id: "framed-terraces", title: "Framed Terraces",
    description: "The structural shell becomes a window into the layered life of the podium.",
    src: "assets/proposals/03/framed-terraces.webp", focus: "57% 50%", portraitFocus: "65% 50%", mobileFocus: "68% 50%", presentation: "wide-cinematic", mobilePresentation: "wide-cinematic", tone: "dark", scrim: "light" }),
  stillScene({ proposal: 3, number: 6, id: "work-between-horizons", title: "Work Between Horizons",
    description: "An elevated workplace shaped by curved structure and panoramic views.",
    src: "assets/proposals/03/work-between-horizons.webp", focus: "52% 50%", portraitFocus: "49% 50%", mobileFocus: "46% 50%", tone: "dark", scrim: "light",
    chapter: { kicker: "WITHIN THE TOWERS", line: "THE OUTER FORM CONTINUES INTO A CURVED INTERIOR LANDSCAPE.", duration: 0.82 } }),
  stillScene({ proposal: 3, number: 7, id: "sky-residence", title: "The Sky Residence",
    description: "Double-height living opens toward the city through the tower's curved frame.",
    src: "assets/proposals/03/sky-residence.webp", focus: "55% 50%", portraitFocus: "61% 50%", mobileFocus: "64% 50%", tone: "dark", scrim: "light" }),
  stillScene({ proposal: 3, number: 8, id: "private-living", title: "Private Living",
    description: "A quieter moment above Benghazi, held between light, structure and view.",
    src: "assets/proposals/03/private-living.webp", focus: "51% 50%", portraitFocus: "49% 50%", mobileFocus: "47% 50%", tone: "dark", scrim: "light" }),
  stillScene({ proposal: 3, number: 9, id: "dining-above-the-sea", title: "Dining Above the Sea",
    description: "The journey through the towers culminates in a room open to the coastline.",
    src: "assets/proposals/03/dining-above-sea.webp", focus: "57% 50%", portraitFocus: "63% 50%", mobileFocus: "66% 50%", tone: "dark", scrim: "light" }),
  stillScene({ proposal: 3, number: 10, id: "water-moves-inward", title: "The Water Moves Inward",
    description: "The coastline extends into the site, forming a network of lagoons, islands and paths.",
    src: "assets/proposals/03/water-moves-inward.webp", focus: "57% 50%", portraitFocus: "66% 50%", mobileFocus: "70% 50%", presentation: "wide-cinematic", mobilePresentation: "wide-cinematic", side: "right",
    chapter: { kicker: "SCENARIO 02", title: "BRINGING THE LAKE INTO THE SITE", line: "THE WATERFRONT MOVES INWARD, TRANSFORMING THE GROUND INTO A NEW COASTAL LANDSCAPE.", duration: 1.05 } }),
  stillScene({ proposal: 3, number: 11, id: "land-meets-water", title: "Land Meets Water",
    description: "The podium dissolves into gardens and walkways surrounded by water.",
    src: "assets/proposals/03/land-meets-water.webp", focus: "54% 50%", portraitFocus: "61% 50%", mobileFocus: "64% 50%", presentation: "wide-cinematic", mobilePresentation: "wide-cinematic" }),
  stillScene({ proposal: 3, number: 12, id: "lagoon-walk", title: "The Lagoon Walk",
    description: "A continuous promenade weaves between landscape, pavilions and the sea.",
    src: "assets/proposals/03/lagoon-walk.webp", focus: "53% 50%", portraitFocus: "48% 50%", mobileFocus: "44% 50%", side: "right" }),
  stillScene({ proposal: 3, number: 13, id: "life-at-waters-edge", title: "Life at the Water's Edge",
    description: "The waterfront becomes a place to walk, gather and stay.",
    src: "assets/proposals/03/waters-edge-life.webp", focus: "54% 50%", portraitFocus: "48% 50%", mobileFocus: "45% 50%" }),
  stillScene({ proposal: 3, number: 14, id: "sunset-pavilion", title: "Sunset Pavilion",
    description: "From inside the landscape, the project opens back toward the horizon.",
    src: "assets/proposals/03/sunset-pavilion.webp", focus: "51% 50%", portraitFocus: "50% 50%", mobileFocus: "49% 50%" }),
  stillScene({ proposal: 3, number: 15, id: "new-waterfront", title: "A New Waterfront",
    description: "Tower, landscape and water come together as one continuous destination.",
    src: "assets/proposals/03/new-waterfront.webp", focus: "54% 51%", portraitFocus: "55% 49%", mobileFocus: "56% 47%", final: true })
];

const proposalConfigs = [
  {
    id: "01",
    title: "Design Proposal 01",
    statement: "The original vision",
    place: "Benghazi, Libya",
    mainTitle: ["Benghazi", "Tower"],
    mainSubtitle: "A new way of living",
    scenes: proposal01Scenes
  },
  {
    id: "02",
    title: "Design Proposal 02",
    statement: "A sculptural landmark shaped by movement, landscape and the sea.",
    place: "02 / 03 — Benghazi, Libya",
    mainTitle: ["Design Proposal", "02"],
    mainSubtitle: "A sculptural landmark shaped by movement, landscape and the sea.",
    scenes: proposal02Scenes
  },
  {
    id: "03",
    title: "Design Proposal 03",
    statement: "A twin landmark where architecture, landscape and water become one.",
    place: "03 / 03 — Benghazi, Libya",
    mainTitle: ["Design Proposal", "03"],
    mainSubtitle: "A twin landmark where architecture, landscape and water become one.",
    scenes: proposal03Scenes
  }
];

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
    this.el.defaultPlaybackRate = 1;
    this.el.playbackRate = 1;
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
      duration: Env.reducedMotion ? 0.35 : 0.78,
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

    tl/* 0–0.7s: dense atmosphere, already moving forward. */
      .to(haze, { opacity: 0.88, duration: 0.7, ease: "none" }, 0)
      .to(near, { opacity: 0.64, scale: scale(1.042), xPercent: shift(0.5), yPercent: shift(0.4), duration: 0.7, ease: "power1.inOut" }, 0)
      .to(mid,  { opacity: 0.56, scale: scale(1.03), xPercent: shift(-0.8), yPercent: shift(0.2), duration: 0.7, ease: "power1.inOut" }, 0)
      .to(far,  { opacity: 0.4, scale: scale(1.018), xPercent: shift(-0.8), yPercent: shift(0.3), duration: 0.7, ease: "power1.inOut" }, 0)

      /* 0.7–1.4s: accelerate smoothly; natural-speed footage starts under the haze. */
      .call(() => AmbientSound.setStage("approach"), null, 0.7)
      .call(() => HeroFilm.start(), null, 0.82)
      .to(haze, { opacity: 0.48, duration: 0.7, ease: "power1.inOut" }, 0.7)
      .to(near, { opacity: 0.4, scale: scale(1.075), xPercent: shift(-3.8), yPercent: shift(-2.3), duration: 0.7, ease: "power2.inOut" }, 0.7)
      .to(mid,  { opacity: 0.38, scale: scale(1.052), xPercent: shift(1.9), yPercent: shift(-1.4), duration: 0.7, ease: "power2.inOut" }, 0.7)
      .to(far,  { opacity: 0.28, scale: scale(1.039), xPercent: shift(0), yPercent: shift(-0.55), duration: 0.7, ease: "power2.inOut" }, 0.7)
      .to(media, { scale: 1, xPercent: 0, yPercent: 0, duration: 1.65, ease: "power1.inOut" }, 0)

      /* 1.4–2.0s: the real film becomes dominant inside the last mist. */
      .to(haze, { opacity: 0, duration: 0.6, ease: "power1.inOut" }, 1.4)
      .to(near, { opacity: 0, scale: scale(1.105), xPercent: shift(-7), yPercent: shift(-5), duration: 0.54, ease: "power2.in" }, 1.4)
      .to(mid,  { opacity: 0, scale: scale(1.078), xPercent: shift(3.4), yPercent: shift(-3.1), duration: 0.58, ease: "power2.in" }, 1.4)
      .to(far,  { opacity: 0, scale: scale(1.06), xPercent: shift(0.7), yPercent: shift(-1.7), duration: 0.6, ease: "power1.inOut" }, 1.4);

    /* Typography resolves over the running film after the cloud-only pre-roll. */
    this.appendReveal(tl, 1.62, 0.72);
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

const ProposalState = {
  current: 0,
  prefetched: new Map(),

  get active() { return proposalConfigs[this.current]; },

  init() {
    this.current = 0;
    experienceConfig.scenes = proposalConfigs[0].scenes;
    body.dataset.proposal = proposalConfigs[0].id;
    body.dataset.main = "true";
    body.dataset.finalScene = "false";
  },

  activate(index) {
    this.current = wrapIndex(index, proposalConfigs.length);
    experienceConfig.scenes = this.active.scenes;
    body.dataset.proposal = this.active.id;
    body.dataset.main = "true";
    body.dataset.finalScene = "false";
    this.updateMainCopy();
  },

  updateMainCopy() {
    const proposal = this.active;
    const place = $(".hero-type__place");
    const lines = $$(".hero-type__title .line > span");
    const subtitle = $(".hero-type__subtitle");
    if (place) place.textContent = proposal.place;
    lines.forEach((line, index) => { line.textContent = proposal.mainTitle[index] || ""; });
    if (subtitle) subtitle.textContent = proposal.mainSubtitle;
  },

  prefetchMain(index) {
    if (index <= 0 || index >= proposalConfigs.length) return Promise.resolve(false);
    if (this.prefetched.has(index)) return this.prefetched.get(index);
    const source = proposalConfigs[index].scenes[0].src;
    const pending = new Promise((resolve) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = async () => {
        try { await img.decode?.(); } catch (error) { /* decoded by onload */ }
        resolve(true);
      };
      img.onerror = () => resolve(false);
      img.src = source;
    });
    this.prefetched.set(index, pending);
    return pending;
  },

  scheduleInitialPrefetch() {
    const begin = () => this.prefetchMain(1);
    if ("requestIdleCallback" in window) requestIdleCallback(begin, { timeout: 2200 });
    else setTimeout(begin, 900);
  },

  canPrefetchThird() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return !connection?.saveData && !/^(slow-2g|2g)$/.test(connection?.effectiveType || "");
  }
};

const ChapterTransition = {
  el: $("#chapter-transition"),

  play(chapter) {
    if (!this.el || !chapter) return Promise.resolve();
    const kicker = $("#chapter-kicker");
    const title = $("#chapter-title");
    const line = $("#chapter-line");
    if (kicker) kicker.textContent = chapter.kicker || "";
    if (title) {
      title.textContent = chapter.title || "";
      title.hidden = !chapter.title;
    }
    if (line) line.textContent = chapter.line || "";
    const duration = Env.reducedMotion ? 0.45 : (chapter.duration || 0.85);
    return new Promise((resolve) => {
      const tl = gsap.timeline({ onComplete: resolve });
      gsap.set(this.el, { autoAlpha: 0 });
      tl.to(this.el, { autoAlpha: 1, duration: duration * 0.28, ease: "power1.out" }, 0)
        .fromTo([kicker, title, line].filter(Boolean), { opacity: 0, y: 8 }, {
          opacity: 1, y: 0, duration: duration * 0.34, stagger: duration * 0.05, ease: "power2.out"
        }, duration * 0.08)
        .to(this.el, { autoAlpha: 0, duration: duration * 0.28, ease: "power1.in" }, duration * 0.72);
    });
  }
};

/* --------------------------------------------------------------------------
   8. SceneDeck — manage cinematic layer DOM
   -------------------------------------------------------------------------- */

const SceneDeck = {
  layers: [],
  loaded: new Set(),
  loadPromises: new Map(),
  current: 0,

  createLayer(scene, index, { proposalIndex = ProposalState.current } = {}) {
    const layer = document.createElement("figure");
    layer.className = "cinema-layer";
    layer.dataset.sceneIndex = String(index);
    layer.dataset.sceneId = scene.id;
    layer.dataset.transition = scene.transition;
    layer.dataset.proposal = proposalConfigs[proposalIndex].id;
    layer.dataset.final = String(!!scene.final);
    layer.setAttribute("aria-hidden", "true");
    layer.style.zIndex = String(index + 2);

    const media = document.createElement("div");
    media.className = "cinema-media";
    const img = document.createElement("img");
    img.alt = scene.description;
    img.decoding = "async";
    img.loading = index === 0 ? "eager" : "lazy";
    img.fetchPriority = index === 0 ? "high" : "auto";
    img.draggable = false;
    img.dataset.src = scene.src;
    img.dataset.mobileSrc = scene.mobileSrc || scene.src;
    media.appendChild(img);

    const life = document.createElement("div");
    life.className = "scene-life";
    life.setAttribute("aria-hidden", "true");
    if (scene.life) life.dataset.life = scene.life.type;

    if (scene.caption) {
      const caption = document.createElement("figcaption");
      caption.className = "scene-caption";
      const indexLabel = document.createElement("span");
      indexLabel.className = "scene-caption__index u-label";
      indexLabel.textContent = scene.eyebrow.startsWith("P")
        ? scene.eyebrow
        : `${String(index + 1).padStart(2, "0")} — ${scene.eyebrow}`;
      const title = document.createElement("h2");
      title.textContent = scene.title;
      const statement = document.createElement("p");
      statement.textContent = scene.description;
      caption.append(indexLabel, title, statement);
      layer.append(media, life, caption);
    } else {
      layer.append(media, life);
    }
    return layer;
  },

  render({ adoptMain = null } = {}) {
    const stack = $("#scene-stack");
    const hero  = $(".cinema-layer--hero");
    [...stack.children].forEach((child) => {
      if (child !== adoptMain) child.remove();
    });
    this.loaded.clear();
    this.loadPromises.clear();

    let main;
    if (ProposalState.current === 0) {
      main = hero;
      gsap.set(hero, { autoAlpha: 1, x: 0, scale: 1 });
    } else {
      main = adoptMain || this.createLayer(experienceConfig.scenes[0], 0);
      if (!main.isConnected) stack.appendChild(main);
      this.loaded.add(0);
      gsap.set(hero, { autoAlpha: 0, x: 0, scale: 1 });
    }
    this.layers = [main];

    experienceConfig.scenes.slice(1).forEach((scene, offset) => {
      const index = offset + 1;
      const layer = this.createLayer(scene, index);
      stack.appendChild(layer);
      this.layers.push(layer);
    });

    this.applyFraming();
    this.current = 0;
    this.loadAround(0);
  },

  applyLayerFraming(layer, scene, mode = Env.mode) {
    if (!layer || !scene) return;
    const focus = scene.focus[mode] || scene.focus.desktop;
    const scale = scene.scale[mode] || scene.scale.desktop;
    const presentation = scene.presentation[mode] || scene.presentation.desktop;
    layer.style.setProperty("--scene-focus", focus);
    layer.style.setProperty("--scene-scale", String(scale || 1));
    layer.style.setProperty("--scene-tone", scene.tone || "#101215");
    layer.style.setProperty("--life-mask", scene.life?.mask || "none");
    layer.style.setProperty("--life-opacity", String(scene.life?.opacity || 0));
    layer.dataset.presentation = presentation;
    const caption = $(".scene-caption", layer);
    const captionStyle = this.captionFor(scene, mode);
    if (caption && captionStyle) {
      caption.dataset.side = captionStyle.side || "left";
      caption.dataset.vertical = captionStyle.vertical || "bottom";
      caption.dataset.tone = captionStyle.tone || "light";
      caption.dataset.scrim = captionStyle.scrim || "dark";
      caption.style.setProperty("--caption-width", captionStyle.maxWidth || "22rem");
    }
  },

  applyFraming() {
    const mode = Env.mode;
    experienceConfig.scenes.forEach((scene, index) => {
      const layer = this.layers[index];
      this.applyLayerFraming(layer, scene, mode);
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
    if (index < 0 || index >= this.layers.length) return Promise.resolve(false);
    if (ProposalState.current === 0 && index === 0) return Promise.resolve(true);
    if (this.loadPromises.has(index)) return this.loadPromises.get(index);
    const img = $("img", this.layers[index]);
    if (!img) return Promise.resolve(false);
    const source = Env.mobile ? img.dataset.mobileSrc : img.dataset.src;
    img.src = source;
    this.layers[index].style.setProperty("--scene-image", `url("${source}")`);
    this.loaded.add(index);
    const pending = (img.decode ? img.decode() : new Promise((resolve, reject) => {
      img.addEventListener("load", resolve, { once: true });
      img.addEventListener("error", reject, { once: true });
    })).then(() => true).catch(() => false);
    this.loadPromises.set(index, pending);
    return pending;
  },

  loadAround(index) {
    const keep  = new Set();
    const first = ProposalState.current === 0 ? 1 : 0;
    if (body.dataset.state === "ready") {
      const count = this.layers.length;
      [index, wrapIndex(index - 1, count), wrapIndex(index + 1, count)].forEach((i) => {
        if (i < first) return;
        keep.add(i);
        this.load(i);
      });
    } else {
      for (let i = first; i <= Math.min(this.layers.length - 1, index + 1); i++) {
        keep.add(i);
        this.load(i);
      }
    }
    if (body.dataset.state !== "ready") return;
    [...this.loaded].forEach((li) => {
      if (keep.has(li)) return;
      const img = $("img", this.layers[li]);
      if (img) img.removeAttribute("src");
      this.layers[li].style.removeProperty("--scene-image");
      this.loaded.delete(li);
      this.loadPromises.delete(li);
    });
  },

  async prepareMainLayer(proposalIndex) {
    if (proposalIndex === 0) return $(".cinema-layer--hero");
    const scene = proposalConfigs[proposalIndex].scenes[0];
    const layer = this.createLayer(scene, 0, { proposalIndex });
    this.applyLayerFraming(layer, scene);
    $("#scene-stack").appendChild(layer);
    const img = $("img", layer);
    const source = Env.mobile ? img.dataset.mobileSrc : img.dataset.src;
    img.src = source;
    layer.style.setProperty("--scene-image", `url("${source}")`);
    try { await img.decode?.(); } catch (error) { /* retain tone fallback */ }
    return layer;
  },

  setActive(index) {
    const next = wrapIndex(index, this.layers.length);
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

const ProposalNavigation = {
  isTransitioning: false,
  timeline: null,
  transitionResolve: null,
  transitionId: 0,
  pointerActive: false,
  pointerId: null,
  pointerStartX: 0,
  pointerStartY: 0,
  pointerDX: 0,
  pointerDY: 0,
  wheelX: 0,
  wheelTimer: null,
  hintDismissed: false,
  handlers: {},

  canUse() {
    return body.dataset.state === "ready" &&
      SceneNavigation.currentScene === 0 &&
      !SceneNavigation.isTransitioning &&
      !this.isTransitioning &&
      $("#menu")?.dataset.open !== "true";
  },

  showHint() {
    if (this.hintDismissed) return;
    const hint = $("#proposal-hint");
    const label = $("#proposal-hint-label");
    if (!hint) return;
    if (label) label.textContent = (Env.mobile || Env.tabletPortrait || Env.tabletLandscape)
      ? "Swipe to explore proposals"
      : "Drag to explore proposals";
    hint.classList.remove("is-dismissed");
    gsap.to(hint, { autoAlpha: 0.72, duration: 0.55, ease: "power2.out", delay: 0.35 });
  },

  dismissHint() {
    if (this.hintDismissed) return;
    this.hintDismissed = true;
    const hint = $("#proposal-hint");
    if (!hint) return;
    hint.classList.add("is-dismissed");
    gsap.to(hint, { autoAlpha: 0, duration: 0.24, ease: "power1.out" });
  },

  setMainCopyFor(index) {
    const proposal = proposalConfigs[index];
    const place = $(".hero-type__place");
    const lines = $$(".hero-type__title .line > span");
    const subtitle = $(".hero-type__subtitle");
    if (place) place.textContent = proposal.place;
    lines.forEach((line, lineIndex) => { line.textContent = proposal.mainTitle[lineIndex] || ""; });
    if (subtitle) subtitle.textContent = proposal.mainSubtitle;
  },

  resistance(direction) {
    const layer = SceneDeck.layers[0];
    if (!layer) return;
    gsap.fromTo(layer, { x: direction * 7 }, { x: 0, duration: 0.32, ease: "power2.out", overwrite: true });
  },

  go(direction) {
    if (!this.canUse()) return false;
    const target = wrapIndex(ProposalState.current + direction, proposalConfigs.length);
    this.switchTo(target, direction);
    return true;
  },

  async switchTo(target, direction = Math.sign(target - ProposalState.current) || 1) {
    if (!this.canUse() || target === ProposalState.current) return false;
    const transitionId = ++this.transitionId;
    this.isTransitioning = true;
    body.dataset.proposalDragging = "false";

    await ProposalState.prefetchMain(target);
    if (transitionId !== this.transitionId || !this.isTransitioning) return false;
    const outgoing = SceneDeck.layers[0];
    const incoming = await SceneDeck.prepareMainLayer(target);
    if (transitionId !== this.transitionId || !this.isTransitioning) {
      if (incoming && incoming !== $(".cinema-layer--hero")) incoming.remove();
      return false;
    }
    if (!outgoing || !incoming) {
      this.isTransitioning = false;
      return false;
    }

    const distance = Env.reducedMotion ? 0 : (Env.mobile ? 42 : 58);
    const duration = Env.reducedMotion ? 0.36 : 0.76;
    const heroType = $(".hero-type");
    const heroEdge = $(".hero-edge");
    gsap.set(outgoing, { autoAlpha: 1, x: 0, scale: 1, zIndex: 5 });
    gsap.set(incoming, { autoAlpha: 0, x: direction * distance, scale: Env.reducedMotion ? 1 : 0.996, zIndex: 6 });
    incoming.setAttribute("aria-hidden", "false");
    outgoing.setAttribute("aria-hidden", "true");

    const completed = await new Promise((resolve) => {
      this.transitionResolve = resolve;
      const tl = gsap.timeline({
        onComplete: () => {
          this.timeline = null;
          this.transitionResolve = null;
          resolve(true);
        }
      });
      this.timeline = tl;
      tl.to(heroType, { autoAlpha: 0, y: direction > 0 ? -6 : 6, duration: duration * 0.23, ease: "power1.in" }, 0)
        .to(outgoing, {
          autoAlpha: 0, x: -direction * distance, scale: Env.reducedMotion ? 1 : 0.996,
          duration, ease: "power2.inOut"
        }, 0)
        .to(incoming, { autoAlpha: 1, x: 0, scale: 1, duration, ease: "power2.inOut" }, 0)
        .to(heroEdge, { opacity: 0.86, duration: duration * 0.4, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0)
        .call(() => this.setMainCopyFor(target), null, duration * 0.43)
        .fromTo(heroType, { autoAlpha: 0, y: direction > 0 ? 7 : -7 }, {
          autoAlpha: 1, y: 0, duration: duration * 0.34, ease: "power2.out"
        }, duration * 0.6);
    });
    if (!completed) return false;

    ProposalState.activate(target);
    SceneDeck.render({ adoptMain: target === 0 ? null : incoming });
    SceneNavigation.currentScene = 0;
    SceneNavigation.setRestState(0);
    SceneNavigation.updateHUD(0);
    Interface.buildMenu();
    this.dismissHint();
    this.isTransitioning = false;

    if (target === 1 && ProposalState.canPrefetchThird()) ProposalState.prefetchMain(2);
    return true;
  },

  cancelTransition() {
    this.transitionId += 1;
    if (this.timeline) this.timeline.kill();
    this.timeline = null;
    if (this.transitionResolve) this.transitionResolve(false);
    this.transitionResolve = null;
    this.isTransitioning = false;
    this.pointerActive = false;
    this.pointerId = null;
    this.pointerDX = 0;
    this.pointerDY = 0;
    this.wheelX = 0;
    clearTimeout(this.wheelTimer);
    body.dataset.proposalDragging = "false";
  },

  preview(dx) {
    if (!this.canUse()) return;
    const layer = SceneDeck.layers[0];
    if (!layer) return;
    gsap.set(layer, { x: Math.max(-18, Math.min(18, dx * 0.12)) });
  },

  settlePreview() {
    const layer = SceneDeck.layers[0];
    if (layer) gsap.to(layer, { x: 0, duration: 0.32, ease: "power2.out", overwrite: true });
  },

  finishTouch(dx, dy) {
    if (!this.canUse() || Math.abs(dx) <= Math.abs(dy) * 1.25) return false;
    const threshold = Env.mobile ? 56 : 64;
    if (Math.abs(dx) >= threshold) this.go(dx < 0 ? 1 : -1);
    else this.settlePreview();
    return true;
  },

  onHorizontalWheel(deltaX) {
    if (!this.canUse()) return;
    this.wheelX += deltaX;
    clearTimeout(this.wheelTimer);
    this.wheelTimer = setTimeout(() => { this.wheelX = 0; }, 180);
    if (Math.abs(this.wheelX) < 72) return;
    const direction = this.wheelX > 0 ? 1 : -1;
    this.wheelX = 0;
    this.go(direction);
  },

  onPointerDown(event) {
    if (event.pointerType === "touch" || event.button !== 0 || !this.canUse()) return;
    if (event.target instanceof Element && event.target.closest("button, nav, audio")) return;
    this.pointerActive = true;
    this.pointerId = event.pointerId;
    this.pointerStartX = event.clientX;
    this.pointerStartY = event.clientY;
    this.pointerDX = 0;
    this.pointerDY = 0;
    body.dataset.proposalDragging = "true";
    event.currentTarget.setPointerCapture?.(event.pointerId);
  },

  onPointerMove(event) {
    if (!this.pointerActive || event.pointerId !== this.pointerId) return;
    this.pointerDX = event.clientX - this.pointerStartX;
    this.pointerDY = event.clientY - this.pointerStartY;
    if (Math.abs(this.pointerDX) > Math.abs(this.pointerDY) * 1.15) this.preview(this.pointerDX);
  },

  onPointerUp(event) {
    if (!this.pointerActive || event.pointerId !== this.pointerId) return;
    this.pointerActive = false;
    body.dataset.proposalDragging = "false";
    const horizontal = Math.abs(this.pointerDX) > Math.abs(this.pointerDY) * 1.25;
    if (horizontal && Math.abs(this.pointerDX) >= 72) this.go(this.pointerDX < 0 ? 1 : -1);
    else this.settlePreview();
    this.pointerId = null;
  },

  bind() {
    if (this.handlers.pointerdown) return;
    const stage = $(".hero-stage");
    this.handlers = {
      pointerdown: this.onPointerDown.bind(this),
      pointermove: this.onPointerMove.bind(this),
      pointerup: this.onPointerUp.bind(this)
    };
    stage.addEventListener("pointerdown", this.handlers.pointerdown);
    stage.addEventListener("pointermove", this.handlers.pointermove);
    stage.addEventListener("pointerup", this.handlers.pointerup);
    stage.addEventListener("pointercancel", this.handlers.pointerup);
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
  homeInProgress:   false,
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
    ProposalNavigation.bind();
  },

  transitionDuration() {
    if (Env.reducedMotion) return 0.42;
    if (Env.mobile)        return 0.95;
    if (Env.tabletPortrait) return 1.0;
    return 1.08;
  },

  mediaFor(index) {
    const layer = SceneDeck.layers[index];
    return index === 0 && ProposalState.current === 0
      ? $(".hero-media")
      : $(".cinema-media img", layer);
  },

  setRestState(activeIndex = this.currentScene) {
    SceneDeck.layers.forEach((layer, index) => {
      const scene   = experienceConfig.scenes[index];
      const camera  = SceneDeck.cameraFor(scene);
      const media   = this.mediaFor(index);
      const caption = $(".scene-caption", layer);
      const life    = $(".scene-life", layer);
      const active  = index === activeIndex;
      const preserveLiveHero = ProposalState.current === 0 && index === 0 && active && HeroFilm.started && !HeroFilm.ended;

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

  goToScene(nextIndex, direction = Math.sign(nextIndex - this.currentScene) || 1, { skipChapter = false, prepared = false } = {}) {
    const lastIndex = experienceConfig.scenes.length - 1;
    const target    = wrapIndex(nextIndex, lastIndex + 1);
    if (this.isTransitioning) return false;
    if (target === this.currentScene) return false;
    if (body.dataset.state !== "ready") return false;
    if ($("#menu")?.dataset.open === "true") return false;
    if (ProposalNavigation.isTransitioning) return false;

    const targetLoad = SceneDeck.load(target);
    const targetImage = $("img", SceneDeck.layers[target]);
    if (!prepared && targetImage && !targetImage.complete) {
      this.isTransitioning = true;
      this.dismissCue();
      Promise.resolve(targetLoad).finally(() => {
        this.isTransitioning = false;
        this.goToScene(target, direction, { skipChapter, prepared: true });
      });
      return true;
    }

    const chapter = experienceConfig.scenes[target]?.chapter;
    if (chapter && direction > 0 && !skipChapter) {
      this.isTransitioning = true;
      this.dismissCue();
      ChapterTransition.play(chapter).finally(() => {
        this.isTransitioning = false;
        this.goToScene(target, direction, { skipChapter: true, prepared: true });
      });
      return true;
    }

    this.isTransitioning = true;
    this.dismissCue();
    this.stopAmbient();
    AmbientSound.setScene(target);

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
    if (ProposalState.current === 0 && this.currentScene === 0) {
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

  cancelTransition() {
    if (this.timeline) this.timeline.kill();
    clearTimeout(this._safetyTimer);
    clearTimeout(this.wheelReleaseTimer);
    this.timeline = null;
    this.isTransitioning = false;
    this.touchActive = false;
    this.wheelAccumulator = 0;
    this.wheelDirection = 0;
    this.wheelReady = true;
    this.stopAmbient();
  },

  goHome() {
    if (body.dataset.state !== "ready") return false;
    if (this.homeInProgress) return false;
    if ($("#menu")?.dataset.open === "true") Interface.hide(false);

    this.cancelTransition();
    ProposalNavigation.cancelTransition();
    this.setRestState(this.currentScene);

    if (ProposalState.current === 0 && this.currentScene === 0) {
      AmbientSound.setScene(0);
      this.updateHUD(0);
      return true;
    }

    const outgoing = SceneDeck.layers[this.currentScene];
    const hero = $(".cinema-layer--hero");
    const heroType = $(".hero-type");
    const heroEdge = $(".hero-edge");
    const duration = Env.reducedMotion ? 0.28 : 0.66;

    this.homeInProgress = true;
    this.isTransitioning = true;
    ProposalState.activate(0);
    AmbientSound.setScene(0);
    hero?.setAttribute("aria-hidden", "false");
    gsap.set(hero, { autoAlpha: 1, x: 0, scale: 1, zIndex: 4 });
    gsap.set(heroType, { autoAlpha: 0, y: 7 });
    gsap.set(heroEdge, { opacity: 0 });

    const finish = () => {
      SceneDeck.render();
      this.currentScene = 0;
      this.isTransitioning = false;
      this.homeInProgress = false;
      this.timeline = null;
      this.setRestState(0);
      this.updateHUD(0);
      this.startAmbient(0);
      Interface.buildMenu();

      const cue = $("#hud-cue");
      this.cueDismissed = false;
      if (cue) {
        cue.classList.remove("is-dismissed");
        gsap.to(cue, { autoAlpha: 1, duration: 0.35, ease: "power1.out" });
      }
    };

    const tl = gsap.timeline({ onComplete: finish });
    if (outgoing && outgoing !== hero) {
      tl.to(outgoing, { autoAlpha: 0, scale: Env.reducedMotion ? 1 : 1.008, duration: duration * 0.58, ease: "power2.inOut" }, 0);
    }
    tl.to(heroType, { autoAlpha: 1, y: 0, duration: duration * 0.48, ease: "power2.out" }, duration * 0.38)
      .to(heroEdge, { opacity: 1, duration: duration * 0.42, ease: "power1.out" }, duration * 0.36);
    this.timeline = tl;
    return true;
  },

  updateHUD(index) {
    const label = $("#hud-progress-label");
    const bar   = $(".hud__progress-bar");
    const verticalCount = experienceConfig.scenes.length - 1;
    const text = index === 0
      ? `${ProposalState.active.id} / 03 — ${ProposalState.active.title.toUpperCase()}`
      : `${String(index).padStart(2, "0")} / ${String(verticalCount).padStart(2, "0")} — ${experienceConfig.scenes[index].label}`;
    if (label && label.textContent !== text) label.textContent = text;
    if (bar) {
      const progress = index === 0
        ? ProposalState.current / (proposalConfigs.length - 1)
        : index / Math.max(1, verticalCount);
      gsap.to(bar, { scaleX: progress, duration: 0.34, ease: "power2.out" });
    }
    body.dataset.main = String(index === 0);
    body.dataset.finalScene = String(!!experienceConfig.scenes[index]?.final);
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
    const modeMultiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
    const horizontal = event.deltaX * modeMultiplier;
    const delta     = event.deltaY * modeMultiplier;
    if (this.currentScene === 0 && Math.abs(horizontal) > Math.abs(delta) * 1.35 && Math.abs(horizontal) > 3) {
      event.preventDefault();
      ProposalNavigation.onHorizontalWheel(horizontal);
      return;
    }
    if (!Number.isFinite(delta) || Math.abs(delta) < 0.5) return;
    event.preventDefault();
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
    if (this.currentScene === 0 && Math.abs(dx) > Math.abs(dy) * 1.2 && Math.abs(dx) > 6) {
      event.preventDefault();
      ProposalNavigation.preview(dx);
      return;
    }
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
    if (this.currentScene === 0 && ProposalNavigation.finishTouch(dx, dy)) return;
    const threshold = Env.mobile ? 48 : 54;
    if (Math.abs(dy) < threshold || Math.abs(dy) < Math.abs(dx) * 1.1) return;
    this.navigate(dy < 0 ? 1 : -1);
  },

  /* ── Keyboard ───────────────────────────────────────────────────────── */

  onKeyDown(event) {
    if (body.dataset.state !== "ready") return;
    if ($("#menu")?.dataset.open === "true") return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(event.target?.tagName) || event.target?.isContentEditable) return;
    if (this.currentScene === 0 && ["ArrowLeft", "ArrowRight"].includes(event.key)) {
      event.preventDefault();
      ProposalNavigation.go(event.key === "ArrowRight" ? 1 : -1);
      return;
    }
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

const ProjectFilm = {
  overlay:     $("#project-film-overlay"),
  trigger:     $("#hud-film"),
  close:       $("#project-film-close"),
  replay:      $("#project-film-replay"),
  video:       $("#project-film"),
  lastFocus:   null,
  isOpen:      false,
  initialized: false,

  init() {
    if (this.initialized || !this.overlay || !this.trigger || !this.video) return;
    this.initialized = true;

    this.trigger.addEventListener("click", () => this.open());
    this.close.addEventListener("click", () => this.hide());
    this.replay.addEventListener("click", () => this.playFromStart());
    this.video.addEventListener("loadeddata", () => this.video.classList.add("is-ready"));
    this.video.addEventListener("playing", () => this.video.classList.add("is-ready"));
    this.video.addEventListener("ended", () => {
      if (this.isOpen) this.replay.hidden = false;
    });

    this.overlay.addEventListener("wheel", (event) => {
      event.preventDefault();
      event.stopPropagation();
    }, { passive: false });

    ["touchstart", "touchmove", "touchend"].forEach((type) => {
      this.overlay.addEventListener(type, (event) => {
        if (type === "touchmove") event.preventDefault();
        event.stopPropagation();
      }, { passive: type !== "touchmove" });
    });

    document.addEventListener("keydown", (event) => {
      if (!this.isOpen) return;
      if (event.key === "Escape") {
        event.preventDefault();
        this.hide();
      } else if (event.key === "Tab") {
        this.trapFocus(event);
      }
      event.stopPropagation();
    });
  },

  open() {
    if (this.isOpen || body.dataset.state !== "ready") return;
    this.isOpen = true;
    this.lastFocus = document.activeElement;
    body.dataset.filmOpen = "true";
    this.replay.hidden = true;
    this.video.classList.remove("is-ready");
    this.video.muted = true;
    this.video.defaultMuted = true;
    this.video.playsInline = true;

    if (!this.video.getAttribute("src")) {
      this.video.src = this.video.dataset.src;
      this.video.load();
    }

    try { this.video.currentTime = 0; } catch (_) {}
    this.overlay.inert = false;
    this.overlay.dataset.open = "true";
    this.overlay.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => this.close.focus());
    this.video.play().catch(() => {});
  },

  hide() {
    if (!this.isOpen) return;
    this.isOpen = false;
    body.dataset.filmOpen = "false";
    this.video.pause();
    try { this.video.currentTime = 0; } catch (_) {}
    this.video.classList.remove("is-ready");
    this.replay.hidden = true;
    this.overlay.inert = true;
    this.overlay.dataset.open = "false";
    this.overlay.setAttribute("aria-hidden", "true");

    const focusTarget = this.lastFocus && document.contains(this.lastFocus)
      ? this.lastFocus
      : this.trigger;
    requestAnimationFrame(() => focusTarget.focus());
  },

  playFromStart() {
    if (!this.isOpen) return;
    this.replay.hidden = true;
    this.video.muted = true;
    try { this.video.currentTime = 0; } catch (_) {}
    this.video.play().catch(() => {});
  },

  trapFocus(event) {
    const items = $$("button:not([hidden])", this.overlay).filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
};

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
    const heading = document.createElement("li");
    heading.className = "menu__heading u-label";
    heading.textContent = ProposalState.active.title;
    list.appendChild(heading);

    const entries = ProposalState.current === 0
      ? this.menuEntries
      : experienceConfig.scenes.slice(1).map((scene) => ({ label: scene.title.toUpperCase(), sceneId: scene.id }));

    entries.forEach((entry, entryIndex) => {
      const sceneIndex = experienceConfig.scenes.findIndex((s) => s.id === entry.sceneId);
      if (sceneIndex < 0) return;
      const scene = experienceConfig.scenes[sceneIndex];
      if (scene.chapter?.title) {
        const chapter = document.createElement("li");
        chapter.className = "menu__chapter";
        const kicker = document.createElement("span");
        kicker.textContent = scene.chapter.kicker;
        const title = document.createElement("strong");
        title.textContent = scene.chapter.title;
        chapter.append(kicker, title);
        list.appendChild(chapter);
      }
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
      btn.addEventListener("click", async () => {
        btn.disabled = true;
        await SceneDeck.load(sceneIndex);
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
    if (cue) cue.addEventListener("click", () => SceneNavigation.navigate(1));
    const home = $("#hud-home");
    if (home) home.addEventListener("click", () => SceneNavigation.goHome());
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
    ProposalState.init();
    AmbientSound.init();
    SceneDeck.render();
    this.applyFraming();
    Interface.init();
    ProjectFilm.init();

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
    ProposalNavigation.showHint();
    ProposalState.scheduleInitialPrefetch();

    /* 6. Guarantee the decoded film handoff even after an accelerated skip. */
    if (!HeroFilm.started && HeroFilm.ready) HeroFilm.start();
    if ((!HeroFilm.started && !HeroFilm.ready) || HeroFilm.ended) Atmosphere.start(Loader.heroSrc);
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
        const proposalHint = $("#proposal-hint-label");
        if (proposalHint) {
          proposalHint.textContent = (Env.mobile || Env.tabletPortrait || Env.tabletLandscape)
            ? "Swipe to explore proposals"
            : "Drag to explore proposals";
        }

        if (wasMobile !== Env.mobile) SceneDeck.refreshSources();
        this.applyFraming();
        const liveFilm = HeroFilm.started && !HeroFilm.ended;
        HeroFilm.syncTracking(liveFilm && !HeroFilm.el.paused);
        if (liveFilm && HeroFilm.el.paused) {
          HeroFilm.silence();
          HeroFilm.el.play().then(() => HeroFilm.syncTracking(true)).catch(() => {});
        }

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
  ProposalState.init();
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
  ProjectFilm.init();
  Interface.buildMenu();
  SceneNavigation.build();
  SceneNavigation.updateHUD(0);
  const cue = $("#hud-cue"); if (cue) cue.style.opacity = 1;
}
