---
title: Internal Progress
date: 2026-08-29
tags: [dev-log, progress]
---
## Summary
Teams, projects, and kanban labels are implemented. Inputs stay at **17px**. PWA install + iOS pull-to-refresh ported from Famity Care patterns.

## Context
- Related: [[Teams-Data-Model]], [[Onboarding]], [[Projects-Kanban]], [[Input-Font-Size]], [[PWA-Pull-Refresh]]
- PR: https://github.com/pablopvsky/next-labelo/pull/4

## Status
- Done: Prisma `Team` / `TeamMember` / `Project` / `Task`; create/join onboarding; dashboard project cards; stacked kanban with DnD, duplicate, delete.
- Done: `pnpm dlx @aura-design/cli@latest blueprint` (suffix `labelo`).
- Done: Mandatory **17px** on text-entry form controls (`app/globals.css`, `Input`, `Textarea`, Aura input CSS).
- Done: PWA manifest + brand icons; iOS standalone [[PWA-Pull-Refresh]].
- Fixing: production `www.labelo.space` 500 — proxy no longer crashes when WorkOS env is incomplete; public pages stay up. Vercel Production still needs `WORKOS_API_KEY`, `WORKOS_CLIENT_ID`, `WORKOS_COOKIE_PASSWORD` (≥32), and `NEXT_PUBLIC_WORKOS_REDIRECT_URI=https://www.labelo.space/callback`.
- Next: optional multi-team switcher UI.
