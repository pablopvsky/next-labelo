import { notFound } from "next/navigation";

import { ProjectKanban } from "@/components/projects/ProjectKanban";
import { getProjectForUser } from "@/lib/projects/actions";
import type { TaskStatusValue } from "@/lib/tasks/statuses";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProjectForUser(projectId);

  if (!project) notFound();

  const tasks = project.tasks.map((task) => ({
    id: task.id,
    title: task.title,
    status: task.status as TaskStatusValue,
    position: task.position,
  }));

  return (
    <ProjectKanban
      projectId={project.id}
      projectName={project.name}
      teamName={project.team.name}
      initialTasks={tasks}
    />
  );
}
