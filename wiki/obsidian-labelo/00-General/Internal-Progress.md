---
title: Internal Progress
date: 2026-09-27
tags: [dev-log, progress]
---
## Summary
Landing remapped to modular Neo Mirai–style diagramation with Famity-kawaii images and sky-blue accent (`#57AEE5`).

Landing design pass: Aura `Marker`, `Stepper`, `Grid`, `AspectRatio`, and `Separator` raise composition quality while keeping copy and generated images. MCP personal tokens remain live for agents.

## Context
- Related: [[Landing-Page]], [[MCP-Personal-Tokens]], [[Image-Identity]]
- Implementation Path: `components/landing/`, `components/ui/Marker.tsx`, `app/[locale]/page.tsx`

## Status
- Done: Landing remapped to Neo Mirai–style modular bands with Famity-kawaii assets and blue accent.
- Done: Prisma `PersonalAccessToken`; profile create/revoke UI; MCP tools for projects/tasks.
- Next: set `LABELO_MCP_TOKEN_PEPPER` in Vercel; connect Cursor to production `/api/mcp`.
- Next: optional multi-team switcher UI.
