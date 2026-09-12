---
title: Projects Kanban
date: 2026-09-12
tags: [product, ui, architecture]
---
## Summary
Dashboard lists team projects as cards. A project opens as a full-viewport nested Embla experience: the outer y-axis moves through statuses and each status owns an x-axis carousel of full-screen labels.

## Context
- Related: [[Teams-Data-Model]], [[Internal-Progress]]
- Implementation Path: `app/dashboard/page.tsx`, `app/dashboard/projects/[projectId]/page.tsx`, `components/projects/`

## Statuses (top → bottom)
Flow: `requerimiento` → `analisis` → `preproduccion` → `produccion` → `divulgacion` → `liberacion`.

Holding: `backlog` is excluded from the y-axis and opens in a dedicated full-screen dialog from the centered toolbar. Promoting a backlog label always lands in `requerimiento`.

## Navigation
Right-side dots jump directly between statuses; Arrow Up/Down and boundary-aware mouse-wheel input also move the y-axis. Horizontal dragging, Arrow Left/Right, and bottom label dots move within a status while each label keeps its own vertical overflow for long content.

## Actions
The centered floating toolbar exposes backlog, import, and export; see [[Project-Backlog]] and [[Task-Import-Export]]. Every flow label has a ⋯ menu for edit, change status, and delete, backed by authorized server actions in `lib/tasks/actions.ts`.
