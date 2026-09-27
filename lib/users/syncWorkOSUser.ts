import type { User as WorkOSUser } from "@workos-inc/node";

import { getPrisma } from "@/lib/prisma";

function workosMetadata(user: WorkOSUser): Record<string, string> {
  return user.metadata && typeof user.metadata === "object"
    ? user.metadata
    : ({} as Record<string, string>);
}

function workosUserFields(user: WorkOSUser) {
  const metadata = workosMetadata(user);
  return {
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
  };
}

/**
 * Upsert the local User for a WorkOS AuthKit identity.
 * When WorkOS project/env moves and the user id changes, remaps the existing
 * row by email so teams/projects stay attached.
 */
export async function upsertUserFromWorkOS(user: WorkOSUser) {
  if (!user.id?.trim() || !user.email?.trim()) {
    console.warn(
      "[auth] Skipping user sync: WorkOS user missing id or email",
    );
    return null;
  }

  const prisma = getPrisma();
  const fields = workosUserFields(user);

  const byWorkosId = await prisma.user.findUnique({
    where: { workosUserId: user.id },
  });
  if (byWorkosId) {
    return prisma.user.update({
      where: { id: byWorkosId.id },
      data: {
        email: fields.email,
        emailVerified: fields.emailVerified,
        profilePictureUrl: fields.profilePictureUrl,
        firstName: fields.firstName,
        lastName: fields.lastName,
        lastSignInAt: fields.lastSignInAt,
        locale: fields.locale,
        metadata: fields.metadata,
        workosCreatedAt: fields.workosCreatedAt,
        workosUpdatedAt: fields.workosUpdatedAt,
      },
    });
  }

  const byEmail = await prisma.user.findFirst({
    where: { email: { equals: user.email, mode: "insensitive" } },
    orderBy: { createdAt: "asc" },
  });
  if (byEmail) {
    return prisma.user.update({
      where: { id: byEmail.id },
      data: fields,
    });
  }

  return prisma.user.create({ data: fields });
}

export async function syncWorkOSUserSafe(user: WorkOSUser) {
  try {
    await upsertUserFromWorkOS(user);
  } catch (err) {
    console.error("[auth] Failed to sync WorkOS user to database", err);
  }
}
