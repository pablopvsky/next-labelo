import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { LandingStepsList } from "@/components/landing/LandingStepsList";
import { AspectRatio } from "@/components/ui/AspectRatio";
import { Marker, MarkerContent } from "@/components/ui/Marker";
import { Section } from "@/components/ui/Section";

const STEP_KEYS = ["signIn", "team", "project", "labels"] as const;

export async function LandingSteps() {
  const t = await getTranslations("home.steps");

  const steps = STEP_KEYS.map((key) => ({
    key,
    title: t(`${key}.title`),
    description: t(`${key}.description`),
  }));

  return (
    <Section
      id="how-it-works"
      container="smush"
      className="bg-gray-2"
      subClassName="grid items-center gap-3 md:grid-cols-2 md:gap-4"
    >
      <div className="landing-rise order-2 flex flex-col gap-2 md:order-1">
        <div className="flex flex-col gap-1">
          <Marker variant="separator" className="justify-center md:justify-start">
            <MarkerContent>
              <span className="text-xs uppercase tracking-[0.05em] text-gray-11">
                {t("eyebrow")}
              </span>
            </MarkerContent>
          </Marker>
          <h2 className="h3 text-balance font-medium tracking-tight text-gray-12">
            {t("title")}
          </h2>
          <p className="max-w-[40ch] text-balance text-gray-11">
            {t("description")}
          </p>
        </div>
        <LandingStepsList steps={steps} activeKey="labels" />
      </div>
      <div className="landing-rise order-1 md:order-2" data-delay="1">
        <AspectRatio
          ratio={4 / 5}
          className="overflow-hidden rounded-xl bg-gray-3"
        >
          <Image
            src="/generated/landing/flow.jpg"
            alt={t("imageAlt")}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </AspectRatio>
      </div>
    </Section>
  );
}
