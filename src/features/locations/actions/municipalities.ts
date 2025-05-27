'use server';

import { db } from '@/lib/db';
import { municipalities } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

export type CreateMunicipalityInput = {
  name: string;
  code: string;
  countryId: string;
  districtId: string;
  countyId: string;
  subCountyId: string;
};

export async function createMunicipality(data: CreateMunicipalityInput) {
  try {
    await db.insert(municipalities).values({
      name: data.name,
      code: data.code,
      country_id: data.countryId,
      district_id: data.districtId,
      county_id: data.countyId,
      sub_county_id: data.subCountyId,
    });

    revalidatePath('/dashboard/locations');
    return { success: true };
  } catch (error) {
    console.error('Error creating municipality:', error);
    return { success: false, error: 'Failed to create municipality' };
  }
}

export async function getMunicipality(id: string) {
  try {
    const data = await db.query.municipalities.findFirst({
      where: eq(municipalities.id, id),
      with: {
        country: true,
        district: true,
        county: true,
        subCounty: true,
      },
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching municipality:', error);
    return { success: false, error: 'Failed to fetch municipality' };
  }
}

export async function updateMunicipality(
  id: string,
  data: Partial<CreateMunicipalityInput>
) {
  try {
    await db
      .update(municipalities)
      .set({
        name: data.name,
        code: data.code,
        country_id: data.countryId,
        district_id: data.districtId,
        county_id: data.countyId,
        sub_county_id: data.subCountyId,
        updated_at: new Date(),
      })
      .where(eq(municipalities.id, id));

    revalidatePath('/dashboard/locations');
    return { success: true };
  } catch (error) {
    console.error('Error updating municipality:', error);
    return { success: false, error: 'Failed to update municipality' };
  }
}

export async function deleteMunicipality(id: string) {
  try {
    await db.delete(municipalities).where(eq(municipalities.id, id));
    revalidatePath('/dashboard/locations');
    return { success: true };
  } catch (error) {
    console.error('Error deleting municipality:', error);
    return { success: false, error: 'Failed to delete municipality' };
  }
}

export async function getMunicipalities(
  params: {
    districtId?: string;
    countyId?: string;
    subCountyId?: string;
  } = {}
) {
  try {
    const whereConditions = [];

    if (params.districtId) {
      whereConditions.push(eq(municipalities.district_id, params.districtId));
    }

    if (params.countyId) {
      whereConditions.push(eq(municipalities.county_id, params.countyId));
    }

    if (params.subCountyId) {
      whereConditions.push(
        eq(municipalities.sub_county_id, params.subCountyId)
      );
    }

    const data = await db.query.municipalities.findMany({
      where: whereConditions.length > 0 ? whereConditions[0] : undefined,
      with: {
        country: true,
        district: true,
        county: true,
        subCounty: true,
      },
      orderBy: (municipalities, { asc }) => [asc(municipalities.name)],
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching municipalities:', error);
    return { success: false, error: 'Failed to fetch municipalities' };
  }
}
