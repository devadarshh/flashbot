import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
const usesSupabase =
  connectionString?.includes("supabase.co") ||
  connectionString?.includes("pooler.supabase.com");

const pool = new Pool({
  connectionString,
  ssl: usesSupabase ? { rejectUnauthorized: false } : undefined,
});

export const db = drizzle(pool, { schema });
