"use server";

import { z } from "zod";
import { parishes } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

const createParishSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  subCountyId: z.string().min(1, "Sub County is required"),
});

export async function addParish(data: z.infer<typeof createParishSchema>) {
  const validatedFields = createParishSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: validatedFields.error.message };
  }

  const { name, code, subCountyId } = validatedFields.data;

  try {
    await db.insert(parishes).values({
      name,
      code,
      sub_county_id: subCountyId,
    });

    revalidatePath("/dashboard/locations");
    return { success: true };
  } catch {
    return { error: "Failed to create parish" };
  }
}

export async function deleteParish(id: string) {
  try {
    await db.delete(parishes).where(eq(parishes.id, id));
    revalidatePath("/dashboard/locations");
    return { success: true };
  } catch {
    return { error: "Failed to delete parish" };
  }
}
