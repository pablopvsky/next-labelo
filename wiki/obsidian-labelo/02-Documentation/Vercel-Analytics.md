---
title: Vercel Analytics
date: 2026-09-27
tags: [dev-log, architecture]
---
## Summary
Web Analytics is enabled via `@vercel/analytics`. The `<Analytics />` component is mounted once in the root layout so every route reports page views after deploy.

## Context
- Related: [[Internal-Progress]]
- Implementation Path: `app/layout.tsx`
- Package: `@vercel/analytics` (import from `@vercel/analytics/next`)
