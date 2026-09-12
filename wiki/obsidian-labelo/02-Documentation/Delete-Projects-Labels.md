---
title: Delete Projects and Labels
date: 2026-09-12
tags: [dev-log, logic, product]
---
## Summary
Projects delete from the home ⋯ drawer (`ProjectHome`) with a confirm dialog. Labels delete from the board ⋯ drawer (`ProjectKanban`). Both call authorized server actions.

## Context
- Related: [[Projects-Kanban]], [[Server-Actions]], [[Internal-Progress]]
- Implementation Path: `lib/projects/actions.ts` (`deleteProjectAction`), `components/projects/ProjectHome.tsx`, `lib/tasks/actions.ts`, `components/projects/ProjectKanban.tsx`
