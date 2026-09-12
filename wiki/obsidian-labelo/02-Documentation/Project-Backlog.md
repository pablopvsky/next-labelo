---
title: Project Backlog
date: 2026-09-12
tags: [dev-log, product, ui]
---
## Summary
Projects keep a `backlog` task status outside the six-stage carousel. The centered toolbar opens it as a dedicated full-screen dialog with label creation, promotion, and deletion; promotion always targets `requerimiento`.

## Context
- Related: [[Projects-Kanban]], [[Internal-Progress]]
- Implementation Path: `lib/tasks/statuses.ts`, `components/projects/ProjectKanban.tsx`, `prisma/schema.prisma`
