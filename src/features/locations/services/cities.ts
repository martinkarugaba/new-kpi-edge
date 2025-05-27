import { db } from '@/lib/db';
import { cities, municipalities, subCounties } from '@/lib/db/schema';
import { eq, type SQL } from 'drizzle-orm';

export async function getCities(locationCode: string) {
  try {
    // First determine what type of code we received
    let municipalityId: string | null = null;
    let subCountyId: string | null = null;
    const whereConditions: SQL<unknown>[] = [];

    // Try as municipality
    const municipality = await db
      .select()
      .from(municipalities)
      .where(eq(municipalities.code, locationCode))
      .limit(1);

    if (municipality && municipality.length > 0) {
      municipalityId = municipality[0].id;
      whereConditions.push(eq(cities.municipality_id, municipalityId));
    } else {
      // Try as sub-county
      const subCounty = await db
        .select()
        .from(subCounties)
        .where(eq(subCounties.code, locationCode))
        .limit(1);

      if (subCounty && subCounty.length > 0) {
        subCountyId = subCounty[0].id;
        whereConditions.push(eq(cities.sub_county_id, subCountyId));
      }
    }

    // Create base query
    const baseQuery = db.select().from(cities);

    // Apply conditions one by one
    let queryWithConditions = baseQuery;

    // Apply all conditions if any exist
    whereConditions.forEach(condition => {
      queryWithConditions = queryWithConditions.where(
        condition
      ) as typeof baseQuery;
    });

    // Execute the query
    const citiesList = await queryWithConditions;

    return citiesList;
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
}
