import { setRequestLocale } from "next-intl/server";

import { HomeHeader } from "@/components/HomeHeader";
import { LandingCta } from "@/components/landing/LandingCta";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingPillars } from "@/components/landing/LandingPillars";
import { LandingStatement } from "@/components/landing/LandingStatement";
import { LandingSteps } from "@/components/landing/LandingSteps";

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
      <main id="main-content" className="landing-diagram pt-4">
        <LandingHero />
        <LandingSteps />
        <LandingPillars />
        <LandingStatement />
        <LandingCta />
      </main>
      <footer className="bg-gray-12 text-gray-1">
        <div className="smush flex h-4 items-center justify-between gap-2 px-2">
          <p className="text-xs text-gray-8">Labelo</p>
          <p className="text-xs text-gray-8">Project · Rail · Label</p>
        </div>
      </footer>
    </div>
  );
}
