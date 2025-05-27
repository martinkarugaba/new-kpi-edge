import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';
import { districts, subCounties, counties } from '../src/lib/db/schema';
import subcounties from 'ug-locale/subcounties.json';
import districtsData from 'ug-locale/districts.json';
import countiesData from 'ug-locale/counties.json';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function normalizeDistrictName(name: string): string[] {
  // Clean the name by removing special characters and converting to lowercase
  const base = name.toLowerCase().replace(/[^a-z]/g, '');

  // Create variations by removing common district suffixes/prefixes
  const variations = [
    base,
    base.replace('district', ''),
    base.replace('municipality', ''),
    base.replace('city', ''),
    base.replace('subcounty', ''),
    base.replace('tc', ''),
    base.replace('towncounty', ''),
  ];

  // Special cases for district name variations
  if (base.includes('kampala')) variations.push('kcca');
  if (base.includes('fortportal')) variations.push('kabarole');
  if (base.includes('fortportal')) variations.push('fortportalcity');
  if (base.includes('arua')) variations.push('aruacity');
  if (base.includes('gulu')) variations.push('gulucity');
  if (base.includes('jinja')) variations.push('jinjacity');
  if (base.includes('lira')) variations.push('liracity');
  if (base.includes('masaka')) variations.push('masakacity');
  if (base.includes('mbale')) variations.push('mbalecity');
  if (base.includes('mbarara')) variations.push('mbararacity');
  if (base.includes('soroti')) variations.push('soroticity');

  // Filter out duplicates and empty strings
  return [...new Set(variations.filter(v => v))];
}

