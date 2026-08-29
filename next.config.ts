import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/**
 * On Vercel preview, bake the deployment callback into
 * NEXT_PUBLIC_WORKOS_REDIRECT_URI so AuthKit fallbacks match this host.
 */
const previewRedirectUri =
  process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/callback`
    : undefined;

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  ...(previewRedirectUri
    ? { env: { NEXT_PUBLIC_WORKOS_REDIRECT_URI: previewRedirectUri } }
    : {}),
};

export default withNextIntl(nextConfig);
