# BusWatch Icon and Logo Redesign

**Date:** 2026-07-10  
**Status:** Approved visual direction; pending implementation

## Goal

Replace the current bus illustration with a bold, highly legible bus-stop sign that remains recognizable at Apple Watch icon sizes. The same vector mark will serve as the BusWatch logo source.

## Selected Direction

Direction A: high-visibility yellow, deep navy, and white.

### Palette

- Deep navy background and primary pictogram: `#12355B`
- Transit-sign yellow: `#FFC83D`
- White contrast field and lettering: `#FFFFFF`

## Composition

- Full-bleed square navy background.
- One centered upright rectangular bus-stop sign with softly rounded sign corners.
- A navy header panel containing the exact uppercase word **BUS** in bold white geometric sans-serif lettering.
- A white lower panel containing a simple front-facing navy bus pictogram.
- Yellow circular headlights and a short yellow sign post.
- Strong symmetry, thick strokes, and generous negative space.
- No gradients, shadows, textures, photographic elements, or extra wording.
- Do not bake Apple’s rounded app-icon mask into the artwork; the operating system applies its own mask.

## Deliverables

1. Editable vector master at `watch-app/Brand/BusWatchLogo.svg`.
2. Opaque sRGB 1024×1024 PNG replacing `watch-app/BusWatch/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png`.
3. A small-size comparison sheet for visual review at representative Watch icon sizes.

## Implementation Constraints

- Preserve the existing asset-catalog filename and `Contents.json` references.
- Keep all important artwork inside a safe area of approximately 10% on every edge.
- Ensure **BUS** remains readable and the bus remains identifiable at 48×48 pixels.
- Use deterministic vector geometry so text and proportions are exact rather than AI-generated.
- Do not alter app behavior, bundle identifiers, signing, or release metadata.

## Verification

- Confirm the exported PNG is exactly 1024×1024, opaque, and sRGB-compatible.
- Render and inspect 48×48, 80×80, 172×172, and 1024×1024 previews.
- Regenerate the Xcode project only if the project structure requires it.
- Run the complete Watch test suite and a simulator build.
- Install and launch the app on Ming’s Watch simulator after pushing the completed implementation to `origin/master`.
