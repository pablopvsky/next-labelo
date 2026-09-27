import {
  LayersIcon,
  MoveIcon,
  ViewVerticalIcon,
} from "@radix-ui/react-icons";
import { getTranslations } from "next-intl/server";

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
        <div className="flex max-w-[40ch] flex-col gap-1">
          <h2 className="h3 text-balance font-medium tracking-tight text-gray-12">
            {t("title")}
          </h2>
          <p className="text-balance text-gray-11">{t("description")}</p>
        </div>
        <ul className="grid gap-3 md:grid-cols-3 md:gap-2">
          {PILLARS.map(({ key, Icon }) => (
            <li key={key} className="flex flex-col gap-1">
              <Icon className="icon h4 text-gray-12" aria-hidden />
              <h3 className="h5 font-medium tracking-tight text-gray-12">
                {t(`${key}.title`)}
              </h3>
              <p className="max-w-[32ch] text-balance text-gray-11">
                {t(`${key}.description`)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
