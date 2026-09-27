---
title: Landing Page
date: 2026-09-27
tags: [dev-log, product, ui]
---
## Summary
Marketing home uses Neo Mirai–style modular diagramation (split bands, portrait pillars, accent manifesto) filled with Labelo product copy and Famity-kawaii imagery. Accent is Famity sky blue (`#57AEE5`) from `@aura-design/cli colors`.

## Context
- Related: [[Image-Identity]], [[Projects-Kanban]], [[Internal-Progress]]
- Implementation Path: `app/[locale]/page.tsx`, `components/landing/`, `components/HomeHeader.tsx`, `public/generated/landing/`

## Sections
- Header: `HomeHeader` — logo, section anchors, Sign in
- Hero: `LandingHero` — full-bleed `hero.jpg`, outcome headline as `h1` (Labelo mark stays in header) + CTAs
- Flow: `LandingSteps` — dark how-it-works rail + vertical tag strip + `flow.jpg`
- Surfaces: `LandingPillars` — three kawaii portrait panels + outlined “Surfaces” panel
- Statement: `LandingStatement` — blue accent manifesto band + `manifesto.jpg`
- CTA: `LandingCta` — workspace open + accent aside
- Motion: `.landing-rise` / `.landing-hero-media` in `app/globals.css` (honors `prefers-reduced-motion`)
