import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Section } from "@/components/ui/Section";

const STEP_KEYS = ["signIn", "team", "project", "labels"] as const;

export async function LandingSteps() {
  const t = await getTranslations("home.steps");

  return (
    <Section
      id="how-it-works"
      container="smush"
      className="bg-gray-2"
      subClassName="grid items-center gap-3 md:grid-cols-2 md:gap-4"
    >
      <div className="landing-rise flex flex-col gap-2 order-2 md:order-1">
        <div className="flex flex-col gap-1">
          <p className="text-xs uppercase tracking-[0.05em] text-gray-11">
            {t("eyebrow")}
          </p>
          <h2 className="h3 text-balance font-medium tracking-tight text-gray-12">
            {t("title")}
          </h2>
          <p className="max-w-[40ch] text-balance text-gray-11">
            {t("description")}
          </p>
        </div>
        <ol className="flex flex-col gap-1.5">
          {STEP_KEYS.map((key, index) => (
            <li key={key} className="flex gap-1">
              <span
                className="text-sm font-semibold tabular-nums text-gray-12"
                aria-hidden
              >
                {index + 1}.
              </span>
              <div className="flex flex-col gap-0.5">
                <h3 className="h6 font-medium tracking-tight text-gray-12">
                  {t(`${key}.title`)}
                </h3>
                <p className="max-w-[36ch] text-balance text-gray-11">
                  {t(`${key}.description`)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="landing-rise relative order-1 aspect-[4/5] overflow-hidden rounded-xl md:order-2">
        <Image
          src="/generated/landing/flow.jpg"
          alt={t("imageAlt")}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center"
        />
      </div>
    </Section>
  );
}
