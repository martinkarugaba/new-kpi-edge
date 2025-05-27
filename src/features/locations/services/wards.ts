import { db } from '@/lib/db';
import { wards, municipalities, subCounties, cities } from '@/lib/db/schema';
import { eq, and, type SQL } from 'drizzle-orm';

export async function getWards(
  locationCode: string,
  municipalityCode?: string,
  cityCode?: string
) {
  try {
    // First determine what type of code we received
    let subCountyId: string | null = null;
    let municipalityId: string | null = null;
    let cityId: string | null = null;
    const whereConditions: SQL<unknown>[] = [];

    // Try as sub-county
    const subCounty = await db
      .select()
      .from(subCounties)
      .where(eq(subCounties.code, locationCode))
      .limit(1);

    if (subCounty && subCounty.length > 0) {
      subCountyId = subCounty[0].id;
      whereConditions.push(eq(wards.sub_county_id, subCountyId));
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
        whereConditions.push(eq(wards.municipality_id, municipalityId));
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
        whereConditions.push(eq(wards.city_id, cityId));
      }
    }

    // Apply conditions using drizzle-orm's and function
    let wardsList: (typeof wards.$inferSelect)[] = [];

    if (whereConditions.length === 0) {
      wardsList = await db.select().from(wards);
    } else if (whereConditions.length === 1) {
      wardsList = await db.select().from(wards).where(whereConditions[0]);
    } else {
      wardsList = await db
        .select()
        .from(wards)
        .where(and(...whereConditions));
    }

    return wardsList;
  } catch (error) {
    console.error('Error fetching wards:', error);
    throw error;
  }
}
