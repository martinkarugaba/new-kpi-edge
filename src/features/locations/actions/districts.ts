"use server";

import { z } from "zod";
import { districts } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

const createDistrictSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  countryId: z.string().min(1, "Country is required"),
});

export async function addDistrict(data: z.infer<typeof createDistrictSchema>) {
  const validatedFields = createDistrictSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: validatedFields.error.message };
  }

  const { name, code, countryId } = validatedFields.data;

  try {
    await db.insert(districts).values({
      name,
      code,
      country_id: countryId,
    });

    revalidatePath("/dashboard/locations");
    return { success: true };
  } catch {
    return { error: "Failed to create district" };
  }
}

export async function deleteDistrict(id: string) {
  try {
    await db.delete(districts).where(eq(districts.id, id));
    revalidatePath("/dashboard/locations");
    return { success: true };
  } catch {
    return { error: "Failed to delete district" };
  }
}
