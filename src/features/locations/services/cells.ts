import { db } from '@/lib/db';
import {
  cells,
  subCounties,
  municipalities,
  cities,
  wards,
  divisions,
} from '@/lib/db/schema';
import { eq, type SQL } from 'drizzle-orm';

export async function getCells(
  locationCode: string,
  municipalityCode?: string,
  cityCode?: string,
  wardCode?: string,
  divisionCode?: string
) {
  try {
    // First determine what type of code we received
    let subCountyId: string | null = null;
    let municipalityId: string | null = null;
    let cityId: string | null = null;
    let wardId: string | null = null;
    let divisionId: string | null = null;
    const whereConditions: SQL<unknown>[] = [];

    // Try as sub-county
    const subCounty = await db
      .select()
      .from(subCounties)
      .where(eq(subCounties.code, locationCode))
      .limit(1);

    if (subCounty && subCounty.length > 0) {
      subCountyId = subCounty[0].id;
      whereConditions.push(eq(cells.sub_county_id, subCountyId));
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
        whereConditions.push(eq(cells.municipality_id, municipalityId));
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
        whereConditions.push(eq(cells.city_id, cityId));
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
        whereConditions.push(eq(cells.ward_id, wardId));
      }
    }

    // If division code is provided, get division ID
    if (divisionCode) {
      const division = await db
        .select()
        .from(divisions)
        .where(eq(divisions.code, divisionCode))
        .limit(1);

      if (division && division.length > 0) {
        divisionId = division[0].id;
      }

      if (divisionId) {
        whereConditions.push(eq(cells.division_id, divisionId));
      }
    }

    // Apply conditions using our utility
    const baseQuery = db.select().from(cells);

    // Apply conditions one by one
    let queryWithConditions = baseQuery;

    // Apply all conditions if any exist
    whereConditions.forEach(condition => {
      queryWithConditions = queryWithConditions.where(
        condition
      ) as typeof baseQuery;
    });

    // Execute the final query
    const cellsList = await queryWithConditions;

    return cellsList;
  } catch (error) {
    console.error('Error fetching cells:', error);
    throw error;
  }
}
