import { withAuth } from "@workos-inc/authkit-nextjs";

import { type AppLocale, routing } from "@/i18n/routing";
import { getPrisma } from "@/lib/prisma";

import { normalizeToAppLocale } from "./normalizeLocale";

export async function resolveLocaleFromProfile(): Promise<AppLocale> {
  try {
    const { user } = await withAuth();

    if (!user) {
      return routing.defaultLocale;
    }

    const fromWorkOS = normalizeToAppLocale(user.locale);
    if (fromWorkOS) {
      return fromWorkOS;
    }

    const dbUser = await getPrisma().user.findUnique({
      where: { workosUserId: user.id },
      select: { locale: true },
    });
    const fromDb = normalizeToAppLocale(dbUser?.locale);
    if (fromDb) {
      return fromDb;
    }
  } catch {
    // Unauthenticated or auth unavailable during static analysis.
  }

  return routing.defaultLocale;
}
