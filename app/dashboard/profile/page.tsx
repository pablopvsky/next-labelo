import { getTranslations } from "next-intl/server";

import { AccountMcpTokensCard } from "@/components/dashboard/AccountMcpTokensCard";
import { AccountProfileCard } from "@/components/dashboard/AccountProfileCard";
import { getAccountProfileData } from "@/lib/users/getAccountProfileData";

export default async function ProfilePage() {
  const t = await getTranslations("profile");
  const { workosUser, dbUser, mcp } = await getAccountProfileData();

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

      <AccountMcpTokensCard
        pepperConfigured={mcp.pepperConfigured}
        tokens={mcp.tokens}
        mcpEndpoint={mcp.endpoint}
        labels={{
          title: t("mcp.title"),
          description: t("mcp.description"),
          pepperMissing: t("mcp.pepperMissing"),
          nameLabel: t("mcp.nameLabel"),
          namePlaceholder: t("mcp.namePlaceholder"),
          generate: t("mcp.generate"),
          generating: t("mcp.generating"),
          copyOnceTitle: t("mcp.copyOnceTitle"),
          copyOnceDescription: t("mcp.copyOnceDescription"),
          copy: t("mcp.copy"),
          copied: t("mcp.copied"),
          empty: t("mcp.empty"),
          created: t("mcp.created"),
          lastUsed: t("mcp.lastUsed"),
          neverUsed: t("mcp.neverUsed"),
          revoke: t("mcp.revoke"),
          revoking: t("mcp.revoking"),
          nameRequired: t("mcp.nameRequired"),
          endpointHint: t("mcp.endpointHint"),
        }}
      />
    </section>
  );
}
