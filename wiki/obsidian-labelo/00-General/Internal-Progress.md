---
title: Internal Progress
date: 2026-08-30
tags: [dev-log, progress]
---
## Summary
Teams, projects, and kanban labels are implemented. Label JSON import/export with AJV validation is available on the project board. Inputs stay at **17px**. PWA install + iOS pull-to-refresh ported from Famity Care patterns.

## Context
- Related: [[Teams-Data-Model]], [[Onboarding]], [[Projects-Kanban]], [[Task-Import-Export]], [[Input-Font-Size]], [[PWA-Pull-Refresh]]
- PR: https://github.com/pablopvsky/next-labelo/pull/4

## Status
- Done: Prisma `Team` / `TeamMember` / `Project` / `Task`; create/join onboarding; dashboard project cards; stacked kanban with DnD, duplicate, delete.
- Done: Project backlog toggle — `backlog` status, list view, promote-to-`requerimiento` only (`cursor/project-backlog-65b3`).
- Done: `pnpm dlx @aura-design/cli@latest blueprint` (suffix `labelo`).
- Done: Mandatory **17px** on text-entry form controls (`app/globals.css`, `Input`, `Textarea`, Aura input CSS).
- Done: PWA manifest + brand icons; iOS standalone [[PWA-Pull-Refresh]].
- Done: Label JSON [[Task-Import-Export]] (paste/file + example, AJV via `utils/web-validation.ts`).
- Fixing: production `www.labelo.space` 500 — proxy no longer crashes when WorkOS env is incomplete; public pages stay up. Vercel Production still needs `WORKOS_API_KEY`, `WORKOS_CLIENT_ID`, `WORKOS_COOKIE_PASSWORD` (≥32), and `NEXT_PUBLIC_WORKOS_REDIRECT_URI=https://www.labelo.space/callback`.
- Next: optional multi-team switcher UI.
