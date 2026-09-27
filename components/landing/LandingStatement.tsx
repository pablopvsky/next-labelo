import { getTranslations } from "next-intl/server";

import { Section } from "@/components/ui/Section";

export async function LandingStatement() {
  const t = await getTranslations("home.statement");

  return (
    <Section
      id="statement"
      container="smash"
      className="bg-gray-2"
      subClassName="landing-rise flex flex-col items-center gap-1 text-center"
    >
      <h2 className="h2 max-w-[18ch] text-balance font-medium tracking-tight text-gray-12">
        {t("title")}
      </h2>
      <p className="h5 max-w-[28ch] text-balance text-gray-11">{t("description")}</p>
    </Section>
  );
}
