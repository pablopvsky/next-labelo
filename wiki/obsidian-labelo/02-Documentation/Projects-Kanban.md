---
title: Projects Kanban
date: 2026-08-29
tags: [product, ui]
---
## Summary
Dashboard lists team projects as cards. Inside a project, labels (tasks) move across six stacked status lanes with horizontal scroll and drag-and-drop.

## Context
- Related: [[Teams-Data-Model]], [[Internal-Progress]]
- Implementation Path: `app/dashboard/page.tsx`, `app/dashboard/projects/[projectId]/page.tsx`, `components/projects/`

## Statuses (top → bottom)
`requerimiento` → `analisis` → `preproduccion` → `produccion` → `divulgacion` → `liberacion`.

## Actions
Labels have a title only; titles may duplicate. Cards support **duplicate** and **delete**. Mutations use server actions under `lib/projects/` and `lib/tasks/` (no `app/api` routes yet).
