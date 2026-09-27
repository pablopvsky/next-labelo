"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useAuth } from "@workos-inc/authkit-nextjs/components";

import Button from "@/components/ui/Button";

export function LandingHero() {
  const t = useTranslations("home");
  const tHeader = useTranslations("header");
  const { user } = useAuth();

  return (
    <section
      className="relative isolate min-h-[100svh] overflow-hidden bg-gray-3"
      aria-labelledby="landing-brand"
    >
      <div className="absolute inset-0 landing-hero-media">
        <Image
          src="/generated/landing/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[78%_48%] sm:object-[70%_42%]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-gray-1/95 via-gray-1/55 to-transparent sm:from-gray-1/90 sm:via-gray-1/35"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-gray-1/80 via-transparent to-gray-1/30"
          aria-hidden
        />
      </div>

      <div className="relative z-10 flex min-h-[100svh] flex-col">
        <div className="flex flex-1 flex-col justify-end pb-4 pt-[78px] sm:justify-center sm:pb-6 sm:pt-[91px]">
          <div className="mx-auto w-full max-w-[1032px] px-2">
            <div className="landing-rise flex max-w-[min(100%,28rem)] flex-col gap-1.5 sm:max-w-[min(100%,34rem)]">
              <h1
                id="landing-brand"
                className="h1 font-semibold tracking-tight text-gray-12"
              >
                {t("brand")}
              </h1>
              <p className="h3 max-w-[22ch] text-balance font-medium tracking-tight text-gray-12">
                {t("headline")}
              </p>
              <p className="max-w-[36ch] text-balance text-gray-11">
                {t("description")}
              </p>
              <div className="mt-0.5 flex flex-wrap items-center gap-1">
                <Button asChild size="lg">
                  <a href={user ? "/dashboard" : "/login"}>
                    {user ? tHeader("dashboard") : t("ctaPrimary")}
                  </a>
                </Button>
                <Button asChild variant="pill" size="lg">
                  <a href="#how-it-works">{t("ctaSecondary")}</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
