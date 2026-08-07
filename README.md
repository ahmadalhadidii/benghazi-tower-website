# Benghazi Tower — A New Way of Living

The opening chapter of a scroll-driven architectural film: an aerial descent
through the cloud layer, a landing on the project render, and a living hero
frame that hands control to the visitor.

This build contains the foundation and the opening sequence only. The
walkthrough (podium, lobby, restaurant, offices, hotel, residences, duplexes,
sea-facing interiors) is not designed yet — reserved containers are in place.

---

## Run it

The page must be served over HTTP, not opened from the file system, so the
loader can stream the render and report real progress.

```bash
cd benghazi-tower
python3 -m http.server 5173     # or: npx serve .
# open http://localhost:5173
```

---

## The hero render

The supplied render is **already installed** — no renaming, no picker, no setup:

```
assets/images/benghazi-tower-hero.webp   195 KB  (loaded first)
assets/images/benghazi-tower-hero.jpg    321 KB  (fallback)
```

It is used unaltered as the destination frame, and it is also the source of
everything atmospheric in the build: the cloud plates are cut from its own fog
and mist, the opening whiteout is tinted with its upper sky, and the resting
sky movement is a masked copy of itself. Nothing in the atmosphere was invented.

To replace it later, overwrite those two files (or point `heroImage` at a new
path) and re-run `python3 extract_clouds.py` to re-cut the cloud plates from the
new image.

### Re-framing the render

Every positional decision lives in `experienceConfig` (top of `script.js`) and
is applied to CSS custom properties — never edit the markup:

| Control | What it does |
| --- | --- |
| `heroObjectPosition` | `object-position` on desktop — the default `52% 46%` keeps the tower centred with the sea to the left |
| `heroObjectPositionMobile` | portrait framing, applied under 900 px |
| `heroScrollDistance` | how many pixels of scroll the hero stays pinned for |
| `heroMaxScale` | how far the camera pushes in. Keep ≤ 1.10 — this is a finite-resolution render, and deep zoom will show it |

Two more in `styles.css` `:root` tune where the atmosphere sits against the
render's own horizon: `--horizon-y`, `--sky-band-top`, `--sky-band-bottom`.

---

## Assets

```
assets/
├── images/
│   └── benghazi-tower-hero.jpg     ← ADD THIS (see above)
├── atmosphere/
│   ├── atmosphere.json             names the bird asset; "bird": null = idle
│   ├── README.md                   how to add real cloud / bird footage
│   └── bird-sequence/              empty — frame sequence goes here
├── video/                          reserved
├── sequence/                       reserved
└── fonts/                          empty by design — fonts are served by Google Fonts
```

**Clouds: no asset, and nothing procedural.** The moving sky is the render's own
sky. `.sky-drift` is a second copy of the render, masked to the band above the
architecture, drifting about 1 % of the viewport width against the original over
~190 seconds. Lighting, sky colour, perspective, density, horizon and grain match
by definition, and the tower never moves because the mask ends above it. Tuning
is in `experienceConfig`: `skyDriftAmount`, `skyDriftDuration`, `skyDriftOpacity`,
`skyMaskEnd`, `skyMaskFade`. The earlier procedural cloud plates have been
deleted.

**Bird: an empty slot, deliberately.** No silhouette, icon or CSS shape stands in
for footage. The flight path, acceleration, near-lens defocus, scale ramp and
timing are implemented and wired; only the footage is missing. Drop a transparent
WebM (or a frame sequence) into `assets/atmosphere/` and name it in
`atmosphere.json` — full instructions in `assets/atmosphere/README.md`. Detection
is manifest-driven, so an absent asset produces no 404s and no console noise.

**Fonts.** Cormorant Garamond (display) and Inter (interface), loaded from
Google Fonts. No fake local font files were created. If the project needs
self-hosting later, put the licensed woff2 files in `assets/fonts/` and swap the
`<link>` for an `@font-face` block. System serif and sans fallbacks are already
declared, so the layout holds if the network fails.

---

## Motion system

**GSAP 3 + ScrollTrigger** (CDN), plus one HTML canvas for the star field.
No Three.js: the opening is a depth-sorted point field with a controlled speed
curve, which canvas 2D renders at a fraction of the cost and with none of the
gaming look WebGL invites here.

Two timing systems, kept strictly apart:

| System | Driven by | Where |
| --- | --- | --- |
| `Intro` | time — autoplays once | `Intro.build()` |
| `ScrollFramework` | scroll position — `scrub: true` | `ScrollFramework.build()` |

