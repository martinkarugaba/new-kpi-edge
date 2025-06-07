import { db } from "../src/lib/db";
import { sql } from "drizzle-orm";
import {
  districts,
  municipalities as dbMunicipalities,
  countries,
  counties,
  subCounties,
} from "../src/lib/db/schema";
import municipalitiesData from "./municipalities.json";
import * as dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Define interfaces
interface Municipality {
  name: string;
  district: string;
  county: string;
  subcounty: string;
  code?: string;
}

interface CountryRecord {
  id: string;
  name: string;
  code: string;
  created_at: Date | null;
  updated_at: Date | null;
}

interface DistrictRecord {
  id: string;
  name: string;
  code: string;
  country_id: string;
  region: string | null;
  created_at: Date | null;
  updated_at: Date | null;
}

interface CountyRecord {
  id: string;
  name: string;
  code: string;
  country_id: string;
  district_id: string;
  created_at: Date | null;
  updated_at: Date | null;
}

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

// Load municipalities data from JSON file
// If using a custom municipalities file, it can be specified via --data=path
const dataFileArg = args.find(arg => arg.startsWith("--data="));
let ugandaMunicipalities: Municipality[] = [];

try {
  if (dataFileArg) {
    const dataFilePath = dataFileArg.split("=")[1];
    const jsonPath = path.resolve(process.cwd(), dataFilePath);
    console.log(`Loading municipalities data from ${jsonPath}`);
    const fileContent = fs.readFileSync(jsonPath, "utf8");
    ugandaMunicipalities = JSON.parse(fileContent);
  } else {
    // Use the default municipalities.json in the scripts directory
    ugandaMunicipalities = municipalitiesData;
  }
  console.log(`Loaded ${ugandaMunicipalities.length} municipalities`);
} catch (error) {
  console.error("Error loading municipalities data:", error);
  process.exit(1);
}

// If no municipalities were loaded, use this default entry
if (ugandaMunicipalities.length === 0) {
  ugandaMunicipalities = [
    {
      name: "Busia",
      district: "Busia",
      county: "Samia Bugwe",
      subcounty: "Busia",
    },
    {
      name: "Iganga",
      district: "Iganga",
      county: "Kigulu",
      subcounty: "Iganga",
    },
    {
      name: "Soroti",
      district: "Soroti",
      county: "Soroti",
      subcounty: "Soroti",
    },
    {
      name: "Tororo",
      district: "Tororo",
      county: "Tororo",
      subcounty: "Tororo",
    },
    {
      name: "Mbale",
      district: "Mbale",
      county: "Bungokho",
      subcounty: "Industrial Division",
    },
    { name: "Kumi", district: "Kumi", county: "Kumi", subcounty: "Kumi" },

    // Central Region
    {
      name: "Mukono",
      district: "Mukono",
      county: "Mukono",
      subcounty: "Mukono",
    },
    {
      name: "Masaka",
      district: "Masaka",
      county: "Masaka",
      subcounty: "Masaka",
    },
    {
      name: "Entebbe",
      district: "Wakiso",
      county: "Entebbe",
      subcounty: "Entebbe",
    },
    {
      name: "Lugazi",
      district: "Buikwe",
      county: "Buikwe",
      subcounty: "Lugazi",
    },
    {
      name: "Mityana",
      district: "Mityana",
      county: "Mityana",
      subcounty: "Mityana",
    },
    {
      name: "Mubende",
      district: "Mubende",
      county: "Mubende",
      subcounty: "Mubende",
    },

    // Western Region
    {
      name: "Fort Portal",
      district: "Kabarole",
      county: "Fort Portal",
      subcounty: "Fort Portal",
    },
    { name: "Hoima", district: "Hoima", county: "Hoima", subcounty: "Hoima" },
    {
      name: "Kasese",
      district: "Kasese",
      county: "Kasese",
      subcounty: "Kasese",
    },
    {
      name: "Masindi",
      district: "Masindi",
      county: "Masindi",
      subcounty: "Masindi",
    },
    {
      name: "Kabale",
      district: "Kabale",
      county: "Kabale",
      subcounty: "Kabale",
    },
    {
      name: "Bushenyi-Ishaka",
      district: "Bushenyi",
      county: "Bushenyi",
      subcounty: "Ishaka",
    },
    {
      name: "Ntungamo",
      district: "Ntungamo",
      county: "Ntungamo",
      subcounty: "Ntungamo",
    },
    {
      name: "Ibanda",
      district: "Ibanda",
      county: "Ibanda",
      subcounty: "Ibanda",
    },

    // Northern Region
    { name: "Gulu", district: "Gulu", county: "Gulu", subcounty: "Gulu" },
    { name: "Lira", district: "Lira", county: "Lira", subcounty: "Lira" },
    { name: "Arua", district: "Arua", county: "Arua", subcounty: "Arua" },
    {
      name: "Kitgum",
      district: "Kitgum",
      county: "Kitgum",
      subcounty: "Kitgum",
    },
    {
      name: "Adjumani",
      district: "Adjumani",
      county: "Adjumani",
      subcounty: "Adjumani",
    },
    {
      name: "Moroto",
      district: "Moroto",
      county: "Moroto",
      subcounty: "Moroto",
    },
  ];
}

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

