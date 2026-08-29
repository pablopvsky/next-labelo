---
title: Onboarding
date: 2026-08-29
tags: [product, auth]
---
## Summary
After WorkOS sign-in, users without a membership land on `/onboarding` to **create** a team or **join** with an invite code. No onboarding images.

## Context
- Related: [[Teams-Data-Model]], [[Internal-Progress]]
- Implementation Path: `app/onboarding/page.tsx`, `components/onboarding/OnboardingFlow.tsx`, `lib/teams/actions.ts`

## Flow
- Callback / login redirect → `/onboarding` (already-onboarded users redirect to `/dashboard`).
- Create writes `Team` + owner `TeamMember`; join attaches membership by `inviteCode`.
- Sidebar surfaces the team invite code for sharing.
