import { db } from "../src/lib/db";
import { sql } from "drizzle-orm";
import * as dotenv from "dotenv";
import path from "path";
import {
  districts,
  cities as dbCities,
  countries,
  counties,
  subCounties,
  municipalities as dbMunicipalities,
} from "../src/lib/db/schema";

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

// Uganda cities data
// Source: Uganda Bureau of Statistics and Ministry of Local Government
const ugandaCities = [
  // Main Cities with their administrative details
  {
    name: "Kampala",
    district: "Kampala",
    county: "Kampala",
    subcounty: "Central Division",
  },
  { name: "Gulu", district: "Gulu", county: "Gulu", subcounty: "Gulu" },
  { name: "Lira", district: "Lira", county: "Lira", subcounty: "Lira" },
  {
    name: "Mbarara",
    district: "Mbarara",
    county: "Mbarara",
    subcounty: "Mbarara",
  },
  { name: "Jinja", district: "Jinja", county: "Jinja", subcounty: "Jinja" },
  {
    name: "Mbale",
    district: "Mbale",
    county: "Bungokho",
    subcounty: "Industrial Division",
  },
  {
    name: "Fort Portal",
    district: "Kabarole",
    county: "Fort Portal",
    subcounty: "Fort Portal",
  },
  { name: "Masaka", district: "Masaka", county: "Masaka", subcounty: "Masaka" },
  { name: "Soroti", district: "Soroti", county: "Soroti", subcounty: "Soroti" },
  { name: "Arua", district: "Arua", county: "Arua", subcounty: "Arua" },

  // New cities (added in 2020-2023)
  { name: "Hoima", district: "Hoima", county: "Hoima", subcounty: "Hoima" },
  { name: "Kisoro", district: "Kisoro", county: "Kisoro", subcounty: "Kisoro" },
];

function normalizeDistrictName(name: string): string[] {
  // Clean the name by removing special characters and converting to lowercase
  const base = name.toLowerCase().replace(/[^a-z]/g, "");

  // Create variations by removing common district suffixes/prefixes
  const variations = [
    base,
    base.replace("district", ""),
    base.replace("municipality", ""),
    base.replace("city", ""),
    base.replace("subcounty", ""),
    base.replace("tc", ""),
    base.replace("towncounty", ""),
  ];

  // Special cases for district name variations
  if (base.includes("kampala")) variations.push("kcca");
  if (base.includes("fortportal")) variations.push("kabarole");
  if (base.includes("fortportal")) variations.push("fortportalcity");
  if (base.includes("arua")) variations.push("aruacity");
  if (base.includes("gulu")) variations.push("gulucity");
  if (base.includes("jinja")) variations.push("jinjacity");
  if (base.includes("lira")) variations.push("liracity");
  if (base.includes("masaka")) variations.push("masakacity");
  if (base.includes("mbale")) variations.push("mbalecity");
  if (base.includes("mbarara")) variations.push("mbararacity");
  if (base.includes("soroti")) variations.push("soroticity");

  // Filter out duplicates and empty strings
  return [...new Set(variations.filter(v => v))];
}

