import { db } from "../src/lib/db";
import { sql, eq } from "drizzle-orm";
import {
  cities,
  districts,
  counties,
  subCounties,
  municipalities,
} from "../src/lib/db/schema";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Allow passing database URL via command line argument
const args = process.argv.slice(2);
const dbUrlArg = args.find(arg => arg.startsWith("--database-url="));
if (dbUrlArg) {
  const dbUrl = dbUrlArg.split("=")[1];
  process.env.DATABASE_URL = dbUrl;
  console.log("Using database URL from command line argument");
}

async function testCityData() {
  try {
    console.log("🔍 Testing city data...");

    // Get count of cities
    const cityCount = await db.select({ count: sql`count(*)` }).from(cities);
    console.log(`Total cities: ${cityCount[0].count}`);

    // Get sample cities with their relations
    const sampleCities = await db
      .select({
        id: cities.id,
        name: cities.name,
        code: cities.code,
        district_name: districts.name,
        county_name: counties.name,
        subcounty_name: subCounties.name,
        municipality_name: municipalities.name,
      })
      .from(cities)
      .innerJoin(districts, eq(cities.district_id, districts.id))
      .innerJoin(counties, eq(cities.county_id, counties.id))
      .innerJoin(subCounties, eq(cities.sub_county_id, subCounties.id))
      .leftJoin(municipalities, eq(cities.municipality_id, municipalities.id))
      .limit(10);

    console.log("\nSample cities with relations:");

    if (sampleCities.length === 0) {
      console.log("No cities found. Have you run the seed script yet?");
    } else {
      // Display the sample data in a tabular format
      console.log(
        "-------------------------------------------------------------------------------------------------------"
      );
      console.log(
        "| City              | Code             | District          | County            | Municipality       |"
      );
      console.log(
        "-------------------------------------------------------------------------------------------------------"
      );

      sampleCities.forEach(city => {
        const cityName = city.name.padEnd(18).substring(0, 18);
        const code = city.code.padEnd(17).substring(0, 17);
        const district = city.district_name.padEnd(18).substring(0, 18);
        const county = city.county_name.padEnd(18).substring(0, 18);
        const municipality = (city.municipality_name || "N/A")
          .padEnd(18)
          .substring(0, 18);

        console.log(
          `| ${cityName} | ${code} | ${district} | ${county} | ${municipality} |`
        );
      });

      console.log(
        "-------------------------------------------------------------------------------------------------------"
      );
    }

    console.log("\nTest completed successfully");
  } catch (error) {
    console.error("❌ Error testing city data:", error);
    throw error;
  }
}

// Run the test
testCityData()
  .then(() => {
    console.log("✅ City data test completed");
    process.exit(0);
  })
  .catch(error => {
    console.error("❌ City data test failed:", error);
    process.exit(1);
  });
