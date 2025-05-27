'use server';

import { db } from '@/lib/db';
import { cities } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createCity(formData: FormData) {
  try {
    const rawFormData = {
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      countryId: formData.get('countryId') as string,
      districtId: formData.get('districtId') as string,
      countyId: formData.get('countyId') as string,
      subCountyId: formData.get('subCountyId') as string,
      municipalityId: formData.get('municipalityId') as string,
    };

    await db.insert(cities).values({
      name: rawFormData.name,
      code: rawFormData.code,
      country_id: rawFormData.countryId,
      district_id: rawFormData.districtId,
      county_id: rawFormData.countyId,
      sub_county_id: rawFormData.subCountyId,
      municipality_id: rawFormData.municipalityId,
    });

    revalidatePath('/dashboard/locations/cities');
    return { success: true };
  } catch (error) {
    console.error('Error creating city:', error);
    return { error: 'Failed to create city' };
  }
}

export async function updateCity(id: string, formData: FormData) {
  try {
    const rawFormData = {
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      countryId: formData.get('countryId') as string,
      districtId: formData.get('districtId') as string,
      countyId: formData.get('countyId') as string,
      subCountyId: formData.get('subCountyId') as string,
      municipalityId: formData.get('municipalityId') as string,
    };

    await db
      .update(cities)
      .set({
        name: rawFormData.name,
        code: rawFormData.code,
        country_id: rawFormData.countryId,
        district_id: rawFormData.districtId,
        county_id: rawFormData.countyId,
        sub_county_id: rawFormData.subCountyId,
        municipality_id: rawFormData.municipalityId,
        updated_at: new Date(),
      })
      .where(eq(cities.id, id));

    revalidatePath('/dashboard/locations/cities');
    return { success: true };
  } catch (error) {
    console.error('Error updating city:', error);
    return { error: 'Failed to update city' };
  }
}

export async function deleteCity(id: string) {
  try {
    await db.delete(cities).where(eq(cities.id, id));
    revalidatePath('/dashboard/locations/cities');
    return { success: true };
  } catch (error) {
    console.error('Error deleting city:', error);
    return { error: 'Failed to delete city' };
  }
}
