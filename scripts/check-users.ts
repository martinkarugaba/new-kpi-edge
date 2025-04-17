import { config } from "dotenv";
import * as path from "path";

// Load environment variables before any other imports
const result = config({ path: path.resolve(process.cwd(), ".env") });

console.log("Environment loading result:", result);
console.log("DATABASE_URL:", process.env.DATABASE_URL);

import { db } from "../src/lib/db";
import {
  users,
  organizationMembers,
  organizations,
} from "../src/lib/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("Checking users in the database...");

  try {
    const allUsers = await db.select().from(users);

    if (allUsers.length === 0) {
      console.log("No users found in the database.");
    } else {
      console.log(`Found ${allUsers.length} users:`);
      for (const user of allUsers) {
        console.log(`- ${user.email} (${user.role})`);

        // Check organization memberships for this user
        const memberships = await db
          .select()
          .from(organizationMembers)
          .where(eq(organizationMembers.user_id, user.id));

        if (memberships.length === 0) {
          console.log(`  No organization memberships found for ${user.email}`);
        } else {
          console.log(`  Organization memberships for ${user.email}:`);
          for (const membership of memberships) {
            console.log(
              `  - Organization ID: ${membership.organization_id}, Role: ${membership.role}`,
            );

            // Get organization details
            const [organization] = await db
              .select()
              .from(organizations)
              .where(eq(organizations.id, membership.organization_id));

            if (organization) {
              console.log(`    Organization details:`);
              console.log(`    - Name: ${organization.name}`);
              console.log(`    - Acronym: ${organization.acronym}`);
              console.log(`    - Country: ${organization.country}`);
              console.log(`    - District: ${organization.district}`);
            } else {
              console.log(`    Organization not found in database`);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error checking users:", error);
    process.exit(1);
  }
}

main();
