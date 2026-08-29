import { config as loadEnv } from "dotenv";
import { resolve } from "node:path";
import { spawn } from "node:child_process";

import { resolvePrismaDatasourceUrl } from "../lib/prisma/resolvePrismaDatasourceUrl";

const root = process.cwd();
loadEnv({ path: resolve(root, ".env"), quiet: true });
loadEnv({ path: resolve(root, ".env.local"), override: true, quiet: true });
loadEnv({
  path: resolve(root, ".env.development.local"),
  override: true,
  quiet: true,
});

const MAX_ATTEMPTS = 3;
const BACKOFF_MS = [2_000, 5_000, 10_000];

function sleep(ms: number) {
  return new Promise<void>((resolveSleep) => {
    setTimeout(resolveSleep, ms);
  });
}

function runMigrateDeploy(env: NodeJS.ProcessEnv) {
  return new Promise<number>((resolveStatus) => {
    const child = spawn("pnpm", ["exec", "prisma", "migrate", "deploy"], {
      cwd: root,
      env,
      stdio: "inherit",
    });
    child.on("error", (error) => {
      console.error("[migrate-deploy] failed to spawn prisma", error);
      resolveStatus(1);
    });
    child.on("close", (code) => {
      resolveStatus(code ?? 1);
    });
  });
}

async function main() {
  const datasourceUrl = resolvePrismaDatasourceUrl();
  if (!datasourceUrl) {
    console.error(
      "[migrate-deploy] DATABASE_URL (or DIRECT_URL / PRISMA_DATABASE_URL) is not set.",
    );
    process.exit(1);
  }

  const env: NodeJS.ProcessEnv = {
    ...process.env,
    DATABASE_URL: datasourceUrl,
    DIRECT_URL: process.env.DIRECT_URL?.trim() || datasourceUrl,
  };

  let lastStatus = 1;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    console.log(
      `[migrate-deploy] prisma migrate deploy (attempt ${attempt}/${MAX_ATTEMPTS})`,
    );

    lastStatus = await runMigrateDeploy(env);
    if (lastStatus === 0) {
      process.exit(0);
    }

    if (attempt < MAX_ATTEMPTS) {
      const wait = BACKOFF_MS[attempt - 1] ?? 10_000;
      console.warn(
        `[migrate-deploy] migrate failed (exit ${lastStatus}); retrying in ${wait}ms…`,
      );
      await sleep(wait);
    }
  }

  console.error(
    "[migrate-deploy] prisma migrate deploy failed after retries.",
  );
  process.exit(lastStatus || 1);
}

void main();
