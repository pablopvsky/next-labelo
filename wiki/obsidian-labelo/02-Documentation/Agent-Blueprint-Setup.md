---
title: Agent Blueprint Setup
date: 2026-09-27
tags: [dev-log, architecture, tooling]
---
## Summary
Ran the Aura MCP agent blueprint on this consumer app: skills, shadcn MCP, `@shadcn/lint` (warn only), Image-Identity scaffold, and `pnpm ai:image`. **Lint is not a deploy gate** — `build` never runs ESLint; Next 16 removed in-build lint; agent rules treat lint as advisory.

## Context
- Related: [[Image-Identity]], [[Internal-Progress]], [[Bootstrap]]
- Implementation Path: `.cursor/mcp.json`, `eslint.config.mjs`, `eslint.aura-shadcn.mjs`, `.cursor/skills/`
