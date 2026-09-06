---
title: Delete Projects and Labels
date: 2026-09-06
tags: [dev-log, logic, product]
---
## Summary
Projects delete from a `ResponsiveMenu` (desktop dropdown, mobile drawer) on dashboard cards and the project header, with confirm. Label titles wrap with no fixed card width—cards size to content (`overflow-wrap: anywhere`).

## Context
- Related: [[Projects-Kanban]], [[Server-Actions]], [[Internal-Progress]]
- Implementation Path: `lib/projects/actions.ts` (`deleteProjectAction`), `components/projects/DeleteProjectButton.tsx`, `components/projects/ProjectKanban.tsx`
