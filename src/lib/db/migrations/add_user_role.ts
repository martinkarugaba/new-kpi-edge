import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

export async function addUserRole() {
  try {
    // First, create a new enum type with the additional value
    await db.execute(sql`
      CREATE TYPE user_role_new AS ENUM (
        'super_admin',
        'cluster_manager',
        'organization_admin',
        'organization_member',
        'user'
      );
    `);

    // Update the column to use the new enum type
    await db.execute(sql`
      ALTER TABLE users 
      ALTER COLUMN role TYPE user_role_new 
      USING role::text::user_role_new;
    `);

    // Drop the old enum type
    await db.execute(sql`
      DROP TYPE user_role;
    `);

    // Rename the new enum type to the original name
    await db.execute(sql`
      ALTER TYPE user_role_new RENAME TO user_role;
    `);

    // Update the default value for new users
    await db.execute(sql`
      ALTER TABLE users 
      ALTER COLUMN role SET DEFAULT 'user';
    `);

    console.log("Successfully added 'user' role to userRole enum");
    return { success: true };
  } catch (error) {
    console.error("Error adding 'user' role to userRole enum:", error);
    return { success: false, error };
  }
}
