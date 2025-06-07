import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Ensure this code only runs on the server
if (typeof window === "undefined") {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
}

// Configure the Neon client with proper fetch options for Edge compatibility
const sql = neon(process.env.DATABASE_URL!, {
  fetchOptions: {
    cache: "no-store",
    keepalive: true,
    retry: 3,
  },
});

// Create the drizzle instance with schema
export const db = drizzle(sql, {
  schema,
  logger: process.env.NODE_ENV === "development",
});