// Function to create missing subcounties with proper relationships
async function createMissingSubcounty(
  name: string,
  districtName: string,
  countyName: string,
  uganda: CountryRecord,
  districtMap: Map<string, DistrictRecord>,
  countyMap: Map<string, CountyRecord>
) {
  // Find district record
  const districtNormalized = normalizeDistrictName(districtName);
  let districtRecord = null;

  for (const variant of districtNormalized) {
    if (districtMap.has(variant)) {
      districtRecord = districtMap.get(variant);
      break;
    }
  }

  if (!districtRecord) {
    console.log(`District not found for subcounty ${name}: ${districtName}`);
    return null;
  }

  // Find county record
  const countyLower = countyName.toLowerCase();
  let countyRecord = countyMap.get(countyLower);

  // Try to find by district_id if not found by name
  if (!countyRecord) {
    countyRecord = countyMap.get(`${districtRecord.id}`);
  }

  if (!countyRecord) {
    console.log(`County not found for subcounty ${name}: ${countyName}`);
    return null;
  }

  // Generate code for the subcounty
  const baseCode = `${districtRecord.code}-${name.substring(0, 3).toUpperCase()}`;

  try {
    const [newSubcounty] = await db
      .insert(subCounties)
      .values({
        name: name,
        code: baseCode,
        country_id: uganda.id,
        district_id: districtRecord.id,
        county_id: countyRecord.id,
      })
      .returning();

    console.log(`Created/Updated subcounty: ${name}`);
    return newSubcounty;
  } catch (error) {
    console.error(`Error creating subcounty ${name}:`, error);
    return null;
  }
}

