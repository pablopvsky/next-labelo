"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@workos-inc/authkit-nextjs/components";

import { Section } from "@/components/ui/Section";
import Button from "@/components/ui/Button";

export function LandingCta() {
  const t = useTranslations("home.cta");
  const tHeader = useTranslations("header");
  const { user } = useAuth();

  return (
    <Section id="open" container="smash" className="bg-gray-1">
      <div className="landing-rise flex flex-col items-start gap-1.5">
        <h2 className="h3 max-w-[18ch] text-balance font-medium tracking-tight text-gray-12">
          {t("title")}
        </h2>
        <p className="max-w-[40ch] text-balance text-gray-11">{t("description")}</p>
        <div className="mt-0.5">
          <Button asChild size="lg">
            <a href={user ? "/dashboard" : "/login"}>
              {user ? tHeader("dashboard") : t("action")}
            </a>
          </Button>
        </div>
      </div>
    </Section>
  );
}
