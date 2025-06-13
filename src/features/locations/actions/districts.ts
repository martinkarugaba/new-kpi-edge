"use server";

import { z } from "zod";
import { districts } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { eq, and, count, ilike } from "drizzle-orm";
import type { PaginationParams } from "../types/pagination";

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

export async function getDistricts(
  params: {
    countryId?: string;
    pagination?: PaginationParams;
  } = {}
) {
  try {
    const { pagination = {}, countryId } = params;
    const { page = 1, limit = 10, search } = pagination;

    // Validate pagination parameters
    if (page < 1) throw new Error("Page must be greater than 0");
    if (limit < 1 || limit > 100)
      throw new Error("Limit must be between 1 and 100");

    // Build where conditions
    const whereConditions = [];

    if (countryId) {
      whereConditions.push(eq(districts.country_id, countryId));
    }

    if (search) {
      whereConditions.push(ilike(districts.name, `%${search}%`));
    }

    // Combine all conditions with AND
    const finalWhereCondition =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Get total count
    const [totalResult] = await db
      .select({ count: count() })
      .from(districts)
      .where(finalWhereCondition);

    const total = Number(totalResult.count);
    const totalPages = Math.ceil(total / limit);

    // Get paginated data
    const data = await db.query.districts.findMany({
      where: finalWhereCondition,
      with: {
        country: true,
      },
      orderBy: (districts, { asc }) => [asc(districts.name)],
      limit,
      offset: (page - 1) * limit,
    });

    return {
      success: true as const,
      data: {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching districts:", error);
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to fetch districts",
    };
  }
}
