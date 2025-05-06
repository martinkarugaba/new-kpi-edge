"use server";

import { z } from "zod";
import { subCounties, districts, counties } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

const createSubCountySchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  districtId: z.string().min(1, "District is required"),
});

export async function addSubCounty(
  data: z.infer<typeof createSubCountySchema>,
) {
  const validatedFields = createSubCountySchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: validatedFields.error.message };
  }

  const { name, code, districtId } = validatedFields.data;

  try {
    // Get the district to retrieve country_id
    const district = await db.query.districts.findFirst({
      where: eq(districts.id, districtId),
    });

    if (!district) {
      return { error: "District not found" };
    }

    // Find the county for this district
    const county = await db.query.counties.findFirst({
      where: eq(counties.district_id, districtId),
    });

    if (!county) {
      return { error: "County not found for this district" };
    }

    await db.insert(subCounties).values({
      name,
      code,
      district_id: districtId,
      country_id: district.country_id,
      county_id: county.id,
    });

    revalidatePath("/dashboard/locations");
    return { success: true };
  } catch (error) {
    console.error("Error adding sub county:", error);
    return { error: "Failed to create sub county" };
  }
}

export async function deleteSubCounty(id: string) {
  try {
    await db.delete(subCounties).where(eq(subCounties.id, id));
    revalidatePath("/dashboard/locations");
    return { success: true };
  } catch {
    return { error: "Failed to delete sub county" };
  }
}
