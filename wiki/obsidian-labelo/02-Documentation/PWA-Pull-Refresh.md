---
title: PWA and Pull to Refresh
date: 2026-08-29
tags: [dev-log, architecture, pwa]
---
## Summary
Labelo installs as a standalone PWA (Famity Care-style manifest) using the brand mark icons. iOS installed mode gets a custom pull-to-refresh because Safari does not provide one.

## Context
- Related: [[Internal-Progress]], [[Input-Font-Size]]
- Implementation Path: `app/manifest.ts`, `components/pwa/PullToRefresh.tsx`, `public/icons/`

## Notes
- Manifest mirrors Famity (`display: standalone`, icon set, theme/background colors mapped to Labelo gray tokens).
- Pull-to-refresh runs only on iOS standalone/PWA; Android keeps native browser refresh.
- Icons generated from the attached circular brand mark (192 / 512 / apple-touch / maskable).
