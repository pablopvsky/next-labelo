import { withAuth } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";

import { getPrisma } from "@/lib/prisma";
import { syncWorkOSUserSafe } from "@/lib/users/syncWorkOSUser";

export async function requireWorkOSUser() {
  const { user } = await withAuth({ ensureSignedIn: true });
  return user;
}

export async function requireDbUser() {
  const workosUser = await requireWorkOSUser();
  const prisma = getPrisma();

  let dbUser = await prisma.user.findUnique({
    where: { workosUserId: workosUser.id },
  });

  if (!dbUser) {
    await syncWorkOSUserSafe(workosUser);
    dbUser = await prisma.user.findUnique({
      where: { workosUserId: workosUser.id },
    });
  }

  if (!dbUser) {
    throw new Error("User not found in database");
  }

  return dbUser;
}

export async function requireTeamMembership() {
  const dbUser = await requireDbUser();
  const membership = await getPrisma().teamMember.findFirst({
    where: { userId: dbUser.id },
    include: { team: true },
    orderBy: { createdAt: "asc" },
  });

  if (!membership) {
    redirect("/onboarding");
  }

  return { dbUser, membership, team: membership.team };
}

export async function userHasTeam(userId: string) {
  const count = await getPrisma().teamMember.count({
    where: { userId },
  });
  return count > 0;
}
