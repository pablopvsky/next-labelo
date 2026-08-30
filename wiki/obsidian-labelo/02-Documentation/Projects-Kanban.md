---
title: Projects Kanban
date: 2026-08-29
tags: [product, ui]
---
## Summary
Dashboard lists team projects as cards. Inside a project, labels (tasks) move across six stacked status lanes with horizontal scroll and drag-and-drop. A toggle switches to a backlog list outside the flow.

## Context
- Related: [[Teams-Data-Model]], [[Internal-Progress]]
- Implementation Path: `app/dashboard/page.tsx`, `app/dashboard/projects/[projectId]/page.tsx`, `components/projects/`

## Statuses (top → bottom)
Flow: `requerimiento` → `analisis` → `preproduccion` → `produccion` → `divulgacion` → `liberacion`.

Holding: `backlog` (not on the board). Promoting a backlog label always lands in `requerimiento` only.

## Actions
Labels have a title only; titles may duplicate. Flow cards support **duplicate**, **change status**, and **delete**. Backlog rows support **move to requerimiento** and **delete**. The board header also has **export** (download / copy JSON) and **import** (paste or file, AJV-validated) — see [[Task-Import-Export]]. Mutations use server actions under `lib/projects/` and `lib/tasks/` (no `app/api` routes yet).
