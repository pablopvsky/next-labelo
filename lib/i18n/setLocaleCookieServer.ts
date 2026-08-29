import { cookies } from "next/headers";

import type { AppLocale } from "@/i18n/routing";

import { LOCALE_COOKIE_NAME } from "./localeCookie";

export async function setLocaleCookieServer(nextLocale: AppLocale) {
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE_NAME, nextLocale, {
    path: "/",
    sameSite: "lax",
  });
}
