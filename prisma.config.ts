import { config as loadEnv } from "dotenv";
import { resolve } from "node:path";
import { defineConfig } from "prisma/config";

import { resolvePrismaDatasourceUrl } from "./lib/prisma/resolvePrismaDatasourceUrl";

const root = process.cwd();

loadEnv({ path: resolve(root, ".env"), quiet: true });
loadEnv({ path: resolve(root, ".env.local"), override: true, quiet: true });
loadEnv({
  path: resolve(root, ".env.development.local"),
  override: true,
  quiet: true,
});

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: resolvePrismaDatasourceUrl(),
  },
});
