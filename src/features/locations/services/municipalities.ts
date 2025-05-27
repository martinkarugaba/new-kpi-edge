import { db } from '@/lib/db';
import { municipalities, districts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getMunicipalities(districtCode: string) {
  try {
    // Get the district ID using the district code
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

    // Get municipalities using the district ID
    const municipalitiesList = await db
      .select()
      .from(municipalities)
      .where(eq(municipalities.district_id, districtId));

    return municipalitiesList;
  } catch (error) {
    console.error('Error fetching municipalities:', error);
    throw error;
  }
}
