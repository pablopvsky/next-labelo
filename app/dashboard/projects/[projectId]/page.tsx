import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

import { ProjectKanban } from "@/components/projects/ProjectKanban";
import { getProjectForUser } from "@/lib/projects/actions";
import type { TaskStatusValue } from "@/lib/tasks/statuses";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const t = await getTranslations("projects");
  const project = await getProjectForUser(projectId);

  if (!project) notFound();

  const tasks = project.tasks.map((task) => ({
    id: task.id,
    title: task.title,
    status: task.status as TaskStatusValue,
    position: task.position,
  }));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-0.5">
        <Link
          href="/dashboard"
          className="inline-flex w-fit items-center gap-0.5 text-sm text-gray-11 hover:text-gray-12"
        >
          <ArrowLeftIcon className="icon" />
          {t("back")}
        </Link>
        <h2 className="h4 text-gray-12">{project.name}</h2>
        <p className="text-sm text-gray-11">{project.team.name}</p>
      </div>
      <ProjectKanban projectId={project.id} initialTasks={tasks} />
    </div>
  );
}
