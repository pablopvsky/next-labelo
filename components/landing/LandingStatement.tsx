import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { LandingArrowLink } from "@/components/landing/LandingArrowLink";

export async function LandingStatement() {
  const t = await getTranslations("home.statement");

  return (
    <section
      id="statement"
      className="landing-diagram-row landing-statement-grid"
      aria-labelledby="landing-statement-title"
    >
      <div className="flex flex-col justify-between gap-3 bg-accent-9 px-2 py-3 text-accent-contrast sm:px-3 md:py-4">
        <div className="landing-rise flex flex-col gap-1.5">
          <p className="landing-kicker text-accent-contrast/80">{t("eyebrow")}</p>
          <h2
            id="landing-statement-title"
            className="h2 max-w-xs text-balance font-medium tracking-tight"
          >
            {t("title")}
          </h2>
          <p className="h5 max-w-sm text-balance text-accent-contrast/90">
            {t("description")}
          </p>
        </div>
        <LandingArrowLink
          href="#open"
          className="text-accent-contrast hover:text-accent-contrast"
        >
          {t("action")}
        </LandingArrowLink>
      </div>

      <div className="relative min-h-60 bg-gray-3 md:min-h-0">
        <Image
          src="/generated/landing/manifesto.jpg"
          alt={t("imageAlt")}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center"
        />
      </div>
    </section>
  );
}
