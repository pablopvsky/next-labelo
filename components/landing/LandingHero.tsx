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
      className="relative isolate min-h-svh overflow-hidden bg-gray-3"
      aria-labelledby="landing-brand"
    >
      <div className="absolute inset-0 landing-hero-media">
        <Image
          src="/generated/landing/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-gray-1 via-gray-1/75 to-transparent sm:from-gray-1/95 sm:via-gray-1/35 sm:to-transparent"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-gray-1 via-transparent to-gray-1/20"
          aria-hidden
        />
      </div>

      <div className="relative z-10 flex min-h-svh flex-col">
        <div className="flex flex-1 flex-col justify-end pb-4 pt-6 sm:justify-center sm:pb-6 sm:pt-7">
          <div className="smush w-full px-2">
            <div className="flex max-w-md flex-col gap-1.5">
              <p className="landing-rise landing-kicker text-accent-11" aria-hidden>
                {t("verticalTag")}
              </p>
              <h1
                id="landing-brand"
                className="landing-rise h1 font-semibold tracking-tight text-gray-12"
              >
                {t("brand")}
              </h1>
              <p
                className="landing-rise h3 max-w-xs text-balance font-medium tracking-tight text-gray-12"
                data-delay="1"
              >
                {t("headline")}
              </p>
              <p
                className="landing-rise max-w-sm text-balance text-gray-11"
                data-delay="2"
              >
                {t("description")}
              </p>
              <div
                className="landing-rise mt-1 flex flex-wrap items-center gap-1"
                data-delay="3"
              >
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
