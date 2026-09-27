---
title: Internal Progress
date: 2026-09-27
tags: [dev-log, progress]
---
## Summary
Marketing landing presents Labelo with generated brand imagery and i18n copy. MCP remains live for agents via personal tokens on Profile.

## Context
- Related: [[Landing-Page]], [[Image-Identity]], [[MCP-Personal-Tokens]], [[Projects-Kanban]]
- Implementation Path: `app/[locale]/page.tsx`, `components/landing/`, `public/generated/landing/`

## Status
- Done: Full-bleed hero + flow/labels/CTA sections; Image-Identity set to `ready`.
- Done: Prisma `PersonalAccessToken`; profile create/revoke UI; MCP tools for projects/tasks.
- Done: Lint stays advisory (`warn`) and out of deploy — see [[Agent-Blueprint-Setup]] / `.cursor/rules/shadcn-lint.mdc`.
- Next: set `LABELO_MCP_TOKEN_PEPPER` in Vercel; connect Cursor to production `/api/mcp`.
- Next: optional multi-team switcher UI.
