---
title: Famity Auth for Labelo
date: 2026-09-27
tags: [dev-log, architecture, auth]
---
## Summary
Labelo signs in through WorkOS AuthKit in the **Famity Care Production** environment so users share the Famity identity pool (Google + Magic Auth). AuthKit currently shows Famity branding because per-application branding is not enabled for the team.

## Context
- Related: [[Onboarding]], [[Server-Actions]], [[Internal-Progress]]
- Implementation Path: `app/login/route.ts`, `app/callback/route.ts`, `proxy.ts`

## WorkOS apps
- Environment: Famity Care → Production (`environment_01K9J84BB364N8RZ89ZP9394VB`)
- Labelo AuthKit app client: `client_01M3DBK65HSCPHK227D836ENNP`
- Famity AuthKit app client: `client_01K9J84BNX4JC8CM3F27RA5ZFX` (default)
- Redirect URIs on the Labelo app: `https://www.labelo.space/callback`, `https://labelo.space/callback`
- Famity default app also accepts Labelo callbacks as a fallback if Production uses Famity's client ID

Local template: `env.workos.example` (copy values into `.env.local`).

## Required Vercel Production env
- `WORKOS_CLIENT_ID` = Labelo app client above
- `WORKOS_API_KEY` = API key created under **that same Famity Care Production environment** (ideally on the Labelo application). A Garitma key makes AuthKit open but `/callback` fail with "Couldn't sign in".
- `NEXT_PUBLIC_WORKOS_REDIRECT_URI` = `https://www.labelo.space/callback`
- `WORKOS_COOKIE_PASSWORD` ≥ 32 characters

## Logos
- Famity keeps the **environment** AuthKit logo/colors (display name Famity).
- Labelo's PWA/UI mark lives in `public/brand/logo.png` and `public/icons/*` — independent of AuthKit.
- Per-app AuthKit branding is **not enabled** on this WorkOS team, so Labelo cannot show a different hosted login logo until WorkOS enables that feature or Labelo uses a separate environment.
