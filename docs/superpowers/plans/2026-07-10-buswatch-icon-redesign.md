# BusWatch Icon Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the BusWatch app icon with the approved yellow/navy bus-stop sign and retain an editable vector logo master.

**Architecture:** Keep one deterministic 1024×1024 SVG as the brand source, render the asset-catalog PNG with `rsvg-convert`, and validate dimensions, opacity, color profile, palette, wording, and catalog references with a small standard-library Python script. The app code and asset catalog structure remain unchanged.

**Tech Stack:** SVG, Python 3 standard library, librsvg (`rsvg-convert`), macOS `sips`, Xcode asset catalogs, `xcodebuild`, watchOS Simulator.

---

## File Map

- Create `watch-app/Brand/BusWatchLogo.svg` — editable vector source of truth.
- Create `watch-app/scripts/validate-brand-assets.py` — deterministic brand-asset validation.
- Replace `watch-app/BusWatch/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png` — opaque 1024×1024 sRGB app icon.
- Preserve `watch-app/BusWatch/Assets.xcassets/AppIcon.appiconset/Contents.json` unchanged.

### Task 1: Add a failing brand-asset validator

**Files:**
- Create: `watch-app/scripts/validate-brand-assets.py`
- Read: `watch-app/BusWatch/Assets.xcassets/AppIcon.appiconset/Contents.json`

- [ ] **Step 1: Create the validator**

Create `watch-app/scripts/validate-brand-assets.py` with this complete content:

```python
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
```

- [ ] **Step 2: Run the validator and confirm the red state**

Run:

```bash
cd watch-app
python3 scripts/validate-brand-assets.py
```

Expected: FAIL with `Missing vector master` because `Brand/BusWatchLogo.svg` does not exist yet. The current PNG also lacks the required sRGB profile, but the validator should stop at the missing vector first.

### Task 2: Create the vector master and render the app icon

**Files:**
- Create: `watch-app/Brand/BusWatchLogo.svg`
- Replace: `watch-app/BusWatch/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png`
- Test: `watch-app/scripts/validate-brand-assets.py`

- [ ] **Step 1: Create the approved SVG master**

Create `watch-app/Brand/BusWatchLogo.svg` with this complete content:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <title>BusWatch BUS stop sign logo</title>
  <rect width="1024" height="1024" fill="#12355B"/>

  <rect x="210" y="92" width="604" height="738" rx="70" fill="#FFC83D"/>
  <rect x="250" y="132" width="524" height="218" rx="36" fill="#12355B"/>
  <text x="512" y="285"
        text-anchor="middle"
        font-family="Helvetica, Arial, sans-serif"
        font-size="150"
        font-weight="900"
        letter-spacing="10"
        fill="#FFFFFF">BUS</text>

  <rect x="250" y="390" width="524" height="360" rx="40" fill="#FFFFFF"/>
  <rect x="330" y="455" width="364" height="230" rx="58" fill="#12355B"/>
  <rect x="380" y="500" width="264" height="90" rx="20" fill="#FFFFFF"/>
  <circle cx="398" cy="650" r="24" fill="#FFC83D"/>
  <circle cx="626" cy="650" r="24" fill="#FFC83D"/>
  <rect x="375" y="670" width="60" height="60" rx="15" fill="#12355B"/>
  <rect x="589" y="670" width="60" height="60" rx="15" fill="#12355B"/>

  <rect x="464" y="830" width="96" height="92" fill="#FFC83D"/>
</svg>
```

- [ ] **Step 2: Render an opaque 1024×1024 PNG**

Run:

```bash
cd watch-app
rsvg-convert \
  --width 1024 \
  --height 1024 \
  --background-color '#12355B' \
  --output BusWatch/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png \
  Brand/BusWatchLogo.svg
sips \
  --matchTo '/System/Library/ColorSync/Profiles/sRGB Profile.icc' \
  BusWatch/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png \
  >/dev/null
