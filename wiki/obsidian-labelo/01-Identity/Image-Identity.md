---
title: Image Identity
date: 2026-09-27
tags: [identity, images, brand]
status: ready
---
## Summary
Labelo imagery is soft studio photography mixed with flat sticker-like illustration. The mascot (orange face, sky-blue petals/tentacles, thick black outline) is the only character; scenes feel calm, tactile, and label-forward.

## Context
- Related: [[Welcome]], [[Bootstrap]], [[Landing-Page]]
- Implementation Path: `.cursor/skills/generate-brand-images/`, `public/generated/landing/`, `pnpm ai:image`

## Dimensions

### Style / medium
- Soft daylight studio photography with gentle depth of field; optional flat vector stickers of labels and the Labelo mascot layered into the scene.
- Friendly, approachable, not corporate 3D gloss or neon cyber UI.

### Palette & lighting
- Brand anchors: warm orange (~`#F6A036`), sky blue (~`#57AEE5` / `#97D7F3`), thick black outlines, off-white paper surfaces.
- Align UI chrome with Aura gray 1–2 backgrounds and black primary (`--accent-9`); keep photographic blues/oranges in imagery only.
- Lighting: soft north-facing daylight, low contrast, no hard rim lights or purple gradients.

### Composition / motifs
- Recurring subjects: physical paper labels, status rails, stacked project sheets, the Labelo mascot as a quiet companion (never the sole subject covering the frame).
- Hero: wide 16:9, subject weighted right or lower-third, clean negative space left/upper for HTML brand type.
- Crop safety: keep mascot and label edges inside a 8% inset; no critical detail at extreme corners.

### Exclusions
- No baked-in UI text, logos, watermarks, or readable app chrome in pixels.
- No purple/indigo glow, cream-and-terracotta editorial clichés, dense newspaper layouts, or dark neon dashboards.
- No extra mascots or competing characters.

## Notes
Native agent image generation used when `GOOGLE_API_KEY` / `GEMINI_API_KEY` is unset. Regenerate if accidental text or identity drift appears.