async function seedSubCounties() {
  try {
    console.log('Starting subcounties seeding...');

    // Get all districts first
    const districtRecords = await db.select().from(districts);

    // Get all counties to use their codes
    const countyRecords = await db.select().from(counties);
    console.log(`Found ${countyRecords.length} county records`);

    // Create a map of county ID to county record for easy lookup
    const countyMap = new Map();
    countiesData.forEach((county: { id: string; name: string }) => {
      countyMap.set(county.id, county);
    });

    // Create a map of county database records by name for code lookup
    const countyDbRecordsByName = new Map();
    countyRecords.forEach(county => {
      countyDbRecordsByName.set(county.name.toLowerCase(), county);
    });

    // Create mapping with normalized names
    const districtMap = new Map();
    districtRecords.forEach(district => {
      const variations = normalizeDistrictName(district.name);
      variations.forEach(variant => {
        districtMap.set(variant, district);
      });
    });

    console.log(
      'Available districts:',
      Array.from(districtMap.keys()).sort().join(', ')
    );

    // Log some sample subcounties to debug
    console.log('Sample subcounties:', subcounties.slice(0, 5));

    console.log(`Found ${districtRecords.length} district records`);

    // Process subcounties data
    const codeCount = new Map<string, number>();
    const usedCodes = new Set<string>();

    // First, create a mapping from county ID to district ID using counties.json
    const districtIdByCountyId = new Map();
    countiesData.forEach((county: { id: string; district: string }) => {
      districtIdByCountyId.set(county.id, county.district);
    });

    console.log(`Mapped ${districtIdByCountyId.size} counties to district IDs`);

    // Then create a mapping from district ID to district name using districts.json
    const districtNameById = new Map();
    districtsData.forEach((d: { id: string; name: string }) => {
      districtNameById.set(d.id, d.name);
    });

    console.log(`Mapped ${districtNameById.size} district IDs to names`);

    // Now combine these mappings to go from county ID directly to district name
    const districtNameByCountyId = new Map();
    districtIdByCountyId.forEach((districtId, countyId) => {
      const districtName = districtNameById.get(districtId);
      if (districtName) {
        districtNameByCountyId.set(countyId, districtName);
      }
    });

    console.log(
      `Created combined mapping of ${districtNameByCountyId.size} counties to district names`
    );

    const subCountiesData = subcounties
      .map((subcounty: { name: string; county: string; id: string }) => {
        // Get county data from county ID
        const county = countyMap.get(subcounty.county);
        if (!county) {
          console.warn(
            `County ID ${subcounty.county} not found for subcounty ${subcounty.name}`
          );
          return null;
        }

        // Get district name from county ID using our combined mapping
        const districtName = districtNameByCountyId.get(subcounty.county);
        if (!districtName) {
          console.warn(
            `District name not found for county ID ${subcounty.county}, subcounty ${subcounty.name}`
          );
          return null;
        }

        // Find the corresponding district using normalized name
        // Try all possible normalized variations of the district name
        const normalizedVariations = normalizeDistrictName(districtName);
        let district;

        for (const normalizedName of normalizedVariations) {
          district = districtMap.get(normalizedName);
          if (district) break;
        }

        // For logging if district not found
        const normalizedDistrictName = normalizedVariations[0];

        // Debug logging
        if (!district) {
          console.warn(`District not found for subcounty: ${subcounty.name}`);
          console.warn(
            `Looking for normalized name: "${normalizedDistrictName}"`
          );
          return null;
        }

        // Look for the county database record to get its code
        // Try to find the county by name
        let countyRecord = countyDbRecordsByName.get(county.name.toLowerCase());

        // If county name with "County" suffix doesn't match, try without suffix
        if (!countyRecord && county.name.toLowerCase().endsWith(' county')) {
          const nameWithoutCounty = county.name.slice(0, -7).toLowerCase();
          countyRecord = countyDbRecordsByName.get(nameWithoutCounty);
        }

        // If still no match, try normalized variations
        if (!countyRecord) {
          for (const record of countyRecords) {
            if (
              record.district_id === district.id &&
              record.name.toLowerCase().includes(county.name.toLowerCase())
            ) {
              countyRecord = record;
              break;
            }
          }
        }

        // Format subcounty name properly (first letter of each word uppercase, rest lowercase)
        const formattedName = subcounty.name
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        // Clean name for code generation (remove spaces and special characters)
        const cleanedName = subcounty.name.replace(/[^a-zA-Z]/g, '');

        // Get first, last, and middle letter for the code
        const firstLetter = cleanedName[0];
        const lastLetter = cleanedName[cleanedName.length - 1];
        const middleIndex = Math.floor(cleanedName.length / 2);
        const middleLetter = cleanedName[middleIndex];

        // We must use the county code as the base - fail if we don't have a county record
        if (!countyRecord) {
          console.warn(
            `County record not found for subcounty ${subcounty.name}, skipping`
          );
          return null;
        }

        const baseCodePrefix = countyRecord.code;

        // Combine county code with subcounty letters
        let baseCode = `${baseCodePrefix}-${firstLetter}${middleLetter}${lastLetter}`;

        // Track the number of times this code has been used
        const count = (codeCount.get(baseCode) || 0) + 1;
        codeCount.set(baseCode, count);

        // If this is not the first occurrence or code is already used, try different middle letters
        if (count > 1 || usedCodes.has(baseCode)) {
          // Try different letters from the name as middle letter
          let found = false;
          for (let i = 0; i < cleanedName.length; i++) {
            // Skip first and last letters
            if (i === 0 || i === cleanedName.length - 1) continue;
            const newCode = `${baseCodePrefix}-${firstLetter}${cleanedName[i]}${lastLetter}`;
            if (!usedCodes.has(newCode)) {
              baseCode = newCode;
              found = true;
              break;
            }
          }

          // If still no unique code found, append a number
          if (!found) {
            let counter = 1;
            while (
              usedCodes.has(
                `${baseCodePrefix}-${firstLetter}${counter}${lastLetter}`
              )
            ) {
              counter++;
            }
            baseCode = `${baseCodePrefix}-${firstLetter}${counter}${lastLetter}`;
          }
        }

        usedCodes.add(baseCode);
        return {
          name: formattedName,
          code: baseCode,
          district_id: district.id,
          country_id: district.country_id,
          county_id: countyRecord.id, // County ID is now required and validated earlier
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    console.log(`Prepared ${subCountiesData.length} subcounties for insertion`);

    // Insert subcounties in batches to avoid overwhelming the database
    const BATCH_SIZE = 50;
    for (let i = 0; i < subCountiesData.length; i += BATCH_SIZE) {
      const batch = subCountiesData.slice(i, i + BATCH_SIZE);
      await db
        .insert(subCounties)
        .values(batch)
        .onConflictDoUpdate({
          target: [subCounties.code],
          set: {
            name: sql`EXCLUDED.name`,
            updated_at: sql`CURRENT_TIMESTAMP`,
          },
        });
      console.log(`Processed batch ${Math.floor(i / BATCH_SIZE) + 1}`);
    }

    console.log('Subcounties seeding completed successfully');
  } catch (error) {
    console.error('Error seeding subcounties:', error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedSubCounties()
    .then(() => {
      console.log('Subcounties seeding completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Subcounties seeding failed:', error);
      process.exit(1);
    });
}

export { seedSubCounties };
