---
title: Landing Page
date: 2026-09-27
tags: [dev-log, product, ui]
---
## Summary
Marketing home presents Labelo with a full-bleed hero, flow and labels sections, and a closing sign-in CTA. Copy lives in `messages/en-US.json` and `messages/es-CO.json` under `home.*`.

## Context
- Related: [[Image-Identity]], [[Projects-Kanban]], [[Internal-Progress]]
- Implementation Path: `app/[locale]/page.tsx`, `components/landing/`, `components/HomeHeader.tsx`, `public/generated/landing/`

## Assets
- Hero: `public/generated/landing/hero.jpg` (16:9, mascot + labels, left negative space)
- Flow: `public/generated/landing/flow.jpg` (vertical rail still life)
- Labels: `public/generated/landing/labels.jpg` (fanned paper labels)
- Motion: `.landing-rise` enter + `.landing-hero-media` drift in `app/globals.css` (honors `prefers-reduced-motion`)
