import { db } from '@/lib/db';
import { countries, districts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getDistricts(countryCode: string) {
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

    // Then get districts using the country ID
    const districtsList = await db
      .select()
      .from(districts)
      .where(eq(districts.country_id, countryId));
    return districtsList;
  } catch (error) {
    console.error('Error fetching districts:', error);
    throw error;
  }
}
