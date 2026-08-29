import type { User as WorkOSUser } from "@workos-inc/node";

import { getPrisma } from "@/lib/prisma";

export async function upsertUserFromWorkOS(user: WorkOSUser) {
  if (!user.id?.trim() || !user.email?.trim()) {
    console.warn(
      "[auth] Skipping user sync: WorkOS user missing id or email",
    );
    return null;
  }

  const metadata =
    user.metadata && typeof user.metadata === "object"
      ? user.metadata
      : ({} as Record<string, string>);

  return getPrisma().user.upsert({
    where: { workosUserId: user.id },
    create: {
      workosUserId: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      profilePictureUrl: user.profilePictureUrl,
      firstName: user.firstName,
      lastName: user.lastName,
      lastSignInAt: user.lastSignInAt ? new Date(user.lastSignInAt) : null,
      locale: user.locale,
      metadata,
      workosCreatedAt: new Date(user.createdAt),
      workosUpdatedAt: new Date(user.updatedAt),
    },
    update: {
      email: user.email,
      emailVerified: user.emailVerified,
      profilePictureUrl: user.profilePictureUrl,
      firstName: user.firstName,
      lastName: user.lastName,
      lastSignInAt: user.lastSignInAt ? new Date(user.lastSignInAt) : null,
      locale: user.locale,
      metadata,
      workosCreatedAt: new Date(user.createdAt),
      workosUpdatedAt: new Date(user.updatedAt),
    },
  });
}

export async function syncWorkOSUserSafe(user: WorkOSUser) {
  try {
    await upsertUserFromWorkOS(user);
  } catch (err) {
    console.error("[auth] Failed to sync WorkOS user to database", err);
  }
}
