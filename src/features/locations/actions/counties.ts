"use server";

import { z } from "zod";
import { counties } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

const createCountySchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  country_id: z.string().min(1, "Country is required"),
  district_id: z.string().min(1, "District is required"),
});

export async function addCounty(data: z.infer<typeof createCountySchema>) {
  const validatedFields = createCountySchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: validatedFields.error.message };
  }

  const { name, code, country_id, district_id } = validatedFields.data;

  try {
    await db.insert(counties).values({
      name,
      code,
      country_id,
      district_id,
    });

    revalidatePath("/dashboard/locations");
    return { success: true };
  } catch {
    return { error: "Failed to create county" };
  }
}

export async function deleteCounty(id: string) {
  try {
    await db.delete(counties).where(eq(counties.id, id));
    revalidatePath("/dashboard/locations");
    return { success: true };
  } catch {
    return { error: "Failed to delete county" };
  }
}
