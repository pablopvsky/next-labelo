---
title: Internal Progress
date: 2026-09-12
tags: [dev-log, progress]
---
## Summary
The project workspace now uses nested full-screen Embla carousels: statuses on the y-axis and labels on the x-axis. Backlog, import, and export remain available as separate top-level actions, and flow labels support edit, status changes, and deletion.

## Context
- Related: [[Teams-Data-Model]], [[Onboarding]], [[Projects-Kanban]], [[Delete-Projects-Labels]], [[Task-Import-Export]], [[Input-Font-Size]], [[PWA-Pull-Refresh]]
- PR: https://github.com/pablopvsky/next-labelo/pull/11

## Status
- Done: Prisma `Team` / `TeamMember` / `Project` / `Task`; create/join onboarding; dashboard project cards.
- Done: Full-screen [[Projects-Kanban]] with nested Embla axes, direct navigation dots, keyboard/wheel navigation, and independent long-label scrolling.
- Done: Project backlog toggle — `backlog` status, list view, promote-to-`requerimiento` only (`cursor/project-backlog-65b3`).
- Done: `pnpm dlx @aura-design/cli@latest blueprint` (suffix `labelo`).
- Done: Mandatory **17px** on text-entry form controls (`app/globals.css`, `Input`, `Textarea`, Aura input CSS).
- Done: PWA manifest + brand icons; iOS standalone [[PWA-Pull-Refresh]].
- Done: Label JSON [[Task-Import-Export]] (paste/file + example, AJV via `utils/web-validation.ts`).
- Done: [[Delete-Projects-Labels]] — `deleteProjectAction` + responsive confirmation menus.
- Verification: production build and changed-file ESLint pass; repository-wide TypeScript remains blocked by existing Aura `Calendar`, `Form`, and `use-dynamic-form` errors.
- Fixing: production `www.labelo.space` 500 — proxy no longer crashes when WorkOS env is incomplete; public pages stay up. Vercel Production still needs `WORKOS_API_KEY`, `WORKOS_CLIENT_ID`, `WORKOS_COOKIE_PASSWORD` (≥32), and `NEXT_PUBLIC_WORKOS_REDIRECT_URI=https://www.labelo.space/callback`.
- Next: optional multi-team switcher UI.
