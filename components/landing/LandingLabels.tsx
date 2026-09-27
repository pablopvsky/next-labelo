import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Section } from "@/components/ui/Section";

export async function LandingLabels() {
  const t = await getTranslations("home.labels");

  return (
    <Section
      id="labels"
      container="smush"
      className="bg-gray-2"
      subClassName="grid items-center gap-2 md:grid-cols-2 md:gap-3"
    >
      <div className="landing-rise relative aspect-[3/2] overflow-hidden rounded-xl">
        <Image
          src="/generated/landing/labels.jpg"
          alt={t("imageAlt")}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center"
        />
      </div>
      <div className="landing-rise flex flex-col gap-1">
        <p className="text-xs uppercase tracking-[0.05em] text-gray-11">
          {t("eyebrow")}
        </p>
        <h2 className="h3 text-balance font-medium tracking-tight text-gray-12">
          {t("title")}
        </h2>
        <p className="max-w-[40ch] text-balance text-gray-11">{t("description")}</p>
      </div>
    </Section>
  );
}
