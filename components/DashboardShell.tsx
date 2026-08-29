"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@workos-inc/authkit-nextjs/components";

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

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { signOut } = useAuth();
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent className="p-2">
          <p className="text-sm font-semibold text-gray-12 px-2 py-1">
            {tCommon("labelo")}
          </p>
        </SidebarContent>
        <SidebarFooter>
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
