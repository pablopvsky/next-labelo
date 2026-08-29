"use client";

import { useTranslations } from "next-intl";

import { Section } from "@/components/ui/Section";

export function HomeBanner() {
  const t = useTranslations("home");

  return (
    <Section className="rounded-none" id="home-banner">
      <div className="relative rounded-xl bg-gray-2 border border-gray-6 overflow-hidden p-4 sm:p-6 flex flex-col items-center text-center gap-2">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--accent-a3),transparent_70%)]" />
        <div className="relative z-10 flex flex-col items-center gap-1.5 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-12 text-balance">
            {t("title")}
          </h1>
          <p className="text-lg text-gray-11 text-balance max-w-lg">
            {t("description")}
          </p>
        </div>
      </div>
    </Section>
  );
}
