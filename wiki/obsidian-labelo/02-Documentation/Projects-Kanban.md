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

## Top bar
The header is a three-column grid: a back arrow to `/dashboard` in the top left, the active status name with its `Etiqueta X de Y` position in the top center, and a single ⋯ button in the top right. Label titles are centered vertically and horizontally inside each slide, so the header never competes with content.

## Pull to refresh
The board is a fixed full-viewport surface, so the window never scrolls and [[PWA-Pull-Refresh]] cannot read a scroll offset. `ProjectKanban` therefore sets `data-pull-to-refresh="blocked"` on its `<main>` while the y-axis sits past the first status; only the first status with its label pane at the top can pull.

## Safe area
Both dot rails float above the slides, so `.label-safe-area` (in `app/globals.css`) reserves 4.5 spacing units of inline padding on every slide. That matches the status rail geometry (13px offset plus a 45.5px track), keeping centered titles clear of the dots on both sides instead of wrapping under them.

## Actions
The top-right ⋯ button opens one drawer on every breakpoint (`ResponsiveMenu alwaysDrawer`). It groups add, edit, change status, and delete for the label currently on screen, then backlog, export, copy JSON, and import; see [[Project-Backlog]] and [[Task-Import-Export]]. Going back to the dashboard lives in the header instead of the drawer. `ProjectKanban` tracks the active status and label index so the drawer always acts on the visible label, backed by authorized server actions in `lib/tasks/actions.ts`.
