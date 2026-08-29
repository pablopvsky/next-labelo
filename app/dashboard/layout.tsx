import { getLocale, setRequestLocale } from "next-intl/server";

import { DashboardShell } from "@/components/DashboardShell";
import { requireTeamMembership } from "@/lib/auth/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { team } = await requireTeamMembership();

  const locale = await getLocale();
  setRequestLocale(locale);

  return (
    <DashboardShell teamName={team.name} inviteCode={team.inviteCode}>
      {children}
    </DashboardShell>
  );
}
