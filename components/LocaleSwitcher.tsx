"use client";

import { useLocale, useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import Button from "@/components/ui/Button";

const localeLabels: Record<AppLocale, string> = {
  "en-US": "EN",
  "es-CO": "ES",
};

export function LocaleSwitcher() {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const t = useTranslations("locale");

  return (
    <div className="flex items-center gap-0.5" role="group" aria-label="Language">
      {routing.locales.map((nextLocale) => {
        const isActive = locale === nextLocale;
        const label =
          nextLocale === "en-US" ? t("en") : t("es");

        return (
          <Button
            key={nextLocale}
            asChild
            variant={isActive ? "fill" : "pill"}
            size="sm"
            aria-current={isActive ? "true" : undefined}
          >
            <Link
              href={pathname}
              locale={nextLocale}
              title={label}
            >
              {localeLabels[nextLocale]}
            </Link>
          </Button>
        );
      })}
    </div>
  );
}
