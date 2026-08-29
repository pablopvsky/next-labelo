"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { CaretSortIcon } from "@radix-ui/react-icons";

import {
  SidebarMenuPanel,
  SidebarMenuPanelItem,
  SidebarMenuPanelSeparator,
} from "@/components/dashboard/SidebarMenuPanel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { SidebarMenuButton } from "@/components/ui/Sidebar";

function userDisplayName(
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  } | null,
) {
  if (!user) return "";
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return name || user.email;
}

function userInitials(
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  } | null,
) {
  if (!user) return "?";
  if (user.firstName && user.lastName) {
    return `${user.firstName[0]!}${user.lastName[0]!}`.toUpperCase();
  }
  if (user.firstName) return user.firstName.slice(0, 2).toUpperCase();
  return user.email.slice(0, 2).toUpperCase();
}

export function AccountSidebarMenu() {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const tProfile = useTranslations("profile");

  return (
    <SidebarMenuPanel
      title={t("myAccount")}
      align="end"
      tooltip={tProfile("nav")}
      trigger={
        <SidebarMenuButton
          size="lg"
          type="button"
          isActive={pathname.startsWith("/dashboard/profile")}
        >
          <Avatar className="size-2.5 shrink-0 rounded-lg group-data-[collapsible=icon]:size-1.5 group-data-[collapsible=icon]:rounded-md">
            {user?.profilePictureUrl ? (
              <AvatarImage
                src={user.profilePictureUrl}
                alt={userDisplayName(user) || t("user")}
              />
            ) : null}
            <AvatarFallback className="text-xs font-medium text-gray-12">
              {loading ? "…" : userInitials(user)}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-medium">
              {loading
                ? tCommon("loading")
                : userDisplayName(user) || tProfile("nav")}
            </span>
            <span className="truncate text-xs text-gray-11">
              {user?.email ?? ""}
            </span>
          </div>
          <CaretSortIcon className="icon ml-auto group-data-[collapsible=icon]:hidden" />
        </SidebarMenuButton>
      }
    >
      <SidebarMenuPanelItem asChild>
        <Link href="/dashboard/profile">{tProfile("nav")}</Link>
      </SidebarMenuPanelItem>
      <SidebarMenuPanelSeparator />
      <SidebarMenuPanelItem
        onSelect={() => {
          void signOut();
        }}
      >
        {t("logOut")}
      </SidebarMenuPanelItem>
    </SidebarMenuPanel>
  );
}
