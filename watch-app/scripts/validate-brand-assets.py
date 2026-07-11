#!/usr/bin/env python3
from pathlib import Path
import json
import subprocess

WATCH_APP = Path(__file__).resolve().parents[1]
SOURCE = WATCH_APP / "Brand" / "BusWatchLogo.png"
PNG = WATCH_APP / "BusWatch" / "Assets.xcassets" / "AppIcon.appiconset" / "AppIcon-1024.png"
CONTENTS = PNG.parent / "Contents.json"


def sips_properties(path: Path) -> str:
    result = subprocess.run(
        [
            "sips",
            "-g", "pixelWidth",
            "-g", "pixelHeight",
            "-g", "hasAlpha",
            "-g", "profile",
            str(path),
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    return result.stdout


def main() -> None:
    assert SOURCE.exists(), f"Missing supplied logo master: {SOURCE}"
    assert PNG.exists(), f"Missing app icon: {PNG}"

    source_properties = sips_properties(SOURCE)
    for required in ("pixelWidth: 1024", "pixelHeight: 1024"):
        assert required in source_properties, f"Logo master validation failed: {required}"

    properties = sips_properties(PNG)
    for required in (
        "pixelWidth: 1024",
        "pixelHeight: 1024",
        "hasAlpha: no",
        "profile: sRGB IEC61966-2.1",
    ):
        assert required in properties, f"PNG validation failed: {required}"

    catalog = json.loads(CONTENTS.read_text())
    images = catalog["images"]
    assert {image["platform"] for image in images} == {"ios", "watchos"}
    assert all(image["filename"] == PNG.name for image in images)
    assert all(image["size"] == "1024x1024" for image in images)

    print("BusWatch brand assets are valid")


if __name__ == "__main__":
    main()
