import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import * as schema from "./schema";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";

export const db = drizzle(sql, { schema });

export const adapter = new DrizzlePostgreSQLAdapter(
  db,
  schema.sessions,
  schema.users,
);
