"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { ExitIcon, PersonIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/Button";
import {
  ResponsiveMenu,
  ResponsiveMenuContent,
  ResponsiveMenuItem,
  ResponsiveMenuLabel,
  ResponsiveMenuSeparator,
  ResponsiveMenuTrigger,
} from "@/components/ui/ResponsiveMenu";

export function AccountHomeMenu({
  teamName,
  inviteCode,
}: {
  teamName: string;
  inviteCode?: string;
}) {
  const { user, loading, signOut } = useAuth();
  const t = useTranslations("dashboard");
  const tProfile = useTranslations("profile");
  const tOnboarding = useTranslations("onboarding");

  return (
    <ResponsiveMenu alwaysDrawer>
      <ResponsiveMenuTrigger asChild>
        <Button
          type="button"
          variant="pill"
          size="icon"
          className="pointer-events-auto justify-self-start bg-gray-a2 backdrop-blur-md"
          aria-label={t("myAccount")}
        >
          <PersonIcon className="icon" />
        </Button>
      </ResponsiveMenuTrigger>
      <ResponsiveMenuContent
        title={t("myAccount")}
        description={loading ? undefined : (user?.email ?? teamName)}
        drawerClassName="mx-auto sm:max-w-[440px]"
      >
        {teamName ? (
          <>
            <ResponsiveMenuLabel>{teamName}</ResponsiveMenuLabel>
            {inviteCode ? (
              <p className="px-2 pb-1 text-xs tracking-wide text-gray-11">
                {tOnboarding("inviteCode")}: {inviteCode}
              </p>
            ) : null}
            <ResponsiveMenuSeparator />
          </>
        ) : null}
        <ResponsiveMenuItem asChild>
          <Link href="/dashboard/profile">
            <PersonIcon className="icon" />
            {tProfile("nav")}
          </Link>
        </ResponsiveMenuItem>
        <ResponsiveMenuItem
          onSelect={() => {
            void signOut();
          }}
        >
          <ExitIcon className="icon" />
          {t("logOut")}
        </ResponsiveMenuItem>
      </ResponsiveMenuContent>
    </ResponsiveMenu>
  );
}
