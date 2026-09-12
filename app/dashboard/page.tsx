import { ProjectHome } from "@/components/projects/ProjectHome";
import { requireTeamMembership } from "@/lib/auth/session";
import { listProjectsForUser } from "@/lib/projects/actions";

export default async function DashboardPage() {
  const { team } = await requireTeamMembership();
  const projects = await listProjectsForUser();

  return (
    <ProjectHome
      projects={projects}
      teamId={team.id}
      teamName={team.name}
      inviteCode={team.inviteCode}
    />
  );
}
