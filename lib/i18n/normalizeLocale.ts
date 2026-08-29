import { hasLocale } from "next-intl";

import { routing, type AppLocale } from "@/i18n/routing";

export function normalizeToAppLocale(
  locale: string | null | undefined,
): AppLocale | null {
  if (!locale?.trim()) {
    return null;
  }

  if (hasLocale(routing.locales, locale)) {
    return locale;
  }

  const lower = locale.toLowerCase();

  if (lower.startsWith("es")) {
    return "es-CO";
  }

  if (lower.startsWith("en")) {
    return "en-US";
  }

  return null;
}
