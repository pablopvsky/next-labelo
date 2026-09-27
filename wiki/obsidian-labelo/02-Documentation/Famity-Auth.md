---
title: Famity Auth for Labelo
date: 2026-09-27
tags: [dev-log, architecture, auth]
---
## Summary
Labelo signs in through WorkOS AuthKit in the **Famity Care Production** environment so users share the Famity identity pool (Google + Magic Auth). Hosted AuthKit branding is **per environment**, so Labelo and Famity show the same login logo/colors while they share that environment.

## Context
- Related: [[Onboarding]], [[Server-Actions]], [[Internal-Progress]]
- Implementation Path: `app/login/route.ts`, `app/callback/route.ts`, `proxy.ts`
- Local template: `env.workos.example`

## WorkOS apps
- Environment: Famity Care → Production (`environment_01K9J84BB364N8RZ89ZP9394VB`)
- Labelo AuthKit app client: `client_01M3DBK65HSCPHK227D836ENNP`
- Famity AuthKit app client: `client_01K9J84BNX4JC8CM3F27RA5ZFX` (default)
- Redirect URIs on the Labelo app: `https://www.labelo.space/callback`, `https://labelo.space/callback`
- Famity default app also accepts Labelo callbacks as a fallback

## Required Vercel Production env
- `WORKOS_CLIENT_ID` = Labelo app client above
- `WORKOS_API_KEY` = API key from **Famity Care Production** (create it on the Labelo application). A Garitma key lets AuthKit open but `/callback` fails with "Couldn't sign in".
- `NEXT_PUBLIC_WORKOS_REDIRECT_URI` = `https://www.labelo.space/callback`
- `WORKOS_COOKIE_PASSWORD` ≥ 32 characters

## Logos
- AuthKit logo/theme is environment-scoped ([WorkOS Applications](https://workos.com/docs/authkit/applications)): Famity and Labelo **cannot** show different hosted login logos while they share one environment and one user base.
- Famity already owns that environment branding (orange buttons + mark). Change it in WorkOS Branding if needed; it updates both apps' AuthKit screens.
- Labelo's in-app / PWA mark (`public/brand/logo.png`, `public/icons/*`) is independent of AuthKit.
- Different AuthKit logos + shared users requires a self-hosted AuthKit UI, not a second environment (that would split users).
