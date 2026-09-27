---
title: Landing Page
date: 2026-09-27
tags: [dev-log, product, ui]
---
## Summary
Marketing home is a Famity-style growth funnel: typographic hero brand (no logo mark), manifesto, three pillars, numbered how-it-works, closing sign-in CTA. Copy lives under `home.*` in `messages/en-US.json` and `messages/es-CO.json`.

## Context
- Related: [[Image-Identity]], [[Projects-Kanban]], [[Internal-Progress]]
- Implementation Path: `app/[locale]/page.tsx`, `components/landing/`, `components/HomeHeader.tsx`, `public/generated/landing/`

## Sections
- Hero: `LandingHero` — full-bleed `hero.jpg`, `h1` Labelo wordmark only, outcome line + CTAs
- Statement: `LandingStatement` — manifesto band on `gray-2`
- Pillars: `LandingPillars` — projects / status rails / full-screen labels
- Steps: `LandingSteps` — four numbered steps + `flow.jpg`
- CTA: `LandingCta` — open workspace → Sign in / Dashboard
- Motion: `.landing-rise` + `.landing-hero-media` in `app/globals.css` (honors `prefers-reduced-motion`)
