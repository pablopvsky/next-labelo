import { handleAuth } from "@workos-inc/authkit-nextjs";
import { NextResponse } from "next/server";

import { syncWorkOSUserSafe } from "@/lib/users/syncWorkOSUser";

export const GET = handleAuth({
  returnPathname: "/onboarding",
  onSuccess: async ({ user }) => {
    await syncWorkOSUserSafe(user);
  },
  onError: async ({ error }) => {
    const message = error instanceof Error ? error.message : String(error ?? "");
    // Common misconfig after moving Labelo into Famity Care AuthKit:
    // WORKOS_CLIENT_ID is Famity Labelo, but WORKOS_API_KEY is still from Garitma.
    console.error("[auth/callback] Sign-in failed", {
      message,
      clientIdPrefix: process.env.WORKOS_CLIENT_ID?.slice(0, 18) ?? null,
      hasApiKey: Boolean(process.env.WORKOS_API_KEY?.trim()),
      redirectUri: process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI ?? null,
    });

    const hint =
      /invalid|unauthorized|client|api.?key|forbidden/i.test(message)
        ? " WorkOS credentials may not match (use Famity Care Production API key with the Labelo client ID)."
        : "";

    return NextResponse.json(
      {
        error: {
          message: "Something went wrong",
          description: `Couldn't sign in.${hint} If you are not sure what happened, please contact your organization admin.`,
        },
      },
      { status: 500 },
    );
  },
});
