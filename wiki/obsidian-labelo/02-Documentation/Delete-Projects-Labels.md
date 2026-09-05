---
title: Delete Projects and Labels
date: 2026-09-05
tags: [dev-log, logic, product]
---
## Summary
Projects can be deleted from the dashboard card menu or the project page header; confirmation warns that labels are removed too (DB cascade). Long label titles wrap instead of truncating on flow cards and backlog rows.

## Context
- Related: [[Projects-Kanban]], [[Server-Actions]], [[Internal-Progress]]
- Implementation Path: `lib/projects/actions.ts` (`deleteProjectAction`), `components/projects/DeleteProjectButton.tsx`, `components/projects/ProjectKanban.tsx`
