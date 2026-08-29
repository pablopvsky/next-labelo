---
title: Project Backlog
date: 2026-08-29
tags: [dev-log, product, ui]
---
## Summary
Projects keep a `backlog` task status separate from the six flow lanes. The status board has a toggle that swaps to a simple backlog list (title + promote icon). Promote always moves the label into `requerimiento`.

## Context
- Related: [[Projects-Kanban]], [[Internal-Progress]]
- Implementation Path: `lib/tasks/statuses.ts`, `components/projects/ProjectKanban.tsx`, `prisma/schema.prisma`
