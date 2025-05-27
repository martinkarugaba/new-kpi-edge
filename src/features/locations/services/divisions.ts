import { db } from '@/lib/db';
import {
  divisions,
  subCounties,
  municipalities,
  cities,
  wards,
} from '@/lib/db/schema';
import { eq, type SQL } from 'drizzle-orm';

export async function getDivisions(
  locationCode: string,
  municipalityCode?: string,
  cityCode?: string,
  wardCode?: string
) {
  try {
    // First determine what type of code we received
    let subCountyId: string | null = null;
    let municipalityId: string | null = null;
    let cityId: string | null = null;
    let wardId: string | null = null;
    const whereConditions: SQL<unknown>[] = [];

    // Try as sub-county
    const subCounty = await db
      .select()
      .from(subCounties)
      .where(eq(subCounties.code, locationCode))
      .limit(1);

    if (subCounty && subCounty.length > 0) {
      subCountyId = subCounty[0].id;
      whereConditions.push(eq(divisions.sub_county_id, subCountyId));
    }

    // If municipality code is provided, get municipality ID
    if (municipalityCode) {
      const municipality = await db
        .select()
        .from(municipalities)
        .where(eq(municipalities.code, municipalityCode))
        .limit(1);

      if (municipality && municipality.length > 0) {
        municipalityId = municipality[0].id;
      }

      if (municipalityId) {
        whereConditions.push(eq(divisions.municipality_id, municipalityId));
      }
    }

    // If city code is provided, get city ID
    if (cityCode) {
      const city = await db
        .select()
        .from(cities)
        .where(eq(cities.code, cityCode))
        .limit(1);

      if (city && city.length > 0) {
        cityId = city[0].id;
      }

      if (cityId) {
        whereConditions.push(eq(divisions.city_id, cityId));
      }
    }

    // If ward code is provided, get ward ID
    if (wardCode) {
      const ward = await db
        .select()
        .from(wards)
        .where(eq(wards.code, wardCode))
        .limit(1);

      if (ward && ward.length > 0) {
        wardId = ward[0].id;
      }

      if (wardId) {
        whereConditions.push(eq(divisions.ward_id, wardId));
      }
    }

    // Apply conditions using our utility
    const baseQuery = db.select().from(divisions);

    // Apply conditions one by one
    let queryWithConditions = baseQuery;

    // Apply all conditions if any exist
    whereConditions.forEach(condition => {
      queryWithConditions = queryWithConditions.where(
        condition
      ) as typeof baseQuery;
    });

    // Execute the query
    const divisionsList = await queryWithConditions;

    return divisionsList;
  } catch (error) {
    console.error('Error fetching divisions:', error);
    throw error;
  }
}
