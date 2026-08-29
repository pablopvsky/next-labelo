import { withAuth } from "@workos-inc/authkit-nextjs";
import { getLocale, setRequestLocale } from "next-intl/server";

import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { redirectIfOnboarded } from "@/lib/teams/actions";

export default async function OnboardingPage() {
  await withAuth({ ensureSignedIn: true });
  const locale = await getLocale();
  setRequestLocale(locale);
  await redirectIfOnboarded();

  return (
    <main className="min-h-screen bg-gray-1">
      <OnboardingFlow />
    </main>
  );
}
