import path from "node:path";
import { defineConfig, env } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: path.resolve(path.join("prisma", "schema")),
  migrations: {
    path: path.resolve(path.join("prisma", "migrations")),
  },
  datasource: {
    url: env("DATABASE_URL"),
    // shadowDatabaseUrl: undefined,
  },
  // tables: {},
});
