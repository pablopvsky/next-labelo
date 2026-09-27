"use server";

import { revalidatePath } from "next/cache";

import { requireDbUser } from "@/lib/auth/session";
import {
  DEFAULT_MCP_SCOPES,
  generatePersonalAccessToken,
  isMcpTokenPepperConfigured,
} from "@/lib/mcp/tokens";
import { getPrisma } from "@/lib/prisma";

export type McpTokenListItem = {
  id: string;
  name: string;
  tokenPrefix: string;
  createdAt: Date;
  lastUsedAt: Date | null;
};

export type CreateMcpTokenResult =
  | {
      ok: true;
      token: {
        id: string;
        name: string;
        tokenPrefix: string;
        rawToken: string;
        createdAt: Date;
      };
    }
  | { ok: false; code: "pepper" | "fields" | "error"; error?: string };

export type RevokeMcpTokenResult =
  | { ok: true }
  | { ok: false; error: string };

export async function listAccountMcpTokens(): Promise<McpTokenListItem[]> {
  const dbUser = await requireDbUser();
  return getPrisma().personalAccessToken.findMany({
    where: { userId: dbUser.id },
    select: {
      id: true,
      name: true,
      tokenPrefix: true,
      createdAt: true,
      lastUsedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createAccountMcpToken(
  name: string,
): Promise<CreateMcpTokenResult> {
  if (!isMcpTokenPepperConfigured()) {
    return { ok: false, code: "pepper" };
  }

  const trimmed = name.trim();
  if (!trimmed || trimmed.length > 80) {
    return { ok: false, code: "fields" };
  }

  try {
    const dbUser = await requireDbUser();
    const generated = generatePersonalAccessToken();
    const row = await getPrisma().personalAccessToken.create({
      data: {
        userId: dbUser.id,
        name: trimmed,
        tokenHash: generated.tokenHash,
        tokenPrefix: generated.tokenPrefix,
        scopes: [...DEFAULT_MCP_SCOPES],
      },
      select: {
        id: true,
        name: true,
        tokenPrefix: true,
        createdAt: true,
      },
    });

    revalidatePath("/dashboard/profile");
    return {
      ok: true,
      token: {
        ...row,
        rawToken: generated.rawToken,
      },
    };
  } catch (error) {
    return {
      ok: false,
      code: "error",
      error: error instanceof Error ? error.message : "Failed to create token",
    };
  }
}

export async function revokeAccountMcpToken(
  id: string,
): Promise<RevokeMcpTokenResult> {
  const tokenId = id.trim();
  if (!tokenId) return { ok: false, error: "Token is required" };

  const dbUser = await requireDbUser();
  const prisma = getPrisma();
  const existing = await prisma.personalAccessToken.findFirst({
    where: { id: tokenId, userId: dbUser.id },
    select: { id: true },
  });
  if (!existing) return { ok: false, error: "Token not found" };

  await prisma.personalAccessToken.delete({ where: { id: tokenId } });
  revalidatePath("/dashboard/profile");
  return { ok: true };
}
