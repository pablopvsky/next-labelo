---
title: Landing Page
date: 2026-09-27
tags: [dev-log, product, ui]
---
## Summary
Marketing home is a Famity-style growth funnel wired to Aura components: typographic hero, manifesto with [[Marker]], pillars (Grid + `labels.jpg`), Stepper how-it-works, closing CTA. Copy stays under `home.*` in messages.

## Context
- Related: [[Image-Identity]], [[Projects-Kanban]], [[Internal-Progress]]
- Implementation Path: `app/[locale]/page.tsx`, `components/landing/`, `components/ui/{Stepper,Marker,Grid,AspectRatio,Separator}.tsx`

## Sections
- Hero: `LandingHero` — full-bleed `hero.jpg`, staggered `.landing-rise`, Aura `Button` CTAs
- Statement: `LandingStatement` — Marker separator + manifesto on `gray-2`
- Pillars: `LandingPillars` — `labels.jpg` + Aura `Grid` three + icon wells
- Steps: `LandingSteps` / `LandingStepsList` — Aura vertical `Stepper` + `flow.jpg` in `AspectRatio`
- CTA: `LandingCta` — accent wash + primary Button with icon
- Motion: `.landing-rise` delays + `.landing-hero-media` in `app/globals.css`
