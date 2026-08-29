"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { DashboardIcon } from "@radix-ui/react-icons";

import { AccountLocaleSelect } from "@/components/AccountLocaleSelect";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/Sidebar";

export function DashboardShell({
  children,
  teamName,
  inviteCode,
}: {
  children: React.ReactNode;
  teamName?: string;
  inviteCode?: string;
}) {
  const { signOut } = useAuth();
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const tOnboarding = useTranslations("onboarding");
  const tLanguage = useTranslations("language");

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent className="p-2">
          <p className="text-sm font-semibold text-gray-12 px-2 py-1">
            {tCommon("labelo")}
          </p>
          {teamName ? (
            <p className="text-xs text-gray-11 px-2 pb-1">{teamName}</p>
          ) : null}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard">
                  <DashboardIcon className="icon" />
                  {t("projectsNav")}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          {inviteCode ? (
            <div className="mt-2 rounded-md border border-gray-6 bg-gray-2 p-1 mx-1">
              <p className="text-xs text-gray-11">{tOnboarding("inviteCode")}</p>
              <p className="text-sm font-medium tracking-wide text-gray-12">
                {inviteCode}
              </p>
            </div>
          ) : null}
        </SidebarContent>
        <SidebarFooter className="gap-1 p-2">
          <div className="px-0.5">
            <p className="text-xs text-gray-11 px-1.5 pb-0.5">
              {tLanguage("label")}
            </p>
            <AccountLocaleSelect />
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => void signOut()}>
                {t("signOut")}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-[52px] items-center gap-2 border-b border-gray-6 px-2">
          <SidebarTrigger />
          <h1 className="text-sm font-semibold text-gray-12">{t("title")}</h1>
        </header>
        <div className="p-2">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
