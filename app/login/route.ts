import { getSignInUrl, withAuth } from "@workos-inc/authkit-nextjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getWorkOSRedirectUri } from "@/lib/auth/workosRedirectUri";

export const GET = async () => {
  const { user } = await withAuth();
  if (user) {
    redirect("/dashboard");
  }

  const headerStore = await headers();
  const redirectUri =
    headerStore.get("x-redirect-uri") ??
    getWorkOSRedirectUri(headerStore.get("x-url") ?? undefined);

  const signInUrl = await getSignInUrl({
    returnTo: "/dashboard",
    redirectUri,
  });

  return redirect(signInUrl);
};
