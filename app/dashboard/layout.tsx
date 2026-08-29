import { withAuth } from "@workos-inc/authkit-nextjs";
import { getLocale, setRequestLocale } from "next-intl/server";

import { DashboardShell } from "@/components/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await withAuth({ ensureSignedIn: true });

  const locale = await getLocale();
  setRequestLocale(locale);

  return <DashboardShell>{children}</DashboardShell>;
}
