import { setRequestLocale } from "next-intl/server";

import { HomeHeader } from "@/components/HomeHeader";
import { LandingCta } from "@/components/landing/LandingCta";
import { LandingFlow } from "@/components/landing/LandingFlow";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingLabels } from "@/components/landing/LandingLabels";

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
        <LandingFlow />
        <LandingLabels />
        <LandingCta />
      </main>
      <footer className="border-t border-gray-6 bg-gray-1">
        <div className="smush flex h-[52px] items-center px-2">
          <p className="text-xs text-gray-11">Labelo</p>
        </div>
      </footer>
    </div>
  );
}
