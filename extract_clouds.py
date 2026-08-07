"""Extract cloud plates from the supplied render's own atmosphere.

No stock clouds, no procedural noise. The fog bank in the lower frame, the mist
over the sea and the cloud band along the horizon are real atmosphere from the
same render, lit by the same sun. We isolate their density (low-frequency
luminance above the local scene) as an alpha channel, tint each plate with the
colour sampled from its own bright pixels, feather the edges to nothing, and
save transparent WebP.

Result: cloud material that matches the destination frame by construction.
"""
import numpy as np
from PIL import Image, ImageFilter

SRC = "assets/images/benghazi-tower-hero.jpg"
OUT = "assets/atmosphere"

img = Image.open(SRC).convert("RGB")


def feather(h, w, fx=0.22, fy=0.22):
    """Cosine window so no plate edge is ever visible."""
    x = np.linspace(0, 1, w)
    y = np.linspace(0, 1, h)
    wx = np.clip(np.minimum(x / fx, (1 - x) / fx), 0, 1)
    wy = np.clip(np.minimum(y / fy, (1 - y) / fy), 0, 1)
    wx = 0.5 - 0.5 * np.cos(np.pi * wx)
    wy = 0.5 - 0.5 * np.cos(np.pi * wy)
    return np.outer(wy, wx)


def plate(name, box, lo_pct, hi_pct, gain, blur, out_size, flip=False, gamma=1.0):
    crop = img.crop(box)
    if flip:
        crop = crop.transpose(Image.FLIP_LEFT_RIGHT)
    crop = crop.resize(out_size, Image.LANCZOS)
    arr = np.array(crop).astype(float)

    # Density is read at low resolution: fog is a low-frequency field, while
    # roads, bridges and cars are high-frequency and simply vanish.
    lum = Image.fromarray(arr.mean(axis=2).astype(np.uint8), "L")
    small = lum.resize((220, max(int(220 * out_size[1] / out_size[0]), 8)), Image.BOX)
    small = small.filter(ImageFilter.GaussianBlur(blur))
    soft = np.array(small.resize(out_size, Image.BICUBIC)).astype(float)

    lo = np.percentile(soft, lo_pct)
    hi = np.percentile(soft, hi_pct)
    alpha = np.clip((soft - lo) / max(hi - lo, 1e-6), 0, 1) ** gamma
    alpha *= feather(*alpha.shape)
    alpha *= gain
    alpha = np.clip(alpha, 0, 1)

    # Colour comes from the plate's own brightest pixels, so it carries the
    # render's light without carrying its geometry.
    bright = arr.reshape(-1, 3)
    idx = np.argsort(bright.mean(axis=1))[-max(len(bright) // 20, 1):]
    tint = bright[idx].mean(axis=0)

    rgb = np.zeros(arr.shape, dtype=np.uint8)
    rgb[:, :, 0] = int(tint[0])
    rgb[:, :, 1] = int(tint[1])
    rgb[:, :, 2] = int(tint[2])

    out = Image.fromarray(rgb, "RGB").convert("RGBA")
    a_img = Image.fromarray((alpha * 255).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(3))
    out.putalpha(a_img)
    path = f"{OUT}/{name}"
    out.save(path, "WEBP", quality=82, method=6)
    print(f"{path}  {out.size}  tint={tint.round(0)}  coverage={round(float(alpha.mean()),3)}")


# NEAR — the dense fog bank in the lower frame. Passes the camera first.
plate("cloud-near.webp", (0, 700, 900, 1126), 26, 95.0, 1.0, 3.5, (1800, 900), gamma=0.62)

# MID — mist wisps over the sea, softer and more separated.
plate("cloud-mid.webp", (0, 170, 820, 560), 34, 96.5, 1.0, 3, (1800, 900), flip=True, gamma=0.75)

# FAR — the cloud band along the horizon, thin and wide.
plate("cloud-far.webp", (0, 10, 1397, 230), 40, 97.5, 0.95, 3, (2000, 700), gamma=0.85)
