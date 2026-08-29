const CALLBACK_PATH = "/callback";

/**
 * Resolve the WorkOS AuthKit redirect URI for the current deployment.
 * Prefer an explicit public env var, then the request origin (so www vs apex
 * stay correct), then Vercel production host, then localhost.
 */
export function getWorkOSRedirectUri(requestUrl?: string | URL): string {
  const configured = process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI?.trim();
  if (configured && isAbsoluteHttpUrl(configured)) {
    return configured;
  }

  const fromRequest = originFromRequest(requestUrl);
  if (fromRequest) {
    return `${fromRequest}${CALLBACK_PATH}`;
  }

  if (process.env.VERCEL_ENV === "production") {
    const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
    if (productionHost) {
      const host = productionHost.replace(/^https?:\/\//, "");
      return `https://${host}${CALLBACK_PATH}`;
    }
  }

  if (process.env.VERCEL_ENV === "preview") {
    const vercelHost = process.env.VERCEL_URL?.trim();
    if (vercelHost) {
      return `https://${vercelHost}${CALLBACK_PATH}`;
    }
  }

  return `http://localhost:3000${CALLBACK_PATH}`;
}

function isAbsoluteHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
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
