import { db } from "@/lib/db";
import { countries, districts } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { State, IState } from "country-state-city";

// Define East African country codes
const EAST_AFRICAN_COUNTRIES = ["UG", "KE", "TZ", "RW", "BI", "ET"];

// Import any custom districts data here
// Define the interface for our custom districts to match required properties
interface CustomDistrict {
  name: string;
  code: string;
  isoCode?: string;
  countryCode?: string;
}

const UGANDA_DISTRICTS: CustomDistrict[] = [
  // These are additional districts not in the country-state-city library
  { name: "Kampala", code: "UG-KMP" },
  { name: "Wakiso", code: "UG-WAK" },
  { name: "Mukono", code: "UG-MUK" },
  { name: "Jinja", code: "UG-JIN" },
  { name: "Mbarara", code: "UG-MBR" },
  { name: "Gulu", code: "UG-GUL" },
  { name: "Lira", code: "UG-LIR" },
  { name: "Mbale", code: "UG-MBL" },
  { name: "Arua", code: "UG-ARU" },
  { name: "Masaka", code: "UG-MSK" },
  { name: "Kabale", code: "UG-KBL" },
  { name: "Tororo", code: "UG-TOR" },
  { name: "Iganga", code: "UG-IGA" },
  { name: "Moroto", code: "UG-MRT" },
  { name: "Kitgum", code: "UG-KTG" },
  { name: "Hoima", code: "UG-HMA" },
  { name: "Fortportal", code: "UG-FPT" },
  { name: "Masindi", code: "UG-MSN" },
  { name: "Soroti", code: "UG-SOR" },
  { name: "Nebbi", code: "UG-NBB" },
  { name: "Moyo", code: "UG-MOY" },
  { name: "Adjumani", code: "UG-ADJ" },
  { name: "Rukungiri", code: "UG-RUK" },
  { name: "Kasese", code: "UG-KAS" },
  { name: "Ntungamo", code: "UG-NTU" },
  { name: "Apac", code: "UG-APC" },
  { name: "Bushenyi", code: "UG-BSH" },
  { name: "Kiboga", code: "UG-KIB" },
  { name: "Kabarole", code: "UG-KBR" },
  { name: "Kamuli", code: "UG-KML" },
  { name: "Mubende", code: "UG-MBN" },
  { name: "Kayunga", code: "UG-KAY" },
  { name: "Kalangala", code: "UG-KLG" },
  { name: "Koboko", code: "UG-KOB" },
  { name: "Mityana", code: "UG-MIT" },
  { name: "Nakaseke", code: "UG-NAK" },
  { name: "Amuria", code: "UG-AMU" },
  { name: "Bududa", code: "UG-BUD" },
  { name: "Bukedea", code: "UG-BUK" },
  { name: "Buliisa", code: "UG-BUL" },
  { name: "Dokolo", code: "UG-DOK" },
  { name: "Kaberamaido", code: "UG-KAB" },
  { name: "Lyantonde", code: "UG-LYA" },
  { name: "Manafwa", code: "UG-MAN" },
  { name: "Namutumba", code: "UG-NAM" },
  { name: "Yumbe", code: "UG-YUM" },
];

// Function to check existing districts
// This function is kept for future use but commented out to avoid linter errors
/*
async function getExistingDistricts() {
  try {
    console.log('🔍 Checking existing districts data...');
    const existingDistricts = await db.select().from(districts);
    console.log(`✅ Found ${existingDistricts.length} existing districts`);
    return existingDistricts;
  } catch (error) {
    console.error(
      '❌ Error checking district data:',
      error instanceof Error ? error.message : String(error)
    );
    console.error('Error details:', error);
    console.log('⚠️ Will continue with an empty list of existing districts.');
    return [];
  }
}
*/

// Get country ID by country code
async function getCountryIdByCode(countryCode: string) {
  try {
    const country = await db
      .select()
      .from(countries)
      .where(sql`${countries.code} = ${countryCode}`);

    if (country && country.length > 0) {
      return country[0].id;
    }
    return null;
  } catch (error) {
    console.error(
      `❌ Error getting country ID for code ${countryCode}:`,
      error instanceof Error ? error.message : String(error),
    );
    return null;
  }
}

