import { db } from '../src/lib/db';
import { sql, eq } from 'drizzle-orm';
import {
  municipalities,
  districts,
  counties,
  subCounties,
} from '../src/lib/db/schema';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Allow passing database URL via command line argument
const args = process.argv.slice(2);
const dbUrlArg = args.find(arg => arg.startsWith('--database-url='));
if (dbUrlArg) {
  const dbUrl = dbUrlArg.split('=')[1];
  process.env.DATABASE_URL = dbUrl;
  console.log('Using database URL from command line argument');
}

async function testMunicipalityData() {
  try {
    console.log('🔍 Testing municipality data...');

    // Get count of municipalities
    const municipalityCount = await db
      .select({ count: sql`count(*)` })
      .from(municipalities);
    console.log(`Total municipalities: ${municipalityCount[0].count}`);

    // Get sample municipalities with their relations
    const sampleMunicipalities = await db
      .select({
        id: municipalities.id,
        name: municipalities.name,
        code: municipalities.code,
        district_name: districts.name,
        county_name: counties.name,
        subcounty_name: subCounties.name,
      })
      .from(municipalities)
      .innerJoin(districts, eq(municipalities.district_id, districts.id))
      .innerJoin(counties, eq(municipalities.county_id, counties.id))
      .innerJoin(subCounties, eq(municipalities.sub_county_id, subCounties.id))
      .limit(10);

    console.log('\nSample municipalities with relations:');

    if (sampleMunicipalities.length === 0) {
      console.log('No municipalities found. Have you run the seed script yet?');
    } else {
      // Display the sample data in a tabular format
      console.log(
        '------------------------------------------------------------------------------------------------'
      );
      console.log(
        '| Municipality      | Code             | District          | County            | Subcounty        |'
      );
      console.log(
        '------------------------------------------------------------------------------------------------'
      );

      sampleMunicipalities.forEach(
        (mun: {
          name: string;
          code: string;
          district_name: string;
          county_name: string;
          subcounty_name: string;
        }) => {
          const munName = mun.name.padEnd(18).substring(0, 18);
          const code = mun.code.padEnd(17).substring(0, 17);
          const district = mun.district_name.padEnd(18).substring(0, 18);
          const county = mun.county_name.padEnd(18).substring(0, 18);
          const subcounty = mun.subcounty_name.padEnd(18).substring(0, 18);

          console.log(
            `| ${munName} | ${code} | ${district} | ${county} | ${subcounty} |`
          );
        }
      );

      console.log(
        '------------------------------------------------------------------------------------------------'
      );
    }

    console.log('\nTest completed successfully');
  } catch (error: unknown) {
    console.error(
      '❌ Error testing municipality data:',
      error instanceof Error ? error.message : String(error)
    );
    throw error;
  }
}

// Run the test
testMunicipalityData()
  .then(() => {
    console.log('✅ Municipality data test completed');
    process.exit(0);
  })
  .catch((error: unknown) => {
    console.error(
      '❌ Municipality data test failed:',
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  });
