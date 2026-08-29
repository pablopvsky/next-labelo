import { getTranslations } from "next-intl/server";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");

  return (
    <div className="rounded-lg border border-gray-6 bg-gray-2 p-4">
      <p className="text-gray-11">{t("welcome")}</p>
    </div>
  );
}
