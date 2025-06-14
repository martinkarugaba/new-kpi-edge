import { addUserRole } from "./migrations/add_user_role";

async function main() {
  console.log("Starting database migration...");

  // Add user role to enum
  const result = await addUserRole();

  if (result.success) {
    console.log("Migration completed successfully");
  } else {
    console.error("Migration failed:", result.error);
  }

  process.exit(0);
}

main().catch(error => {
  console.error("Migration script failed:", error);
  process.exit(1);
});
