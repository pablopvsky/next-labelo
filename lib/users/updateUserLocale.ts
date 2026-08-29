import { withAuth } from "@workos-inc/authkit-nextjs";
import { hasLocale } from "next-intl";

import { routing, type AppLocale } from "@/i18n/routing";
import { setLocaleCookieServer } from "@/lib/i18n/setLocaleCookieServer";
import { getWorkOSClient } from "@/lib/workos/client";

import { upsertUserFromWorkOS } from "./syncWorkOSUser";

export type UpdateUserLocaleResult =
  | { ok: true; locale: AppLocale }
  | { ok: false; error: "unauthorized" | "invalid" | "failed" };

export async function updateUserLocale(
  nextLocale: string,
): Promise<UpdateUserLocaleResult> {
  if (!hasLocale(routing.locales, nextLocale)) {
    return { ok: false, error: "invalid" };
  }

  const { user } = await withAuth({ ensureSignedIn: true });
  if (!user) {
    return { ok: false, error: "unauthorized" };
  }

  try {
    const workos = getWorkOSClient();
    const updatedUser = await workos.userManagement.updateUser({
      userId: user.id,
      locale: nextLocale,
    });

    await upsertUserFromWorkOS(updatedUser);
    await setLocaleCookieServer(nextLocale);

    return { ok: true, locale: nextLocale };
  } catch (err) {
    console.error("[account] Failed to update user locale", err);
    return { ok: false, error: "failed" };
  }
}
