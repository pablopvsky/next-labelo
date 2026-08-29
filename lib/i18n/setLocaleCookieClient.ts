"use client";

import type { AppLocale } from "@/i18n/routing";

import { LOCALE_COOKIE_NAME } from "./localeCookie";

export function setLocaleCookieClient(nextLocale: AppLocale) {
  document.cookie = `${LOCALE_COOKIE_NAME}=${nextLocale};path=/;SameSite=lax`;
}
