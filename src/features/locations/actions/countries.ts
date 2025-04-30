"use server";

import { z } from "zod";
import { countries } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

const createCountrySchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
});

export async function addCountry(data: z.infer<typeof createCountrySchema>) {
  const validatedFields = createCountrySchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: validatedFields.error.message };
  }

  const { name, code } = validatedFields.data;

  try {
    await db.insert(countries).values({
      name,
      code,
    });

    revalidatePath("/dashboard/locations");
    return { success: true };
  } catch {
    return { error: "Failed to create country" };
  }
}

export async function deleteCountry(id: string) {
  try {
    await db.delete(countries).where(eq(countries.id, id));
    revalidatePath("/dashboard/locations");
    return { success: true };
  } catch {
    return { error: "Failed to delete country" };
  }
}
