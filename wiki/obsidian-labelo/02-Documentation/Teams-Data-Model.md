---
title: Teams Data Model
date: 2026-08-29
tags: [architecture, database]
---
## Summary
**Team** is a first-class Postgres entity. Users access work through `TeamMember`; projects belong to a team, not directly to a user.

## Context
- Related: [[Onboarding]], [[Projects-Kanban]], [[Internal-Progress]]
- Implementation Path: `prisma/schema.prisma`, `lib/teams/`, `lib/auth/session.ts`

## Model
- `Team`: `name`, unique `inviteCode`, `createdById`.
- `TeamMember`: `teamId` + `userId` (unique), role `owner` | `member`.
- `Project.teamId` → `Team`; `Task.projectId` → `Project`.
- Membership checks: `requireTeamMembership()` before dashboard and mutations.
