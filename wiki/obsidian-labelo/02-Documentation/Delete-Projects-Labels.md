---
title: Delete Projects and Labels
date: 2026-09-06
tags: [dev-log, logic, product]
---
## Summary
Projects delete from a `ResponsiveMenu` (desktop dropdown, mobile drawer) on dashboard cards and the project header, with confirm. Flow label cards use a fixed `220px` width (`max-w-full`) so horizontal lanes don’t collapse; titles wrap with `break-words` (no truncate, no character-column shrink from `overflow-wrap: anywhere`).

## Context
- Related: [[Projects-Kanban]], [[Server-Actions]], [[Internal-Progress]]
- Implementation Path: `lib/projects/actions.ts` (`deleteProjectAction`), `components/projects/DeleteProjectButton.tsx`, `components/projects/ProjectKanban.tsx`