async function seedCities() {
  try {
    console.log("Starting cities seeding...");

    // First, get the Uganda country ID
    const [uganda] = await db
      .select()
      .from(countries)
      .where(sql`LOWER(${countries.name}) = 'uganda'`);

    if (!uganda) {
      throw new Error(
        "Uganda country record not found. Please seed countries first."
      );
    }

    console.log("Found Uganda country record");

    // Get all districts
    const districtRecords = await db.select().from(districts);

    // Create mapping with normalized names for districts
    const districtMap = new Map();
    districtRecords.forEach(district => {
      const variations = normalizeDistrictName(district.name);
      variations.forEach(variant => {
        districtMap.set(variant, district);
      });
    });

    console.log(`Found ${districtRecords.length} district records`);

    // Get all counties
    const countyRecords = await db.select().from(counties);

    // Create a map of county by name for easy lookup
    const countyMap = new Map();
    countyRecords.forEach(county => {
      countyMap.set(county.name.toLowerCase(), county);
      // Also add the district_id as a key for matching counties to districts
      countyMap.set(`${county.district_id}`, county);
    });

    console.log(`Found ${countyRecords.length} county records`);

    // Get all subcounties
    const subcountyRecords = await db.select().from(subCounties);

    // Create a map of subcounty by name and district for easy lookup
    const subcountyMap = new Map();
    subcountyRecords.forEach(subcounty => {
      subcountyMap.set(
        `${subcounty.name.toLowerCase()}-${subcounty.district_id}`,
        subcounty
      );
      subcountyMap.set(
        `${subcounty.name.toLowerCase()}-${subcounty.county_id}`,
        subcounty
      );
    });

    console.log(`Found ${subcountyRecords.length} subcounty records`);

    // Get all municipalities
    const municipalityRecords = await db.select().from(dbMunicipalities);

    // Create a map of municipality by name for lookup
    const municipalityMap = new Map();
    municipalityRecords.forEach(municipality => {
      municipalityMap.set(municipality.name.toLowerCase(), municipality);
    });

    console.log(`Found ${municipalityRecords.length} municipality records`);

    // Process cities data
    // Create a map to track code usage
    const codeCount = new Map<string, number>();

    const citiesData = [];
    const notFoundItems = [];

    for (const city of ugandaCities) {
      // Find district record
      const districtNormalized = normalizeDistrictName(city.district);
      let districtRecord = null;

      for (const variant of districtNormalized) {
        if (districtMap.has(variant)) {
          districtRecord = districtMap.get(variant);
          break;
        }
      }

      if (!districtRecord) {
        notFoundItems.push(`District not found: ${city.district}`);
        continue;
      }

      // Find county record
      const countyLower = city.county.toLowerCase();
      let countyRecord = countyMap.get(countyLower);

      // Try to find by district_id if not found by name
      if (!countyRecord) {
        countyRecord = countyMap.get(`${districtRecord.id}`);
      }

      if (!countyRecord) {
        notFoundItems.push(
          `County not found: ${city.county} in district ${city.district}`
        );
        continue;
      }

      // Find subcounty record
      const subcountyKey = `${city.subcounty.toLowerCase()}-${districtRecord.id}`;
      const subcountyKeyAlt = `${city.subcounty.toLowerCase()}-${countyRecord.id}`;

      let subcountyRecord = subcountyMap.get(subcountyKey);
      if (!subcountyRecord) {
        subcountyRecord = subcountyMap.get(subcountyKeyAlt);
      }

      if (!subcountyRecord) {
        notFoundItems.push(
          `Subcounty not found: ${city.subcounty} in county ${city.county}, district ${city.district}`
        );
        continue;
      }

      // Check if there's a municipality with the same name
      const municipalityLower = city.name.toLowerCase();
      const municipalityRecord = municipalityMap.get(municipalityLower);

      // Generate a unique code for the city
      // Clean name for code generation (remove spaces and special characters)
      const cleanedName = city.name.replace(/[^a-zA-Z]/g, "");

      // Get first, last, and middle letter for the code
      const firstLetter = cleanedName[0];
      const lastLetter = cleanedName[cleanedName.length - 1];
      const middleLetter = cleanedName[Math.floor(cleanedName.length / 2)];

      let baseCode =
        `${uganda.code}-CITY-${firstLetter}${middleLetter}${lastLetter}`.toUpperCase();

      // Track the number of times this code has been used
      const count = (codeCount.get(baseCode) || 0) + 1;
      codeCount.set(baseCode, count);

      // If this is not the first occurrence, try different middle letters
      if (count > 1) {
        for (let i = 1; i < cleanedName.length - 1; i++) {
          const altCode =
            `${uganda.code}-CITY-${firstLetter}${cleanedName[i]}${lastLetter}`.toUpperCase();
          if (!codeCount.has(altCode)) {
            baseCode = altCode;
            codeCount.set(baseCode, 1);
            break;
          }
        }
      }

      // Add city to the data array
      citiesData.push({
        name: city.name,
        code: baseCode,
        country_id: uganda.id,
        district_id: districtRecord.id,
        county_id: countyRecord.id,
        sub_county_id: subcountyRecord.id,
        municipality_id: municipalityRecord?.id || null,
      });
    }

    console.log(`Prepared ${citiesData.length} cities for insertion`);

    if (notFoundItems.length > 0) {
      console.log("Some items could not be matched. Details:");
      notFoundItems.forEach(item => console.log(`- ${item}`));
    }

    if (citiesData.length === 0) {
      console.log("No cities data to insert. Aborting.");
      return;
    }

    // Insert cities in batches to avoid overwhelming the database
    const BATCH_SIZE = 20;
    for (let i = 0; i < citiesData.length; i += BATCH_SIZE) {
      const batch = citiesData.slice(i, i + BATCH_SIZE);
      await db
        .insert(dbCities)
        .values(batch)
        .onConflictDoUpdate({
          target: [dbCities.code],
          set: {
            name: sql`EXCLUDED.name`,
            updated_at: sql`CURRENT_TIMESTAMP`,
          },
        });
      console.log(`Processed batch ${Math.floor(i / BATCH_SIZE) + 1}`);
    }

    console.log("Cities seeding completed successfully");
  } catch (error) {
    console.error("Error seeding cities:", error);
    throw error;
  }
}

// Run the seeding
seedCities()
  .then(() => {
    console.log("✅ Cities seeding completed");
    process.exit(0);
  })
  .catch(error => {
    console.error("❌ Cities seeding failed:", error);
    process.exit(1);
  });
