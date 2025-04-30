import { seedUgandaAdministrativeUnits } from "./seed-data/uganda-administrative-units";

async function main() {
  try {
    console.log("🌱 Starting database seeding...");

    console.log("Seeding Uganda administrative units...");
    await seedUgandaAdministrativeUnits();

    console.log("✅ Database seeding completed successfully");
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Stack trace:", error.stack);
    }
    process.exit(1);
  }
}

process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled rejection:", error);
  process.exit(1);
});

main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
