"use server";

import { db } from "@/lib/db";
import {
  countries,
  districts,
  subCounties,
  parishes,
  villages,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Country actions
export async function createCountry(data: { name: string; code: string }) {
  try {
    await db.insert(countries).values({
      name: data.name,
      code: data.code,
    });
    revalidatePath("/dashboard/locations");
    return { success: true };
  } catch (error) {
    console.error("Error creating country:", error);
    return { success: false, error: "Failed to create country" };
  }
}

export async function getCountries() {
  try {
    const results = await db.select().from(countries);
    return { success: true, data: results };
  } catch (error) {
    console.error("Error fetching countries:", error);
    return { success: false, error: "Failed to fetch countries" };
  }
}

// District actions
export async function createDistrict(data: {
  name: string;
  code: string;
  countryId: string;
}) {
  try {
    await db.insert(districts).values({
      name: data.name,
      code: data.code,
      country_id: data.countryId,
    });
    revalidatePath("/dashboard/locations");
    return { success: true };
  } catch (error) {
    console.error("Error creating district:", error);
    return { success: false, error: "Failed to create district" };
  }
}

export async function getDistricts(countryId: string) {
  try {
    const results = await db
      .select()
      .from(districts)
      .where(eq(districts.country_id, countryId));
    return { success: true, data: results };
  } catch (error) {
    console.error("Error fetching districts:", error);
    return { success: false, error: "Failed to fetch districts" };
  }
}

// Sub-county actions
export async function createSubCounty(data: {
  name: string;
  code: string;
  countryId: string;
  districtId: string;
  countyId: string;
}) {
  try {
    // Ensure all required fields are present
    if (!data.countryId) {
      return { success: false, error: "Country ID is required" };
    }

    await db.insert(subCounties).values({
      name: data.name,
      code: data.code,
      country_id: data.countryId,
      district_id: data.districtId,
      county_id: data.countyId,
    });
    revalidatePath("/dashboard/locations");
    return { success: true };
  } catch (error) {
    console.error("Error creating sub-county:", error);
    return { success: false, error: "Failed to create sub-county" };
  }
}

export async function getSubCounties(districtId: string) {
  try {
    const results = await db
      .select()
      .from(subCounties)
      .where(eq(subCounties.district_id, districtId));
    return { success: true, data: results };
  } catch (error) {
    console.error("Error fetching sub-counties:", error);
    return { success: false, error: "Failed to fetch sub-counties" };
  }
}

// Parish actions
export async function createParish(data: {
  name: string;
  code: string;
  subCountyId: string;
  districtId: string;
  countyId: string;
  countryId: string;
}) {
  try {
    await db.insert(parishes).values({
      name: data.name,
      code: data.code,
      sub_county_id: data.subCountyId,
      district_id: data.districtId,
      county_id: data.countyId,
      country_id: data.countryId,
    });
    revalidatePath("/dashboard/locations");
    return { success: true };
  } catch (error) {
    console.error("Error creating parish:", error);
    return { success: false, error: "Failed to create parish" };
  }
}

export async function getParishes(subCountyId: string) {
  try {
    const results = await db
      .select()
      .from(parishes)
      .where(eq(parishes.sub_county_id, subCountyId));
    return { success: true, data: results };
  } catch (error) {
    console.error("Error fetching parishes:", error);
    return { success: false, error: "Failed to fetch parishes" };
  }
}

// Village actions
export async function createVillage(data: {
  name: string;
  code: string;
  parishId: string;
  subCountyId: string;
  countyId: string;
  districtId: string;
  countryId: string;
}) {
  try {
    await db.insert(villages).values({
      name: data.name,
      code: data.code,
      parish_id: data.parishId,
      sub_county_id: data.subCountyId,
      county_id: data.countyId,
      district_id: data.districtId,
      country_id: data.countryId,
    });
    revalidatePath("/dashboard/locations");
    return { success: true };
  } catch (error) {
    console.error("Error creating village:", error);
    return { success: false, error: "Failed to create village" };
  }
}

export async function getVillages(parishId: string) {
  try {
    const results = await db
      .select()
      .from(villages)
      .where(eq(villages.parish_id, parishId));
    return { success: true, data: results };
  } catch (error) {
    console.error("Error fetching villages:", error);
    return { success: false, error: "Failed to fetch villages" };
  }
}

export async function getWards(unitCode: string) {
  try {
    const data = await db
      .select({
        id: districts.id,
        name: districts.name,
        code: districts.code,
      })
      .from(districts)
      .where(eq(districts.code, unitCode));

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error fetching wards:", error);
    return {
      success: false,
      error: "Failed to fetch wards",
    };
  }
}

export async function getDivisions(unitCode: string) {
  try {
    const data = await db
      .select({
        id: districts.id,
        name: districts.name,
        code: districts.code,
      })
      .from(districts)
      .where(eq(districts.code, unitCode));

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Error fetching divisions:", error);
    return {
      success: false,
      error: "Failed to fetch divisions",
    };
  }
}
