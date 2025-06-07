import { db } from "@/lib/db";
import { countries } from "@/lib/db/schema";
import { Country } from "country-state-city";
import { sql } from "drizzle-orm";

async function checkExistingData() {
  try {
    console.log("🔍 Checking existing countries data...");
    const existingCountries = await db.select().from(countries);
    console.log(`✅ Found ${existingCountries.length} existing countries`);
    return existingCountries;
  } catch (error) {
    console.error(
      "❌ Error checking data:",
      error instanceof Error ? error.message : String(error)
    );
    return [];
  }
}

async function seedCountries(existingCodes: Set<string> = new Set()) {
  try {
    console.log("🌱 Starting to seed countries...");

    // Get countries data from the country-state-city package
    const allCountries = Country.getAllCountries();

    // Filter out countries that already exist
    const newCountries = allCountries.filter(
      country => !existingCodes.has(country.isoCode)
    );
    console.log(
      `Found ${allCountries.length} total countries, ${newCountries.length} new countries to seed`
    );

    if (newCountries.length === 0) {
      console.log(
        "✅ No new countries to add. Database is already up to date."
      );
      return;
    }

    // Insert all countries in batches for better performance
    const batchSize = 50;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < newCountries.length; i += batchSize) {
      try {
        const batch = newCountries.slice(i, i + batchSize);
        const countryData = batch.map(country => ({
          name: country.name,
          code: country.isoCode,
        }));

        await db.insert(countries).values(countryData);
        successCount += batch.length;
        console.log(
          `✅ Added countries batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(newCountries.length / batchSize)}`
        );
      } catch (error) {
        errorCount += 1;
        console.error(
          `❌ Error with batch ${Math.floor(i / batchSize) + 1}:`,
          error instanceof Error ? error.message : String(error)
        );

        // Try inserting one by one for this batch to handle duplicates
        const batch = newCountries.slice(i, i + batchSize);
        for (const country of batch) {
          try {
            // Try to check if the country already exists
            const existing = await db
              .select({ id: countries.id })
              .from(countries)
              .where(sql`${countries.code} = ${country.isoCode}`);

            if (existing.length === 0) {
              await db.insert(countries).values({
                name: country.name,
                code: country.isoCode,
              });
              successCount += 1;
            } else {
              console.log(
                `  - Country ${country.name} (${country.isoCode}) already exists, skipping`
              );
            }
          } catch (err) {
            errorCount += 1;
            console.error(
              `  - Failed to add country ${country.name} (${country.isoCode}): ${err instanceof Error ? err.message : String(err)}`
            );
          }
        }
      }
    }

    if (successCount > 0) {
      console.log(`✅ Successfully seeded ${successCount} countries!`);
    } else {
      console.log(
        `✅ No new countries were added. All countries already exist in the database.`
      );
    }

    if (errorCount > 0) {
      console.log(`⚠️ Encountered ${errorCount} errors during seeding.`);
    }
  } catch (error) {
    console.error(
      "❌ Error seeding data:",
      error instanceof Error ? error.message : String(error)
    );
    throw error;
  }
}

async function main() {
  try {
    // Try to get existing countries, but don't fail if we can't
    let existingCodes = new Set<string>();
    try {
      const existingCountries = await checkExistingData();
      existingCodes = new Set(existingCountries.map(c => c.code));
    } catch {
      console.warn(
        "Warning: Failed to check existing countries properly, will proceed carefully"
      );
    }

    // Update the seedCountries function to filter out existing countries
    await seedCountries(existingCodes);
    process.exit(0);
  } catch (error) {
    console.error(
      "Failed to seed database:",
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}

main();
