"use server";

import { z } from "zod";
import { subCounties } from "@/lib/db/schema";
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
    await db.insert(subCounties).values({
      name,
      code,
      district_id: districtId,
    });

    revalidatePath("/dashboard/locations");
    return { success: true };
  } catch {
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
