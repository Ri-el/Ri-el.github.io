#!/usr/bin/env python3
"""Convert one WebP input to one genuine PNG output for the offline importer.

This helper intentionally has no package-management behavior.  Pillow must be
provided by the explicitly selected Python environment.
"""

from __future__ import annotations

import os
import sys


MAX_PIXELS = 4_000_000


def fail(message: str, code: int = 2) -> int:
    sys.stderr.write(f"convert-webp-to-png.py: {message}\n")
    return code


def is_webp(path: str) -> bool:
    try:
        with open(path, "rb") as stream:
            header = stream.read(12)
    except OSError as exc:
        raise RuntimeError(f"cannot read input {path}: {exc}") from exc
    return len(header) >= 12 and header[:4] == b"RIFF" and header[8:12] == b"WEBP"


def main(argv: list[str]) -> int:
    if len(argv) != 3:
        return fail("expected exactly one input path and one output path (INPUT.webp OUTPUT.png)")
    input_path, output_path = argv[1], argv[2]

    try:
        from PIL import Image, ImageOps
    except Exception as exc:  # pragma: no cover - exercised in a Pillow-less env
        return fail(
            "Pillow is unavailable; install Pillow in the selected Python environment "
            f"or provide --sharp-module instead ({exc})"
        )

    try:
        if not is_webp(input_path):
            return fail("input is not a WebP file (missing RIFF/WEBP magic)")
        # Keep Pillow from accepting a decompression bomb larger than the
        # converter's shared four-million-pixel boundary.
        Image.MAX_IMAGE_PIXELS = MAX_PIXELS
        with Image.open(input_path) as source:
            width, height = source.size
            if width <= 0 or height <= 0:
                return fail("input dimensions must be positive")
            if width * height > MAX_PIXELS:
                return fail(f"input exceeds the {MAX_PIXELS} pixel limit")
            oriented = ImageOps.exif_transpose(source)
            rgba = oriented.convert("RGBA")
            os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
            rgba.save(output_path, format="PNG", compress_level=9, optimize=False)

        # Re-open and verify the output rather than treating a successful save
        # call as proof that a complete PNG reached disk.
        with Image.open(output_path) as written:
            written.verify()
    except Exception as exc:
        return fail(f"conversion failed: {exc}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
