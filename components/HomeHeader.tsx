"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@workos-inc/authkit-nextjs/components";

import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import Button from "@/components/ui/Button";

export function HomeHeader() {
  const { user, loading } = useAuth();
  const t = useTranslations("header");
  const tCommon = useTranslations("common");

  return (
    <header className="border-b border-gray-6 bg-gray-1/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-2 h-[52px] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <div className="size-2 bg-accent-9 rounded-full" />
          <span className="font-semibold text-sm tracking-tight">
            {tCommon("labelo")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          {loading ? (
            <span
              className="cursor-progress text-gray-11 text-sm"
              role="status"
              aria-live="polite"
            >
              {tCommon("loading")}
            </span>
          ) : user ? (
            <Button asChild>
              <a href="/dashboard">{t("dashboard")}</a>
            </Button>
          ) : (
            <Button asChild>
              <a href="/login">{t("signIn")}</a>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
