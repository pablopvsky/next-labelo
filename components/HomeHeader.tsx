"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@workos-inc/authkit-nextjs/components";

import { Logo } from "@/components/brand/Logo";
import { LocaleSuggestionBanner } from "@/components/LocaleSuggestionBanner";
import Button from "@/components/ui/Button";

export function HomeHeader() {
  const { user } = useAuth();
  const t = useTranslations("header");
  const tCommon = useTranslations("common");

  return (
    <>
      <LocaleSuggestionBanner />
      <header className="fixed inset-x-0 top-0 z-20 border-b border-gray-6/60 bg-gray-1/70 backdrop-blur-md">
        <div className="smush flex h-[52px] items-center justify-between gap-2 px-2">
          <a
            href="#main-content"
            className="flex items-center gap-1 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-8"
          >
            <Logo priority />
            <span className="text-sm font-semibold tracking-tight text-gray-12">
              {tCommon("labelo")}
            </span>
          </a>
          <Button asChild>
            <a href={user ? "/dashboard" : "/login"}>
              {user ? t("dashboard") : t("signIn")}
            </a>
          </Button>
        </div>
      </header>
    </>
  );
}