async function deleteExistingDistricts() {
  try {
    console.log("🧹 Deleting existing districts for selected countries...");

    for (const countryCode of EAST_AFRICAN_COUNTRIES) {
      const countryId = await getCountryIdByCode(countryCode);
      if (countryId) {
        await db
          .delete(districts)
          .where(sql`${districts.country_id} = ${countryId}`);
        console.log(`✅ Deleted districts for country ${countryCode}`);
      }
    }
  } catch (error) {
    console.error(
      "❌ Error deleting districts:",
      error instanceof Error ? error.message : String(error),
    );
  }
}

async function seedDistricts() {
  try {
    console.log("🌱 Starting to seed districts...");

    // Since we deleted existing districts for these countries, we don't need to check
    const existingCodes = new Set();

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    // Process each East African country
    for (const countryCode of EAST_AFRICAN_COUNTRIES) {
      // Get the country ID
      const countryId = await getCountryIdByCode(countryCode);

      if (!countryId) {
        console.log(
          `⚠️ Country with code ${countryCode} not found in the database. Skipping.`,
        );
        continue;
      }

      console.log(`🔍 Processing districts for country ${countryCode}...`);

      // Get states/districts from country-state-city
      const statesFromAPI = State.getStatesOfCountry(countryCode);

      // Add custom districts for Uganda
      let allDistricts: (IState | CustomDistrict)[] = [...statesFromAPI];
      if (countryCode === "UG") {
        allDistricts = [...allDistricts, ...UGANDA_DISTRICTS];
      }

      if (allDistricts.length === 0) {
        console.log(`ℹ️ No districts found for ${countryCode} in the API.`);
        continue;
      }

      console.log(
        `📊 Found ${allDistricts.length} districts for ${countryCode}`,
      );

      // Process districts in batches
      const batchSize = 20;
      for (let i = 0; i < allDistricts.length; i += batchSize) {
        const batch = allDistricts.slice(i, i + batchSize);

        // Process each district in the batch
        for (const district of batch) {
          try {
            // Format district code to follow country-district pattern (e.g., UG-BSH)
            let districtCode =
              "isoCode" in district
                ? district.isoCode || ""
                : (district as CustomDistrict).code;
            const districtName = district.name;

            // Standardize code format
            if (!districtCode.startsWith(countryCode + "-")) {
              districtCode = `${countryCode}-${districtCode}`;
            }

            // Skip if code is undefined or already exists
            if (!districtCode || existingCodes.has(districtCode)) {
              console.log(
                `⏭️ District ${districtName} (${districtCode || "undefined"}) ${!districtCode ? "has no code" : "already exists"}, skipping.`,
              );
              skippedCount++;
              continue;
            }

            // Insert the district
            await db.insert(districts).values({
              name: districtName,
              code: districtCode,
              country_id: countryId,
            });

            successCount++;
            console.log(
              `✅ Added district: ${districtName} (${districtCode}) for country ${countryCode}`,
            );

            // Add to existing codes to prevent duplicates
            existingCodes.add(districtCode);
          } catch (error) {
            errorCount++;
            console.error(
              `❌ Error adding district ${district.name}:`,
              error instanceof Error ? error.message : String(error),
            );
          }
        }
      }
    }

    // Report results
    if (successCount > 0) {
      console.log(`✅ Successfully added ${successCount} districts!`);
    } else {
      console.log(`ℹ️ No new districts were added.`);
    }

    if (skippedCount > 0) {
      console.log(`⏭️ Skipped ${skippedCount} districts (already exist).`);
    }

    if (errorCount > 0) {
      console.log(`⚠️ Encountered ${errorCount} errors during seeding.`);
    }
  } catch (error) {
    console.error(
      "❌ Error seeding districts data:",
      error instanceof Error ? error.message : String(error),
    );
    throw error;
  }
}

async function main() {
  try {
    console.log("🚀 Starting districts seeding process...");

    // First delete existing districts for specified countries
    await deleteExistingDistricts();

    // Then seed districts again
    await seedDistricts();

    console.log("✨ Districts seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error(
      "Failed to seed districts:",
      error instanceof Error ? error.message : String(error),
    );
    console.error("Error details:", error);
    process.exit(1);
  }
}

main();
