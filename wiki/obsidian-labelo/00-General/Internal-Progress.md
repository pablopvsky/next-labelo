---
title: Internal Progress
date: 2026-09-27
tags: [dev-log, progress]
---
## Summary
MCP is live for agents: personal tokens on Profile authenticate `/api/mcp` tools that list and manage projects and labels. Peppered token hashes use `LABELO_MCP_TOKEN_PEPPER`.

## Context
- Related: [[MCP-Personal-Tokens]], [[Teams-Data-Model]], [[Projects-Kanban]], [[Onboarding]]
- Implementation Path: `app/api/mcp/route.ts`, `components/dashboard/AccountMcpTokensCard.tsx`

## Status
- Done: Prisma `PersonalAccessToken`; profile create/revoke UI; MCP tools for projects/tasks.
- Done: OAuth protected-resource metadata route; AuthKit bypass for MCP paths.
- Next: set `LABELO_MCP_TOKEN_PEPPER` in Vercel; connect Cursor to production `/api/mcp`.
- Next: optional multi-team switcher UI.
