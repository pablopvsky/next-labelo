const CALLBACK_PATH = "/callback";

/**
 * Resolve the WorkOS AuthKit redirect URI for the current deployment.
 */
export function getWorkOSRedirectUri(requestUrl?: string | URL): string {
  const configured = process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI?.trim();

  if (process.env.VERCEL_ENV === "production") {
    if (configured) return configured;
    const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
    if (productionHost) {
      return `https://${productionHost}${CALLBACK_PATH}`;
    }
    return configured ?? "";
  }

  if (process.env.VERCEL_ENV === "preview") {
    const fromRequest = originFromRequest(requestUrl);
    if (fromRequest) {
      return `${fromRequest}${CALLBACK_PATH}`;
    }

    const vercelHost = process.env.VERCEL_URL?.trim();
    if (vercelHost) {
      return `https://${vercelHost}${CALLBACK_PATH}`;
    }
  }

  if (configured) return configured;

  return `http://localhost:3000${CALLBACK_PATH}`;
}

function originFromRequest(requestUrl?: string | URL): string | null {
  if (!requestUrl) return null;
  try {
    const url =
      typeof requestUrl === "string" ? new URL(requestUrl) : requestUrl;
    if (url.protocol === "https:" || url.protocol === "http:") {
      return url.origin;
    }
  } catch {
    return null;
  }
  return null;
}
