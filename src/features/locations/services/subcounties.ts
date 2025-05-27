import { db } from '@/lib/db';
import { countries, districts, subCounties } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function getSubCounties(
  countryCode: string,
  districtCode: string
) {
  try {
    // First get the country ID using the country code
    const country = await db
      .select()
      .from(countries)
      .where(eq(countries.code, countryCode))
      .limit(1);

    if (!country || country.length === 0) {
      console.error(`No country found with code: ${countryCode}`);
      return [];
    }

    const countryId = country[0].id;

    // Then get the district ID using the district code
    const district = await db
      .select()
      .from(districts)
      .where(eq(districts.code, districtCode))
      .limit(1);

    if (!district || district.length === 0) {
      console.error(`No district found with code: ${districtCode}`);
      return [];
    }

    const districtId = district[0].id;

    // Query sub-counties with multiple conditions using 'and'
    const result = await db
      .select()
      .from(subCounties)
      .where(
        and(
          eq(subCounties.country_id, countryId),
          eq(subCounties.district_id, districtId)
        )
      );

    return result;
  } catch (error) {
    console.error('Error fetching sub-counties:', error);
    throw error;
  }
}
