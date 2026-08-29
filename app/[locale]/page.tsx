import { setRequestLocale } from "next-intl/server";

import { HomeBanner } from "@/components/HomeBanner";
import { HomeHeader } from "@/components/HomeHeader";

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
        <HomeBanner />
      </main>
    </div>
  );
}
