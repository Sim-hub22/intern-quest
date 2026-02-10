import { env } from "@/env";
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import ws from "ws";

import * as schema from "./schema";

neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true;

const sql = neon(env.DATABASE_URL);
// Note: neon-http driver does not support interactive transactions (db.transaction(...))
// If transactions are needed, use the neon-serverless WebSocket driver instead
export const db = drizzle(sql, { schema });
