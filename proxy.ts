import {
  AUTHKIT_REQUEST_HEADERS,
  authkit,
  applyResponseHeaders,
  handleAuthkitHeaders,
  isAuthkitRequestHeader,
  partitionAuthkitHeaders,
} from "@workos-inc/authkit-nextjs";
import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";

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

function applyAuthkitRequestHeaders(
  request: NextRequest,
  requestHeaders: Headers,
) {
  for (const name of [...request.headers.keys()]) {
    if (isAuthkitRequestHeader(name)) {
      request.headers.delete(name);
    }
  }

  for (const headerName of AUTHKIT_REQUEST_HEADERS) {
    const value = requestHeaders.get(headerName);
    if (value != null) {
      request.headers.set(headerName, value);
    }
  }
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAuthOrApiRoute(pathname)) {
    const { session, headers: authkitHeaders } = await authkit(
      request,
      authkitOptions(request),
    );

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

    const { session, headers: authkitHeaders } = await authkit(
      request,
      authkitOptions(request),
    );

    if (!session.user) {
      return handleAuthkitHeaders(request, authkitHeaders, {
        redirect: "/login",
      });
    }

    return handleAuthkitHeaders(request, authkitHeaders);
  }

  const { session, headers: authkitHeaders } = await authkit(
    request,
    authkitOptions(request),
  );

  if (session.user && getPathWithoutLocale(pathname) === "/") {
    return handleAuthkitHeaders(request, authkitHeaders, {
      redirect: "/onboarding",
    });
  }

  const { requestHeaders, responseHeaders } = partitionAuthkitHeaders(
    request,
    requestHeaders,
  );

  applyAuthkitRequestHeaders(request, requestHeaders);

  const intlResponse = handleI18nRouting(request);
  return applyResponseHeaders(intlResponse, responseHeaders);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
