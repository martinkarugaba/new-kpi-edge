import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Configure Neon database connection cache for better performance
neonConfig.fetchConnectionCache = true;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Configure the Neon client with proper Next.js cache settings
const sql = neon(process.env.DATABASE_URL, {
  fetchOptions: {
    cache: "no-store",
  },
});

// Create the drizzle instance with schema
export const db = drizzle(sql, {
  schema,
  // Add logger for debugging only in development
  logger:
    process.env.NODE_ENV === "development"
      ? {
          logQuery: (query, params) => {
            console.log("Query:", query);
            console.log("Params:", params);
          },
        }
      : undefined,
});
