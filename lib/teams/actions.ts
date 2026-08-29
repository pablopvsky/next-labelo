"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireDbUser, userHasTeam } from "@/lib/auth/session";
import { getPrisma } from "@/lib/prisma";
import { createInviteCode } from "@/lib/teams/inviteCode";

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function createTeamAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    return { ok: false, error: "Team name is required" };
  }

  const dbUser = await requireDbUser();
  const prisma = getPrisma();

  let inviteCode = createInviteCode();
  for (let attempt = 0; attempt < 5; attempt++) {
    const existing = await prisma.team.findUnique({
      where: { inviteCode },
    });
    if (!existing) break;
    inviteCode = createInviteCode();
  }

  await prisma.team.create({
    data: {
      name,
      inviteCode,
      createdById: dbUser.id,
      members: {
        create: {
          userId: dbUser.id,
          role: "owner",
        },
      },
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/onboarding");
  redirect("/dashboard");
}

export async function joinTeamAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const code = String(formData.get("inviteCode") ?? "")
    .trim()
    .toUpperCase();
  if (!code) {
    return { ok: false, error: "Invite code is required" };
  }

  const dbUser = await requireDbUser();
  const prisma = getPrisma();

  const team = await prisma.team.findUnique({
    where: { inviteCode: code },
  });

  if (!team) {
    return { ok: false, error: "Team not found" };
  }

  const already = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: { teamId: team.id, userId: dbUser.id },
    },
  });

  if (already) {
    redirect("/dashboard");
  }

  await prisma.teamMember.create({
    data: {
      teamId: team.id,
      userId: dbUser.id,
      role: "member",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/onboarding");
  redirect("/dashboard");
}

export async function redirectIfOnboarded() {
  const dbUser = await requireDbUser();
  if (await userHasTeam(dbUser.id)) {
    redirect("/dashboard");
  }
}
