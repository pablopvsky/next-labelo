import { setRequestLocale } from "next-intl/server";

import { HomeHeader } from "@/components/HomeHeader";
import { LandingCta } from "@/components/landing/LandingCta";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingPillars } from "@/components/landing/LandingPillars";
import { LandingStatement } from "@/components/landing/LandingStatement";
import { LandingSteps } from "@/components/landing/LandingSteps";
import { Separator } from "@/components/ui/Separator";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-gray-1 text-gray-12 selection:bg-accent-5 selection:text-accent-12">
      <HomeHeader />
      <main id="main-content">
        <LandingHero />
        <LandingStatement />
        <LandingPillars />
        <LandingSteps />
        <LandingCta />
      </main>
      <footer className="bg-gray-1">
        <Separator />
        <div className="smush flex h-4 items-center px-2">
          <p className="text-xs text-gray-11">Labelo</p>
        </div>
      </footer>
    </div>
  );
}
