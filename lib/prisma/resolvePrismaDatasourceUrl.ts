/**
 * Prefer a direct (unpooled) URL for Prisma CLI migrations, and ensure a
 * generous connect_timeout so serverless / Prisma Postgres cold starts do not
 * fail with P1001 before the instance accepts TCP.
 */
export function resolvePrismaDatasourceUrl(
  env: NodeJS.ProcessEnv = process.env,
): string | undefined {
  const raw =
    env.DIRECT_URL?.trim() ||
    env.DATABASE_URL_UNPOOLED?.trim() ||
    env.PRISMA_DATABASE_URL?.trim() ||
    env.DATABASE_URL?.trim();

  if (!raw) {
    return undefined;
  }

  try {
    const url = new URL(raw);
    if (!url.searchParams.has("connect_timeout")) {
      url.searchParams.set("connect_timeout", "30");
    }
    if (
      (url.hostname === "db.prisma.io" ||
        url.hostname.endsWith(".db.prisma.io") ||
        url.hostname.includes("prisma.io")) &&
      !url.searchParams.has("sslmode")
    ) {
      url.searchParams.set("sslmode", "require");
    }
    return url.toString();
  } catch {
    return raw;
  }
}