`scrub: true` (not a smoothing number) is deliberate: the frame is bound to the
scrollbar, so stopping freezes the image and scrolling up reverses it. Nothing
keeps gliding after the visitor's hand leaves the wheel.

### Opening sequence — an aerial descent (≈ 16 s, `introDuration` scales it)

The render is in place from the first millisecond — far above, defocused, and
completely inside cloud. Nothing else is on screen: no title, no wordmark, no
navigation, no scroll hint, no skip button.

| Time | Beat |
| --- | --- |
| 0 – 1 s | inside the cloud layer: whiteout plus moving cloud structure, no building |
| 0 – 3.5 s | the two near banks sweep past the camera and out of frame |
| 1.4 – 7 s | the mid bank opens; light, horizon and sea begin to come through |
| 3.4 – 9 s | the render resolves through the thinning cloud as focus returns |
| 0 – 9.4 s | the camera keeps descending (1.5 → 1.38 → 1.16) |
| 9.4 – 14 s | it eases to a complete stop at 1.0 — the landing |
| 10.4 s | last of the haze clears; the resting atmosphere starts |
| 12.6 s | the bird crosses the settled frame (when footage is present) |
| 14.2 s → | rule draws, place line, title lines rise, subtitle, then the interface |

Then it stops and waits. A wheel gesture, a touch drag or Enter / Space / ↓
jumps to the `arrival` label — never a hard cut, never a visible control over
the descent.

Layer order, back to front: render → far haze → mid bank → near bank A → near
bank B, each on its own scale and drift curve, all transform/opacity only.
Atmospheric defocus is 22 px on desktop and disabled on mobile
(`descentBlur`, `descentBlurMobile`), and it is removed from the DOM entirely
once the camera has landed.

### First scroll range — `exteriorApproach`

Hero pinned for `heroScrollDistance` px: camera pushes to `heroMaxScale`, sky
layers recede, ground mist advances, the title travels on its own plane and
releases, the cinematic edge closes in, and the development marker appears.

---

## Adding the next scenes

1. Add a section in `index.html` following the reserved pattern:
   `<section class="scene" id="scene-podium" data-scene="podiumArrival">`.
2. Add a build method to `ScrollFramework` (e.g. `buildPodiumArrival()`) that
   returns a timeline with its own `scrollTrigger`, and call it from `build()`.
   Push the trigger into `this.triggers` so cleanup stays centralised.
3. Add the scene's label to the `names` array in `buildProgress()`.
4. Lazy-load that scene's media inside its own trigger's `onEnter` — the loader
   must keep preloading opening assets only.

Two reserved containers already exist: `#scene-future-01` (podium arrival) and
`#scene-future-02` (lobby). They hold no design.

---

## Removing the development marker

Delete `<p class="dev-marker" data-dev="true">` from `index.html`, the
`.dev-marker` block in `styles.css`, and the single `marker` tween in
`ScrollFramework.buildHeroApproach()`.

---

## Accessibility

Semantic landmarks; the render carries descriptive alt text; the menu is
keyboard-operable with a focus trap and Escape to close; focus rings are visible
against the dark palette; interface text is warm off-white over a scrim that
stays at or above 0.42 so contrast holds on bright frames.

`prefers-reduced-motion: reduce` replaces the star travel with a short fade into
the render, disables the bird entirely, slows the atmosphere to a quarter speed,
and limits the scroll push to 1.02. Every word of project information and all
navigation remain.

---

## Performance

- Four cloud layers, transform/opacity only — no per-frame layout, no canvas.
- The whole fly-through is removed from the DOM the moment the camera lands.
- Full-frame defocus runs on desktop only; mobile gets the same choreography
  without the blur (`descentBlurMobile: 0`).
- The resting mist plate is skipped entirely on mobile.
- Cloud drift is transform-only (compositor thread), never `background-position`.
- No scroll event listeners outside ScrollTrigger; no layout reads in the frame loop.
- Everything pauses on `visibilitychange` and resumes on return.
- `ScrollTrigger.refresh()` runs after `load` and after `document.fonts.ready`,
  so late layout settling cannot leave stale ranges or shift the page.

### Known limitations

- `heroMaxScale` is capped by the render's resolution, not by taste. A larger
  export raises the ceiling.
- The resting sky drift can only move what is already in the render. It breathes
  rather than travels; clouds crossing the whole frame after landing would need
  separate transparent plates.
- The bird fly-by is idle until footage is added. This is deliberate: the
  animation is finished, the asset is not.
- Without GSAP (offline, blocked CDN) the page degrades to a static, complete
  hero — correct, but not cinematic.