```

Expected: the PNG is replaced without changing `Contents.json`.

- [ ] **Step 3: Run the validator and confirm the green state**

Run:

```bash
cd watch-app
python3 scripts/validate-brand-assets.py
```

Expected: `BusWatch brand assets are valid`.

- [ ] **Step 4: Generate representative size previews**

Run:

```bash
rm -rf /tmp/buswatch-icon-previews
mkdir -p /tmp/buswatch-icon-previews
for size in 48 80 172 1024; do
  cp watch-app/BusWatch/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png \
    "/tmp/buswatch-icon-previews/icon-${size}.png"
  sips --resampleHeightWidth "$size" "$size" \
    "/tmp/buswatch-icon-previews/icon-${size}.png" >/dev/null
done
```

Expected: four opaque previews at exactly 48×48, 80×80, 172×172, and 1024×1024.

- [ ] **Step 5: Inspect the previews visually**

Load each preview with `vision_analyze`. Verify that **BUS** remains readable, the front-facing bus is recognizable, the yellow sign does not touch the system mask edge, and no rendering artifact or unintended transparency appears.

- [ ] **Step 6: Commit the brand implementation**

Run:

```bash
git add \
  watch-app/Brand/BusWatchLogo.svg \
  watch-app/scripts/validate-brand-assets.py \
  watch-app/BusWatch/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png
git commit -m "feat(watch): redesign BusWatch app icon"
```

Expected: one focused implementation commit on `master`.

### Task 3: Verify, push, and run on the Watch simulator

**Files:**
- Verify: `watch-app/BusWatch.xcodeproj`
- Verify: `watch-app/BusWatchTests/`

- [ ] **Step 1: Run the complete Watch test suite serially**

Run:

```bash
cd watch-app
RESULT="/tmp/buswatch-icon-tests-$$.xcresult"
xcodebuild test \
  -project BusWatch.xcodeproj \
  -scheme BusWatch \
  -destination 'id=E6F65876-99B0-44B9-9191-547DEABD8419' \
  -parallel-testing-enabled NO \
  -maximum-parallel-testing-workers 1 \
  -resultBundlePath "$RESULT" \
  CODE_SIGNING_ALLOWED=NO \
  -quiet
xcrun xcresulttool get test-results summary --path "$RESULT" --compact
```

Expected: all 95 existing tests pass with zero failures and zero skips.

- [ ] **Step 2: Check the final diff**

Run:

```bash
git diff --check
git status --short --branch
```

Expected: clean diff validation; only the implementation commit is ahead of `origin/master`.

- [ ] **Step 3: Rebase and push `master`**

Run:

```bash
git pull --rebase origin master
git push origin master
LOCAL=$(git rev-parse master)
REMOTE=$(git ls-remote origin refs/heads/master | cut -f1)
test "$LOCAL" = "$REMOTE"
```

Expected: push succeeds and local/remote hashes match.

- [ ] **Step 4: Build, install, and launch on Ming’s Watch simulator**

Run:

```bash
cd watch-app
UDID=E6F65876-99B0-44B9-9191-547DEABD8419
BUNDLE=com.nggihming.buswatch.watchkitapp
DERIVED=/tmp/buswatch-icon-final
xcodebuild build \
  -project BusWatch.xcodeproj \
  -scheme BusWatch \
  -destination "id=$UDID" \
  -configuration Debug \
  -derivedDataPath "$DERIVED" \
  CODE_SIGNING_ALLOWED=NO \
  -quiet
xcrun simctl boot "$UDID" 2>/dev/null || true
xcrun simctl install "$UDID" "$DERIVED/Build/Products/Debug-watchsimulator/BusWatch.app"
xcrun simctl privacy "$UDID" grant location "$BUNDLE" || true
xcrun simctl location "$UDID" set '3.1478,101.6953'
xcrun simctl launch "$UDID" "$BUNDLE"
```

Expected: build succeeds and BusWatch launches with live nearby data.

- [ ] **Step 5: Report delivery evidence**

Report the final commit, matching `origin/master` hash, validator result, exact test totals, simulator build/install/launch result, and attach the approved 1024×1024 icon plus the small-size previews.
