import { getTranslations } from "next-intl/server";

import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { requireTeamMembership } from "@/lib/auth/session";
import { listProjectsForUser } from "@/lib/projects/actions";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
  const { team } = await requireTeamMembership();
  const projects = await listProjectsForUser();

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-gray-11">
        {t("teamLabel", { name: team.name })}
      </p>
      <ProjectGrid projects={projects} teamId={team.id} />
    </div>
  );
}
