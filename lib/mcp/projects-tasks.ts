import { getPrisma } from "@/lib/prisma";
import { isTaskStatus, type TaskStatusValue } from "@/lib/tasks/statuses";

export async function listAccessibleTeamIds(userId: string) {
  const memberships = await getPrisma().teamMember.findMany({
    where: { userId },
    select: { teamId: true },
  });
  return memberships.map((m) => m.teamId);
}

export async function assertProjectAccess(userId: string, projectId: string) {
  const project = await getPrisma().project.findUnique({
    where: { id: projectId },
    include: {
      team: { select: { id: true, name: true } },
    },
  });
  if (!project) return null;

  const membership = await getPrisma().teamMember.findUnique({
    where: {
      teamId_userId: { teamId: project.teamId, userId },
    },
  });
  if (!membership) return null;
  return project;
}

export async function mcpListProjects(userId: string) {
  const teamIds = await listAccessibleTeamIds(userId);
  return getPrisma().project.findMany({
    where: { teamId: { in: teamIds } },
    include: {
      team: { select: { id: true, name: true } },
      _count: { select: { tasks: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function mcpGetProject(userId: string, projectId: string) {
  const project = await assertProjectAccess(userId, projectId);
  if (!project) return null;

  return getPrisma().project.findUnique({
    where: { id: projectId },
    include: {
      team: { select: { id: true, name: true } },
      tasks: { orderBy: [{ status: "asc" }, { position: "asc" }] },
    },
  });
}

export async function mcpCreateProject(
  userId: string,
  input: { name: string; teamId?: string },
) {
  const name = input.name.trim();
  if (!name) throw new Error("Project name is required");

  const prisma = getPrisma();
  let teamId = input.teamId?.trim() || "";

  if (!teamId) {
    const first = await prisma.teamMember.findFirst({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: { teamId: true },
    });
    if (!first) throw new Error("No team membership found");
    teamId = first.teamId;
  } else {
    const membership = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId } },
    });
    if (!membership) throw new Error("Forbidden");
  }

  return prisma.project.create({
    data: { name, teamId },
    include: { team: { select: { id: true, name: true } } },
  });
}

export async function mcpDeleteProject(userId: string, projectId: string) {
  const project = await assertProjectAccess(userId, projectId);
  if (!project) throw new Error("Project not found");
  await getPrisma().project.delete({ where: { id: projectId } });
  return { id: projectId };
}

export async function mcpListTasks(
  userId: string,
  input: { projectId: string; status?: string },
) {
  const project = await assertProjectAccess(userId, input.projectId);
  if (!project) throw new Error("Project not found");

  const status = input.status?.trim();
  if (status && !isTaskStatus(status)) {
    throw new Error(`Invalid status: ${status}`);
  }

  return getPrisma().task.findMany({
    where: {
      projectId: input.projectId,
      ...(status ? { status: status as TaskStatusValue } : {}),
    },
    orderBy: [{ status: "asc" }, { position: "asc" }],
  });
}

export async function mcpCreateTask(
  userId: string,
  input: { projectId: string; title: string; status?: string },
) {
  const title = input.title.trim();
  if (!title) throw new Error("Title is required");

  const project = await assertProjectAccess(userId, input.projectId);
  if (!project) throw new Error("Project not found");

  const statusRaw = input.status?.trim() || "requerimiento";
  if (!isTaskStatus(statusRaw)) {
    throw new Error(`Invalid status: ${statusRaw}`);
  }

  const prisma = getPrisma();
  const max = await prisma.task.aggregate({
    where: { projectId: input.projectId, status: statusRaw },
    _max: { position: true },
  });

  return prisma.task.create({
    data: {
      title,
      projectId: input.projectId,
      status: statusRaw,
      position: (max._max.position ?? -1) + 1,
    },
  });
}

export async function mcpUpdateTask(
  userId: string,
  input: { taskId: string; title: string },
) {
  const title = input.title.trim();
  if (!title) throw new Error("Title is required");

  const prisma = getPrisma();
  const task = await prisma.task.findUnique({ where: { id: input.taskId } });
  if (!task) throw new Error("Task not found");

  const project = await assertProjectAccess(userId, task.projectId);
  if (!project) throw new Error("Forbidden");

  return prisma.task.update({
    where: { id: task.id },
    data: { title },
  });
}

export async function mcpMoveTask(
  userId: string,
  input: { taskId: string; status: string; position: number },
) {
  if (!isTaskStatus(input.status)) {
    throw new Error(`Invalid status: ${input.status}`);
  }

  const prisma = getPrisma();
  const task = await prisma.task.findUnique({ where: { id: input.taskId } });
  if (!task) throw new Error("Task not found");

  const project = await assertProjectAccess(userId, task.projectId);
  if (!project) throw new Error("Forbidden");

  const nextStatus = input.status as TaskStatusValue;

  const siblings = await prisma.task.findMany({
    where: {
      projectId: task.projectId,
      status: nextStatus,
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
      data: { status: nextStatus, position: insertAt },
    }),
    ...orderedIds.map((id, index) =>
      prisma.task.update({
        where: { id },
        data: {
          position: index,
          ...(id === task.id ? { status: nextStatus } : {}),
        },
      }),
    ),
  ]);

  if (task.status !== nextStatus) {
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

  return prisma.task.findUniqueOrThrow({ where: { id: task.id } });
}

export async function mcpDeleteTask(userId: string, taskId: string) {
  const prisma = getPrisma();
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new Error("Task not found");

  const project = await assertProjectAccess(userId, task.projectId);
  if (!project) throw new Error("Forbidden");

  await prisma.task.delete({ where: { id: taskId } });
  return { id: taskId };
}
