#!/usr/bin/env node
/**
 * Verifies WORKOS_API_KEY can call the API for WORKOS_CLIENT_ID's environment.
 * Run: pnpm exec tsx scripts/check-workos-auth.ts
 */
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

function loadEnvFile(path: string): void {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf-8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq <= 0) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}

const root = process.cwd();
loadEnvFile(resolve(root, ".env"));
loadEnvFile(resolve(root, ".env.local"));

const clientId = process.env.WORKOS_CLIENT_ID?.trim();
const apiKey = process.env.WORKOS_API_KEY?.trim();

const FAMITY_LABELO_CLIENT = "client_01M3DBK65HSCPHK227D836ENNP";
const FAMITY_DEFAULT_CLIENT = "client_01K9J84BNX4JC8CM3F27RA5ZFX";
const GARITMA_LABELO_CLIENT = "client_01M173R5Z35SDVPH3D5XSEEYZ8";

async function main() {
  if (!clientId || !apiKey) {
    console.error(
      "Missing WORKOS_CLIENT_ID or WORKOS_API_KEY (check .env.local or Vercel env).",
    );
    process.exit(1);
  }

  console.log(`WORKOS_CLIENT_ID=${clientId}`);
  if (clientId === FAMITY_LABELO_CLIENT) {
    console.log("→ Famity Care Production · Labelo AuthKit app");
  } else if (clientId === FAMITY_DEFAULT_CLIENT) {
    console.log("→ Famity Care Production · Famity default AuthKit app");
  } else if (clientId === GARITMA_LABELO_CLIENT) {
    console.warn(
      "→ Garitma Production · Labelo app (NOT Famity). Login will not share Famity users.",
    );
  } else {
    console.log("→ Unknown client ID (verify in WorkOS dashboard)");
  }

  const res = await fetch(
    `https://api.workos.com/user_management/users?limit=1`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    const body = await res.text();
    console.error(`API key check failed (${res.status}): ${body.slice(0, 300)}`);
    console.error(
      "Create/rotate an API key in Famity Care Production and set WORKOS_API_KEY in Vercel.",
    );
    process.exit(1);
  }

  console.log("API key is valid for this WorkOS environment.");
  console.log(
    "If Production login still fails after AuthKit, confirm Vercel Production uses this same CLIENT_ID + API key pair.",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
