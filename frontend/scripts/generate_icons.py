#!/usr/bin/env python3
"""
Generare iconițe PWA pentru Open Transparență.

Creează public/icons/icon-192.png, icon-512.png, maskable-512.png
cu fundal dark #08090b + simbol "OT" stilizat.

Usage:
    python scripts/generate_icons.py
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

BG = (8, 9, 11)          # #08090b — theme dark
ACCENT = (245, 158, 11)  # #f59e0b — amber (culoarea domeniului Buget/CTAs)
TEXT = (255, 255, 255)

OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "icons"


def find_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    """Încearcă fonturi comune; fallback la default."""
    candidates = [
        "C:/Windows/Fonts/arialbd.ttf",
        "C:/Windows/Fonts/segoeuib.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            continue
    return ImageFont.load_default()


def draw_icon(size: int, maskable: bool = False) -> Image.Image:
    img = Image.new("RGBA", (size, size), BG)
    draw = ImageDraw.Draw(img)

    # Fundal: gradient subtil vertical (slightly lighter sus)
    for y in range(size):
        t = y / size
        r = int(BG[0] + (18 - BG[0]) * t)
        g = int(BG[1] + (22 - BG[1]) * t)
        b = int(BG[2] + (28 - BG[2]) * t)
        draw.line([(0, y), (size, y)], fill=(r, g, b, 255))

    # Zona sigură pentru maskable (safe zone 80%): simbolul în centru
    margin = size * 0.20 if maskable else size * 0.12
    box = (margin, margin, size - margin, size - margin)

    # Romb/patrat rotunjit accent în spatele textului
    accent_box = [
        box[0] + size * 0.08,
        box[1] + size * 0.08,
        box[2] - size * 0.08,
        box[3] - size * 0.08,
    ]
    radius = int(size * 0.06)
    draw.rounded_rectangle(accent_box, radius=radius, fill=ACCENT + (230,))

    # Text "OT" centrat
    font = find_font(int(size * 0.34))
    text = "OT"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    tx = (size - tw) / 2 - bbox[0]
    ty = (size - th) / 2 - bbox[1]
    draw.text((tx, ty), text, font=font, fill=TEXT)

    return img


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    for size in (192, 512):
        icon = draw_icon(size, maskable=False)
        icon.save(OUT_DIR / f"icon-{size}.png")
        print(f"  ✓ icon-{size}.png ({size}x{size})")

    maskable = draw_icon(512, maskable=True)
    maskable.save(OUT_DIR / "maskable-512.png")
    print("  ✓ maskable-512.png (512x512, safe zone 80%)")

    # Favicon clasic (32x32)
    fav = draw_icon(32, maskable=False)
    fav.save(OUT_DIR.parent / "favicon.ico", format="ICO", sizes=[(32, 32)])
    print("  ✓ favicon.ico (32x32)")

    print("\nGata — iconițe generate în", OUT_DIR)


if __name__ == "__main__":
    main()
