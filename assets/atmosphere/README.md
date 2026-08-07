# Atmosphere assets

## Opening cloud depth

The active opening uses three photoreal 1920 × 1080 WebP plates:

- `cloud-near-v2.webp` — dense near-camera cloud walls.
- `cloud-mid-v2.webp` — a broken middle bank with visible depth openings.
- `cloud-far-v2.webp` — thin distant sunrise cloud and sky.

They are layered at different scale, opacity, drift, and exit rates. Desktop
adds a fourth foreground instance of the near plate; phones omit that plane.
The legacy `cloud-near.webp`, `cloud-mid.webp`, and `cloud-far.webp` remain in
the repository for comparison but are not used by the current experience.

## Settled hero atmosphere

After landing, `.sky-drift` moves only a masked copy of the render's upper sky.
Three `.hero-mist` zones reuse the new cloud material over the sea, coast, and
foreground. Their radial masks exclude the tower and reduce the chance of
duplicating architectural geometry. Phones omit the foreground zone.

## Bird

`mediterranean-gull.webp` is an alpha photographic gull named in
`atmosphere.json`. The one-time flight begins 0.9 seconds after the camera
settles, stays in the upper sky, accelerates right-to-left, scales toward the
lens, and defocuses before leaving the frame.

The runtime also supports a transparent WebM or a WebP/PNG frame sequence. To
use a sequence, point `bird` in `atmosphere.json` to a JSON manifest such as:

```json
{ "fps": 24, "frames": ["bird-000.webp", "bird-001.webp", "bird-002.webp"] }
```
