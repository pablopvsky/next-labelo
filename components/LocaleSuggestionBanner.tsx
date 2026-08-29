"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";

import { getPathname, usePathname } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { setLocaleCookieClient } from "@/lib/i18n/setLocaleCookieClient";
import { getPathWithoutLocale } from "@/lib/i18n/pathname";
import { matchBrowserLocale } from "@/lib/i18n/matchBrowserLocale";
import Button from "@/components/ui/Button";
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
import enMessages from "@/messages/en-US.json";
import esMessages from "@/messages/es-CO.json";

const DISMISS_KEY = "labelo-locale-banner-dismissed";

const BANNER_COPY = {
  "en-US": enMessages.localeBanner,
  "es-CO": esMessages.localeBanner,
} as const;

/**
 * Apple-style locale suggestion: shown only when the browser language
 * differs from the current page locale. Not a persistent header control.
 */
export function LocaleSuggestionBanner() {
  const pageLocale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedLocale, setSelectedLocale] = useState<AppLocale | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      if (sessionStorage.getItem(DISMISS_KEY) === "1") {
        setVisible(false);
        return;
      }
    } catch {
      // sessionStorage may be unavailable
    }

    const suggested = matchBrowserLocale(
      navigator.languages ?? [navigator.language],
    );
    if (!suggested || suggested === pageLocale) {
      setVisible(false);
      return;
    }

    setSelectedLocale(suggested);
    setVisible(true);
  }, [pageLocale]);

  const copy = useMemo(() => {
    const locale = selectedLocale ?? pageLocale;
    return BANNER_COPY[locale];
  }, [pageLocale, selectedLocale]);

  function dismiss() {
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  function continueToLocale() {
    if (!selectedLocale || selectedLocale === pageLocale || isPending) {
      dismiss();
      return;
    }

    const href = getPathname({
      locale: selectedLocale,
      href: getPathWithoutLocale(pathname),
    });

    setLocaleCookieClient(selectedLocale);
    setVisible(false);

    startTransition(() => {
      router.replace(href);
      router.refresh();
    });
  }

  if (!visible || !selectedLocale) {
    return null;
  }

  return (
    <div
      className="border-b border-gray-6 bg-gray-3 text-gray-12"
      role="region"
      aria-label={copy.selectLabel}
    >
      <div className="smush py-1.5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-center sm:gap-1.5">
          <p className="text-sm text-gray-12 text-center sm:text-left sm:max-w-[28rem]">
            {copy.message}
          </p>

          <div className="flex items-center justify-center gap-1">
            <Select
              value={selectedLocale}
              onValueChange={(value) => setSelectedLocale(value as AppLocale)}
            >
              <SelectTrigger
                aria-label={copy.selectLabel}
                className="h-3 min-w-[12rem] max-w-[16rem]"
              >
                <span className="flex min-w-0 flex-1 items-center gap-0.5">
                  <CheckIcon
                    className="icon shrink-0 text-gray-12"
                    aria-hidden
                  />
                  <SelectValue />
                </span>
                <SelectIcon />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={6}>
                <SelectViewport>
                  {routing.locales.map((locale) => (
                    <SelectItem key={locale} value={locale} className="pl-3">
                      <SelectItemIndicator />
                      <SelectItemText>{copy.regions[locale]}</SelectItemText>
                    </SelectItem>
                  ))}
                </SelectViewport>
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant="fill"
              size="sm"
              disabled={isPending}
              onClick={continueToLocale}
            >
              {copy.continue}
            </Button>

            <Button
              type="button"
              variant="link"
              size="icon"
              aria-label={copy.dismiss}
              disabled={isPending}
              onClick={dismiss}
            >
              <Cross2Icon className="icon" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
