---
title: MCP Personal Tokens
date: 2026-09-27
tags: [dev-log, architecture, mcp]
---
## Summary
Labelo exposes a Streamable HTTP MCP server at `/api/mcp`, authenticated with personal access tokens created on the profile page. Tokens are stored as peppered SHA-256 hashes (`LABELO_MCP_TOKEN_PEPPER`); the plaintext is shown once.

## Context
- Related: [[Teams-Data-Model]], [[Server-Actions]], [[Internal-Progress]]
- Implementation Path: `app/api/mcp/route.ts`, `lib/mcp/*`, `components/dashboard/AccountMcpTokensCard.tsx`, `app/dashboard/profile/page.tsx`

## Details
- Scopes: `mcp:read` (required) and `mcp:write` (mutations). Tools cover projects and labels (tasks).
- Clients send `Authorization: Bearer <token>`. Resource metadata: `/.well-known/oauth-protected-resource`.
- `proxy.ts` skips AuthKit/i18n for MCP and the well-known route so Bearer auth is not wrapped by WorkOS.
