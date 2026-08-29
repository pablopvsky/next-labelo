---
title: Internal Progress
date: 2026-08-29
tags: [dev-log, progress]
---
## Summary
Teams, projects, and kanban labels are implemented on branch `cursor/projects-kanban-teams-7106`. Aura blueprint created `wiki/obsidian-labelo` and `wiki/bruno-labelo`.

## Context
- Related: [[Teams-Data-Model]], [[Onboarding]], [[Projects-Kanban]]
- PR: https://github.com/pablopvsky/next-labelo/pull/1

## Status
- Done: Prisma `Team` / `TeamMember` / `Project` / `Task`; create/join onboarding; dashboard project cards; stacked kanban with DnD, duplicate, delete.
- Done: Project backlog toggle — `backlog` status, list view, promote-to-`requerimiento` only (`cursor/project-backlog-65b3`).
- Done: `pnpm dlx @aura-design/cli@latest blueprint` (suffix `labelo`).
- Fixing: production `www.labelo.space` 500 — proxy no longer crashes when WorkOS env is incomplete; public pages stay up. Vercel Production still needs `WORKOS_API_KEY`, `WORKOS_CLIENT_ID`, `WORKOS_COOKIE_PASSWORD` (≥32), and `NEXT_PUBLIC_WORKOS_REDIRECT_URI=https://www.labelo.space/callback`.
- Next: optional multi-team switcher UI.
