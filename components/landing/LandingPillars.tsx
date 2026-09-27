import Image from "next/image";
import {
  LayersIcon,
  MoveIcon,
  ViewVerticalIcon,
} from "@radix-ui/react-icons";
import { getTranslations } from "next-intl/server";

import { AspectRatio } from "@/components/ui/AspectRatio";
import { Grid } from "@/components/ui/Grid";
import { Separator } from "@/components/ui/Separator";
import { Section } from "@/components/ui/Section";

const PILLARS = [
  { key: "projects", Icon: LayersIcon },
  { key: "rails", Icon: ViewVerticalIcon },
  { key: "labels", Icon: MoveIcon },
] as const;

export async function LandingPillars() {
  const t = await getTranslations("home.pillars");

  return (
    <Section id="pillars" container="smush" className="bg-gray-1">
      <div className="landing-rise flex flex-col gap-3">
        <div className="grid items-center gap-3 md:grid-cols-2 md:gap-4">
          <div className="flex max-w-[40ch] flex-col gap-1">
            <h2 className="h3 text-balance font-medium tracking-tight text-gray-12">
              {t("title")}
            </h2>
            <p className="text-balance text-gray-11">{t("description")}</p>
          </div>
          <AspectRatio
            ratio={4 / 3}
            className="overflow-hidden rounded-xl bg-gray-2"
          >
            <Image
              src="/generated/landing/labels.jpg"
              alt={t("imageAlt")}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </AspectRatio>
        </div>

        <Separator />

        <Grid col="three">
          {PILLARS.map(({ key, Icon }, index) => (
            <div
              key={key}
              className="landing-rise flex flex-col gap-1"
              data-delay={String(index + 1)}
            >
              <span className="inline-flex size-3 items-center justify-center rounded-md bg-gray-3 text-gray-12">
                <Icon className="icon" aria-hidden />
              </span>
              <h3 className="h5 font-medium tracking-tight text-gray-12">
                {t(`${key}.title`)}
              </h3>
              <p className="max-w-[32ch] text-balance text-gray-11">
                {t(`${key}.description`)}
              </p>
            </div>
          ))}
        </Grid>
      </div>
    </Section>
  );
}
