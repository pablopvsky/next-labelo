---
title: Input Font Size (iOS Zoom)
date: 2026-08-29
tags: [dev-log, logic, architecture]
---
## Summary
Form fields (`input`, `textarea`, `select`) always use **17px** font size so iOS Safari does not zoom on focus.

## Context
- Related: [[Internal-Progress]]
- Implementation Path: `app/globals.css`, `components/ui/Input.tsx`, `components/ui/Textarea.tsx`, `styles/main.css`

## Why
iOS zooms focused controls under 16px. Aura sets root `html` to 17px and locks the same size on text-entry controls (checkbox/radio/range/hidden/button types excluded).
