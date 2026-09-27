"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { ArrowRightIcon } from "@radix-ui/react-icons";

import Button from "@/components/ui/Button";

export function LandingCta() {
  const t = useTranslations("home.cta");
  const tHeader = useTranslations("header");
  const { user } = useAuth();

  return (
    <section
      id="open"
      className="landing-diagram-row landing-cta-grid"
      aria-labelledby="landing-cta-title"
    >
      <div className="flex flex-col justify-center gap-1.5 bg-gray-1 px-2 py-3 sm:px-3 md:py-4">
        <p className="landing-kicker text-accent-11">{t("eyebrow")}</p>
        <h2
          id="landing-cta-title"
          className="h3 max-w-xs text-balance font-medium tracking-tight text-gray-12"
        >
          {t("title")}
        </h2>
        <p className="max-w-md text-balance text-gray-11">{t("description")}</p>
        <div className="mt-1">
          <Button asChild size="lg">
            <a href={user ? "/dashboard" : "/login"}>
              {user ? tHeader("dashboard") : t("action")}
              <ArrowRightIcon className="icon" />
            </a>
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-2 bg-accent-9 px-2 py-3 text-center text-accent-contrast md:py-4">
        <p className="h4 max-w-xs text-balance font-medium tracking-tight">
          {t("aside")}
        </p>
        <a
          href={user ? "/dashboard" : "/login"}
          className="landing-cta-orb"
          aria-label={user ? tHeader("dashboard") : t("action")}
        >
          <ArrowRightIcon className="icon h4" />
        </a>
      </div>
    </section>
  );
}
