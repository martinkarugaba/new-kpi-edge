import { db } from "@/lib/db";
import { districts, subCounties, parishes, villages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getCountries() {
  try {
    return await db.query.countries.findMany({
      orderBy: (countries, { asc }) => [asc(countries.name)],
    });
  } catch (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
}

export async function getDistricts(countryId: string) {
  try {
    return await db.query.districts.findMany({
      where: eq(districts.country_id, countryId),
      orderBy: (districts, { asc }) => [asc(districts.name)],
    });
  } catch (error) {
    console.error("Error fetching districts:", error);
    return [];
  }
}

export async function getSubCounties(districtId: string) {
  try {
    return await db.query.subCounties.findMany({
      where: eq(subCounties.district_id, districtId),
      orderBy: (subCounties, { asc }) => [asc(subCounties.name)],
    });
  } catch (error) {
    console.error("Error fetching sub-counties:", error);
    return [];
  }
}

export async function getParishes(subCountyId: string) {
  try {
    return await db.query.parishes.findMany({
      where: eq(parishes.sub_county_id, subCountyId),
      orderBy: (parishes, { asc }) => [asc(parishes.name)],
    });
  } catch (error) {
    console.error("Error fetching parishes:", error);
    return [];
  }
}

export async function getVillages(parishId: string) {
  try {
    return await db.query.villages.findMany({
      where: eq(villages.parish_id, parishId),
      orderBy: (villages, { asc }) => [asc(villages.name)],
    });
  } catch (error) {
    console.error("Error fetching villages:", error);
    return [];
  }
}
