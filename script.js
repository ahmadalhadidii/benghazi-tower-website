/* ==========================================================================
   BENGHAZI TOWER — A NEW WAY OF LIVING
   script.js

     1.  experienceConfig      — all creative controls
     2.  Env
     3.  Loader                — real progress; asks for the render if absent
     4.  Atmosphere            — cloud plates cut from the render itself
     5.  Bird                  — asset-driven fly-by; nothing fake if absent
     6.  Intro                 — one continuous aerial descent (autoplay, once)
     8.  SceneNavigation       — one gesture advances one settled scene
     9.  Interface
     10. Boot
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. Configuration
   -------------------------------------------------------------------------- */

const experienceConfig = {
  /* Opening — an aerial descent through the cloud layer */
  introDuration: 4.52,           // desktop reference; compact modes use the profiles below
  descentStartScale: 1.14,       // wider/higher opening frame keeps upper atmosphere present
  descentBlur: 10,               // restrained; cloud depth comes from plates, not blur
  descentBlurMobile: 0,          // full-frame blur is too costly on phones
  introProfiles: {
    desktop: { dprCap: 2, cloudCount: 4, mistCount: 3, skyDrift: true, skyBreath: true },
    tabletLandscape: { dprCap: 1.5, cloudCount: 2, mistCount: 2, skyDrift: false, skyBreath: false },
    tabletPortrait: { dprCap: 1.5, cloudCount: 2, mistCount: 2, skyDrift: false, skyBreath: false },
    tabletLite: { dprCap: 1.25, cloudCount: 1, mistCount: 1, skyDrift: false, skyBreath: false },
    mobile: { dprCap: 1.25, cloudCount: 2, mistCount: 1, skyDrift: false, skyBreath: false },
    lite: { dprCap: 1, cloudCount: 1, mistCount: 1, skyDrift: false, skyBreath: false }
  },

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
      id: "arrival", label: "A NEW WAY OF LIVING", eyebrow: "Benghazi, Libya", title: "Benghazi Tower",
      description: "A mixed-use waterfront landmark where tower, podium and landscape are developed as one continuous architectural system.",
      proposalRef: "Proposal 01, pages 9–10 — project identity and final mixed-use tower",
      focus: { desktop: "50% 46%", tabletLandscape: "54% 46%", tabletPortrait: "56% 44%", mobile: "58% 43%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "cover", tabletLandscape: "cover", tabletPortrait: "cover", mobile: "cover" },
      tone: "#8b8176", transition: "hero", transitionTarget: "tower podium at 56% / 67%",
      camera: { origin: "52% 66%", start: [1, 0, 0], read: [1.014, -0.1, -0.2], end: [1.054, -0.8, -1.1] },
      cameraMobile: { origin: "57% 63%", start: [1, 0, 0], read: [1.01, 0, -0.1], end: [1.038, -0.35, -0.65] },
      caption: false
    },
    {
      id: "aerial-detail", label: "A NEW WAY OF LIVING", eyebrow: "Mixed-use tower", title: "A New Way of Living",
      description: "A mixed-use waterfront landmark where tower, podium and landscape are developed as one continuous architectural system.",
      proposalRef: "Proposal 01, page 18 — aerial master view",
      src: "assets/scenes/01-aerial-detail-1600.webp", mobileSrc: "assets/scenes/01-aerial-detail-900.webp",
      focus: { desktop: "52% 50%", tabletLandscape: "52% 50%", tabletPortrait: "52% 50%", mobile: "52% 50%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "standard-landscape", tabletLandscape: "standard-landscape", tabletPortrait: "standard-landscape", mobile: "standard-landscape" },
      tone: "#7d776f", transition: "matched-push", transitionTarget: "podium-to-tower fold at 57% / 68%",
      camera: { origin: "57% 68%", start: [1, 0.45, 0], read: [1.008, 0, 0], end: [1.05, -0.75, 0] },
      cameraMobile: { origin: "57% 66%", start: [1, 0.2, 0], read: [1.006, 0, 0], end: [1.034, -0.35, 0] },
      caption: {
        desktop: { side: "left", vertical: "top", tone: "dark", scrim: "light", maxWidth: "20rem" },
        mobile: { side: "left", vertical: "bottom", tone: "light", scrim: "dark", maxWidth: "21rem" }
      },
      life: { type: "sea-shimmer", mask: "linear-gradient(180deg, transparent 0 42%, #000 58% 88%, transparent 98%)", opacity: 0.2 }
    },
    {
      id: "icon-exterior", label: "GROUND TO SKY", eyebrow: "Tower + podium", title: "Ground to Sky",
      description: "The sculpted podium rises into an expressive structural shell, connecting the public waterfront base with the vertical tower above.",
      proposalRef: "Proposal 01, page 19; page 10 steps 03–04",
      src: "assets/scenes/02-icon-exterior-1600.webp", mobileSrc: "assets/scenes/02-icon-exterior-900.webp",
      focus: { desktop: "50% 50%", tabletLandscape: "50% 50%", tabletPortrait: "50% 50%", mobile: "50% 50%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "standard-landscape", tabletLandscape: "standard-landscape", tabletPortrait: "standard-landscape", mobile: "standard-landscape" },
      tone: "#82786c", transition: "tower-rise", transitionTarget: "seaward podium sweep at 39% / 72%",
      camera: { origin: "39% 72%", start: [1, -0.3, 0], read: [1.008, 0, 0], end: [1.05, 0.85, 0] },
      cameraMobile: { origin: "45% 70%", start: [1, -0.15, 0], read: [1.006, 0, 0], end: [1.034, 0.45, 0] },
      caption: {
        desktop: { side: "left", vertical: "top", tone: "dark", scrim: "light", maxWidth: "20rem" },
        mobile: { side: "left", vertical: "bottom", tone: "light", scrim: "dark", maxWidth: "20rem" }
      },
      life: { type: "light-breath", mask: "radial-gradient(circle at 18% 30%, #000 0 19%, transparent 44%)", opacity: 0.2 }
    },
    {
      id: "promenade", label: "A CONTINUOUS GROUND", eyebrow: "Landscape + promenade", title: "A Continuous Ground",
      description: "Landscape and pedestrian movement extend through the base of the building, creating a gradual connection between architecture and waterfront.",
      proposalRef: "Proposal 01, page 19 — waterfront approach",
      src: "assets/scenes/03-promenade-1600.webp", mobileSrc: "assets/scenes/03-promenade-900.webp",
      focus: { desktop: "50% 50%", tabletLandscape: "50% 50%", tabletPortrait: "50% 50%", mobile: "50% 50%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "standard-landscape", tabletLandscape: "standard-landscape", tabletPortrait: "standard-landscape", mobile: "standard-landscape" },
      tone: "#463f37", transition: "horizon-cut", transitionTarget: "glazed podium entrance at 73% / 54%",
      camera: { origin: "73% 54%", start: [1, -0.4, 0], read: [1.008, 0, 0], end: [1.052, -0.9, 0] },
      cameraMobile: { origin: "70% 54%", start: [1, -0.2, 0], read: [1.006, 0, 0], end: [1.035, -0.5, 0] },
      caption: {
        desktop: { side: "left", vertical: "bottom", tone: "light", scrim: "dark", maxWidth: "21rem" },
        mobile: { side: "left", vertical: "bottom", tone: "light", scrim: "dark", maxWidth: "20rem" }
      },
      life: { type: "sea-shimmer", mask: "linear-gradient(90deg, #000 0 30%, transparent 47% 100%)", opacity: 0.22 }
    },
    {
      id: "podium-close", label: "ORGANIC CARVING", eyebrow: "Podium + shell", title: "Organic Carving",
      description: "Curved voids cut through the podium to create visual permeability, planted terraces and interconnected public spaces.",
      proposalRef: "Proposal 01, page 20; page 10 step 02",
      src: "assets/scenes/04-podium-close-1600.webp", mobileSrc: "assets/scenes/04-podium-close-900.webp",
      focus: { desktop: "50% 50%", tabletLandscape: "50% 50%", tabletPortrait: "50% 50%", mobile: "50% 50%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "standard-landscape", tabletLandscape: "standard-landscape", tabletPortrait: "standard-landscape", mobile: "standard-landscape" },
      tone: "#5f615d", transition: "ribbon-wipe", transitionTarget: "sweeping planted ribbon at 61% / 55%",
      camera: { origin: "61% 55%", start: [1, 0.4, 0], read: [1.008, 0, 0], end: [1.052, -0.85, 0] },
      cameraMobile: { origin: "61% 55%", start: [1, 0.2, 0], read: [1.006, 0, 0], end: [1.035, -0.4, 0] },
      caption: {
        desktop: { side: "left", vertical: "top", tone: "dark", scrim: "light", maxWidth: "21rem" },
        mobile: { side: "left", vertical: "bottom", tone: "light", scrim: "dark", maxWidth: "20rem" }
      },
      life: { type: "water-reflection", mask: "radial-gradient(ellipse at 58% 78%, #000 0 24%, transparent 52%)", opacity: 0.24 }
    },
    {
      id: "podium-landscape", label: "THE SCULPTED PODIUM", eyebrow: "Podium landscape", title: "The Sculpted Podium",
      description: "Fluid carving opens the podium into terraces, landscape and public circulation rather than treating the base as a closed volume.",
      proposalRef: "Proposal 01, page 20; page 10 step 02",
      src: "assets/scenes/05-podium-landscape-1600.webp", mobileSrc: "assets/scenes/05-podium-landscape-900.webp",
      focus: { desktop: "48% 50%", tabletLandscape: "48% 50%", tabletPortrait: "50% 50%", mobile: "50% 50%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "standard-landscape", tabletLandscape: "standard-landscape", tabletPortrait: "standard-landscape", mobile: "standard-landscape" },
      tone: "#506169", transition: "ribbon-match", transitionTarget: "white loop and inner garden at 34% / 52%",
      camera: { origin: "34% 52%", start: [1, -0.4, 0], read: [1.008, 0, 0], end: [1.05, 0.85, 0] },
      cameraMobile: { origin: "38% 52%", start: [1, -0.2, 0], read: [1.006, 0, 0], end: [1.034, 0.45, 0] },
      caption: {
        desktop: { side: "right", vertical: "top", tone: "dark", scrim: "light", maxWidth: "20rem" },
        mobile: { side: "right", vertical: "bottom", tone: "light", scrim: "dark", maxWidth: "20rem" }
      },
      life: { type: "garden-light", mask: "linear-gradient(180deg, transparent 0 40%, #000 57% 86%, transparent 100%)", opacity: 0.18 }
    },
    {
      id: "envelope", label: "STRUCTURAL SHELL", eyebrow: "Structural shell", title: "Structural Shell",
      description: "The outer shell emerges from the podium and climbs the tower, giving the project its structural and architectural identity.",
      proposalRef: "Proposal 01, page 21; page 10 step 03",
      src: "assets/scenes/06-envelope-1600.webp", mobileSrc: "assets/scenes/06-envelope-900.webp",
      focus: { desktop: "50% 50%", tabletLandscape: "50% 50%", tabletPortrait: "50% 50%", mobile: "50% 50%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "wide-cinematic", tabletLandscape: "wide-cinematic", tabletPortrait: "wide-cinematic", mobile: "wide-cinematic" },
      tone: "#56666c", transition: "ribbon-wipe", transitionTarget: "central glazed opening at 54% / 49%",
      camera: { origin: "54% 49%", start: [1, 0.4, 0], read: [1.006, 0, 0], end: [1.052, -0.75, 0] },
      cameraMobile: { origin: "54% 49%", start: [1, 0.2, 0], read: [1.004, 0, 0], end: [1.034, -0.4, 0] },
      caption: {
        desktop: { side: "right", vertical: "bottom", tone: "light", scrim: "dark", maxWidth: "20rem" },
        mobile: { side: "right", vertical: "bottom", tone: "light", scrim: "dark", maxWidth: "20rem" }
      },
      life: { type: "sea-shimmer", mask: "linear-gradient(90deg, transparent 0 58%, #000 72% 100%)", opacity: 0.18 }
    },
    {
      id: "public-court", label: "THE SOCIAL HEART", eyebrow: "Courtyard Interior", title: "The Social Heart",
      description: "A multi-level internal court draws daylight, landscape and public activity deep into the podium while maintaining a direct visual connection to the waterfront.",
      proposalRef: "Proposal 01, page 22 — Courtyard Interior",
      src: "assets/scenes/07-public-court-1600.webp", mobileSrc: "assets/scenes/07-public-court-900.webp",
      focus: { desktop: "50% 50%", tabletLandscape: "50% 50%", tabletPortrait: "50% 50%", mobile: "50% 50%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "standard-landscape", tabletLandscape: "standard-landscape", tabletPortrait: "standard-landscape", mobile: "standard-landscape" },
      tone: "#766757", transition: "void-push", transitionTarget: "central sky opening at 53% / 45%",
      camera: { origin: "53% 45%", start: [1, 0, 0], read: [1.008, 0, 0], end: [1.055, -0.2, 0] },
      cameraMobile: { origin: "53% 47%", start: [1, 0, 0], read: [1.006, 0, 0], end: [1.036, -0.1, 0] },
      caption: {
        desktop: { side: "left", vertical: "bottom", tone: "light", scrim: "dark", maxWidth: "20rem" },
        mobile: { side: "left", vertical: "bottom", tone: "light", scrim: "dark", maxWidth: "20rem" }
      },
      life: { type: "water-reflection", mask: "radial-gradient(ellipse at 76% 82%, #000 0 20%, transparent 48%)", opacity: 0.22 }
    },
    {
      id: "atrium", label: "FLUID VOIDS", eyebrow: "Courtyard Interior", title: "Fluid Voids",
      description: "Curved openings connect the courtyard’s levels, planted terraces and public routes while keeping the waterfront visible through the podium.",
      proposalRef: "Proposal 01, page 22 — Courtyard Interior",
      src: "assets/scenes/08-atrium-1600.webp", mobileSrc: "assets/scenes/08-atrium-900.webp",
      focus: { desktop: "50% 50%", tabletLandscape: "50% 50%", tabletPortrait: "50% 50%", mobile: "50% 50%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "standard-landscape", tabletLandscape: "standard-landscape", tabletPortrait: "standard-landscape", mobile: "standard-landscape" },
      tone: "#6b5b4b", transition: "void-match", transitionTarget: "sea-facing glazing at 67% / 56%",
      camera: { origin: "67% 56%", start: [1, 0.4, 0], read: [1.008, 0, 0], end: [1.052, -0.8, 0] },
      cameraMobile: { origin: "65% 55%", start: [1, 0.2, 0], read: [1.006, 0, 0], end: [1.035, -0.4, 0] },
      caption: {
        desktop: { side: "left", vertical: "bottom", tone: "light", scrim: "dark", maxWidth: "21rem" },
        mobile: { side: "left", vertical: "bottom", tone: "light", scrim: "dark", maxWidth: "20rem" }
      },
      life: { type: "water-reflection", mask: "radial-gradient(ellipse at 58% 80%, #000 0 24%, transparent 53%)", opacity: 0.22 }
    },
    {
      id: "reception", label: "AN OPEN ARRIVAL", eyebrow: "Reception", title: "An Open Arrival",
      description: "The reception extends the project’s curved architectural language into an open arrival space oriented toward the panoramic waterfront.",
      proposalRef: "Proposal 01, page 23 — Reception",
      src: "assets/scenes/10-social-lounge-1600.webp", mobileSrc: "assets/scenes/10-social-lounge-900.webp",
      focus: { desktop: "50% 50%", tabletLandscape: "50% 50%", tabletPortrait: "50% 50%", mobile: "50% 50%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "standard-landscape", tabletLandscape: "standard-landscape", tabletPortrait: "standard-landscape", mobile: "standard-landscape" },
      tone: "#433b35", transition: "glass-dissolve", transitionTarget: "central seating and coastal glazing at 58% / 58%",
      camera: { origin: "58% 58%", start: [1, 0.3, 0], read: [1.008, 0, 0], end: [1.05, -0.65, 0] },
      cameraMobile: { origin: "58% 58%", start: [1, 0.15, 0], read: [1.006, 0, 0], end: [1.034, -0.35, 0] },
      caption: {
        desktop: { side: "left", vertical: "top", tone: "light", scrim: "dark", maxWidth: "21rem" },
        mobile: { side: "left", vertical: "bottom", tone: "light", scrim: "dark", maxWidth: "20rem" }
      },
      life: { type: "light-breath", mask: "linear-gradient(90deg, transparent 0 24%, #000 48% 100%)", opacity: 0.16 }
    },
    {
      id: "office", label: "WORK ABOVE THE WATERFRONT", eyebrow: "Offices", title: "Work Above the Waterfront",
      description: "Workspaces are organized along the panoramic façade, combining a clear internal circulation core with uninterrupted waterfront views.",
      proposalRef: "Proposal 01, page 23 — Offices",
      src: "assets/scenes/09-office-1600.webp", mobileSrc: "assets/scenes/09-office-900.webp",
      focus: { desktop: "50% 50%", tabletLandscape: "50% 50%", tabletPortrait: "50% 50%", mobile: "50% 50%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "standard-landscape", tabletLandscape: "standard-landscape", tabletPortrait: "standard-landscape", mobile: "standard-landscape" },
      tone: "#3d4447", transition: "glass-wipe", transitionTarget: "panoramic glazing at 73% / 54%",
      camera: { origin: "73% 54%", start: [1, 0.5, 0], read: [1.008, 0, 0], end: [1.048, -1, 0] },
      cameraMobile: { origin: "70% 54%", start: [1, 0.25, 0], read: [1.006, 0, 0], end: [1.032, -0.5, 0] },
      caption: {
        desktop: { side: "left", vertical: "middle", tone: "dark", scrim: "light", maxWidth: "20rem" },
        mobile: { side: "left", vertical: "bottom", tone: "light", scrim: "dark", maxWidth: "20rem" }
      },
      life: { type: "horizon-haze", mask: "linear-gradient(180deg, transparent 0 36%, #000 48% 68%, transparent 78%)", opacity: 0.15 }
    },
    {
      id: "duplex", label: "VERTICAL LIVING", eyebrow: "Duplex", title: "Vertical Living",
      description: "A two-level residence connects living, dining and upper-level spaces through a continuous interior volume shaped by the tower geometry.",
      proposalRef: "Proposal 01, page 25 — Duplex",
      src: "assets/scenes/11-residence-1600.webp", mobileSrc: "assets/scenes/11-residence-900.webp",
      focus: { desktop: "50% 52%", tabletLandscape: "50% 52%", tabletPortrait: "52% 51%", mobile: "52% 51%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "portrait", tabletLandscape: "portrait", tabletPortrait: "portrait", mobile: "portrait" },
      tone: "#2c2824", transition: "depth-dissolve", transitionTarget: "curved living room and daylight",
      camera: { origin: "34% 48%", start: [1, -0.25, 0], read: [1.006, 0, 0], end: [1.045, 0.45, 0] },
      cameraMobile: { origin: "38% 48%", start: [1, -0.15, 0], read: [1.004, 0, 0], end: [1.03, 0.25, 0] },
      caption: {
        desktop: { side: "left", vertical: "top", tone: "dark", scrim: "light", maxWidth: "20rem" },
        mobile: { side: "left", vertical: "bottom", tone: "dark", scrim: "light", maxWidth: "20rem" }
      },
      life: { type: "garden-light", mask: "linear-gradient(180deg, transparent 0 34%, #000 48% 76%, transparent 88%)", opacity: 0.14 }
    },
    {
      id: "lake-view-duplex", label: "LIVING WITH THE VIEW", eyebrow: "Lake-View Duplex", title: "Living with the View",
      description: "The duplex living space is positioned along the panoramic edge, using the curved tower envelope to frame expansive views across the water.",
      proposalRef: "Proposal 01, page 24 — Lake-View Duplex",
      src: "assets/scenes/12-sky-lounge-1600.webp", mobileSrc: "assets/scenes/12-sky-lounge-900.webp",
      focus: { desktop: "50% 52%", tabletLandscape: "52% 52%", tabletPortrait: "54% 52%", mobile: "55% 52%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "portrait", tabletLandscape: "portrait", tabletPortrait: "portrait", mobile: "portrait" },
      tone: "#2e2925", transition: "ceiling-match", transitionTarget: "sea horizon",
      camera: { origin: "52% 62%", start: [1, 0.15, 0], read: [1.006, 0, 0], end: [1.042, -0.2, 0] },
      cameraMobile: { origin: "52% 60%", start: [1, 0.1, 0], read: [1.004, 0, 0], end: [1.028, -0.1, 0] },
      caption: {
        desktop: { side: "left", vertical: "top", tone: "light", scrim: "dark", maxWidth: "20rem" },
        mobile: { side: "left", vertical: "bottom", tone: "light", scrim: "dark", maxWidth: "20rem" }
      },
      life: { type: "sea-shimmer", mask: "linear-gradient(180deg, transparent 0 47%, #000 58% 82%, transparent 92%)", opacity: 0.18 }
    },
    {
      id: "waterfront-coda", label: "FINAL MIXED-USE TOWER", eyebrow: "Final mixed-use tower", title: "City to Waterfront",
      description: "The completed tower brings structure, public podium, landscape and mixed-use living together as one composition overlooking the waterfront.",
      proposalRef: "Proposal 01, page 19; page 10 step 04",
      src: "assets/scenes/13-waterfront-coda-1600.webp", mobileSrc: "assets/scenes/13-waterfront-coda-900.webp",
      focus: { desktop: "50% 50%", tabletLandscape: "50% 50%", tabletPortrait: "50% 50%", mobile: "50% 50%" },
      scale: { desktop: 1, tabletLandscape: 1, tabletPortrait: 1, mobile: 1 },
      presentation: { desktop: "standard-landscape", tabletLandscape: "standard-landscape", tabletPortrait: "standard-landscape", mobile: "standard-landscape" },
      tone: "#657c8a", transition: "horizon-dissolve", transitionTarget: "tower and open sea",
      camera: { origin: "55% 52%", start: [1, 0.35, 0], read: [1.006, 0, 0], end: [1.04, -0.35, 0] },
      cameraMobile: { origin: "55% 52%", start: [1, 0.15, 0], read: [1.004, 0, 0], end: [1.028, -0.2, 0] },
      caption: {
        desktop: { side: "right", vertical: "top", tone: "dark", scrim: "light", maxWidth: "20rem" },
        mobile: { side: "right", vertical: "bottom", tone: "light", scrim: "dark", maxWidth: "20rem" }
      },
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
  highPixelTablet: false,
  lowPower: false,
  introMode: "desktop",
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
    const memory = Number(navigator.deviceMemory || 8);
    const cores = Number(navigator.hardwareConcurrency || 8);
    const renderPixels = width * height * Math.min(window.devicePixelRatio || 1, 2) ** 2;
    this.lowPower = this.reducedMotion || memory <= 4 || cores <= 4;
    this.highPixelTablet = (this.tabletPortrait || this.tabletLandscape) && renderPixels > 3500000;
    this.introMode = this.lowPower ? "lite" : this.highPixelTablet ? "tabletLite" : this.mode;
    document.documentElement.dataset.viewport = this.mode;
    document.documentElement.dataset.introMode = this.introMode;
    document.documentElement.dataset.dprCap = String(experienceConfig.introProfiles[this.introMode].dprCap);
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
  el: $("#loader"),
  bar: $("#loader-bar"),
  value: $("#loader-value"),
  status: $("#loader-status"),
  ask: $("#loader-ask"),
  progress: 0,
  heroSrc: null,

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
    const hero = $("#hero-image");
    if (hero) hero.src = src;
    this.heroSrc = src;
    body.dataset.hero = "";
    if (Env.introMode === "desktop") Atmosphere.deriveFromRender(src);
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

  start(heroSrc = Loader.heroSrc) {
    const profile = Env.introProfile;
    const drift = $(".sky-drift");
    if (drift && profile.skyDrift && experienceConfig.skyDriftEnabled && body.dataset.hero !== "missing") {
      if (heroSrc && !drift.src) drift.src = heroSrc;
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

    const mistZones = $$(".hero-mist")
      .filter((zone) => getComputedStyle(zone).display !== "none")
      .slice(0, profile.mistCount);
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
    if (breath && profile.skyBreath) {
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

    const tl = gsap
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
      );
    if (Env.mode === "desktop") {
      tl.to(blur, { v: 2.2 * scaleFactor, duration: 0.45, ease: "power2.in", onUpdate: applyBlur }, 0.8);
    }
    tl.to(this.el, { opacity: 0, duration: 0.26, ease: "power2.in" }, 1.18);
    this.tl = tl;
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

      const caption = $(".scene-caption", layer);
      const captionStyle = this.captionFor(scene, mode);
      if (caption && captionStyle) {
        caption.dataset.side = captionStyle.side || "left";
        caption.dataset.vertical = captionStyle.vertical || "bottom";
        caption.dataset.tone = captionStyle.tone || "light";
        caption.dataset.scrim = captionStyle.scrim || "dark";
        caption.style.setProperty("--caption-width", captionStyle.maxWidth || "22rem");
      }
    });
  },

  captionFor(scene, mode = Env.mode) {
    if (!scene.caption) return null;
    if (mode === "mobile") return scene.caption.mobile || scene.caption.desktop;
    if (mode === "tabletPortrait") {
      return scene.caption.tabletPortrait || scene.caption.mobile || scene.caption.desktop;
    }
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

  enterState() {
    return {
      autoAlpha: 0,
      scale: Env.reducedMotion ? 1 : 0.992,
      clipPath: "inset(0 0 0 0)",
      filter: "none"
    };
  },

  enterEndState() {
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
    const blurAmount = Env.mode === "desktop" ? experienceConfig.descentBlur : experienceConfig.descentBlurMobile;
    const defocus = { v: blurAmount };
    const applyDefocus = () => {
      media.style.filter = defocus.v > 0.3 ? `blur(${defocus.v.toFixed(1)}px)` : "none";
    };

    body.dataset.state = "intro";
    performance.mark("benghazi-intro-start");

    /* The destination frame is already in place from the first millisecond —
       high above, defocused, and completely inside the cloud layer. */
    gsap.set(stage, { opacity: 1 });
    gsap.set(media, { scale: experienceConfig.descentStartScale, yPercent: 2.2 });
    applyDefocus();

    if (Env.introMode === "lite") return this.buildReduced(media, haze, defocus, applyDefocus);
    if (Env.mobile) return this.buildMobile(media, stage, haze, far, mid);
    if (Env.tabletPortrait || Env.tabletLandscape) return this.buildTablet(media, stage, haze, far, mid);

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
      .to(defocus, { v: 0, duration: 1.7, ease: "power2.out", onUpdate: applyDefocus }, 1.55);

    /* Only once the frame has settled. */
    this.appendReveal(tl, 3.18);
    this.tl = tl;
    return tl;
  },

  buildTablet(media, stage, haze, far, mid) {
    const tl = gsap.timeline({ onComplete: () => Experience.handOver() });
    const compact = Env.introMode === "tabletLite";

    gsap.set(stage, { opacity: 1 });
    tl.set(haze, { opacity: 0.18 })
      .set(mid, { opacity: 0.74, scale: 1.08, xPercent: 2, yPercent: 1 })
      .to(mid, { scale: 2.2, xPercent: 7, yPercent: 8, opacity: 0, duration: 2.25, ease: "power1.inOut" }, 0.12)
      .to(haze, { opacity: 0.05, duration: 0.85, ease: "none" }, 0.2)
      .to(haze, { opacity: 0, duration: 1, ease: "power1.inOut" }, 1.05)
      .to(media, { scale: 1.055, yPercent: 0.65, duration: 1.95, ease: "none" }, 0)
      .to(media, { scale: 1.01, yPercent: 0, duration: 1.3, ease: "power2.out" }, 1.95)
      .addLabel("arrival", 3.05);
    if (!compact) {
      tl.set(far, { opacity: 0.58, scale: 1.02, xPercent: -1, yPercent: -1 }, 0)
        .to(far, { scale: 1.58, xPercent: -2, yPercent: 4, opacity: 0, duration: 2.45, ease: "power1.inOut" }, 0.4);
    }

    this.appendReveal(tl, 3, 0.78);
    this.tl = tl;
    return tl;
  },

  buildMobile(media, stage, haze, far, mid) {
    const tl = gsap.timeline({ onComplete: () => Experience.handOver() });

    gsap.set(stage, { opacity: 1 });
    tl.set(haze, { opacity: 0.18 })
      .set(far, { opacity: 0.56, scale: 1.02, xPercent: -1, yPercent: -1 })
      .set(mid, { opacity: 0.7, scale: 1.08, xPercent: 2, yPercent: 1 })
      .to(mid, { scale: 2.08, xPercent: 6, yPercent: 7, opacity: 0, duration: 2.05, ease: "power1.inOut" }, 0.08)
      .to(far, { scale: 1.5, xPercent: -2, yPercent: 4, opacity: 0, duration: 2.25, ease: "power1.inOut" }, 0.4)
      .to(haze, { opacity: 0.05, duration: 0.75, ease: "none" }, 0.16)
      .to(haze, { opacity: 0, duration: 0.9, ease: "power1.inOut" }, 0.9)
      .to(media, { scale: 1.05, yPercent: 0.6, duration: 1.8, ease: "none" }, 0)
      .to(media, { scale: 1.008, yPercent: 0, duration: 1.25, ease: "power2.out" }, 1.8)
      .addLabel("arrival", 2.75);

    this.appendReveal(tl, 2.7, 0.72);
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
      .to(haze, { opacity: 0, duration: 1.15, ease: "power1.inOut" }, 0.15);
    this.appendReveal(tl, 1.45, 0.55);
    this.tl = tl;
    return tl;
  },

  /* Interface exists only after the camera has landed. */
  appendReveal(tl, at, pace = 1) {
    const rule = $(".hero-type__rule");
    const place = $(".hero-type__place");
    const lines = $$(".hero-type__title .line > span");
    const subtitle = $(".hero-type__subtitle");
    const dur = Env.reducedMotion ? 0.45 : pace;

    tl.to($(".hud"), { autoAlpha: 1, duration: 0.62 * dur, ease: "power2.out" }, at - 0.08 * dur)
      .to($(".signature"), { autoAlpha: 1, duration: 0.62 * dur, ease: "power2.out" }, at + 0.02 * dur)
      .to(rule, { scaleX: 1, duration: 0.72 * dur, ease: "power3.inOut" }, at)
      .to(place, { opacity: 1, y: 0, duration: 0.5 * dur, ease: "power2.out" }, at + 0.1 * dur)
      .to(lines, { y: "0%", duration: 0.68 * dur, ease: "power3.out", stagger: 0.06 * dur }, at + 0.2 * dur)
      .to(subtitle, { opacity: 1, duration: 0.55 * dur, ease: "power2.out" }, at + 0.62 * dur)
      .to($(".hud__cue"), { opacity: 1, duration: 0.48 * dur, ease: "power2.out" }, at + 0.86 * dur)
      .to($(".hud__progress"), { opacity: 1, duration: 0.48 * dur, ease: "power2.out" }, at + 0.86 * dur);
  },

  /* No visible control sits over the descent; the gesture is enough. */
  skip() {
    if (!this.tl || !this.tl.isActive()) return;
    const target = this.tl.duration();
    if (this.tl.time() < target) this.tl.tweenTo(target, { duration: 0.7, ease: "power2.inOut" });
  }
};

/* --------------------------------------------------------------------------
   8. Discrete scene navigation — engaged only after arrival
   -------------------------------------------------------------------------- */

const SceneNavigation = {
  currentScene: 0,
  isTransitioning: false,
  timeline: null,
  ambient: null,
  cueDismissed: false,
  wheelAccumulator: 0,
  wheelDirection: 0,
  wheelLastAt: 0,
  wheelReady: true,
  wheelReleaseTimer: null,
  touchStart: null,
  handlers: {},

  build() {
    body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    this.bindInputs();
    this.setRestState(this.currentScene);
    this.updateHUD(this.currentScene);
    this.startAmbient(this.currentScene);
  },

  transitionDuration() {
    if (Env.reducedMotion) return 0.42;
    if (Env.mobile) return 1.02;
    if (Env.tabletPortrait) return 1.08;
    return 1.18;
  },

  mediaFor(index) {
    const layer = SceneDeck.layers[index];
    return index === 0 ? $(".hero-media") : $(".cinema-media img", layer);
  },

  setRestState(activeIndex = this.currentScene) {
    SceneDeck.layers.forEach((layer, index) => {
      const scene = experienceConfig.scenes[index];
      const camera = SceneDeck.cameraFor(scene);
      const media = this.mediaFor(index);
      const caption = $(".scene-caption", layer);
      const life = $(".scene-life", layer);
      const active = index === activeIndex;

      gsap.killTweensOf([layer, media, caption, life].filter(Boolean));
      gsap.set(layer, { autoAlpha: active ? 1 : 0, scale: 1, zIndex: active ? 5 : 1 });
      gsap.set(media, {
        transformOrigin: camera.origin,
        scale: camera.read[0],
        xPercent: camera.read[1],
        yPercent: camera.read[2]
      });
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
    gsap.set($(".hero-edge"), { opacity: activeIndex === 0 ? 1 : 0 });
  },

  goToScene(nextIndex, direction = Math.sign(nextIndex - this.currentScene) || 1) {
    const lastIndex = experienceConfig.scenes.length - 1;
    const target = Math.max(0, Math.min(lastIndex, nextIndex));
    if (this.isTransitioning || target === this.currentScene || body.dataset.state !== "ready") return false;
    if ($("#menu")?.dataset.open === "true") return false;

    this.isTransitioning = true;
    this.dismissCue();
    this.stopAmbient();
    SceneDeck.load(target);

    const currentIndex = this.currentScene;
    const currentLayer = SceneDeck.layers[currentIndex];
    const nextLayer = SceneDeck.layers[target];
    const currentScene = experienceConfig.scenes[currentIndex];
    const nextScene = experienceConfig.scenes[target];
    const currentMedia = this.mediaFor(currentIndex);
    const nextMedia = this.mediaFor(target);
    const currentCaption = $(".scene-caption", currentLayer);
    const nextCaption = $(".scene-caption", nextLayer);
    const currentLife = $(".scene-life", currentLayer);
    const nextLife = $(".scene-life", nextLayer);
    const currentCamera = SceneDeck.cameraFor(currentScene);
    const nextCamera = SceneDeck.cameraFor(nextScene);
    const currentTarget = direction > 0 ? currentCamera.end : currentCamera.start;
    const nextStart = direction > 0 ? nextCamera.start : nextCamera.end;
    const duration = this.transitionDuration();
    const nextLifeOpacity = nextScene.life
      ? (Env.reducedMotion ? nextScene.life.opacity * 0.45 : nextScene.life.opacity)
      : 0;
    const heroType = $(".hero-type");
    const heroEdge = $(".hero-edge");

    currentLayer.setAttribute("aria-hidden", "true");
    nextLayer.setAttribute("aria-hidden", "false");
    gsap.set(currentLayer, { autoAlpha: 1, scale: 1, zIndex: 5 });
    gsap.set(nextLayer, { ...SceneDeck.enterState(), zIndex: 6 });
    gsap.set(nextMedia, {
      transformOrigin: nextCamera.origin,
      scale: Env.reducedMotion ? nextCamera.read[0] : nextStart[0],
      xPercent: Env.reducedMotion ? nextCamera.read[1] : nextStart[1],
      yPercent: Env.reducedMotion ? nextCamera.read[2] : nextStart[2]
    });
    if (nextCaption) gsap.set(nextCaption, { opacity: 0, y: direction > 0 ? 12 : -12 });
    if (nextLife) gsap.set(nextLife, { opacity: 0, xPercent: direction > 0 ? -0.8 : 0.8, yPercent: 0.15 });

    const tl = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: () => {
        this.currentScene = target;
        SceneDeck.setActive(target);
        this.setRestState(target);
        this.updateHUD(target);
        this.startAmbient(target);
        this.timeline = null;
        this.isTransitioning = false;
        if (performance.now() - this.wheelLastAt >= 180) {
          clearTimeout(this.wheelReleaseTimer);
          this.wheelReady = true;
          this.wheelAccumulator = 0;
          this.wheelDirection = 0;
        }
      }
    });

    if (currentCaption) {
      tl.to(currentCaption, {
        opacity: 0,
        y: direction > 0 ? -7 : 7,
        duration: duration * 0.15,
        ease: "power1.in"
      }, 0);
    }
    if (currentIndex === 0) {
      tl.to(heroType, { autoAlpha: 0, duration: duration * 0.22, ease: "power1.in" }, 0);
      tl.to(heroEdge, { opacity: 0, duration: duration * 0.3, ease: "power1.inOut" }, 0);
    } else if (target === 0) {
      gsap.set(heroType, { autoAlpha: 0 });
      gsap.set(heroEdge, { opacity: 0 });
      tl.to(heroType, { autoAlpha: 1, duration: duration * 0.34, ease: "power2.out" }, duration * 0.66);
      tl.to(heroEdge, { opacity: 1, duration: duration * 0.34, ease: "power1.inOut" }, duration * 0.62);
    }

    tl.to(currentMedia, {
      scale: Env.reducedMotion ? currentCamera.read[0] : currentTarget[0],
      xPercent: Env.reducedMotion ? currentCamera.read[1] : currentTarget[1],
      yPercent: Env.reducedMotion ? currentCamera.read[2] : currentTarget[2],
      duration: duration * 0.7,
      ease: "power2.inOut"
    }, 0)
      .to(currentLayer, { autoAlpha: 0, duration: duration * 0.34, ease: "power1.inOut" }, duration * 0.36)
      .to(nextLayer, {
        ...SceneDeck.enterEndState(),
        zIndex: 6,
        duration: duration * 0.38,
        ease: "power2.inOut"
      }, duration * 0.2)
      .to(nextMedia, {
        scale: nextCamera.read[0],
        xPercent: nextCamera.read[1],
        yPercent: nextCamera.read[2],
        duration: duration * 0.72,
        ease: "power3.out"
      }, duration * 0.18);

    if (currentLife) {
      tl.to(currentLife, { opacity: 0, duration: duration * 0.24, ease: "power1.in" }, 0);
    }
    if (nextLife && nextScene.life) {
      tl.to(nextLife, {
        opacity: nextLifeOpacity,
        xPercent: 0,
        yPercent: 0,
        duration: duration * 0.44,
        ease: "sine.out"
      }, duration * 0.48);
    }
    if (nextCaption) {
      tl.to(nextCaption, {
        opacity: 1,
        y: 0,
        duration: duration * 0.32,
        ease: "power3.out"
      }, duration * 0.68);
    }

    tl.call(() => {}, null, duration);
    this.timeline = tl;
    return true;
  },

  navigate(direction) {
    return this.goToScene(this.currentScene + direction, direction);
  },

  updateHUD(index) {
    const label = $(".hud__progress-label");
    const bar = $(".hud__progress-bar");
    const count = experienceConfig.scenes.length;
    const text = String(index + 1).padStart(2, "0") + " / " +
      String(count).padStart(2, "0") + " — " + experienceConfig.scenes[index].label;
    if (label && label.textContent !== text) label.textContent = text;
    if (bar) gsap.to(bar, { scaleX: count > 1 ? index / (count - 1) : 1, duration: 0.34, ease: "power2.out" });
  },

  dismissCue() {
    if (this.cueDismissed) return;
    this.cueDismissed = true;
    gsap.to($(".hud__cue"), { autoAlpha: 0, duration: 0.24, ease: "power1.out" });
  },

  startAmbient(index) {
    if (Env.reducedMotion) return;
    const life = $(".scene-life", SceneDeck.layers[index]);
    if (!life || !experienceConfig.scenes[index].life) return;
    this.ambient = gsap.to(life, {
      xPercent: 0.45,
      yPercent: -0.12,
      duration: 5.8,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    });
  },

  stopAmbient() {
    if (this.ambient) this.ambient.kill();
    this.ambient = null;
  },

  noteWheelActivity() {
    this.wheelReady = false;
    clearTimeout(this.wheelReleaseTimer);
    const armWhenQuiet = () => {
      const quietFor = performance.now() - this.wheelLastAt;
      if (this.isTransitioning || quietFor < 180) {
        this.wheelReleaseTimer = setTimeout(armWhenQuiet, Math.max(50, 180 - quietFor));
        return;
      }
      this.wheelReady = true;
      this.wheelAccumulator = 0;
      this.wheelDirection = 0;
    };
    this.wheelReleaseTimer = setTimeout(armWhenQuiet, 180);
  },

  onWheel(event) {
    if (body.dataset.state !== "ready" || $("#menu")?.dataset.open === "true") return;
    event.preventDefault();

    const modeMultiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
    const delta = event.deltaY * modeMultiplier;
    if (!Number.isFinite(delta) || Math.abs(delta) < 0.5) return;

    const now = performance.now();
    const direction = Math.sign(delta);
    const previousDirection = this.wheelDirection;
    const looksLikeWheel = event.deltaMode !== 0 || Math.abs(delta) >= 48;
    const threshold = looksLikeWheel ? 42 : 72;

    if (now - this.wheelLastAt > 190 || direction !== this.wheelDirection) this.wheelAccumulator = 0;
    this.wheelLastAt = now;
    this.wheelDirection = direction;

    if (this.isTransitioning) {
      this.noteWheelActivity();
      return;
    }
    if (!this.wheelReady) {
      if (previousDirection && direction !== previousDirection) {
        clearTimeout(this.wheelReleaseTimer);
        this.wheelReady = true;
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

  onTouchStart(event) {
    if (body.dataset.state !== "ready" || $("#menu")?.dataset.open === "true" || event.touches.length !== 1) return;
    const touch = event.touches[0];
    this.touchStart = { x: touch.clientX, y: touch.clientY };
  },

  onTouchMove(event) {
    if (!this.touchStart || $("#menu")?.dataset.open === "true") return;
    const touch = event.touches[0];
    if (!touch) return;
    const dy = touch.clientY - this.touchStart.y;
    const dx = touch.clientX - this.touchStart.x;
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) event.preventDefault();
  },

  onTouchEnd(event) {
    if (!this.touchStart) return;
    const start = this.touchStart;
    this.touchStart = null;
    if (this.isTransitioning || $("#menu")?.dataset.open === "true") return;
    const touch = event.changedTouches[0];
    if (!touch) return;
    const dy = touch.clientY - start.y;
    const dx = touch.clientX - start.x;
    const threshold = Env.mobile ? 52 : 58;
    if (Math.abs(dy) < threshold || Math.abs(dy) < Math.abs(dx) * 1.15) return;
    this.navigate(dy < 0 ? 1 : -1);
  },

  onKeyDown(event) {
    if (body.dataset.state !== "ready" || $("#menu")?.dataset.open === "true") return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(event.target?.tagName) || event.target?.isContentEditable) return;
    const forward = ["ArrowDown", "PageDown", " "];
    const backward = ["ArrowUp", "PageUp"];
    if (!forward.includes(event.key) && !backward.includes(event.key)) return;
    event.preventDefault();
    this.navigate(backward.includes(event.key) || (event.key === " " && event.shiftKey) ? -1 : 1);
  },

  bindInputs() {
    if (this.handlers.wheel) return;
    this.handlers = {
      wheel: this.onWheel.bind(this),
      touchstart: this.onTouchStart.bind(this),
      touchmove: this.onTouchMove.bind(this),
      touchend: this.onTouchEnd.bind(this),
      keydown: this.onKeyDown.bind(this)
    };
    window.addEventListener("wheel", this.handlers.wheel, { passive: false });
    window.addEventListener("touchstart", this.handlers.touchstart, { passive: true });
    window.addEventListener("touchmove", this.handlers.touchmove, { passive: false });
    window.addEventListener("touchend", this.handlers.touchend, { passive: true });
    window.addEventListener("keydown", this.handlers.keydown);
  },

  reframe() {
    if (this.timeline) this.timeline.kill();
    this.timeline = null;
    this.isTransitioning = false;
    this.stopAmbient();
    this.setRestState(this.currentScene);
    this.updateHUD(this.currentScene);
    this.startAmbient(this.currentScene);
  },

  destroy() {
    if (this.timeline) this.timeline.kill();
    this.stopAmbient();
    clearTimeout(this.wheelReleaseTimer);
    if (this.handlers.wheel) {
      window.removeEventListener("wheel", this.handlers.wheel);
      window.removeEventListener("touchstart", this.handlers.touchstart);
      window.removeEventListener("touchmove", this.handlers.touchmove);
      window.removeEventListener("touchend", this.handlers.touchend);
      window.removeEventListener("keydown", this.handlers.keydown);
    }
    this.handlers = {};
    this.timeline = null;
    this.isTransitioning = false;
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
        requestAnimationFrame(() => SceneNavigation.goToScene(index));
      });
    });
    document.addEventListener("keydown", (e) => {
      if (this.menu.dataset.open === "true") {
        if (e.key === "Escape") this.hide();
        if (e.key === "Tab") this.trap(e, this.menu);
      }
    });
    $(".hud__cue").addEventListener("click", () => {
      SceneNavigation.goToScene(1);
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
    if (body.dataset.state === "ready") body.style.overflow = "hidden";
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

  /* Autoplay ends here. Every later scene waits for one deliberate gesture. */
  handOver() {
    if (body.dataset.state === "ready") return;
    body.dataset.state = "ready";
    performance.mark("benghazi-interactive");
    body.style.overflow = "hidden";
    /* the cloud layer has been left behind — take it out of the DOM */
    const flythrough = $("#flythrough");
    flythrough && flythrough.remove();
    const haze = $("#haze");
    haze && haze.remove();
    SceneNavigation.build();
    Atmosphere.start(Loader.heroSrc);
    this.schedulePostArrival();
  },

  /* Non-essential media begins only after the hero is readable and interactive. */
  schedulePostArrival() {
    const startBird = async () => {
      await Bird.init();
      if (!Bird.el || !Bird.mode) return;
      const scale = Env.mobile ? 0.76 : Env.tabletPortrait ? 0.86 : Env.tabletLandscape ? 0.94 : 1;
      window.setTimeout(() => Bird.fly(scale), experienceConfig.birdFirstDelay * 1000);
    };
    if ("requestIdleCallback" in window) window.requestIdleCallback(startBird, { timeout: 1200 });
    else window.setTimeout(startBird, 240);
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

    let rt;
    let viewportState = {
      width: window.innerWidth,
      orientation: window.innerWidth >= window.innerHeight ? "landscape" : "portrait",
      mode: Env.mode
    };
    window.addEventListener(
      "resize",
      () => {
        clearTimeout(rt);
        rt = setTimeout(() => {
          const orientation = window.innerWidth >= window.innerHeight ? "landscape" : "portrait";
          const substantialWidthChange = Math.abs(window.innerWidth - viewportState.width) > 40;
          if (!substantialWidthChange && orientation === viewportState.orientation) {
            return;
          }

          const wasMobile = Env.mobile;
          Env.sync();
          if (wasMobile !== Env.mobile) SceneDeck.refreshSources();
          this.applyFraming();
          if (body.dataset.state === "ready") SceneNavigation.reframe();
          viewportState = { width: window.innerWidth, orientation, mode: Env.mode };
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
