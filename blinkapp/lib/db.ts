import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "./env";
import * as schema from "./schema";

export function createDbClient() {
  if (!env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is required for database access");
  }

  const client = postgres(env.POSTGRES_URL);
  return drizzle(client, { schema });
}
