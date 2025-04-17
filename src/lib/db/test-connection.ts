import { db } from "./index";
import { sql } from "drizzle-orm";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function testConnection() {
  try {
    console.log("Testing database connection...");
    console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Not set");
    const result = await db.execute(sql`SELECT 1 as test`);
    console.log("Connection successful:", result);
    return true;
  } catch (error) {
    console.error("Connection failed:", error);
    return false;
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testConnection()
    .then((success) => {
      if (success) {
        console.log("Database connection test passed");
        process.exit(0);
      } else {
        console.error("Database connection test failed");
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("Test failed with error:", error);
      process.exit(1);
    });
}

export { testConnection };
