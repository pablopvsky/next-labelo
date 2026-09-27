import { withAuth } from "@workos-inc/authkit-nextjs";
import type { User as WorkOSUser } from "@workos-inc/node";
import { headers } from "next/headers";

import type { McpTokenListItem } from "@/lib/mcp/actions";
import { isMcpTokenPepperConfigured } from "@/lib/mcp/tokens";
import { getPrisma } from "@/lib/prisma";

export type AccountProfileData = {
  workosUser: WorkOSUser;
  dbUser: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  mcp: {
    pepperConfigured: boolean;
    tokens: McpTokenListItem[];
    endpoint: string;
  };
};

async function resolvePublicOrigin(): Promise<string> {
  const headerStore = await headers();
  const host =
    headerStore.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    headerStore.get("host")?.trim();
  const proto =
    headerStore.get("x-forwarded-proto")?.split(",")[0]?.trim() || "https";
  if (host) return `${proto}://${host}`;
  return process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000";
}

export async function getAccountProfileData(): Promise<AccountProfileData> {
  const { user } = await withAuth({ ensureSignedIn: true });

  const dbUser = await getPrisma().user.findUnique({
    where: { workosUserId: user.id },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const tokens = dbUser
    ? await getPrisma().personalAccessToken.findMany({
        where: { userId: dbUser.id },
        select: {
          id: true,
          name: true,
          tokenPrefix: true,
          createdAt: true,
          lastUsedAt: true,
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const origin = await resolvePublicOrigin();

  return {
    workosUser: user,
    dbUser,
    mcp: {
      pepperConfigured: isMcpTokenPepperConfigured(),
      tokens,
      endpoint: `${origin}/api/mcp`,
    },
  };
}
