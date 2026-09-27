import type { AuthInfo } from "@modelcontextprotocol/server";

import { getPrisma } from "@/lib/prisma";
import {
  hashPersonalAccessToken,
  MCP_READ_SCOPE,
} from "@/lib/mcp/tokens";

export type McpAuthExtra = {
  userId: string;
  tokenId: string;
};

export async function verifyMcpBearerToken(
  _req: Request,
  bearerToken?: string,
): Promise<AuthInfo | undefined> {
  if (!bearerToken) return undefined;

  const tokenHash = hashPersonalAccessToken(bearerToken);
  if (!tokenHash) return undefined;

  const prisma = getPrisma();
  const row = await prisma.personalAccessToken.findUnique({
    where: { tokenHash },
    select: {
      id: true,
      userId: true,
      scopes: true,
    },
  });

  if (!row) return undefined;
  if (!row.scopes.includes(MCP_READ_SCOPE)) return undefined;

  // Fire-and-forget last-used stamp; auth must not fail if the update fails.
  void prisma.personalAccessToken
    .update({
      where: { id: row.id },
      data: { lastUsedAt: new Date() },
    })
    .catch(() => undefined);

  return {
    token: bearerToken,
    scopes: row.scopes,
    clientId: row.userId,
    extra: {
      userId: row.userId,
      tokenId: row.id,
    } satisfies McpAuthExtra,
  };
}

export function getMcpUserId(authInfo: AuthInfo | undefined): string | null {
  const extra = authInfo?.extra as McpAuthExtra | undefined;
  return extra?.userId ?? authInfo?.clientId ?? null;
}
