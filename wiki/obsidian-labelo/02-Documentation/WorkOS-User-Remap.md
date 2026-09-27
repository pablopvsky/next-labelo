---
title: WorkOS User Remap
date: 2026-09-27
tags: [dev-log, auth, architecture]
---
## Summary
When Labelo switched AuthKit apps inside Famity Care Production, local `users.workos_user_id` values from Garitma no longer matched. Sync now remaps an existing row by email before creating a new user, so teams and projects stay attached.

## Context
- Related: [[Famity-Auth]], [[Teams-Data-Model]], [[Onboarding]]
- Implementation Path: `lib/users/syncWorkOSUser.ts`

## Ops note
- Canonical Labelo row for `pablo.orozcomontessj@gmail.com` → WorkOS `user_01M0QQ10T52J6EZRHSBTPMNMQ2` (Famity Care Production).
- Duplicate Pablo rows from Garitma Local/Prod were merged into that canonical user; orphan Famity login row removed.
- `user_01M1CVQZSB7KNAJA01ZXT9BDPY` in WorkOS is `pcorozcom@gmail.com`, not Pablo’s Famity identity.
