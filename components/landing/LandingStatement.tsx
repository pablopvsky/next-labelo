import { getTranslations } from "next-intl/server";

import { Marker, MarkerContent } from "@/components/ui/Marker";
import { Section } from "@/components/ui/Section";

export async function LandingStatement() {
  const t = await getTranslations("home.statement");

  return (
    <Section
      id="statement"
      container="smash"
      className="relative overflow-hidden bg-gray-2"
      subClassName="landing-rise relative z-10 flex flex-col items-center gap-1.5 text-center"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,var(--accent-a3),transparent_65%)]"
        aria-hidden
      />
      <Marker variant="separator" className="w-full max-w-[16rem]" aria-hidden>
        <MarkerContent>
          <span className="size-0.5 rounded-full bg-accent-9" />
        </MarkerContent>
      </Marker>
      <h2 className="h2 max-w-[18ch] text-balance font-medium tracking-tight text-gray-12">
        {t("title")}
      </h2>
      <p className="h5 max-w-[28ch] text-balance text-gray-11">
        {t("description")}
      </p>
    </Section>
  );
}
