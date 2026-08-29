import { getTranslations } from "next-intl/server";

import { AccountProfileCard } from "@/components/dashboard/AccountProfileCard";
import { getAccountProfileData } from "@/lib/users/getAccountProfileData";

export default async function ProfilePage() {
  const t = await getTranslations("profile");
  const { workosUser, dbUser } = await getAccountProfileData();

  return (
    <section className="mx-auto flex w-full max-w-lg flex-col gap-2">
      <div>
        <h1 className="h4 text-gray-12">{t("title")}</h1>
        <p className="text-sm text-gray-11 mt-0.5">{t("description")}</p>
      </div>

      <AccountProfileCard
        workosUser={workosUser}
        dbUser={dbUser}
        labels={{
          profileType: t("profileType"),
          email: t("email"),
          lastSignIn: t("lastSignIn"),
          displayName: t("displayName"),
          userId: t("userId"),
          memberSince: t("memberSince"),
          verified: t("verified"),
          notVerified: t("notVerified"),
          notSyncedYet: t("notSyncedYet"),
          syncFooterLabel: t("syncFooterLabel"),
          refreshHint: t("refreshHint"),
        }}
      />
    </section>
  );
}
