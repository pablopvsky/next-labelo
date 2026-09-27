"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@workos-inc/authkit-nextjs/components";

import { Logo } from "@/components/brand/Logo";
import { LocaleSuggestionBanner } from "@/components/LocaleSuggestionBanner";
import Button from "@/components/ui/Button";

export function HomeHeader() {
  const { user, loading } = useAuth();
  const t = useTranslations("header");
  const tCommon = useTranslations("common");

  return (
    <>
      <LocaleSuggestionBanner />
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20">
        <div className="smush pointer-events-auto flex h-[52px] items-center justify-between gap-2 px-2">
          <a
            href="#main-content"
            className="flex items-center gap-1 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-8"
          >
            <Logo priority />
            <span className="text-sm font-semibold tracking-tight text-gray-12">
              {tCommon("labelo")}
            </span>
          </a>
          <div className="flex items-center gap-1">
            {loading ? (
              <span
                className="cursor-progress text-sm text-gray-11"
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
    </>
  );
}
