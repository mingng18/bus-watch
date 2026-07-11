#!/usr/bin/env python3
from pathlib import Path
import json
import subprocess
import xml.etree.ElementTree as ET

WATCH_APP = Path(__file__).resolve().parents[1]
SVG = WATCH_APP / "Brand" / "BusWatchLogo.svg"
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
    assert SVG.exists(), f"Missing vector master: {SVG}"
    assert PNG.exists(), f"Missing app icon: {PNG}"

    root = ET.parse(SVG).getroot()
    assert root.attrib.get("viewBox") == "0 0 1024 1024"
    assert root.attrib.get("width") == "1024"
    assert root.attrib.get("height") == "1024"

    svg_text = SVG.read_text()
    for required in ("BUS", "#12355B", "#FFC83D", "#FFFFFF"):
        assert required in svg_text, f"SVG missing required brand token: {required}"

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
