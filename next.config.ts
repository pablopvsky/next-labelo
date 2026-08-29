import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/**
 * On Vercel, bake the deployment callback into NEXT_PUBLIC_WORKOS_REDIRECT_URI
 * when the public env var is unset so AuthKit fallbacks match this host.
 */
const resolvedRedirectUri = (() => {
  const configured = process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI?.trim();
  if (configured) return configured;

  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/callback`;
  }

  if (
    process.env.VERCEL_ENV === "production" &&
    process.env.VERCEL_PROJECT_PRODUCTION_URL
  ) {
    const host = process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(
      /^https?:\/\//,
      "",
    );
    return `https://${host}/callback`;
  }

  return undefined;
})();

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  ...(resolvedRedirectUri
    ? { env: { NEXT_PUBLIC_WORKOS_REDIRECT_URI: resolvedRedirectUri } }
    : {}),
};

export default withNextIntl(nextConfig);
