import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { LandingArrowLink } from "@/components/landing/LandingArrowLink";

const STEP_KEYS = ["signIn", "team", "project", "labels"] as const;

export async function LandingSteps() {
  const t = await getTranslations("home.steps");
  const tHome = await getTranslations("home");

  return (
    <section
      id="how-it-works"
      className="landing-diagram-row landing-steps-grid"
      aria-labelledby="landing-steps-title"
    >
      <div className="flex flex-col justify-between gap-3 bg-gray-12 px-2 py-3 text-gray-1 sm:px-3 md:py-4">
        <div className="landing-rise flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <p className="landing-kicker text-accent-8">{t("eyebrow")}</p>
            <h2
              id="landing-steps-title"
              className="h3 font-medium tracking-tight text-gray-1"
            >
              {t("title")}
            </h2>
            <p className="max-w-sm text-balance text-gray-8">{t("description")}</p>
          </div>

          <ol className="flex flex-col">
            {STEP_KEYS.map((key, index) => (
              <li key={key} className="landing-step-item">
                <div className="flex flex-col items-center pt-0.5">
                  <span
                    className="size-1 rounded-full bg-accent-9"
                    aria-hidden
                  />
                  {index < STEP_KEYS.length - 1 ? (
                    <span
                      className="mt-0.5 w-px flex-1 bg-gray-11/50"
                      aria-hidden
                    />
                  ) : null}
                </div>
                <div className="flex flex-col gap-0.5 pb-0.5">
                  <p className="landing-kicker text-accent-8">
                    {t("stepLabel", { n: index + 1 })}
                  </p>
                  <h3 className="h6 font-medium tracking-tight text-gray-1">
                    {t(`${key}.title`)}
                  </h3>
                  <p className="max-w-sm text-balance text-gray-8">
                    {t(`${key}.description`)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <LandingArrowLink
          href="#open"
          className="text-gray-1 hover:text-accent-8"
        >
          {t("viewAll")}
        </LandingArrowLink>
      </div>

      <div className="landing-steps-rail hidden md:flex" aria-hidden>
        <p className="landing-vertical-tag">{tHome("verticalTag")}</p>
      </div>

      <div className="relative min-h-60 bg-gray-3 md:min-h-0">
        <Image
          src="/generated/landing/flow.jpg"
          alt={t("imageAlt")}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover object-center"
        />
      </div>
    </section>
  );
}
