'use server';

import { z } from 'zod';
import { countries } from '@/lib/db/schema';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

const createCountrySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
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

    revalidatePath('/dashboard/locations');
    return { success: true };
  } catch {
    return { error: 'Failed to create country' };
  }
}

export async function deleteCountry(id: string) {
  try {
    await db.delete(countries).where(eq(countries.id, id));
    revalidatePath('/dashboard/locations');
    return { success: true };
  } catch {
    return { error: 'Failed to delete country' };
  }
}

import { count, ilike, asc } from 'drizzle-orm';
import type { PaginationParams } from '../types/pagination';

export async function getCountries(params: PaginationParams = {}) {
  try {
    const { page = 1, limit = 10, search } = params;

    // Validate and sanitize pagination parameters
    const validatedPage = Math.max(1, page);
    const validatedLimit = Math.min(Math.max(1, limit), 100);
    const offset = (validatedPage - 1) * validatedLimit;

    // Build search condition
    const searchCondition = search
      ? ilike(countries.name, `%${search}%`)
      : undefined;

    // Get total count
    const [totalResult] = await db
      .select({ count: count() })
      .from(countries)
      .where(searchCondition);

    const total = totalResult.count;

    // Get paginated data
    const data = await db
      .select()
      .from(countries)
      .where(searchCondition)
      .orderBy(asc(countries.name))
      .limit(validatedLimit)
      .offset(offset);

    const totalPages = Math.ceil(total / validatedLimit);

    return {
      success: true,
      data: {
        data,
        pagination: {
          page: validatedPage,
          limit: validatedLimit,
          total,
          totalPages,
          hasNext: validatedPage < totalPages,
          hasPrev: validatedPage > 1,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching countries:', error);
    return { error: 'Failed to fetch countries' };
  }
}

export async function getCountryById(id: string) {
  try {
    const country = await db.query.countries.findFirst({
      where: eq(countries.id, id),
    });

    if (!country) {
      throw new Error('Country not found');
    }

    return {
      success: true as const,
      data: country,
    };
  } catch (error) {
    console.error('Error fetching country:', error);
    return {
      success: false as const,
      error: error instanceof Error ? error.message : 'Failed to fetch country',
    };
  }
}
