---
title: Agent Blueprint Setup
date: 2026-09-27
tags: [dev-log, architecture, tooling]
---
## Summary
Ran the Aura MCP agent blueprint on this consumer app: skills, shadcn MCP, `@shadcn/lint` (warn), Image-Identity scaffold, and `pnpm ai:image`. Lint stays out of the deploy path (`build` does not run ESLint; Next 16 removed in-build lint).

## Context
- Related: [[Image-Identity]], [[Internal-Progress]], [[Bootstrap]]
- Implementation Path: `.cursor/mcp.json`, `eslint.config.mjs`, `eslint.aura-shadcn.mjs`, `.cursor/skills/`
