import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";

import { resolveLocaleFromProfile } from "@/lib/i18n/resolveAppLocale";

import { routing, type AppLocale } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  let locale: AppLocale;

  if (hasLocale(routing.locales, requested)) {
    locale = requested;
  } else {
    locale = await resolveLocaleFromProfile();
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
