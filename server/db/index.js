import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;

let db = null;
let sqlClient = null;

if (connectionString && !connectionString.includes('REPLACE_WITH_PASSWORD') && !connectionString.includes('[YOUR-PASSWORD]')) {
  try {
    // Disable prefetch/prepare for Supabase Transaction Pooler compatibility (port 6543)
    sqlClient = postgres(connectionString, { prepare: false, max: 10 });
    db = drizzle(sqlClient, { schema });
    console.log('⚡ [DB] Connected to Supabase PostgreSQL Cluster via Transaction Pooler');
  } catch (err) {
    console.warn('⚠️ [DB] PostgreSQL Connection failed, operating in fallback store mode:', err.message);
  }
} else {
  console.log('ℹ️ [DB] Running with local persistent memory store (Set valid DATABASE_URL in server/.env to enable live Supabase Postgres)');
}

export { db, sqlClient, schema };
export default db;
