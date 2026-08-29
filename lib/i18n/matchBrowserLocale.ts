import { hasLocale } from "next-intl";

import { routing, type AppLocale } from "@/i18n/routing";

/**
 * Maps `navigator.languages` to a supported app locale.
 * Prefers exact tags, then language subtags (`es` → `es-CO`, `en` → `en-US`).
 */
export function matchBrowserLocale(
  languages: readonly string[],
): AppLocale | null {
  for (const raw of languages) {
    const tag = raw.trim().toLowerCase();
    if (!tag) continue;

    for (const locale of routing.locales) {
      if (locale.toLowerCase() === tag) {
        return locale;
      }
    }

    const language = tag.split("-")[0];
    if (language === "es" && hasLocale(routing.locales, "es-CO")) {
      return "es-CO";
    }
    if (language === "en" && hasLocale(routing.locales, "en-US")) {
      return "en-US";
    }
  }

  return null;
}
