"use client";

import { CheckIcon } from "@radix-ui/react-icons";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { updateAccountLocale } from "@/app/dashboard/actions";
import {
  Select,
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "@/components/ui/Select";
import { routing, type AppLocale } from "@/i18n/routing";
import { setLocaleCookieClient } from "@/lib/i18n/setLocaleCookieClient";

const LOCALE_LABEL_KEY: Record<AppLocale, "enUS" | "esCO"> = {
  "en-US": "enUS",
  "es-CO": "esCO",
};

type AccountLocaleSelectProps = {
  disabled?: boolean;
};

export function AccountLocaleSelect({ disabled }: AccountLocaleSelectProps) {
  const pageLocale = useLocale() as AppLocale;
  const t = useTranslations("language");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onValueChange(nextLocale: string) {
    const locale = nextLocale as AppLocale;
    if (locale === pageLocale || isPending) {
      return;
    }

    startTransition(async () => {
      const result = await updateAccountLocale(locale);
      if (!result.ok) {
        console.error("[account] Failed to update locale", result.error);
        return;
      }

      setLocaleCookieClient(locale);
      router.refresh();
    });
  }

  return (
    <Select
      value={pageLocale}
      onValueChange={onValueChange}
      disabled={disabled || isPending}
    >
      <SelectTrigger aria-label={t("label")} className="h-4">
        <span className="flex min-w-0 flex-1 items-center gap-0.5">
          <CheckIcon className="icon shrink-0 text-gray-11" aria-hidden />
          <SelectValue />
        </span>
        <SelectIcon />
      </SelectTrigger>
      <SelectContent position="popper" sideOffset={6}>
        <SelectViewport>
          {routing.locales.map((locale) => (
            <SelectItem key={locale} value={locale} className="pl-3">
              <SelectItemIndicator />
              <SelectItemText>{t(LOCALE_LABEL_KEY[locale])}</SelectItemText>
            </SelectItem>
          ))}
        </SelectViewport>
      </SelectContent>
    </Select>
  );
}
