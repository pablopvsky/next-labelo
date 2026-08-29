"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

/** Keeps `<html lang>` in sync when soft-navigating between locales. */
export function DocumentLocale() {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
