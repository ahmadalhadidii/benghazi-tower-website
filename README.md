# Benghazi Tower — A New Way of Living

A scroll-driven architectural film for Benghazi Tower. The experience begins
inside layered photoreal cloud depth, lands on the aerial hero, then hands control to
the visitor for a pinned fourteen-scene journey through the project.

## Run it

Serve the repository over HTTP so the loader can stream the hero image and
report real progress.

```bash
python3 -m http.server 5173
# or: npx serve .
```

Open `http://localhost:5173`.

## Experience architecture

The current implementation deliberately keeps time-driven and scroll-driven
motion separate:

- `Intro` controls the one-time cloud descent, hero landing, bird fly-by, title,
  HUD, and signature reveal.
- `SceneDeck` renders scene layers from `experienceConfig.scenes`, applies the
  desktop, tablet-landscape, tablet-portrait, and mobile art direction, and
  progressively assigns image sources.
- `ScrollFramework` pins a single full-screen frame and scrubs the complete
  sequence. Each incoming scene uses its configured transition family.
- `Interface` controls project menu destinations, focus trapping, and the
  scroll cue.

The menu points to four real moments in the journey: The Arrival, The
Waterfront, The Court, and The Horizon. Authorship remains only in the fixed
bottom signature.

## Scene sequence

1. Atmospheric aerial arrival
2. Closer aerial landmark
3. Iconic full exterior
4. Waterfront promenade
5. Podium and garden terraces
6. Coastal landscape roof
7. Flowing architectural envelope
8. Mixed-use public court
9. Sea-facing atrium
10. Office and business space
11. Panoramic hospitality lounge
12. Private residence
13. Mediterranean sky lounge
14. Waterfront coda

All scene metadata, copy, focal points, scales, and transition choices are at
the top of `script.js` in `experienceConfig.scenes`. Add a future scene there;
the DOM, progress HUD, lazy loading, and timeline are generated from the same
configuration.

## Assets

```text
assets/
├── images/          opening hero WebP and JPG fallback
├── scenes/          1600 px desktop and 900 px mobile WebP variants
└── atmosphere/      cloud plates, gull asset, and atmosphere manifest
```

Only the hero and the first architectural scene are requested at startup.
`SceneDeck.loadAround()` keeps only the previous, active, and next scene ready
as the visitor moves. The complete added scene set is approximately 2.3 MB across both
desktop and mobile variants; a visitor downloads only the variant appropriate
to the current breakpoint.

The Mediterranean gull is a small alpha WebP named by
`assets/atmosphere/atmosphere.json`. It uses the original asset-driven flight
path, scale ramp, acceleration, and near-lens defocus.

## Art direction

Every scene defines independent desktop and mobile camera start, reading, and
exit states as well as tablet-blended framing. Standard views retain a
controlled cover crop; wide views can switch to an image-toned cinematic frame
on portrait screens, while portrait interiors use contained editorial frames on
desktop. No architecture is stretched or warped. Transition families follow
shared architectural lines: matched push, light cut, ribbon reveal, central
void, glass wipe, depth dissolve, ceiling match, and horizon dissolve. Phones
use shorter travel and simplified reveals.

## Performance and accessibility

- GSAP + ScrollTrigger only; no WebGL or continuous render loop for scenes.
- Mobile uses 900 px WebPs, three cloud layers, no descent blur, a compact
  horizontal chapter label, and shorter per-scene scroll distances.
- Scene images decode asynchronously and receive their URLs progressively.
- Height-only mobile browser-bar changes do not refresh the pinned journey;
  true orientation changes preserve the active chapter.
- Intro, atmosphere, and bird motion pause while the tab is hidden.
- `prefers-reduced-motion` shortens the intro, disables the bird, removes depth
  blur and large transition movement, while keeping the full scene sequence.
- The project menu is keyboard-operable, traps focus, and closes with Escape.
- Without GSAP, the experience degrades to the complete static hero rather than
  exposing an unfinished page.

The fixed authorship line remains part of the interface:
`2026 · BIM LAB · AHMAD ALHADIDII`, with the author name in the warm accent.
