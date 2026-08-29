import { withAuth } from "@workos-inc/authkit-nextjs";
import type { User as WorkOSUser } from "@workos-inc/node";

import { getPrisma } from "@/lib/prisma";

export type AccountProfileData = {
  workosUser: WorkOSUser;
  dbUser: {
    createdAt: Date;
    updatedAt: Date;
  } | null;
};

export async function getAccountProfileData(): Promise<AccountProfileData> {
  const { user } = await withAuth({ ensureSignedIn: true });

  const dbUser = await getPrisma().user.findUnique({
    where: { workosUserId: user.id },
    select: {
      createdAt: true,
      updatedAt: true,
    },
  });

  return {
    workosUser: user,
    dbUser,
  };
}
