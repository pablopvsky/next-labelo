"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { ArrowRightIcon } from "@radix-ui/react-icons";

import { Section } from "@/components/ui/Section";
import Button from "@/components/ui/Button";

export function LandingCta() {
  const t = useTranslations("home.cta");
  const tHeader = useTranslations("header");
  const { user } = useAuth();

  return (
    <Section
      id="open"
      container="smash"
      className="relative overflow-hidden bg-gray-1"
      subClassName="landing-rise relative z-10"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_50%,var(--accent-a4),transparent_55%),radial-gradient(ellipse_at_100%_100%,var(--gray-a3),transparent_50%)]"
        aria-hidden
      />
      <div className="relative flex flex-col items-start gap-1.5">
        <h2 className="h3 max-w-[18ch] text-balance font-medium tracking-tight text-gray-12">
          {t("title")}
        </h2>
        <p className="max-w-[40ch] text-balance text-gray-11">{t("description")}</p>
        <div className="mt-0.5">
          <Button asChild size="lg">
            <a href={user ? "/dashboard" : "/login"}>
              {user ? tHeader("dashboard") : t("action")}
              <ArrowRightIcon className="icon" aria-hidden />
            </a>
          </Button>
        </div>
      </div>
    </Section>
  );
}
