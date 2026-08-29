const LOCALE_PREFIX_PATTERN = /^\/(en-US|es-CO)(?=\/|$)/;

export function getPathWithoutLocale(pathname: string): string {
  const withoutLocale = pathname.replace(LOCALE_PREFIX_PATTERN, "");
  return withoutLocale === "" ? "/" : withoutLocale;
}

export function isLocaleFreeRoute(pathname: string): boolean {
  const path = getPathWithoutLocale(pathname);
  return path.startsWith("/dashboard");
}
