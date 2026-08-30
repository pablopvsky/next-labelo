---
title: Server Actions Note
date: 2026-08-29
tags: [api, architecture]
---
## Summary
Domain mutations for teams, projects, and tasks use Next.js **server actions**, not `app/api/**` route handlers. Bruno has no HTTP mirrors until REST routes exist.

## Context
- Related: [[Teams-Data-Model]], [[Bootstrap]]
- Implementation Path: `lib/teams/actions.ts`, `lib/projects/actions.ts`, `lib/tasks/actions.ts` (`importTasksAction` for JSON label import)
- Auth routes only: `app/login/route.ts`, `app/callback/route.ts` (WorkOS).
