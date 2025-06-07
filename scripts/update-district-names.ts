import { db } from "../src/lib/db";
import { districts } from "../src/lib/db/schema";
import { eq, like } from "drizzle-orm";

async function main() {
  console.log("🚀 Starting district name update process...");

  try {
    // First, get all districts with names ending in 'District'
    const districtsToUpdate = await db.query.districts.findMany({
      where: like(districts.name, "% District"),
    });

    console.log(
      `Found ${districtsToUpdate.length} districts with 'District' suffix to update`
    );

    // Loop through each district and update it
    let successCount = 0;
    for (const district of districtsToUpdate) {
      // Remove ' District' from the end of the name
      const newName = district.name.replace(/ District$/, "");

      // Update the district name in the database
      await db
        .update(districts)
        .set({ name: newName })
        .where(eq(districts.id, district.id));

      console.log(`✅ Updated: "${district.name}" -> "${newName}"`);
      successCount++;
    }

    console.log(
      `\n✨ District names update completed! Updated ${successCount} districts.`
    );
  } catch (error) {
    console.error("❌ Error updating district names:", error);
    process.exit(1);
  }
}

main()
  .catch(e => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Closing database connection...");
    process.exit(0);
  });
