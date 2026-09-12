---
title: Internal Progress
date: 2026-09-12
tags: [dev-log, progress]
---
## Summary
Home and project boards now share the same fullscreen overlay navigation. Home is a y-axis project list with account on the top left, ⋯ actions on the top right, and tap-to-enter. Inside a project, statuses stay on the y-axis and labels on the x-axis.

## Context
- Related: [[Teams-Data-Model]], [[Onboarding]], [[Projects-Kanban]], [[Delete-Projects-Labels]], [[Task-Import-Export]], [[Input-Font-Size]], [[PWA-Pull-Refresh]]
- Implementation Path: `components/projects/ProjectHome.tsx`, `components/projects/ProjectKanban.tsx`

## Status
- Done: Slides use a symmetric 71.5px safe area (rail track plus gutter on both sides) and the label title opens the actions drawer.
- Done: Home project list uses the same Embla y-axis overlay as the board (dots, wheel/keyboard, top-right ⋯ for create/delete).
- Done: Prisma `Team` / `TeamMember` / `Project` / `Task`; create/join onboarding.
- Done: Full-screen [[Projects-Kanban]] with nested Embla axes and a single ⋯ drawer.
- Done: Board safe area and top-left back arrow.
- Done: Project backlog toggle — `backlog` status, list view, promote-to-`requerimiento` only.
- Done: Label JSON [[Task-Import-Export]]; PWA + pull-to-refresh; 17px form controls.
- Verification: pending browser pass of home carousel tap-to-enter and board back-to-home.
- Next: optional multi-team switcher UI.
