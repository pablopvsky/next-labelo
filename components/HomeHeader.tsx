"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@workos-inc/authkit-nextjs/components";

import { Logo } from "@/components/brand/Logo";
import { LocaleSuggestionBanner } from "@/components/LocaleSuggestionBanner";
import Button from "@/components/ui/Button";

const NAV = [
  { href: "#features", key: "features" as const },
  { href: "#how-it-works", key: "howItWorks" as const },
  { href: "#open", key: "open" as const },
];

export function HomeHeader() {
  const { user } = useAuth();
  const t = useTranslations("header");
  const tNav = useTranslations("home.nav");
  const tCommon = useTranslations("common");

  return (
    <>
      <LocaleSuggestionBanner />
      <header className="fixed inset-x-0 top-0 z-20 border-b border-gray-6 bg-gray-1/85 backdrop-blur-md">
        <div className="landing-header-bar">
          <a
            href="#main-content"
            className="flex items-center gap-1 justify-self-start rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-8"
          >
            <Logo priority />
            <span className="text-sm font-semibold tracking-tight text-gray-12">
              {tCommon("labelo")}
            </span>
          </a>

          <nav
            aria-label={tNav("ariaLabel")}
            className="hidden items-center gap-2 md:flex"
          >
            {NAV.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="landing-kicker text-gray-11 transition-colors hover:text-gray-12"
              >
                {tNav(item.key)}
              </a>
            ))}
          </nav>

          <div className="justify-self-end">
            <Button asChild>
              <a href={user ? "/dashboard" : "/login"}>
                {user ? t("dashboard") : t("signIn")}
              </a>
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
