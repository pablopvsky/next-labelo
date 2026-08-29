import {
  authkit,
  applyResponseHeaders,
  handleAuthkitHeaders,
  partitionAuthkitHeaders,
} from "@workos-inc/authkit-nextjs";
import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { getWorkOSRedirectUri } from "@/lib/auth/workosRedirectUri";
import {
  getPathWithoutLocale,
  isLocaleFreeRoute,
} from "@/lib/i18n/pathname";

import { routing } from "./i18n/routing";

const handleI18nRouting = createIntlMiddleware(routing);

function authkitOptions(request: NextRequest) {
  return { redirectUri: getWorkOSRedirectUri(request.url) };
}

function isAuthOrApiRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/api") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/callback")
  );
}

function isWorkOSConfigured(): boolean {
  const apiKey = process.env.WORKOS_API_KEY?.trim();
  const clientId = process.env.WORKOS_CLIENT_ID?.trim();
  const cookiePassword = process.env.WORKOS_COOKIE_PASSWORD?.trim();
  return Boolean(
    (apiKey || clientId) &&
      cookiePassword &&
      cookiePassword.length >= 32,
  );
}

async function safeAuthkit(request: NextRequest) {
  if (!isWorkOSConfigured()) {
    console.error(
      "[proxy] WorkOS env incomplete. Set WORKOS_API_KEY (or WORKOS_CLIENT_ID), WORKOS_COOKIE_PASSWORD (≥32), and NEXT_PUBLIC_WORKOS_REDIRECT_URI.",
    );
    return null;
  }

  try {
    return await authkit(request, authkitOptions(request));
  } catch (error) {
    console.error("[proxy] authkit failed", error);
    return null;
  }
}

function continueWithIntl(
  request: NextRequest,
  authkitHeaders?: Headers,
) {
  if (!authkitHeaders) {
    return handleI18nRouting(request);
  }

  const { requestHeaders, responseHeaders } = partitionAuthkitHeaders(
    request,
    authkitHeaders,
  );

  // Clone the request with AuthKit headers — avoid mutating request.headers.
  const requestForIntl = new NextRequest(request, {
    headers: requestHeaders,
  });

  const intlResponse = handleI18nRouting(requestForIntl);
  return applyResponseHeaders(intlResponse, responseHeaders);
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAuthOrApiRoute(pathname)) {
    const result = await safeAuthkit(request);

    if (!result) {
      if (pathname.startsWith("/login")) {
        return NextResponse.json(
          {
            error:
              "Authentication is not configured. Set WorkOS environment variables in Vercel Production.",
          },
          { status: 503 },
        );
      }
      return NextResponse.next();
    }

    const { session, headers: authkitHeaders } = result;

    if (pathname.startsWith("/login") && session.user) {
      return handleAuthkitHeaders(request, authkitHeaders, {
        redirect: "/onboarding",
      });
    }

    return handleAuthkitHeaders(request, authkitHeaders);
  }

  if (isLocaleFreeRoute(pathname)) {
    const pathWithoutLocale = getPathWithoutLocale(pathname);

    if (pathWithoutLocale !== pathname) {
      const url = request.nextUrl.clone();
      url.pathname = pathWithoutLocale;
      return NextResponse.redirect(url);
    }

    const result = await safeAuthkit(request);

    if (!result?.session.user) {
      if (result) {
        return handleAuthkitHeaders(request, result.headers, {
          redirect: "/login",
        });
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return handleAuthkitHeaders(request, result.headers);
  }

  const result = await safeAuthkit(request);

  if (result?.session.user && getPathWithoutLocale(pathname) === "/") {
    return handleAuthkitHeaders(request, result.headers, {
      redirect: "/onboarding",
    });
  }

  return continueWithIntl(request, result?.headers);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
