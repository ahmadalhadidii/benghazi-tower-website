# Atmosphere assets

## Clouds — cut from the supplied render itself

No stock plates, no procedural noise, no CSS blobs. The three cloud plates in
this folder are extracted from the project render's own atmosphere:

| Plate | Source region of the render |
| --- | --- |
| `cloud-near.webp` | the dense fog bank across the lower frame |
| `cloud-mid.webp` | the mist wisps over the sea (mirrored) |
| `cloud-far.webp` | the thin cloud band along the horizon |

Extraction (`extract_clouds.py`, reproducible): density is read as a
low-frequency luminance field, so roads, bridges and cars — all high-frequency —
disappear while the fog's own shape survives. Each plate is tinted with the
colour of its own brightest pixels, so it carries the render's light without
carrying its geometry, and every edge is feathered to zero with a cosine window
so no plate boundary can ever appear.

The result matches the destination frame by construction: same sun, same colour
temperature, same atmospheric density.

To regenerate at different densities, edit the `plate(...)` calls at the bottom
of `extract_clouds.py` — `lo_pct` controls how much fog survives, `gamma` its
contrast, `gain` its ceiling.

### Resting atmosphere

After landing, two things move and nothing else:

- `.sky-drift` — a second copy of the render, masked to the band above the
  architecture *and* horizontally away from the city skyline (so no building is
  ever doubled), drifting ~1 % of viewport width over ~190 s.
- `.mist-rest` — one wisp of `cloud-mid` over the sea at 11 % opacity, drifting
  over ~150 s.

Both are tuned in `experienceConfig`: `skyDriftAmount`, `skyDriftDuration`,
`skyDriftOpacity`, `skyMaskEnd`, `skyMaskFade`. The masks must stay **above**
the tower crown — if you re-crop with `heroObjectPosition`, move them too.

## Bird — asset slot, still empty

This is the one thing that cannot be built from the render: there is no bird in
it, and nothing convincing can be synthesised. No icon, silhouette or CSS shape
stands in for footage.

Everything else is done and wired: the flight path (open sky, never crossing the
tower, with a separate higher route for portrait), the acceleration toward the
lens, the near-camera defocus, the scale ramp and the timing. Only the footage
is missing.

**Option A — transparent WebM (preferred, lightest):**

```bash
ffmpeg -i bird.mov -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 900k -an bird.webm
```

Put `bird.webm` in this folder, then set `"bird": "bird.webm"` in
`atmosphere.json`. 1–2 seconds, gull or tern, real wing movement, no baked
highlights or background — it passes close to the lens.

**Option B — frame sequence:** transparent WebP/PNG frames in `bird-sequence/`
plus a manifest:

```json
{ "fps": 24, "frames": ["bird-000.webp", "bird-001.webp", "bird-002.webp"] }
```

then `"bird": "bird-sequence/manifest.json"` in `atmosphere.json`.

Either is detected on load. Nothing else needs changing. While `"bird"` is
`null` the fly-by stays idle and no placeholder is drawn.
