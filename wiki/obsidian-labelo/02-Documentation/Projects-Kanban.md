---
title: Projects Kanban
date: 2026-09-12
tags: [product, ui, architecture]
---
## Summary
Home (`/dashboard`) is a full-viewport y-axis Embla of projects. Tapping a project opens the nested board: statuses on the y-axis and full-screen labels on the x-axis.

## Context
- Related: [[Teams-Data-Model]], [[Internal-Progress]], [[Delete-Projects-Labels]]
- Implementation Path: `app/dashboard/page.tsx`, `components/projects/ProjectHome.tsx`, `app/dashboard/projects/[projectId]/page.tsx`, `components/projects/`

## Home (project list)
Projects stack on the y-axis with the same overlay chrome as the board: account on the top left, project count in the top center, and one ⋯ drawer on the top right (new project + delete current). Right-side dots jump between projects. Tap the centered project name to enter.

## Statuses (top → bottom)
Flow: `requerimiento` → `analisis` → `preproduccion` → `produccion` → `divulgacion` → `liberacion`.

Holding: `backlog` is excluded from the y-axis and opens in a dedicated full-screen dialog from the board ⋯ menu. Promoting a backlog label always lands in `requerimiento`.

## Navigation
Right-side dots jump directly between statuses; Arrow Up/Down and boundary-aware mouse-wheel input also move the y-axis. Horizontal dragging, Arrow Left/Right, and bottom label dots move within a status while each label keeps its own vertical overflow for long content.

## Top bar
The header is a three-column grid: a back arrow to `/dashboard` in the top left, the active status name with its `Etiqueta X de Y` position in the top center, and a single ⋯ button in the top right. Label titles are centered vertically and horizontally inside each slide, so the header never competes with content.

## Safe area
The status rail floats above the slides, so `.label-safe-area` (in `app/globals.css`) reserves its 58.5px track (13px offset plus a 45.5px rail) plus a 13px gutter, and mirrors that 71.5px reservation on **both** inline sides. Equal gutters mean content centers on the viewport while still clearing the dots. Slides with no rail (a lone project on home) set `data-rail="none"` to zero out `--label-rail`, leaving a symmetric 13px gutter.

## Actions
The top-right ⋯ button opens one drawer on every breakpoint (`ResponsiveMenu alwaysDrawer`). It groups add, edit, change status, and delete for the label currently on screen, then backlog, export, copy JSON, and import; see [[Project-Backlog]] and [[Task-Import-Export]]. Going back to the dashboard lives in the header instead of the drawer. `ProjectKanban` tracks the active status and label index so the drawer always acts on the visible label, backed by authorized server actions in `lib/tasks/actions.ts`.

Tapping the label title opens that same drawer: `ProjectKanban` owns the open state and passes it to both the ⋯ trigger and each slide, so the full-screen title doubles as the actions affordance.
