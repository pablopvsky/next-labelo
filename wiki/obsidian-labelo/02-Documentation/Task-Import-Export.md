---
title: Task Import Export
date: 2026-09-12
tags: [product, ui, validation]
---
## Summary
Project labels can be exported and imported as versioned JSON (`version: 1`, `tasks[]`). Export, copy JSON, and import are items in the single board actions drawer (see [[Projects-Kanban]]). `TaskImportExportProvider` owns the state and renders the import dialog outside the drawer so it survives the drawer closing; `TaskImportExportMenuItems` renders the drawer entries. The importer validates with AJV (`utils/web-validation.ts` + `lib/tasks/import-schema.ts`) before writing; input is paste or `.json` file, with a copyable example.

## Context
- Related: [[Projects-Kanban]], [[Server-Actions]], [[Internal-Progress]]
- Implementation Path: `components/projects/TaskImportExport.tsx`, `lib/tasks/import-schema.ts`, `importTasksAction` in `lib/tasks/actions.ts`

## Format
Each task needs `title`; optional `status` (defaults to `requerimiento`) and `position` (ignored on import — labels append per status). Export includes `title`, `status`, and `position` for round-trip editing.
