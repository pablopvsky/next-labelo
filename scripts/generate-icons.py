#!/usr/bin/env python3
"""Regenerate the Labelo brand logo and PWA icon set.

Source of truth: ``public/icons/icon-source.png`` (square artwork on a white
background). Running this script rewrites ``public/brand/logo.png`` (background
removed, used by the in-app ``Logo`` component) plus every favicon and PWA icon
referenced from ``app/layout.tsx`` and ``app/manifest.ts``.

Requires Pillow:

    python3 -m pip install pillow
    python3 scripts/generate-icons.py
"""

from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "public" / "icons" / "icon-source.png"
LOGO = ROOT / "public" / "brand" / "logo.png"
ICONS = ROOT / "public" / "icons"

# Icon canvas colour. Matches the white strokes inside the artwork so the mark
# reads as a single shape on iOS/Android launchers, which ignore transparency.
CANVAS = (255, 255, 255, 255)
WHITE_THRESHOLD = 238
LOGO_SIZE = 1024


def strip_background(image: Image.Image) -> Image.Image:
    """Clear the white canvas around the mark, keeping interior white strokes.

    Only white pixels reachable from the border are cleared, so the white
    outlines that separate the petals stay part of the artwork.
    """
    rgb = image.convert("RGB")
    width, height = rgb.size
    pixels = rgb.load()
    outside = bytearray(width * height)
    queue: deque[tuple[int, int]] = deque()

    def enqueue(x: int, y: int) -> None:
        index = y * width + x
        if outside[index]:
            return
        red, green, blue = pixels[x, y]
        if red < WHITE_THRESHOLD or green < WHITE_THRESHOLD or blue < WHITE_THRESHOLD:
            return
        outside[index] = 1
        queue.append((x, y))

    for x in range(width):
        enqueue(x, 0)
        enqueue(x, height - 1)
    for y in range(height):
        enqueue(0, y)
        enqueue(width - 1, y)

    while queue:
        x, y = queue.popleft()
        if x > 0:
            enqueue(x - 1, y)
        if x < width - 1:
            enqueue(x + 1, y)
        if y > 0:
            enqueue(x, y - 1)
        if y < height - 1:
            enqueue(x, y + 1)

    alpha = Image.frombytes(
        "L", (width, height), bytes(0 if flag else 255 for flag in outside)
    ).filter(ImageFilter.GaussianBlur(0.6))

    transparent = rgb.convert("RGBA")
    transparent.putalpha(alpha)
    box = transparent.getbbox()
    return transparent.crop(box) if box else transparent


def square(image: Image.Image) -> Image.Image:
    """Pad the mark to a transparent square canvas."""
    side = max(image.size)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(
        image, ((side - image.width) // 2, (side - image.height) // 2), image
    )
    return canvas


def render(logo: Image.Image, size: int, scale: float) -> Image.Image:
    """Draw the mark centred on an opaque canvas at ``scale`` of the canvas."""
    canvas = Image.new("RGBA", (size, size), CANVAS)
    mark = logo.resize((round(size * scale), round(size * scale)), Image.LANCZOS)
    offset = ((size - mark.width) // 2, (size - mark.height) // 2)
    canvas.alpha_composite(mark, offset)
    return canvas.convert("RGB")


def main() -> None:
    logo = square(strip_background(Image.open(SOURCE)))

    LOGO.parent.mkdir(parents=True, exist_ok=True)
    # The mark is flat colour, so a palette keeps the shipped asset small.
    logo.resize((LOGO_SIZE, LOGO_SIZE), Image.LANCZOS).quantize(
        colors=128, method=Image.FASTOCTREE
    ).save(LOGO, optimize=True)

    for name, size, scale in (
        ("icon-32.png", 32, 0.94),
        ("icon-192.png", 192, 0.94),
        ("icon-512.png", 512, 0.94),
        ("apple-touch-icon.png", 180, 0.86),
        # Launchers crop maskable icons to the inner 80%; keep the mark smaller.
        ("icon-512-maskable.png", 512, 0.62),
    ):
        render(logo, size, scale).save(ICONS / name, optimize=True)

    favicon = render(logo, 256, 0.94)
    for target in (ROOT / "public" / "favicon.ico", ROOT / "app" / "favicon.ico"):
        favicon.save(target, sizes=[(16, 16), (32, 32), (48, 48)])


if __name__ == "__main__":
    main()
