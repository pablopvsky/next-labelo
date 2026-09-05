"use server";

import { revalidatePath } from "next/cache";

import { requireTeamMembership } from "@/lib/auth/session";
import { getPrisma } from "@/lib/prisma";

export type ProjectActionResult =
  | { ok: true; projectId?: string }
  | { ok: false; error: string };

async function assertTeamAccess(teamId: string) {
  const { dbUser } = await requireTeamMembership();
  const membership = await getPrisma().teamMember.findUnique({
    where: {
      teamId_userId: { teamId, userId: dbUser.id },
    },
  });
  if (!membership) {
    throw new Error("Forbidden");
  }
  return dbUser;
}

export async function createProjectAction(
  _prev: ProjectActionResult | null,
  formData: FormData,
): Promise<ProjectActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  const teamId = String(formData.get("teamId") ?? "").trim();

  if (!name) {
    return { ok: false, error: "Project name is required" };
  }
  if (!teamId) {
    return { ok: false, error: "Team is required" };
  }

  await assertTeamAccess(teamId);

  const project = await getPrisma().project.create({
    data: { name, teamId },
  });

  revalidatePath("/dashboard");
  return { ok: true, projectId: project.id };
}

export async function deleteProjectAction(
  projectId: string,
): Promise<ProjectActionResult> {
  const id = projectId.trim();
  if (!id) {
    return { ok: false, error: "Project is required" };
  }

  const { dbUser } = await requireTeamMembership();
  const prisma = getPrisma();
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    return { ok: false, error: "Project not found" };
  }

  const membership = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: { teamId: project.teamId, userId: dbUser.id },
    },
  });
  if (!membership) {
    return { ok: false, error: "Forbidden" };
  }

  await prisma.project.delete({ where: { id } });
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/projects/${id}`);
  return { ok: true, projectId: id };
}

export async function listProjectsForUser() {
  const { dbUser } = await requireTeamMembership();
  const memberships = await getPrisma().teamMember.findMany({
    where: { userId: dbUser.id },
    select: { teamId: true },
  });
  const teamIds = memberships.map((m) => m.teamId);

  return getPrisma().project.findMany({
    where: { teamId: { in: teamIds } },
    include: {
      team: { select: { id: true, name: true } },
      _count: { select: { tasks: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getProjectForUser(projectId: string) {
  const { dbUser } = await requireTeamMembership();
  const project = await getPrisma().project.findUnique({
    where: { id: projectId },
    include: {
      team: true,
      tasks: { orderBy: [{ status: "asc" }, { position: "asc" }] },
    },
  });

  if (!project) return null;

  const membership = await getPrisma().teamMember.findUnique({
    where: {
      teamId_userId: { teamId: project.teamId, userId: dbUser.id },
    },
  });

  if (!membership) return null;
  return project;
}