async function seedMunicipalities() {
  try {
    console.log("Starting municipalities seeding...");

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
    const districtMap = new Map<string, DistrictRecord>();
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
    const countyMap = new Map<string, CountyRecord>();
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

    // First create missing subcounties
    console.log("Creating missing subcounties...");
    const missingSubcounties = [
      { name: "Gulu", district: "Gulu", county: "Gulu" },
      { name: "Kitgum", district: "Kitgum", county: "Kitgum" },
      { name: "Arua", district: "Arua", county: "Arua" },
      { name: "Moroto", district: "Moroto", county: "Moroto" },
      { name: "Jinja", district: "Jinja", county: "Jinja" },
      { name: "Kapchorwa", district: "Kapchorwa", county: "Kapchorwa" },
      { name: "Kamuli", district: "Kamuli", county: "Bugabula" },
      { name: "Nakasongola", district: "Nakasongola", county: "Nakasongola" },
      { name: "Rakai", district: "Rakai", county: "Rakai" },
      { name: "Kiboga", district: "Kiboga", county: "Kiboga" },
      { name: "Rukungiri", district: "Rukungiri", county: "Rukungiri" },
      { name: "Kanungu", district: "Kanungu", county: "Kanungu" },
      { name: "Kyenjojo", district: "Kyenjojo", county: "Kyenjojo" },
      { name: "Kibaale", district: "Kibaale", county: "Kibaale" },
      { name: "Kisoro", district: "Kisoro", county: "Kisoro" },
      { name: "Adjumani", district: "Adjumani", county: "Adjumani" },
      { name: "Bundibugyo", district: "Bundibugyo", county: "Bundibugyo" },
      { name: "Amuria", district: "Amuria", county: "Amuria" },
      { name: "Yumbe", district: "Yumbe", county: "Yumbe" },
      { name: "Industrial Division", district: "Mbale", county: "Bungokho" },
    ];

    for (const subcounty of missingSubcounties) {
      await createMissingSubcounty(
        subcounty.name,
        subcounty.district,
        subcounty.county,
        uganda,
        districtMap,
        countyMap
      );
    }

    // Refresh subcounties after creating missing ones
    const subcountyRecordsFresh = await db.select().from(subCounties);
    const subcountyMapFresh = new Map();
    subcountyRecordsFresh.forEach(subcounty => {
      subcountyMapFresh.set(
        `${subcounty.name.toLowerCase()}-${subcounty.district_id}`,
        subcounty
      );
      subcountyMapFresh.set(
        `${subcounty.name.toLowerCase()}-${subcounty.county_id}`,
        subcounty
      );
    });

    console.log(
      `Found ${subcountyRecordsFresh.length} subcounty records after update`
    );

    // Process municipalities data
    // Create a map to track code usage
    const codeCount = new Map<string, number>();

    const municipalitiesData = [];
    const notFoundItems = [];

    for (const municipality of ugandaMunicipalities) {
      // Find district record
      const districtNormalized = normalizeDistrictName(municipality.district);
      let districtRecord = null;

      for (const variant of districtNormalized) {
        if (districtMap.has(variant)) {
          districtRecord = districtMap.get(variant);
          break;
        }
      }

      if (!districtRecord) {
        notFoundItems.push(`District not found: ${municipality.district}`);
        continue;
      }

      // Find county record
      const countyLower = municipality.county.toLowerCase();
      let countyRecord = countyMap.get(countyLower);

      // Try to find by district_id if not found by name
      if (!countyRecord) {
        countyRecord = countyMap.get(`${districtRecord.id}`);
      }

      if (!countyRecord) {
        notFoundItems.push(
          `County not found: ${municipality.county} in district ${municipality.district}`
        );
        continue;
      }

      // Find subcounty record
      const subcountyKey = `${municipality.subcounty.toLowerCase()}-${districtRecord.id}`;
      const subcountyKeyAlt = `${municipality.subcounty.toLowerCase()}-${countyRecord.id}`;

      let subcountyRecord = subcountyMapFresh.get(subcountyKey);
      if (!subcountyRecord) {
        subcountyRecord = subcountyMapFresh.get(subcountyKeyAlt);
      }

      if (!subcountyRecord) {
        notFoundItems.push(
          `Subcounty not found: ${municipality.subcounty} in county ${municipality.county}, district ${municipality.district}`
        );
        continue;
      }

      // Generate a unique code for the municipality
      // Clean name for code generation (remove spaces and special characters)
      const cleanedName = municipality.name.replace(/[^a-zA-Z]/g, "");

      // Get first, last, and middle letter for the code
      const firstLetter = cleanedName[0];
      const lastLetter = cleanedName[cleanedName.length - 1];
      const middleLetter = cleanedName[Math.floor(cleanedName.length / 2)];

      let baseCode =
        `${uganda.code}-MUN-${firstLetter}${middleLetter}${lastLetter}`.toUpperCase();

      // Track the number of times this code has been used
      const count = (codeCount.get(baseCode) || 0) + 1;
      codeCount.set(baseCode, count);

      // If this is not the first occurrence, try different middle letters
      if (count > 1) {
        for (let i = 1; i < cleanedName.length - 1; i++) {
          const altCode =
            `${uganda.code}-MUN-${firstLetter}${cleanedName[i]}${lastLetter}`.toUpperCase();
          if (!codeCount.has(altCode)) {
            baseCode = altCode;
            codeCount.set(baseCode, 1);
            break;
          }
        }
      }

      // Add municipality to the data array
      municipalitiesData.push({
        name: municipality.name,
        code: baseCode,
        country_id: uganda.id,
        district_id: districtRecord.id,
        county_id: countyRecord.id,
        sub_county_id: subcountyRecord.id,
      });
    }

    console.log(
      `Prepared ${municipalitiesData.length} municipalities for insertion`
    );

    if (notFoundItems.length > 0) {
      console.log("Some items could not be matched. Details:");
      notFoundItems.forEach(item => console.log(`- ${item}`));
    }

    if (municipalitiesData.length === 0) {
      console.log("No municipalities data to insert. Aborting.");
      return;
    }

    // Insert municipalities in batches to avoid overwhelming the database
    const BATCH_SIZE = 20;
    for (let i = 0; i < municipalitiesData.length; i += BATCH_SIZE) {
      const batch = municipalitiesData.slice(i, i + BATCH_SIZE);
      await db
        .insert(dbMunicipalities)
        .values(batch)
        .onConflictDoUpdate({
          target: [dbMunicipalities.code],
          set: {
            name: sql`EXCLUDED.name`,
            updated_at: sql`CURRENT_TIMESTAMP`,
          },
        });
      console.log(`Processed batch ${Math.floor(i / BATCH_SIZE) + 1}`);
    }

    console.log("Municipalities seeding completed successfully");
  } catch (error) {
    console.error("Error seeding municipalities:", error);
    throw error;
  }
}

// Run the seeding
seedMunicipalities()
  .then(() => {
    console.log("✅ Municipalities seeding completed");
    process.exit(0);
  })
  .catch(error => {
    console.error("❌ Municipalities seeding failed:", error);
    process.exit(1);
  });
