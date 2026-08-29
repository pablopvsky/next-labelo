"use server";

import { revalidatePath } from "next/cache";

import { requireTeamMembership } from "@/lib/auth/session";
import { getPrisma } from "@/lib/prisma";
import { isTaskStatus, type TaskStatusValue } from "@/lib/tasks/statuses";

export type TaskActionResult =
  | { ok: true; taskId?: string }
  | { ok: false; error: string };

async function getAccessibleProject(projectId: string) {
  const { dbUser } = await requireTeamMembership();
  const project = await getPrisma().project.findUnique({
    where: { id: projectId },
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

function revalidateProject(projectId: string) {
  revalidatePath(`/dashboard/projects/${projectId}`);
  revalidatePath("/dashboard");
}

export async function createTaskAction(
  _prev: TaskActionResult | null,
  formData: FormData,
): Promise<TaskActionResult> {
  const title = String(formData.get("title") ?? "").trim();
  const projectId = String(formData.get("projectId") ?? "").trim();
  const statusRaw = String(formData.get("status") ?? "requerimiento");

  if (!title) return { ok: false, error: "Title is required" };
  if (!projectId) return { ok: false, error: "Project is required" };
  if (!isTaskStatus(statusRaw)) {
    return { ok: false, error: "Invalid status" };
  }

  const project = await getAccessibleProject(projectId);
  if (!project) return { ok: false, error: "Project not found" };

  const prisma = getPrisma();
  const max = await prisma.task.aggregate({
    where: { projectId, status: statusRaw },
    _max: { position: true },
  });

  const task = await prisma.task.create({
    data: {
      title,
      projectId,
      status: statusRaw,
      position: (max._max.position ?? -1) + 1,
    },
  });

  revalidateProject(projectId);
  return { ok: true, taskId: task.id };
}

export async function moveTaskAction(input: {
  taskId: string;
  status: TaskStatusValue;
  position: number;
}): Promise<TaskActionResult> {
  const prisma = getPrisma();
  const task = await prisma.task.findUnique({ where: { id: input.taskId } });
  if (!task) return { ok: false, error: "Task not found" };

  const project = await getAccessibleProject(task.projectId);
  if (!project) return { ok: false, error: "Forbidden" };
  if (!isTaskStatus(input.status)) {
    return { ok: false, error: "Invalid status" };
  }

  const siblings = await prisma.task.findMany({
    where: {
      projectId: task.projectId,
      status: input.status,
      NOT: { id: task.id },
    },
    orderBy: { position: "asc" },
  });

  const insertAt = Math.max(0, Math.min(input.position, siblings.length));
  const orderedIds = siblings.map((t) => t.id);
  orderedIds.splice(insertAt, 0, task.id);

  await prisma.$transaction([
    prisma.task.update({
      where: { id: task.id },
      data: { status: input.status, position: insertAt },
    }),
    ...orderedIds.map((id, index) =>
      prisma.task.update({
        where: { id },
        data: {
          position: index,
          ...(id === task.id ? { status: input.status } : {}),
        },
      }),
    ),
  ]);

  // If the task left another column, compact that column
  if (task.status !== input.status) {
    const previous = await prisma.task.findMany({
      where: { projectId: task.projectId, status: task.status },
      orderBy: { position: "asc" },
    });
    if (previous.length > 0) {
      await prisma.$transaction(
        previous.map((t, index) =>
          prisma.task.update({
            where: { id: t.id },
            data: { position: index },
          }),
        ),
      );
    }
  }

  revalidateProject(task.projectId);
  return { ok: true };
}

export async function duplicateTaskAction(
  taskId: string,
): Promise<TaskActionResult> {
  const prisma = getPrisma();
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) return { ok: false, error: "Task not found" };

  const project = await getAccessibleProject(task.projectId);
  if (!project) return { ok: false, error: "Forbidden" };

  const max = await prisma.task.aggregate({
    where: { projectId: task.projectId, status: task.status },
    _max: { position: true },
  });

  const copy = await prisma.task.create({
    data: {
      title: task.title,
      status: task.status,
      projectId: task.projectId,
      position: (max._max.position ?? -1) + 1,
    },
  });

  revalidateProject(task.projectId);
  return { ok: true, taskId: copy.id };
}

export async function deleteTaskAction(
  taskId: string,
): Promise<TaskActionResult> {
  const prisma = getPrisma();
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) return { ok: false, error: "Task not found" };

  const project = await getAccessibleProject(task.projectId);
  if (!project) return { ok: false, error: "Forbidden" };

  await prisma.task.delete({ where: { id: taskId } });
  revalidateProject(task.projectId);
  return { ok: true };
}
