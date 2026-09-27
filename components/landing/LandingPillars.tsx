import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { LandingArrowLink } from "@/components/landing/LandingArrowLink";

const PILLARS = [
  { key: "projects", image: "/generated/landing/pillar-projects.jpg" },
  { key: "rails", image: "/generated/landing/pillar-rails.jpg" },
  { key: "labels", image: "/generated/landing/pillar-labels.jpg" },
] as const;

export async function LandingPillars() {
  const t = await getTranslations("home.pillars");

  return (
    <section
      id="features"
      className="landing-diagram-row landing-pillars-grid"
      aria-labelledby="landing-pillars-title"
    >
      {PILLARS.map(({ key, image }, index) => (
        <article
          key={key}
          className="landing-rise landing-pillar-panel"
          data-delay={String(index + 1)}
        >
          <div className="absolute inset-0">
            <Image
              src={image}
              alt={t(`${key}.imageAlt`)}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover object-center"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-gray-12/80 via-gray-12/10 to-transparent"
              aria-hidden
            />
          </div>
          <div className="relative mt-auto flex flex-col gap-0.5 p-2">
            <h3 className="h5 font-medium tracking-tight text-gray-1">
              {t(`${key}.title`)}
            </h3>
            <p className="max-w-xs text-balance text-sm text-gray-3">
              {t(`${key}.description`)}
            </p>
          </div>
        </article>
      ))}

      <div className="landing-pillars-aside">
        <div className="landing-rise flex flex-col gap-1">
          <h2
            id="landing-pillars-title"
            className="landing-outline-title h2 font-semibold tracking-tight"
          >
            {t("panelTitle")}
          </h2>
          <p className="max-w-xs text-balance text-gray-11">{t("description")}</p>
        </div>
        <LandingArrowLink href="#how-it-works">{t("viewAll")}</LandingArrowLink>
      </div>
    </section>
  );
}
