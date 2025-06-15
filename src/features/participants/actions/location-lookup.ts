"use server";

import { db } from "@/lib/db";
import { districts, subCounties, counties } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Fetch a district name by its ID
 */
export async function getDistrictNameById(id: string): Promise<string | null> {
  try {
    const district = await db.query.districts.findFirst({
      where: eq(districts.id, id),
      columns: {
        name: true,
      },
    });

    return district?.name || null;
  } catch (error) {
    console.error("Error fetching district name:", error);
    return null;
  }
}

/**
 * Fetch a subcounty name by its ID
 */
export async function getSubcountyNameById(id: string): Promise<string | null> {
  try {
    const subcounty = await db.query.subCounties.findFirst({
      where: eq(subCounties.id, id),
      columns: {
        name: true,
      },
    });

    return subcounty?.name || null;
  } catch (error) {
    console.error("Error fetching subcounty name:", error);
    return null;
  }
}

/**
 * Fetch a county name by its ID
 */
export async function getCountyNameById(id: string): Promise<string | null> {
  try {
    const county = await db.query.counties.findFirst({
      where: eq(counties.id, id),
      columns: {
        name: true,
      },
    });

    return county?.name || null;
  } catch (error) {
    console.error("Error fetching county name:", error);
    return null;
  }
}
