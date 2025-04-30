"use server";

import { z } from "zod";
import { villages } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

const createVillageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  parishId: z.string().min(1, "Parish is required"),
});

export async function addVillage(data: z.infer<typeof createVillageSchema>) {
  const validatedFields = createVillageSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: validatedFields.error.message };
  }

  const { name, code, parishId } = validatedFields.data;

  try {
    await db.insert(villages).values({
      name,
      code,
      parish_id: parishId,
    });

    revalidatePath("/dashboard/locations");
    return { success: true };
  } catch {
    return { error: "Failed to create village" };
  }
}

export async function deleteVillage(id: string) {
  try {
    await db.delete(villages).where(eq(villages.id, id));
    revalidatePath("/dashboard/locations");
    return { success: true };
  } catch {
    return { error: "Failed to delete village" };
  }
}
